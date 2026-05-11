"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

const ImageCard = ({
  imagePreview,
  isEditMode,
  selectedImage,
  onImageChange,
  onRemoveImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-100 rounded-lg">
            <ImageIcon className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">
            Featured Image
          </h2>
        </div>
      </div>

      <div className="p-4">
        {imagePreview ? (
          <div className="relative w-full max-w-[200px] mx-auto aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
            {isEditMode && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <label className="bg-white text-gray-900 px-2 py-1 rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-md">
                  <Upload className="w-3 h-3" /> Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files[0] && onImageChange(e.target.files[0])
                    }
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No image uploaded</p>
            {isEditMode && (
              <label className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-xs cursor-pointer hover:bg-yellow-600 transition">
                <Upload className="w-3 h-3" /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] && onImageChange(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {!isEditMode && imagePreview && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Click Edit to change image
          </p>
        )}

        {isEditMode && selectedImage && (
          <div className="mt-3 flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
            <span className="text-xs text-green-700 truncate max-w-[160px]">
              {selectedImage.name}
            </span>
            <button
              onClick={onRemoveImage}
              className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
