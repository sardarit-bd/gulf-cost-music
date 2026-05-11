"use client";

import { Edit2, Loader2, Save, X } from "lucide-react";

const ActionButtons = ({ isEditMode, saving, onEdit, onCancel, onSave }) => {
  return (
    <div className="flex justify-end gap-3 mb-6">
      {!isEditMode ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all text-sm font-medium cursor-pointer shadow-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit Footer
        </button>
      ) : (
        <>
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium cursor-pointer disabled:opacity-50 border border-gray-300"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-medium cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
