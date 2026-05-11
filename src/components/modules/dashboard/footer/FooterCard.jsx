"use client";

import {
  Edit2,
  ImageIcon,
  Instagram,
  Mail,
  Phone,
  Upload,
  X,
  Youtube,
} from "lucide-react";
import Image from "next/image";

const FooterCard = ({
  footer,
  previewLogo,
  isEditMode,
  logoFile,
  onLogoChange,
  onResetLogo,
  onOpenEditModal,
  onFieldChange,
}) => {
  // All fields combined array
  const allFields = [
    // Contact Fields
    {
      section: "contact",
      field: "phone",
      label: "Phone Number",
      icon: Phone,
      placeholder: "+1 234 567 8900",
      type: "tel",
      category: "contact",
    },
    {
      section: "contact",
      field: "email",
      label: "Email Address",
      icon: Mail,
      placeholder: "contact@example.com",
      type: "email",
      category: "contact",
    },
    // Social Fields
    {
      section: "socialLinks",
      field: "instagram",
      label: "Instagram URL",
      icon: Instagram,
      placeholder: "https://instagram.com/username",
      type: "url",
      category: "social",
    },
    {
      section: "socialLinks",
      field: "youtube",
      label: "YouTube URL",
      icon: Youtube,
      placeholder: "https://youtube.com/channel",
      type: "url",
      category: "social",
    },
  ];

  const getValue = (section, field) => {
    return footer[section]?.[field] || "";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Footer Configuration
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Manage logo, contact info, and social media links
        </p>
      </div>

      {/* Logo Section */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-yellow-100 rounded">
              <ImageIcon className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Logo</h3>
          </div>
          {isEditMode && logoFile && (
            <button
              onClick={onResetLogo}
              className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* Logo Preview */}
          <div className="relative group">
            {previewLogo ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-1">
                <Image
                  src={previewLogo}
                  alt="Logo Preview"
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            {isEditMode ? (
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    {logoFile ? "Change Logo" : "Choose Logo"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onLogoChange}
                  />
                </label>

                {logoFile && (
                  <button
                    onClick={() => {
                      onLogoChange({ target: { files: [] } });
                      onResetLogo();
                    }}
                    className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-xs cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                {previewLogo ? (
                  <span className="text-green-600">✓ Logo uploaded</span>
                ) : (
                  "No logo uploaded"
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              200x200px PNG or JPG, max 2MB
            </p>
            {isEditMode && logoFile && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 p-1.5 rounded">
                ✓ New logo selected: {logoFile.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border-b border-gray-200">
        <div className="px-5 py-2 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Contact Information
          </h3>
        </div>

        {/* Contact Fields with border between them */}
        <div>
          {allFields
            .filter((field) => field.category === "contact")
            .map((field, idx, arr) => {
              const Icon = field.icon;
              const value = getValue(field.section, field.field);

              return (
                <div key={idx}>
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1 bg-gray-100 rounded">
                            <Icon className="w-3 h-3 text-gray-500" />
                          </div>
                          <label className="text-xs font-medium text-gray-500">
                            {field.label}
                          </label>
                        </div>

                        {isEditMode ? (
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={field.type}
                              value={value}
                              onChange={(e) =>
                                onFieldChange(
                                  field.section,
                                  field.field,
                                  e.target.value,
                                )
                              }
                              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 bg-white"
                              placeholder={field.placeholder}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 ml-5">
                              <span className="text-sm text-gray-700">
                                {value || (
                                  <span className="text-gray-400 italic">
                                    Not set
                                  </span>
                                )}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                onOpenEditModal(
                                  field.section,
                                  field.field,
                                  value,
                                  field.label,
                                )
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
                  {/* Add border except for last item */}
                  {idx !== arr.length - 1 && (
                    <div className="border-t border-gray-100"></div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Social Links Section */}
      <div>
        <div className="px-5 py-2 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Social Media Links
          </h3>
        </div>

        {/* Social Fields with border between them */}
        <div>
          {allFields
            .filter((field) => field.category === "social")
            .map((field, idx, arr) => {
              const Icon = field.icon;
              const value = getValue(field.section, field.field);

              return (
                <div key={idx}>
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1 bg-gray-100 rounded">
                            <Icon className="w-3 h-3 text-gray-500" />
                          </div>
                          <label className="text-xs font-medium text-gray-500">
                            {field.label}
                          </label>
                        </div>

                        {isEditMode ? (
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={field.type}
                              value={value}
                              onChange={(e) =>
                                onFieldChange(
                                  field.section,
                                  field.field,
                                  e.target.value,
                                )
                              }
                              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 bg-white"
                              placeholder={field.placeholder}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 ml-5">
                              <span className="text-sm text-gray-700">
                                {value ? (
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 hover:underline truncate max-w-md inline-block"
                                  >
                                    {value}
                                  </a>
                                ) : (
                                  <span className="text-gray-400 italic">
                                    Not set
                                  </span>
                                )}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                onOpenEditModal(
                                  field.section,
                                  field.field,
                                  value,
                                  field.label,
                                )
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
                  {/* Add border except for last item */}
                  {idx !== arr.length - 1 && (
                    <div className="border-t border-gray-100"></div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FooterCard;
