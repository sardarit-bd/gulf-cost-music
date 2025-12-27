"use client";

import { BoomBox, CheckCircle, CloudUpload, Crown as CrownIcon, ImageIcon, Music2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Custom Crown icon component
const Crown = ({ size = 16 }) => (
    <CrownIcon size={size} className="text-yellow-500" />
);

export default function UploadSection({
    type,
    label,
    accept,
    maxFiles,
    currentFiles = [],
    onUpload,
    onRemove,
    subscriptionPlan,
    disabled = false,
}) {
    const [dragOver, setDragOver] = useState(false);

    const Icon = type === "image" ? ImageIcon : Music2;
    const isPro = subscriptionPlan === "pro";

    // Filter out files with empty/invalid URLs
    const validCurrentFiles = useMemo(() => {
        return currentFiles.filter(file => {
            if (!file) return false;

            // Check if file has valid URL for images
            if (type === "image" && file.url) {
                return file.url.trim() !== "" &&
                    file.url !== "undefined" &&
                    file.url !== "null" &&
                    !file.url.startsWith("data:,");
            }

            // For audio files, we might not have URL yet
            return true;
        });
    }, [currentFiles, type]);

    const currentCount = validCurrentFiles.length;
    const canUpload = isPro && currentCount < maxFiles;

    const handleFileSelect = useCallback((e) => {
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
    }, [canUpload, currentCount, maxFiles, onUpload, type]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (canUpload) setDragOver(true);
    }, [canUpload]);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);

        if (!canUpload) return;

        const files = Array.from(e.dataTransfer.files).filter(
            file => file.type.startsWith(`${type}/`)
        );

        if (files.length > 0) {
            const availableSlots = maxFiles - currentCount;
            const limitedFiles = files.slice(0, availableSlots);
            onUpload(limitedFiles);
        }
    }, [canUpload, currentCount, maxFiles, onUpload, type]);

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 KB";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Check if URL is valid for Image component
    const isValidImageUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const trimmedUrl = url.trim();
        return trimmedUrl !== "" &&
            trimmedUrl !== "undefined" &&
            trimmedUrl !== "null" &&
            !trimmedUrl.startsWith("data:,") &&
            trimmedUrl.length > 10;
    };

    if (!isPro) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <Icon className="text-yellow-400" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {label} <span className="text-yellow-500 text-sm">(Pro Feature)</span>
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Upgrade to Pro to upload {type}s and showcase your work
                        </p>
                        <button
                            onClick={() => window.open("/pricing", "_blank")}
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition"
                        >
                            <Crown size={16} />
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
                <span className="text-sm text-gray-400">
                    {currentCount}/{maxFiles} files
                </span>
            </div>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragOver
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                    } ${!canUpload ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => canUpload && document.getElementById(`${type}-upload`).click()}
            >
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-700/50 mb-3">
                        <CloudUpload className="text-gray-300" size={24} />
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-2">
                        {canUpload ? "Drag & drop files here" : "Maximum files reached"}
                    </h4>

                    <p className="text-gray-400 text-sm mb-4">
                        {canUpload
                            ? `or click to browse files (max ${maxFiles} ${type}s)`
                            : `You've reached the maximum of ${maxFiles} ${type}s`
                        }
                    </p>

                    {canUpload && (
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                            <Upload size={16} />
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

                {/* Progress indicator background */}
                {!canUpload && (
                    <div className="absolute inset-0 bg-gray-900/50 rounded-xl"></div>
                )}
            </div>

            {/* File List */}
            {currentCount > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Uploaded files</span>
                        <span>{currentCount} of {maxFiles}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        {validCurrentFiles.map((file, index) => {
                            const showImage = type === "image" && file.url && isValidImageUrl(file.url);

                            return (
                                <div
                                    key={file.id || index}
                                    className="flex items-center border border-gray-400 gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group"
                                >
                                    {/* File Icon/Preview */}
                                    {showImage ? (
                                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={file.url}
                                                alt={file.name || `File ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                                onError={(e) => {
                                                    // Hide image and show fallback
                                                    e.target.style.display = 'none';
                                                    const parent = e.target.parentElement;
                                                    if (parent) {
                                                        const fallback = document.createElement('div');
                                                        fallback.className = 'w-full h-full bg-gray-700 flex items-center justify-center';
                                                        fallback.innerHTML = `
                                                            <ImageIcon class="w-5 h-5 text-gray-500" />
                                                        `;
                                                        parent.appendChild(fallback);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${type === "image" ? "bg-gray-700" : "bg-purple-500/20"
                                            }`}>
                                            {type === "image" ? (
                                                <ImageIcon className="text-gray-400" size={18} />
                                            ) : (
                                                <BoomBox className="text-purple-400" size={18} />
                                            )}
                                        </div>
                                    )}

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm truncate">
                                            {file.name || `File ${index + 1}`}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            {file.size && (
                                                <span>{formatFileSize(file.size)}</span>
                                            )}
                                            {file.isNew && (
                                                <span className="inline-flex items-center gap-1 text-green-400">
                                                    <CheckCircle size={10} />
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => onRemove(index)}
                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition opacity-0 group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-3 border-t border-gray-700">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Storage usage</span>
                            <span>{Math.round((currentCount / maxFiles) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-300"
                                style={{ width: `${(currentCount / maxFiles) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}