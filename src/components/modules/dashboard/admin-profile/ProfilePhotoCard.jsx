"use client";

import { Camera, Upload, Shield, User } from "lucide-react";
import Image from "next/image";

const ProfilePhotoCard = ({ preview, onPhotoChange, onSave, saving }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onPhotoChange(e);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Camera className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Profile Picture
          </h2>
        </div>
      </div>

      <div className="p-5">
        {/* Profile Photo Preview */}
        <div className="flex justify-center mb-5">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md bg-gray-100">
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="text-center space-y-3">
          <label
            htmlFor="photo-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium cursor-pointer w-full justify-center"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload New Photo
          </label>

          <p className="text-xs text-gray-400">
            Recommended: Square image, max 5MB
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            <span>Account secured with encryption</span>
          </div>
        </div>

        {/* Save Button for Photo */}
        {preview && (
          <button
            onClick={onSave}
            disabled={saving}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoCard;
