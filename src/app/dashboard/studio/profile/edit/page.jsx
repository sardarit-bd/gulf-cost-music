"use client";

import Select from "@/ui/Select";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  FileText,
  Loader2,
  MapPin,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

export default function EditStudioProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studioData, setStudioData] = useState({
    name: "",
    city: "",
    state: "",
    biography: "",
  });
  const [errors, setErrors] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [cities, setCities] = useState([]);

  // State options
  const stateOptions = [
    { value: "Louisiana", label: "Louisiana" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Alabama", label: "Alabama" },
    { value: "Florida", label: "Florida" },
  ];

  // City data for each state
  const cityData = {
    Louisiana: [
      { value: "new orleans", label: "New Orleans" },
      { value: "baton rouge", label: "Baton Rouge" },
      { value: "lafayette", label: "Lafayette" },
      { value: "shreveport", label: "Shreveport" },
      { value: "lake charles", label: "Lake Charles" },
      { value: "monroe", label: "Monroe" },
    ],
    Mississippi: [
      { value: "jackson", label: "Jackson" },
      { value: "biloxi", label: "Biloxi" },
      { value: "gulfport", label: "Gulfport" },
      { value: "oxford", label: "Oxford" },
      { value: "hattiesburg", label: "Hattiesburg" },
    ],
    Alabama: [
      { value: "birmingham", label: "Birmingham" },
      { value: "mobile", label: "Mobile" },
      { value: "huntsville", label: "Huntsville" },
      { value: "tuscaloosa", label: "Tuscaloosa" },
    ],
    Florida: [
      { value: "tampa", label: "Tampa" },
      { value: "st. petersburg", label: "St. Petersburg" },
      { value: "clearwater", label: "Clearwater" },
      { value: "pensacola", label: "Pensacola" },
      { value: "panama city", label: "Panama City" },
      { value: "fort myers", label: "Fort Myers" },
    ],
  };

  // Initialize cities based on selected state
  useEffect(() => {
    if (studioData.state) {
      setCities(cityData[studioData.state] || []);
    }
  }, [studioData.state]);

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/studios/profile");
      const data = response.data;

      setStudioData({
        name: data.name || "",
        city: data.city || "",
        state: data.state || "Louisiana",
        biography: data.biography || "",
      });

      // Set cities based on state
      if (data.state) {
        setCities(cityData[data.state] || []);
      }

      // Calculate profile completion
      const completedFields = [
        data.name,
        data.city,
        data.state,
        data.biography,
      ].filter(Boolean).length;
      setProfileCompletion(Math.round((completedFields / 4) * 100));
    } catch (error) {
      console.error("Error fetching studio data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudioData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const stateValue = e.target.value;

    setStudioData((prev) => ({
      ...prev,
      state: stateValue,
      city: "", // Reset city when state changes
    }));

    // Update cities list for the selected state
    setCities(cityData[stateValue] || []);

    // Clear errors
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }));
    }
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const cityValue = e.target.value;
    setStudioData((prev) => ({
      ...prev,
      city: cityValue,
    }));

    // Clear error for city
    if (errors.city) {
      setErrors((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!studioData.name.trim()) {
      newErrors.name = "Studio name is required";
    }

    if (!studioData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!studioData.state) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...studioData,
        city: studioData.city.toLowerCase(),
      };

      const response = await api.put("/api/studios/profile", payload);

      toast.success("Profile updated successfully!");

      // Update profile completion
      const completedFields = [
        studioData.name,
        studioData.city,
        studioData.state,
        studioData.biography,
      ].filter(Boolean).length;
      setProfileCompletion(Math.round((completedFields / 4) * 100));

      // Redirect back after delay
      setTimeout(() => {
        router.push("/dashboard/studios/profile");
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.status === 400 && error.data?.message) {
        toast.error(error.data.message);
      } else if (error.status === 403) {
        toast.error("Only studio users can update profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/studios/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Edit Studio Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Update your studio information to attract more clients
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-full ${profileCompletion === 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"} font-medium flex items-center gap-2`}
            >
              {profileCompletion === 100 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              Profile {profileCompletion}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Profile Completion
          </span>
          <span className="text-sm font-medium text-gray-900">
            {profileCompletion}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${profileCompletion === 100 ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {profileCompletion === 100 ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Profile is complete! Great job!
            </span>
          ) : profileCompletion >= 75 ? (
            <span className="text-blue-600 flex items-center gap-1">
              Almost there! Just a few more fields to complete
            </span>
          ) : (
            <span className="text-yellow-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Complete your profile for better visibility
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Studio Name */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Studio Name
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your studio's public name
                  </p>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="name"
                  value={studioData.name}
                  onChange={handleChange}
                  placeholder="Enter studio name"
                  className={`text-gray-600 w-full px-4 py-3 bg-gray-50 border ${errors.name ? "border-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  This name will be displayed publicly on your profile
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Location</h3>
                  <p className="text-sm text-gray-600">
                    Where your studio is located
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <Select
                    label=""
                    name="state"
                    value={studioData.state}
                    options={stateOptions}
                    onChange={handleStateChange}
                    required
                    error={errors.state}
                    placeholder="Select a state"
                    className="w-full"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Select
                    label=""
                    name="city"
                    value={studioData.city}
                    options={[
                      { value: "", label: "Select a city", disabled: true },
                      ...cities,
                    ]}
                    onChange={handleCityChange}
                    required
                    error={errors.city}
                    placeholder="Select a city"
                    className="w-full"
                    disabled={!studioData.state}
                  />
                  {!studioData.state && (
                    <p className="mt-2 text-sm text-gray-500">
                      Please select a state first
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Your studio will appear in the {studioData.state} section under
                the Studios tab
              </p>
            </div>

            {/* Biography */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-gray-600 w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Biography</h3>
                  <p className="text-sm text-gray-600">
                    Tell clients about your studio
                  </p>
                </div>
              </div>

              <div>
                <textarea
                  name="biography"
                  value={studioData.biography}
                  onChange={handleChange}
                  placeholder="Describe your studio, equipment, experience, specialties..."
                  rows="6"
                  className="text-gray-600 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Write a compelling bio to attract more clients
                  </p>
                  <p className="text-sm text-gray-500">
                    {studioData.biography.length}/2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/studios/profile")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Profile Status</h3>

            <div className="space-y-4 mb-6">
              {[
                { label: "Studio Name", completed: !!studioData.name },
                {
                  label: "Location",
                  completed: !!studioData.city && !!studioData.state,
                },
                { label: "Biography", completed: !!studioData.biography },
                {
                  label: "Services",
                  completed: false,
                  note: "Add in Services tab",
                },
                { label: "Photos", completed: false, note: "Add in Media tab" },
                {
                  label: "Audio Sample",
                  completed: false,
                  note: "Add in Media tab",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? "bg-green-400" : "bg-white/30"}`}
                    >
                      {item.completed && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.note && (
                    <span className="text-xs text-blue-200">{item.note}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span>Overall Completion</span>
                <span className="font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Selected Location Preview */}
          {studioData.state && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Location Preview</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>State</span>
                  </div>
                  <span className="font-bold">{studioData.state}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>City</span>
                  </div>
                  <span className="font-bold">
                    {studioData.city
                      ? cities.find((c) => c.value === studioData.city)
                          ?.label || studioData.city
                      : "Not selected"}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/20">
                  <p className="text-sm mb-2">
                    Available Cities in {studioData.state}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cities.slice(0, 4).map((city) => (
                      <span
                        key={city.value}
                        className={`text-xs px-2 py-1 rounded-full ${studioData.city === city.value ? "bg-white text-green-600" : "bg-white/20"}`}
                      >
                        {city.label}
                      </span>
                    ))}
                    {cities.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20">
                        +{cities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Profile Tips
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Use your actual studio name for brand recognition
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Accurate location helps local clients find you
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Detailed bio increases booking rates by 40%
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Complete profiles get 3x more views
                </span>
              </li>
            </ul>
          </div>

          {/* Next Steps Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Next Steps</h3>

            <div className="space-y-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <p className="font-medium mb-1">Add Services & Pricing</p>
                <p className="text-sm text-green-100">
                  List your services with clear pricing
                </p>
                <button
                  onClick={() =>
                    router.push("/dashboard/studios/profile/services")
                  }
                  className="mt-2 w-full py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Go to Services
                </button>
              </div>

              <div className="p-3 bg-white/20 rounded-xl">
                <p className="font-medium mb-1">Upload Media</p>
                <p className="text-sm text-green-100">
                  Add photos and audio samples
                </p>
                <button
                  onClick={() => router.push("/dashboard/studios/media/upload")}
                  className="mt-2 w-full py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Go to Media
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
