"use client";

import { Edit, Trash2, Building2 } from "lucide-react";

const SponsorCard = ({ sponsor, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Logo Section */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-center mb-2">
          {sponsor.name}
        </h3>

        {sponsor.description && (
          <p className="text-xs text-gray-500 text-center line-clamp-2 mb-3">
            {sponsor.description}
          </p>
        )}

        {/* Status Badge */}
        <div className="flex justify-center mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              sponsor.isActive !== false
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                sponsor.isActive !== false ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {sponsor.isActive !== false ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(sponsor)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-xs font-medium cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(sponsor)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;
