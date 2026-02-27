"use client";

import { useAuth } from "@/context/AuthContext";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EditButton from "./EditButton";
import ProfileForm from "./ProfileForm";
import ProfileView from "./ProfileView";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function ManageProfile() {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [originalCity, setOriginalCity] = useState("");
  const [originalState, setOriginalState] = useState("");
  const [photographer, setPhotographer] = useState({
    name: "",
    state: "",
    city: "",
    biography: "",
    photos: [],
    services: [],
    videos: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const STATE_CITY_MAPPING = {
    LA: ["mobile"],
    MS: ["biloxi"],
    AL: ["mobile"],
    FL: ["pensacola"],
  };

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch profile data

  useEffect(() => {
    const fetchPhotographer = async () => {
      if (authLoading) return;

      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/photographers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch profile.");
        }

        const data = await res.json();

        if (data.data?.photographer) {
          let p = data.data.photographer;
          console.log("Fetched photographer data:", p);

          // FIX: Normalize state to acronym if it's full name
          const stateMapping = {
            "louisiana": "LA",
            "mississippi": "MS",
            "alabama": "AL",
            "florida": "FL"
          };

          let normalizedState = p.state || "";
          if (normalizedState && normalizedState.toLowerCase() in stateMapping) {
            normalizedState = stateMapping[normalizedState.toLowerCase()];
          }

          setPhotographer({
            name: p.name || "",
            state: normalizedState,
            city: p.city || "",
            biography: p.biography || "",
            photos: p.photos || [],
            services: p.services || [],
            videos: p.videos || [],
          });
          setOriginalCity(p.city || "");
          setOriginalState(normalizedState);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPhotographer();
    }
  }, [authLoading, API_BASE]);

  const handleChange = (e) => {
    if (!e || !e.target) return;

    const { name, value } = e.target;

    if (name === "name" || name === "biography") {
      setPhotographer((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (name === "state" || name === "city") {
      toast.error(`${name === "state" ? "State" : "City"} cannot be changed after profile creation`);
      return;
    }
  };

  const handleStateChange = (e) => {
    toast.error("State cannot be changed after profile creation");
    return;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!photographer.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (photographer.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!photographer.state) {
      newErrors.state = "State is required";
    }

    if (!photographer.city) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Form validation
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      setSaving(true);
      const toastId = toast.loading("Saving profile...");

      const profileData = {
        name: photographer.name.trim(),
        biography: photographer.biography || "",
      };

      console.log("Sending profile data:", profileData);

      const res = await fetch(`${API_BASE}/api/photographers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) {
        if (res.status === 404) {
          const createData = {
            name: photographer.name.trim(),
            state: originalState || photographer.state,
            city: originalCity || photographer.city,
            biography: photographer.biography || "",
          };

          const createRes = await fetch(
            `${API_BASE}/api/photographers/profile`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(createData),
            }
          );

          const createResponse = await createRes.json();

          if (!createRes.ok) {
            throw new Error(createResponse.message || "Failed to create profile.");
          }

          toast.success("Profile created successfully!");
        } else {
          if (data.message) {
            throw new Error(data.message);
          } else {
            throw new Error("Failed to save profile.");
          }
        }
      } else {
        toast.success("Profile updated successfully!");

        if (data.data?.photographer) {
          const p = data.data.photographer;
          setPhotographer({
            name: p.name || "",
            state: p.state || photographer.state,
            city: p.city || photographer.city,
            biography: p.biography || "",
            photos: p.photos || [],
            services: p.services || [],
            videos: p.videos || [],
          });
        }
      }

      setIsEditing(false);

    } catch (error) {
      console.error("Save error:", error);

      if (error.message.includes("locationTags") || error.message.includes("State must be one of")) {
        toast.error("Location information cannot be changed. Please refresh the page.");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(error.message || "Failed to save profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatCityName = (city) => {
    if (!city) return "";
    return city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getFullStateName = (acronym) => {
    const stateMap = {
      LA: "Louisiana",
      MS: "Mississippi",
      AL: "Alabama",
      FL: "Florida",
    };
    return stateMap[acronym] || acronym;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? "Edit Profile" : "My Profile"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing
                  ? "Update your photographer information"
                  : "View and manage your photographer profile"}
              </p>
            </div>
          </div>

          <EditButton
            onClick={() => setIsEditing(!isEditing)}
            isEditing={isEditing}
          />
        </div>

        {/* Content - Toggle between View and Edit modes */}
        {isEditing ? (
          <ProfileForm
            photographer={photographer}
            handleChange={handleChange}
            handleSave={handleSave}
            onCancel={() => setIsEditing(false)}
            saving={saving}
            errors={errors}
            getFullStateName={getFullStateName}
            formatCityName={formatCityName}
            originalCity={originalCity}
            originalState={originalState}
          />
        ) : (
          <ProfileView
            photographer={photographer}
            user={user}
            formatCityName={formatCityName}
            getFullStateName={getFullStateName}
          />
        )}
      </div>
    </div>
  );
}