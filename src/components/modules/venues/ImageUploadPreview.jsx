// components/ImageUploadPreview.js
"use client";

import { ImageIcon, X } from "lucide-react";

export default function ImageUploadPreview({
  imagePreview,
  onRemove,
  onFileChange,
  disabled,
  required,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <ImageIcon size={18} className="text-gray-500" />
        Show Image *
      </label>

      {imagePreview ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Image Preview:</p>
          <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-300">
            <img
              src={imagePreview}
              alt="Show preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/400/300";
              }}
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white rounded-full shadow-sm"
            >
              <X size={18} className="text-gray-700" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="image-upload"
            required={required}
            disabled={disabled}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Click to upload show image</p>
            <p className="text-gray-500 text-sm mt-1">
              JPG, PNG, WebP (Max 5MB)
            </p>
          </label>
        </div>
      )}
    </div>
  );
}
