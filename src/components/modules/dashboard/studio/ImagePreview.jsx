// components/modules/dashboard/studio/ImagePreview.jsx
"use client";

import { File, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImagePreview({ file, index, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    // 🔥 FIX: Handle different file types
    if (typeof file === "string") {
      // Direct URL string
      setPreviewUrl(file);
      setLoading(false);
    } else if (file.url) {
      // Object with url property
      setPreviewUrl(file.url);
      setLoading(false);
    } else if (file instanceof File) {
      // File object from input
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setLoading(false);

      // Cleanup
      return () => URL.revokeObjectURL(url);
    } else if (file.publicId) {
      // Construct URL from publicId
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_NAME ||
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/${file.publicId}`;
      setPreviewUrl(url);
      setLoading(false);
    }
  }, [file]);

  const handleImageError = () => {
    console.error("❌ Image failed to load:", previewUrl);
    setError(true);
    setLoading(false);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    // Force reload
    setTimeout(() => setLoading(false), 500);
  };

  if (!previewUrl || error) {
    return (
      <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <File className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">
            {typeof file === "object" && file.name
              ? file.name
              : "Image failed to load"}
          </p>
          <p className="text-sm text-red-600 mt-1">
            Failed to load image.
            <button
              onClick={handleRetry}
              className="ml-2 text-red-700 underline hover:no-underline"
            >
              Retry
            </button>
          </p>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(index)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={previewUrl}
          alt={`Preview ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          sizes="64px"
          onError={handleImageError}
          onLoad={() => setLoading(false)}
          unoptimized={previewUrl?.includes("cloudinary")} // 🔥 For Cloudinary URLs
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {typeof file === "object" && file.name
            ? file.name
            : `Photo ${index + 1}`}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-600">
            {file.size
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              : "✓ Uploaded"}
          </span>
          {!file.size && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Ready
            </span>
          )}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
