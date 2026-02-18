// components/modules/dashboard/photographer/ManageProfile.jsx
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

  const stateOptions = [
    { value: "", label: "Select State", disabled: true },
    { value: "LA", label: "Louisiana (LA)" },
    { value: "MS", label: "Mississippi (MS)" },
    { value: "AL", label: "Alabama (AL)" },
    { value: "FL", label: "Florida (FL)" },
  ];

  const [cityOptions, setCityOptions] = useState([
    { value: "", label: "Select State First", disabled: true },
  ]);

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
          const p = data.data.photographer;
          setPhotographer({
            name: p.name || "",
            state: p.state || "",
            city: p.city || "",
            biography: p.biography || "",
            photos: p.photos || [],
            services: p.services || [],
            videos: p.videos || [],
          });
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

  // Update city options when state changes
  useEffect(() => {
    if (photographer?.state && STATE_CITY_MAPPING[photographer.state]) {
      const citiesForState = STATE_CITY_MAPPING[photographer.state];
      const formattedCityOptions = citiesForState.map((city) => ({
        value: city,
        label:
          city.charAt(0).toUpperCase() +
          city.slice(1).replace(/\b\w/g, (char) => char.toUpperCase()),
      }));
      setCityOptions(formattedCityOptions);
    } else {
      setCityOptions([
        { value: "", label: "Select State First", disabled: true },
      ]);
    }
  }, [photographer?.state]);

  const handleChange = (e) => {
    if (!e || !e.target) return;

    const { name, value } = e.target;
    setPhotographer((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStateChange = (e) => {
    handleChange(e);
    if (e.target.name === "state" && e.target.value) {
      const stateValue = e.target.value;
      if (stateValue && STATE_CITY_MAPPING[stateValue]) {
        const cities = STATE_CITY_MAPPING[stateValue];
        if (cities.length === 1) {
          setTimeout(() => {
            setPhotographer((prev) => ({
              ...prev,
              city: cities[0],
            }));
          }, 100);
        }
      }
    }
  };

  const isCityDisabled = () => {
    return photographer.name !== "" && photographer.state !== "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!photographer.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (photographer.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!photographer.state) {
      newErrors.state = "Please select a state";
    }

    if (!photographer.city) {
      newErrors.city = "Please select a city";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
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
        state: photographer.state,
        city: photographer.city.toLowerCase(),
        biography: photographer.biography || "",
      };

      let res = await fetch(`${API_BASE}/api/photographers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      let data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) {
        if (res.status === 404) {
          const createRes = await fetch(
            `${API_BASE}/api/photographers/profile`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(profileData),
            },
          );

          const createData = await createRes.json();

          if (!createRes.ok) {
            throw new Error(createData.message || "Failed to create profile.");
          }

          toast.success("Profile created successfully!");
        } else {
          throw new Error(data.message || "Failed to save profile.");
        }
      } else {
        toast.success("Profile updated successfully!");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save profile");
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
            setPhotographer={setPhotographer}
            stateOptions={stateOptions}
            cityOptions={cityOptions}
            handleChange={handleChange}
            handleStateChange={handleStateChange}
            isCityDisabled={isCityDisabled}
            handleSave={handleSave}
            onCancel={() => setIsEditing(false)}
            saving={saving}
            errors={errors}
            getFullStateName={getFullStateName}
            formatCityName={formatCityName}
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