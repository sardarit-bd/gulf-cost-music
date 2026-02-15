// components/venue/StatusAlerts.js
import { Clock, Palette } from "lucide-react";

export default function StatusAlerts({ venue }) {
  if (!venue) return null;

  return (
    <div className="space-y-4 mb-6">
      {/* Verification Status */}
      {!venue.isActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <h4 className="text-yellow-800 font-semibold">
                Pending Verification
              </h4>
              <p className="text-yellow-700 text-sm mt-1">
                Your venue is under review. You'll receive a verification color
                code once approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Color Code Status */}
      {venue.colorCode &&
        venue.colorCode !== "#000000" &&
        venue.colorCode !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div
                className="p-3 rounded-lg border-2 border-white shadow-sm"
                style={{ backgroundColor: venue.colorCode }}
              >
                <Palette className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold">
                  Venue Color Assigned
                </h4>
                <p className="text-blue-700 text-sm mt-1">
                  Your venue color is{" "}
                  <span className="font-medium">{venue.colorCode}</span>
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  All your events will appear with this color in the calendar
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
