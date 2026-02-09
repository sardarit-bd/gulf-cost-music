// components/VenueLocationCard.js
import { MapPin } from "lucide-react";

export default function VenueLocationCard({ city, state }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MapPin className="text-blue-600" size={20} />
        </div>
        <div>
          <h4 className="text-gray-900 font-semibold">Venue Location</h4>
          <p className="text-gray-600 text-sm">
            Shows will be automatically listed in:{" "}
            <span className="font-medium text-gray-900 capitalize">
              {city || "Not set"}, {state || "Not set"}
            </span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Your venue's location from the profile will be used for all shows
          </p>
        </div>
      </div>
    </div>
  );
}
