"use client";

import { Eye, Image, X, ZoomIn } from "lucide-react";
import { useState } from "react";

export default function ImagePreview({ file, index, onRemove }) {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getFileSize = (size) => {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        }
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getImageDimensions = (url) => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                resolve({ width: 0, height: 0 });
            };
            img.src = url;
        });
    };

    const handleImageLoad = async (e) => {
        const img = e.target;
        const url = URL.createObjectURL(file);
        const dimensions = await getImageDimensions(url);

        // You could store dimensions in state if needed
        console.log(`Image ${index}: ${dimensions.width}x${dimensions.height}`);
    };

    return (
        <div
            className="relative group overflow-hidden rounded-xl border border-gray-200 bg-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
                {imageError ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                    </div>
                ) : (
                    <img
                        src={file ? URL.createObjectURL(file) : ""}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onLoad={handleImageLoad}
                        onError={() => setImageError(true)}
                    />
                )}

                {/* Hover Overlay */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity">
                        <button className="p-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white">
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white">
                            <Eye className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Remove Button */}
                {onRemove && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(index);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Index Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    #{index + 1}
                </div>
            </div>

            {/* Info */}
            <div className="p-3">
                <p className="font-medium text-gray-900 text-sm truncate">
                    {file?.name || `Image ${index + 1}`}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">
                        {getFileSize(file?.size || 0)}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                        Ready
                    </span>
                </div>
            </div>
        </div>
    );
}

// Compact version for lists
export function CompactImagePreview({ file, index, onRemove }) {
    const [imageError, setImageError] = useState(false);

    const getFileSize = (size) => {
        return `${(size / 1024).toFixed(0)} KB`;
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            {/* Thumbnail */}
            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {imageError ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-5 h-5 text-gray-400" />
                    </div>
                ) : (
                    <img
                        src={file ? URL.createObjectURL(file) : ""}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                    {file?.name || `Image ${index + 1}`}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">
                        {getFileSize(file?.size || 0)}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-blue-600 font-medium">
                        Ready to upload
                    </span>
                </div>
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    onClick={() => onRemove(index)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}