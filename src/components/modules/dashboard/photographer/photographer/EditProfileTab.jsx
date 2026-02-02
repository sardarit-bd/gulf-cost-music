// components/modules/dashboard/photographer/ManageProfile.js
"use client";

import { useAuth } from "@/context/AuthContext";
import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import { Briefcase, Camera, Edit3, Globe, ImageIcon, Loader2, MapPin, Save, User, Video } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function ManageProfile() {
  const { user, loading: authLoading } = useAuth();
  const [photographer, setPhotographer] = useState({
    name: "",
    state: "",
    city: "",
    biography: "",
    photos: [],
    services: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const STATE_CITY_MAPPING = {
    louisiana: ["new orleans"],
    mississippi: ["biloxi"],
    alabama: ["mobile"],
    florida: ["pensacola"]
  };

  const stateOptions = [
    { value: "", label: "Select State", disabled: true },
    { value: "louisiana", label: "Louisiana" },
    { value: "mississippi", label: "Mississippi" },
    { value: "alabama", label: "Alabama" },
    { value: "florida", label: "Florida" }
  ];

  const [cityOptions, setCityOptions] = useState([
    { value: "", label: "Select State First", disabled: true }
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
            videos: p.videos || []
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
      const formattedCityOptions = citiesForState.map(city => ({
        value: city,
        label: city.charAt(0).toUpperCase() + city.slice(1).replace(/\b\w/g, char => char.toUpperCase())
      }));
      setCityOptions(formattedCityOptions);
    } else {
      setCityOptions([
        { value: "", label: "Select State First", disabled: true }
      ]);
    }
  }, [photographer?.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhotographer(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCustomChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      handleChange(e);

      if (value && STATE_CITY_MAPPING[value]) {
        const cities = STATE_CITY_MAPPING[value];
        if (cities.length === 1) {
          const cityEvent = {
            target: {
              name: "city",
              value: cities[0]
            }
          };
          setTimeout(() => {
            handleChange(cityEvent);
          }, 100);
        }
      }
    } else {
      handleChange(e);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!photographer.name.trim()) {
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
        state: photographer.state.toLowerCase(),
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
          const createRes = await fetch(`${API_BASE}/api/photographers/profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
          });

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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600 mt-1">Update your photographer information</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gray-600" />
                Profile Information
              </h2>

              <div className="space-y-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={photographer.name}
                  onChange={handleChange}
                  icon={<User className="w-4 h-4" />}
                  placeholder="Enter your full name"
                  required
                  error={errors.name}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="State"
                    name="state"
                    value={photographer.state}
                    options={stateOptions}
                    onChange={handleCustomChange}
                    icon={<Globe className="w-4 h-4" />}
                    required
                    error={errors.state}
                  />

                  <Select
                    label="City"
                    name="city"
                    value={photographer.city}
                    options={cityOptions}
                    onChange={handleChange}
                    icon={<MapPin className="w-4 h-4" />}
                    required
                    disabled={!photographer.state}
                    error={errors.city}
                  />
                </div>

                {photographer.state && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <span className="font-semibold">Service Area:</span>
                      {photographer.state.charAt(0).toUpperCase() + photographer.state.slice(1)}
                      {photographer.city && (
                        <>
                          <span>•</span>
                          {formatCityName(photographer.city)}
                        </>
                      )}
                    </p>
                  </div>
                )}

                <Textarea
                  label="Biography"
                  name="biography"
                  value={photographer.biography}
                  onChange={handleChange}
                  placeholder="Tell clients about your photography style, experience, specialties..."
                  rows={6}
                  icon={<Edit3 className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Changes</h3>
              <button
                onClick={handleSave}
                disabled={saving || !photographer.name || !photographer.state || !photographer.city}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Photos</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {photographer.photos?.length || 0}/5
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Services</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {photographer.services?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">Videos</span>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {photographer.videos?.length || 0}/1
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-700">Location</span>
                  </div>
                  <span className="font-semibold text-yellow-600 capitalize">
                    {photographer.city ? formatCityName(photographer.city) : "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}