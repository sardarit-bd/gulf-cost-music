// components/SaveProfileSection.js
import { AlertCircle, Loader2, Save } from "lucide-react";

export default function SaveProfileSection({
  onSave,
  saving,
  venueName,
  state,
  city,
  isActive,
}) {
  const isProfileComplete = venueName && state && city;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {!isActive && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Pending Verification
              </h4>
              <p className="text-xs text-yellow-700 mt-1">
                Complete your profile and submit for verification to access all
                features.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Profile Status:</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              isProfileComplete
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isProfileComplete ? "Complete" : "Incomplete"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Verification:</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isActive ? "Verified" : "Pending"}
          </span>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Make sure all required fields (*) are filled before saving
        </div>
      </div>
    </div>
  );
}
