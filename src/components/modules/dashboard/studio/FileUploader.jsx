// components/modules/dashboard/studio/FileUploader.jsx
"use client";

import {
  AlertCircle,
  Camera,
  CheckCircle,
  Headphones,
  Upload,
  X,
} from "lucide-react";
import { useRef } from "react";

export default function FileUploader({
  activeTab,
  onFileSelect,
  selectedFiles,
  onRemoveFile,
  maxPhotos,
  currentPhotoCount,
  hasAudio,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getRemainingSlots = () => {
    if (activeTab === "photos") {
      return maxPhotos - currentPhotoCount;
    }
    return hasAudio ? 0 : 1;
  };

  const isDisabled = () => {
    if (activeTab === "photos") {
      return currentPhotoCount >= maxPhotos;
    }
    return hasAudio;
  };

  const remainingSlots = getRemainingSlots();
  const disabled = isDisabled();

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          disabled
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={activeTab === "photos"}
          accept={
            activeTab === "photos"
              ? "image/jpeg,image/jpg,image/png,image/webp"
              : "audio/mpeg,audio/wav,audio/mp3,audio/flac"
          }
          onChange={(e) => onFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="w-16 h-16 mx-auto mb-4">
          {activeTab === "photos" ? (
            <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
              <Camera
                className={`w-8 h-8 ${disabled ? "text-gray-400" : "text-blue-600"}`}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-purple-100 rounded-full flex items-center justify-center">
              <Headphones
                className={`w-8 h-8 ${disabled ? "text-gray-400" : "text-purple-600"}`}
              />
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {disabled
            ? activeTab === "photos"
              ? "Maximum Photos Reached"
              : "Audio Already Uploaded"
            : activeTab === "photos"
              ? "Upload Studio Photos"
              : "Upload Audio Sample"}
        </h3>

        <p className="text-gray-600 mb-4">
          {disabled
            ? activeTab === "photos"
              ? `You've reached the maximum of ${maxPhotos} photos`
              : "Delete existing audio to upload a new one"
            : activeTab === "photos"
              ? `Drag & drop or click to upload (${remainingSlots} slot${remainingSlots !== 1 ? "s" : ""} available)`
              : "Drag & drop or click to upload audio sample"}
        </p>

        {!disabled && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all">
            <Upload className="w-4 h-4" />
            Choose Files
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          {activeTab === "photos"
            ? "Supports JPG, PNG, WebP • Max 10MB each"
            : "Supports MP3, WAV, FLAC • Max 50MB"}
        </p>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h4>
            <button
              onClick={() => {
                selectedFiles.forEach((_, index) => onRemoveFile(index));
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {activeTab === "photos" ? (
                      <Camera className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Headphones className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ready
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage Warning */}
      {activeTab === "photos" &&
        currentPhotoCount >= maxPhotos - 1 &&
        currentPhotoCount < maxPhotos && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Almost Full!</p>
                <p className="text-sm text-yellow-700 mt-1">
                  You have {remainingSlots} slot
                  {remainingSlots !== 1 ? "s" : ""} remaining. Consider deleting
                  some photos if you need more space.
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
