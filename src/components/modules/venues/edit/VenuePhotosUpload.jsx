// components/VenuePhotosUpload.js
import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function VenuePhotosUpload({
  previewImages,
  onImageUpload,
  onRemoveImage,
  disabled,
}) {
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (previewImages.length + files.length > 10) {
      setError("Maximum 10 photos allowed.");
      return;
    }

    // Validate file size (5MB max)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Some files exceed 5MB limit.");
      return;
    }

    setError("");
    onImageUpload(files);
    e.target.value = null; // Reset file input
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon size={20} className="text-gray-700" />
          Venue Photos ({previewImages.length}/10)
        </h3>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          All Users
        </span>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="photo-upload"
        disabled={disabled || previewImages.length >= 10}
      />

      <label
        htmlFor="photo-upload"
        className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition ${
          previewImages.length >= 10
            ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ImageIcon size={32} />
        <span className="text-sm font-medium text-center">
          {previewImages.length >= 10
            ? "Maximum 10 Photos Uploaded"
            : "Upload Venue Photos"}
        </span>
        <span className="text-xs text-gray-500 text-center">
          Maximum 10 photos allowed • JPG, PNG, WebP • Max 5MB each
        </span>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}

      {previewImages.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Uploaded Photos:</p>
            <p className="text-xs text-blue-600">
              {10 - previewImages.length} photos remaining
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {previewImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 group"
              >
                <Image
                  src={src}
                  alt={`Venue photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/300/300";
                    e.target.className =
                      "w-full h-full bg-gray-100 flex items-center justify-center";
                  }}
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  disabled={disabled}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50 hover:bg-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
