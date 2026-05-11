"use client";

import { Loader2, MapPin, Music, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EditArtistModal = ({
  isOpen,
  artist,
  formData,
  loading,
  onClose,
  onSave,
  onInputChange,
}) => {
  if (!isOpen || !artist) return null;

  const genreOptions = [
    { value: "rap", label: "Rap" },
    { value: "country", label: "Country" },
    { value: "pop", label: "Pop" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "reggae", label: "Reggae" },
    { value: "edm", label: "EDM" },
    { value: "classical", label: "Classical" },
    { value: "rnb_soul", label: "R&B / Soul" },
    { value: "metal", label: "Metal" },
    { value: "other", label: "Other" },
  ];

  const cityOptions = [
    { value: "new orleans", label: "New Orleans" },
    { value: "baton rouge", label: "Baton Rouge" },
    { value: "lafayette", label: "Lafayette" },
    { value: "shreveport", label: "Shreveport" },
    { value: "lake charles", label: "Lake Charles" },
    { value: "monroe", label: "Monroe" },
    { value: "jackson", label: "Jackson" },
    { value: "biloxi", label: "Biloxi" },
    { value: "gulfport", label: "Gulfport" },
    { value: "oxford", label: "Oxford" },
    { value: "hattiesburg", label: "Hattiesburg" },
    { value: "birmingham", label: "Birmingham" },
    { value: "mobile", label: "Mobile" },
    { value: "huntsville", label: "Huntsville" },
    { value: "tuscaloosa", label: "Tuscaloosa" },
    { value: "tampa", label: "Tampa" },
    { value: "st. petersburg", label: "St. Petersburg" },
    { value: "clearwater", label: "Clearwater" },
    { value: "pensacola", label: "Pensacola" },
    { value: "panama city", label: "Panama City" },
    { value: "fort myers", label: "Fort Myers" },
  ];

  const planOptions = [
    { value: "free", label: "Free Plan" },
    { value: "pro", label: "Pro Plan" },
  ];

  // Custom Dropdown Component
  const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder,
    icon: Icon,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:border-yellow-400 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <span
              className={!selectedOption ? "text-gray-400" : "text-gray-700"}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-purple-50 transition-colors cursor-pointer ${
                  value === option.value
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700"
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Artist Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Artist Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              placeholder="Enter artist name"
            />
          </div>

          {/* Genre - Select Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <CustomSelect
              options={genreOptions}
              value={formData.genre || ""}
              onChange={(value) => onInputChange("genre", value)}
              placeholder="Select Genre"
              icon={Music}
            />
          </div>

          {/* City - Select Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <CustomSelect
              options={cityOptions}
              value={formData.city || ""}
              onChange={(value) => onInputChange("city", value)}
              placeholder="Select City"
              icon={MapPin}
            />
          </div>

          {/* Subscription Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription Plan
            </label>
            <CustomSelect
              options={planOptions}
              value={formData.subscriptionPlan || "free"}
              onChange={(value) => onInputChange("subscriptionPlan", value)}
              placeholder="Select Plan"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArtistModal;
