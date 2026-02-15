// components/VenueLocationInfo.js
import { MapPin } from "lucide-react";

export default function VenueLocationInfo({ state, city }) {
  const formatCityDisplay = (city) => {
    if (!city) return "";
    return city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin size={18} className="text-gray-700" />
        Location Information
      </h3>
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 mb-1">📍 Listing Category</p>
          <p className="text-2xl font-bold text-blue-800 text-center">
            {state || "Not selected"}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">State:</span>
            <span className="text-sm font-medium text-gray-900">
              {state || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">City:</span>
            <span className="text-sm font-medium text-gray-900">
              {city ? formatCityDisplay(city) : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
