"use client";

import { Edit2, Eye, Loader2, Save, X } from "lucide-react";

const FeaturedHeader = ({ isEditMode, onEdit, onCancel, onSave, saving }) => {
  const handlePreview = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          Featured Section
        </h1>
        <p className="text-gray-500 text-xs mt-0.5">
          Customize the featured section of your website
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3 lg:mt-0">
        <button
          onClick={handlePreview}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-medium transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>

        {!isEditMode ? (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs font-medium transition cursor-pointer disabled:opacity-50 border border-gray-300"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedHeader;
