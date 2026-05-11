"use client";

import { ImageIcon, Upload, X, Edit2 } from "lucide-react";
import Image from "next/image";

const LogoSection = ({
  previewLogo,
  isEditMode,
  logoFile,
  onLogoChange,
  onResetLogo,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-100 rounded-lg">
              <ImageIcon className="w-4 h-4 text-yellow-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Logo Settings
            </h2>
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
      </div>

      <div className="p-5">
        {/* Logo Preview */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            {previewLogo ? (
              <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
                <Image
                  src={previewLogo}
                  alt="Logo Preview"
                  width={112}
                  height={112}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {!isEditMode && previewLogo && (
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {isEditMode ? (
          <div className="flex items-center gap-3">
            <label className="cursor-pointer flex-1">
              <div className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
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
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm">
            {previewLogo ? "Logo uploaded" : "No logo uploaded"}
          </div>
        )}

        {isEditMode && logoFile && (
          <div className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
            ✓ New logo selected: {logoFile.name}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-3">
          Recommended: 200x200px PNG or JPG, max 2MB
        </p>
      </div>
    </div>
  );
};

export default LogoSection;
