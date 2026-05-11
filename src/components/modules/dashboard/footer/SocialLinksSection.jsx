"use client";

import { Instagram, Youtube, Edit2 } from "lucide-react";

const SocialLinksSection = ({
  socialLinks,
  isEditMode,
  onSocialChange,
  onOpenEditModal,
}) => {
  const socialFields = [
    {
      key: "instagram",
      label: "Instagram URL",
      icon: Instagram,
      placeholder: "https://instagram.com/username",
      color: "pink",
    },
    {
      key: "youtube",
      label: "YouTube URL",
      icon: Youtube,
      placeholder: "https://youtube.com/channel",
      color: "red",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-pink-100 rounded-lg">
            <Instagram className="w-4 h-4 text-pink-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Social Media Links
          </h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {socialFields.map((field) => {
          const Icon = field.icon;
          const value = socialLinks[field.key] || "";

          return (
            <div
              key={field.key}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {field.label}
                  </label>
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          value={value}
                          onChange={(e) =>
                            onSocialChange(
                              "socialLinks",
                              field.key,
                              e.target.value,
                            )
                          }
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 bg-white"
                          placeholder={field.placeholder}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate max-w-md">
                          {value || "Not set"}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          onOpenEditModal("socialLinks", field.key, value)
                        }
                        className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition cursor-pointer"
                        title={`Edit ${field.label}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksSection;
