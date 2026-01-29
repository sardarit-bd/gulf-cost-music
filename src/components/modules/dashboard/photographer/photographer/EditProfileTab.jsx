"use client";

import Input from "@/ui/Input";
import Select from "@/ui/Select";
import Textarea from "@/ui/Textarea";
import { Edit3, Loader2, MapPin, Save, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditProfileTab({
  photographer,
  subscriptionPlan,
  handleChange,
  handleSave,
  saving,
}) {
  // State-City mapping based on your PDF requirements
  const STATE_CITY_MAPPING = {
    louisiana: ["new orleans"],
    mississippi: ["biloxi"],
    alabama: ["mobile"],
    florida: ["pensacola"]
  };

  // State options with proper labels
  const stateOptions = [
    { value: "", label: "Select State", disabled: true },
    { value: "louisiana", label: "Louisiana" },
    { value: "mississippi", label: "Mississippi" },
    { value: "alabama", label: "Alabama" },
    { value: "florida", label: "Florida" }
  ];

  // City options that update based on selected state
  const [cityOptions, setCityOptions] = useState([
    { value: "", label: "Select State First", disabled: true }
  ]);

  // Initialize city options when component mounts or photographer changes
  useEffect(() => {
    if (photographer.state && STATE_CITY_MAPPING[photographer.state]) {
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
  }, [photographer.state]);

  // Custom handleChange function to handle state-city auto-selection
  const handleCustomChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      // Update state
      handleChange(e);

      // Auto-select the only city for this state
      if (value && STATE_CITY_MAPPING[value]) {
        const cities = STATE_CITY_MAPPING[value];
        if (cities.length === 1) {
          // Create a synthetic event for city change
          const cityEvent = {
            target: {
              name: "city",
              value: cities[0]
            }
          };
          // Call handleChange for city after a small delay
          setTimeout(() => {
            handleChange(cityEvent);
          }, 100);
        }
      }
    } else {
      // For other fields, use the original handleChange
      handleChange(e);
    }
  };

  // Format city name for display
  const formatCityName = (city) => {
    if (!city) return "";
    return city
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="animate-fadeIn">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Edit3 size={20} />
              Profile Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Photographer Name"
                name="name"
                value={photographer.name}
                onChange={handleChange}
                icon={<User size={18} />}
                placeholder="Enter your full name"
                required
              />

              {/* State Selection (PDF Requirement) */}
              <Select
                label="State"
                name="state"
                value={photographer.state}
                options={stateOptions}
                onChange={handleCustomChange}
                icon={<MapPin size={18} />}
                required
              />

              {/* City Selection - Auto-populated based on state */}
              <div>
                <Select
                  label="City"
                  name="city"
                  value={photographer.city}
                  options={cityOptions}
                  onChange={handleChange}
                  icon={<MapPin size={18} />}
                  required
                  disabled={!photographer.state}
                />
                {photographer.state && (
                  <p className="mt-2 text-sm text-gray-400">
                    Only <span className="text-yellow-400 font-semibold">
                      {formatCityName(cityOptions[0]?.label)}
                    </span> is available for {photographer.state.charAt(0).toUpperCase() + photographer.state.slice(1)}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Biography"
                  name="biography"
                  value={photographer.biography}
                  onChange={handleChange}
                  icon={<Edit3 size={18} />}
                  placeholder="Tell us about your photography experience, style, specialties..."
                  rows={6}
                />
                {/* No upgrade prompt - all features are free per PDF */}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Profile Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-300">
                <span>Photos Uploaded:</span>
                <span className="font-semibold text-yellow-400">
                  {photographer.photos?.length || 0}/5
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Services:</span>
                <span className="font-semibold text-green-400">
                  {photographer.services?.length || 0} services
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Videos:</span>
                <span className="font-semibold text-purple-400">
                  {photographer.videos?.length || 0}/1
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Location:</span>
                <span className="font-semibold text-blue-400 capitalize">
                  {photographer.city ? `${formatCityName(photographer.city)}, ` : ""}
                  {photographer.state ? photographer.state.charAt(0).toUpperCase() + photographer.state.slice(1) : "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                disabled={saving || !photographer.name || !photographer.state || !photographer.city}
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}