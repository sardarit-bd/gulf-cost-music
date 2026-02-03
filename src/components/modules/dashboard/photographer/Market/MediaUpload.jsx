"use client";

import {
    AlertCircle,
    Image,
    Trash2,
    Upload,
    Video,
    X
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MediaUpload({
    existingItem,
    photoFiles,
    videoFile,
    onPhotoUpload,
    onVideoUpload,
    onRemovePhoto,
    onRemoveVideo,
    onRemoveExistingPhoto,
    onRemoveExistingVideo,
    errors
}) {
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    const totalExistingPhotos = existingItem?.photos?.length || 0;
    const totalPhotos = totalExistingPhotos + photoFiles.length;
    const remainingSlots = 5 - totalPhotos;
    const hasExistingVideo = existingItem?.videos?.length > 0;

    // Existing video URL handle (object বা string হতে পারে)
    const existingVideoUrl = hasExistingVideo
        ? (existingItem.videos[0]?.url || existingItem.videos[0])
        : null;

    const handleFileSelect = (e, type) => {
        const files = Array.from(e.target.files || []);

        if (type === 'photos') {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            const maxSize = 5 * 1024 * 1024; // 5MB

            const validFiles = files.filter((file) => {
                if (!validTypes.includes(file.type)) {
                    toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, WebP allowed.`);
                    return false;
                }
                if (file.size > maxSize) {
                    toast.error(`File too large: ${file.name}. Max size is 5MB.`);
                    return false;
                }
                return true;
            });

            onPhotoUpload(validFiles);
        } else if (type === 'video') {
            const file = files[0];
            if (file) {
                const validTypes = ["video/mp4", "video/quicktime", "video/mov"];
                const maxSize = 50 * 1024 * 1024; // 50MB

                if (!validTypes.includes(file.type)) {
                    toast.error(`Invalid file type. Only MP4, MOV allowed.`);
                    return;
                }
                if (file.size > maxSize) {
                    toast.error(`File too large. Max size is 50MB.`);
                    return;
                }

                onVideoUpload(file);
            }
        }

        e.target.value = "";
    };

    return (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Media Upload</h3>
            </div>

            {/* Photos Upload */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Photos (Max 5) *
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                            Clear photos from multiple angles increase sales
                        </p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                        {totalPhotos}/5 uploaded
                    </span>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {/* Existing Photos */}
                    {existingItem?.photos?.map((photo, index) => (
                        <div key={`existing-${photo.public_id || index}`} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-xl border border-gray-300 bg-white">
                                <img
                                    src={typeof photo === 'string' ? photo : photo.url}
                                    alt={`Listing photo ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    console.log("Removing existing photo:", photo);
                                    onRemoveExistingPhoto(photo);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                                title="Delete photo"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {/* New Photos - শুধুমাত্র new photo-র জন্য */}
                    {photoFiles.map((file, index) => (
                        <div key={`new-${index}`} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-xl border-2 border-blue-500 bg-white">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`New photo ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    console.log("Removing new photo at index:", index);
                                    onRemovePhoto(index); // 🔥 FIXED: শুধুমাত্র index পাঠানো
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                                title="Remove new photo"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {/* Upload Button */}
                    {totalPhotos < 5 && (
                        <label className="cursor-pointer">
                            <div className="aspect-square border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
                                    <Upload className="w-6 h-6 text-gray-500 group-hover:text-blue-500 transition" />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-blue-600 transition">
                                    Add Photo
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    {remainingSlots} slots left
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={(e) => handleFileSelect(e, 'photos')}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {errors.photos && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.photos}
                    </p>
                )}
            </div>

            {/* Videos Upload */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Video (Optional)
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                            Show equipment in action
                        </p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                        {(videoFile || hasExistingVideo) ? "1/1 uploaded" : "0/1 uploaded"}
                    </span>
                </div>

                {/* Video Upload Area */}
                {(!videoFile && !hasExistingVideo) ? (
                    <label className="cursor-pointer block max-w-md">
                        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
                                <Video className="w-7 h-7 text-gray-500 group-hover:text-blue-500 transition" />
                            </div>
                            <p className="text-gray-600 group-hover:text-blue-600 transition text-sm">
                                Add Video (Optional)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                MP4, MOV • Max 50MB
                            </p>
                        </div>

                        <input
                            type="file"
                            accept="video/mp4,video/quicktime,video/mov"
                            onChange={(e) => handleFileSelect(e, 'video')}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="relative max-w-md">
                        <div className="rounded-xl overflow-hidden border border-gray-300 bg-white">
                            <video
                                src={videoFile ? URL.createObjectURL(videoFile) : existingVideoUrl}
                                controls
                                preload="metadata"
                                className="w-full h-auto max-h-[280px] object-contain"
                            />
                        </div>

                        <button
                            onClick={() => {
                                console.log("Removing video:", {
                                    hasExistingVideo,
                                    existingVideo: existingItem?.videos?.[0]
                                });
                                hasExistingVideo ? onRemoveExistingVideo() : onRemoveVideo();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                            title={hasExistingVideo ? "Delete existing video" : "Remove new video"}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}