"use client";

import { Edit2, FileText, Type } from "lucide-react";

const ContentCard = ({ featuredData, isEditMode, onOpenEditModal }) => {
  const fields = [
    {
      key: "subtitle",
      label: "Subtitle",
      icon: Type,
      type: "text",
      placeholder: "Enter subtitle",
    },
    {
      key: "title",
      label: "Main Title",
      icon: Type,
      type: "text",
      placeholder: "Enter main title",
    },
    {
      key: "description",
      label: "Description",
      icon: FileText,
      type: "textarea",
      placeholder: "Enter description",
      rows: 3,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header - with proper border-bottom */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-100 rounded-lg">
            <Type className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">
            Content Settings
          </h2>
        </div>
      </div>

      {/* Fields - with dividers between items */}
      <div>
        {fields.map((field, idx) => {
          const Icon = field.icon;
          const value = featuredData[field.key];
          const isDescription = field.key === "description";

          return (
            <div key={field.key}>
              <div className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-gray-400" />
                      <label className="text-xs font-medium text-gray-500">
                        {field.label}
                      </label>
                    </div>

                    {isEditMode ? (
                      isDescription ? (
                        <textarea
                          value={value}
                          onChange={(e) =>
                            onOpenEditModal(
                              field.key,
                              e.target.value,
                              field.label,
                            )
                          }
                          rows={field.rows}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none resize-none cursor-pointer text-gray-500"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={value}
                          onChange={(e) =>
                            onOpenEditModal(
                              field.key,
                              e.target.value,
                              field.label,
                            )
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none cursor-pointer text-gray-500"
                          placeholder={field.placeholder}
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-700 line-clamp-2">
                          {value || (
                            <span className="text-gray-400 italic">
                              Not set
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            onOpenEditModal(field.key, value, field.label)
                          }
                          className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Border between items - except last one */}
              {idx !== fields.length - 1 && (
                <div className="border-t border-gray-100"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentCard;
