"use client";

import { Camera, CheckCircle, Music, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function UploadSection({
  type,
  label,
  accept,
  maxFiles = 5,
  currentFiles = [],
  onUpload,
  onRemove,
  subscriptionPlan,
  disabled = false,
  showLimits = true,
  currentCount = 0,
}) {
  const [dragOver, setDragOver] = useState(false);

  const Icon = type === "image" ? Camera : Music;
  const canUpload = currentCount < maxFiles;

  // Filter out files with empty/invalid URLs
  const validCurrentFiles = useMemo(() => {
    return currentFiles.filter((file) => {
      if (!file) return false;

      if (type === "image" && file.url) {
        return (
          file.url.trim() !== "" &&
          file.url !== "undefined" &&
          file.url !== "null" &&
          !file.url.startsWith("data:,")
        );
      }

      return true;
    });
  }, [currentFiles, type]);

  const handleFileSelect = useCallback(
    (e) => {
      if (!canUpload) return;

      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const availableSlots = maxFiles - currentCount;
      const limitedFiles = files.slice(0, availableSlots);

      if (limitedFiles.length === 0) {
        toast.error(`Maximum ${maxFiles} ${type}s allowed`);
        return;
      }

      onUpload(limitedFiles);
      toast.success(`Added ${limitedFiles.length} ${type}(s)`);
      e.target.value = "";
    },
    [canUpload, currentCount, maxFiles, onUpload, type],
  );

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (canUpload) setDragOver(true);
    },
    [canUpload],
  );

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);

      if (!canUpload) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith(`${type}/`),
      );

      if (files.length > 0) {
        const availableSlots = maxFiles - currentCount;
        const limitedFiles = files.slice(0, availableSlots);
        onUpload(limitedFiles);
      }
    },
    [canUpload, currentCount, maxFiles, onUpload, type],
  );

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    const trimmedUrl = url.trim();
    return (
      trimmedUrl !== "" &&
      trimmedUrl !== "undefined" &&
      trimmedUrl !== "null" &&
      !trimmedUrl.startsWith("data:,") &&
      trimmedUrl.length > 10
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${type === "image" ? "bg-blue-100" : "bg-purple-100"}`}>
            <Icon className={`w-4 h-4 ${type === "image" ? "text-blue-600" : "text-purple-600"}`} />
          </div>
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        {showLimits && (
          <span className="text-sm text-gray-500">
            {currentCount}/{maxFiles}
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 bg-gray-50"
          } ${!canUpload ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => canUpload && document.getElementById(`${type}-upload`).click()}
      >
        <div className="relative z-10">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${type === "image" ? "bg-blue-100" : "bg-purple-100"
            }`}>
            <Upload className={type === "image" ? "text-blue-600" : "text-purple-600"} size={20} />
          </div>

          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {canUpload ? "Drag & drop files here" : "Maximum files reached"}
          </h4>

          <p className="text-gray-500 text-xs mb-3">
            {canUpload
              ? `or click to browse files (max ${maxFiles} ${type}s)`
              : `You've reached the maximum of ${maxFiles} ${type}s`}
          </p>

          {canUpload && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${type === "image"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              } transition`}>
              <Upload size={14} />
              Select Files
            </div>
          )}

          <input
            id={`${type}-upload`}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileSelect}
            disabled={!canUpload}
            className="hidden"
          />
        </div>

        {!canUpload && (
          <div className="absolute inset-0 bg-white/80 rounded-xl backdrop-blur-sm"></div>
        )}
      </div>

      {/* File List */}
      {validCurrentFiles.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Uploaded files ({validCurrentFiles.length})
          </div>

          <div className="space-y-2">
            {validCurrentFiles.map((file, index) => {
              const showImage = type === "image" && file.url && isValidImageUrl(file.url);

              return (
                <div
                  key={file.id || index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition group"
                >
                  {/* File Icon/Preview */}
                  {showImage ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border">
                      <Image
                        src={file.url}
                        alt={file.name || `File ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="40px"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.className += " bg-gray-200";
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${type === "image" ? "bg-blue-100" : "bg-purple-100"
                      }`}>
                      {type === "image" ? (
                        <Camera className="text-blue-600" size={16} />
                      ) : (
                        <Music className="text-purple-600" size={16} />
                      )}
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">
                      {file.name || `File ${index + 1}`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {file.isNew && (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle size={10} />
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Storage usage</span>
              <span>{Math.round((validCurrentFiles.length / maxFiles) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${type === "image"
                    ? "bg-gradient-to-r from-blue-500 to-blue-400"
                    : "bg-gradient-to-r from-purple-500 to-purple-400"
                  }`}
                style={{ width: `${(validCurrentFiles.length / maxFiles) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}