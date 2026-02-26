// components/EditVenueDetails.js
import Select from "@/ui/Select";
import {
  Building2,
  Clock,
  Edit3,
  Globe,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

const STATE_CITY_MAPPING = {
  Louisiana: [
    { value: "new orleans", label: "New Orleans" },
    { value: "baton rouge", label: "Baton Rouge" },
    { value: "lafayette", label: "Lafayette" },
    { value: "shreveport", label: "Shreveport" },
  ],
  Mississippi: [
    { value: "jackson", label: "Jackson" },
    { value: "biloxi", label: "Biloxi" },
    { value: "gulfport", label: "Gulfport" },
    { value: "oxford", label: "Oxford" },
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
  ],
};

const stateOptions = [
  { value: "Louisiana", label: "Louisiana" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Alabama", label: "Alabama" },
  { value: "Florida", label: "Florida" },
];

export default function EditVenueDetails({
  venueData,
  onInputChange,
  formErrors,
  disabled,
}) {
  const getCityOptions = () => {
    if (!venueData.state) return [];
    return STATE_CITY_MAPPING[venueData.state] || [];
  };

  const formatCityDisplay = (city) => {
    if (!city || typeof city !== "string") return "";
    return city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Edit3 size={20} className="text-gray-700" />
        Venue Details
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* State Selection */}
        <Select
          label="State *"
          value={venueData.state}
          onChange={(e) => onInputChange("state", e?.target?.value ?? e)}
          options={stateOptions}
          placeholder="Select a state"
          required={true}
          icon={<MapPin size={18} className="text-gray-500" />}
          error={formErrors.state}
          helperText="This determines your category on the homepage"
          disabled={disabled}
        />

        {/* City Selection */}
        <Select
          label="City *"
          value={venueData.city}
          onChange={(e) => onInputChange("city", e?.target?.value ?? e)}
          options={getCityOptions()}
          placeholder={venueData.state ? "Select a city" : "Select state first"}
          required={true}
          icon={<MapPin size={18} className="text-gray-500" />}
          error={formErrors.city}
          disabled={!venueData.state || disabled}
          customDisplay={
            venueData.city ? formatCityDisplay(venueData.city) : ""
          }
          helperText={
            venueData.state
              ? `Cities in ${venueData.state}`
              : "Select state first"
          }
        />

        {/* Venue Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={venueData.venueName}
              onChange={(e) => onInputChange("venueName", e.target.value)}
              className={`w-full bg-white border ${formErrors.venueName ? "border-red-300" : "border-gray-300"} rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500`}
              placeholder="Enter venue name"
              disabled={disabled}
            />
          </div>
          {formErrors.venueName && (
            <p className="mt-2 text-sm text-red-600">{formErrors.venueName}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={venueData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter venue address"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Phone */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={venueData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter phone number"
              disabled={disabled}
            />
          </div>
        </div> */}

        {/* Website */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={venueData.website}
              onChange={(e) => onInputChange("website", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="https://example.com"
              disabled={disabled}
            />
          </div>
        </div> */}

        {/* Seating Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seating Capacity
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={venueData.seatingCapacity || ""}
              onChange={(e) =>
                onInputChange("seatingCapacity", parseInt(e.target.value) || 0)
              }
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter seating capacity"
              min="0"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Open Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Open Hours
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={venueData.openHours}
              onChange={(e) => onInputChange("openHours", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="e.g., 6 PM - 2 AM"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Open Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Open Days
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={venueData.openDays}
              onChange={(e) => onInputChange("openDays", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="e.g., Mon-Sat, Closed Sunday"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Biography */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biography
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3">
              <Edit3 className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={venueData.biography}
              onChange={(e) => onInputChange("biography", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500 min-h-[120px]"
              placeholder="Tell us about your venue, history, specialties..."
              disabled={disabled}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
