"use client";

import { ImageIcon, Loader2, Upload } from "lucide-react";

export default function UploadSection({
  photos,
  MAX_PHOTOS,
  uploadingPhotos,
  onUpload,
}) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Photos
          </h2>
          <p className="text-gray-600">Add new photos to your portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-gray-600 text-sm">Storage Used</p>
            <p className="text-lg font-bold text-blue-600">
              {Math.round((photos.length / MAX_PHOTOS) * 100)}%
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <label
        className={`cursor-pointer flex flex-col items-center justify-center gap-6 p-10 border-2 border-dashed rounded-2xl transition-all duration-300 ${
          photos.length >= MAX_PHOTOS || uploadingPhotos
            ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-blue-300 bg-blue-50 text-blue-600 hover:border-blue-400 hover:bg-blue-100 hover:scale-[1.01]"
        }`}
      >
        {uploadingPhotos ? (
          <div className="text-center">
            <Loader2
              size={48}
              className="animate-spin mx-auto mb-4 text-blue-500"
            />
            <p className="text-lg font-medium text-blue-600">
              Uploading Photos...
            </p>
            <p className="text-gray-500 mt-2">
              Please wait while we process your photos
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
              <Upload size={36} className="text-blue-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-gray-900">
                {photos.length >= MAX_PHOTOS
                  ? "Maximum Photos Reached"
                  : "Upload Your Photos"}
              </p>
              <p className="text-gray-600">
                {photos.length >= MAX_PHOTOS
                  ? `You've reached the maximum of ${MAX_PHOTOS} photos`
                  : "Drag & drop or click to browse files"}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Supported: JPG, PNG, WebP, GIF • Max 5MB per file
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onUpload}
              disabled={photos.length >= MAX_PHOTOS || uploadingPhotos}
            />
          </>
        )}
      </label>

      {/* Upload Progress */}
      {uploadingPhotos && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Processing photos...</span>
            <span>
              {photos.length}/{MAX_PHOTOS}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(photos.length / MAX_PHOTOS) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
