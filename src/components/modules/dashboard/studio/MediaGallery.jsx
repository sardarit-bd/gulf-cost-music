"use client";

import {
    Check,
    Download,
    Eye,
    Image as ImageIcon,
    Trash2,
    ZoomIn
} from "lucide-react";
import { useState } from "react";

export default function MediaGallery({
    photos,
    viewMode = "grid",
    selectedPhotos = new Set(),
    onSelect,
    onDelete,
    onView
}) {
    const [hoveredPhoto, setHoveredPhoto] = useState(null);

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                    <div
                        key={photo._id || index}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                        onMouseEnter={() => setHoveredPhoto(photo._id)}
                        onMouseLeave={() => setHoveredPhoto(null)}
                    >
                        {/* Photo */}
                        <img
                            src={photo.url || "/placeholder.jpg"}
                            alt={`Studio photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Selection Overlay */}
                        <div
                            className={`absolute inset-0 transition-colors ${selectedPhotos.has(photo._id)
                                    ? "bg-blue-600/30"
                                    : "bg-black/0 group-hover:bg-black/20"
                                }`}
                        >
                            {/* Selection Checkbox */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect?.(photo._id);
                                }}
                                className={`absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${selectedPhotos.has(photo._id)
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "bg-white/90 border-white/90 text-transparent hover:bg-blue-100 hover:border-blue-300"
                                    }`}
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Hover Actions */}
                        {hoveredPhoto === photo._id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView?.(index);
                                    }}
                                    className="p-3 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors"
                                    title="View"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView?.(index);
                                    }}
                                    className="p-3 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors"
                                    title="Zoom"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(photo._id);
                                    }}
                                    className="p-3 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Photo Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Photo {index + 1}</span>
                                <span className="text-xs opacity-75">Studio</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty Slots */}
                {photos.length < 5 && (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900 mb-1">Add More Photos</p>
                        <p className="text-sm text-gray-600">
                            {5 - photos.length} slots available
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // List View
    return (
        <div className="space-y-3">
            {photos.map((photo, index) => (
                <div
                    key={photo._id || index}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                    {/* Selection Checkbox */}
                    <button
                        onClick={() => onSelect?.(photo._id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedPhotos.has(photo._id)
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-gray-300 text-transparent hover:border-blue-400"
                            }`}
                    >
                        <Check className="w-3 h-3" />
                    </button>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={photo.url || "/placeholder.jpg"}
                            alt={`Studio photo ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">Studio Photo {index + 1}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-600">Uploaded 2 days ago</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-600">Studio Space</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onView?.(index)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete?.(photo._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}