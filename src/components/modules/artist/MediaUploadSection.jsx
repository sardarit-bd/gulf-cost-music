"use client";

import { Camera, Film, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MediaUploadSection({
    listingPhotos = [],
    listingVideos = [],
    onPhotoUpload,
    onVideoUpload,
    onRemovePhoto,
    onRemoveVideo,
    formErrors = {},
}) {
    // const [previewImages, setPreviewImages] = useState({});
    const [videoError, setVideoError] = useState(false);

    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [isNewVideo, setIsNewVideo] = useState(false);

    useEffect(() => {
        if (!listingVideos || listingVideos.length === 0) {
            setVideoPreviewUrl(null);
            return;
        }

        const video = listingVideos[0];

        if (video instanceof File) {
            const url = URL.createObjectURL(video);
            setVideoPreviewUrl(url);
            setIsNewVideo(true);

            return () => URL.revokeObjectURL(url);
        } else if (typeof video === "string") {
            setVideoPreviewUrl(video);
            setIsNewVideo(false);
        }
    }, [listingVideos]);


    // Cleanup object URLs on unmount
    // useEffect(() => {
    //     return () => {
    //         Object.values(previewImages).forEach(url => {
    //             if (url && url.startsWith('blob:')) {
    //                 URL.revokeObjectURL(url);
    //             }
    //         });
    //     };
    // }, [previewImages]);

    const handlePhotoChange = (e) => {
        onPhotoUpload(e);
    };

    const handleVideoChange = (e) => {
        setVideoError(false);
        onVideoUpload(e);
    };

    const getImageUrl = (photo) => {
        if (photo instanceof File) {
            return URL.createObjectURL(photo);
        }
        return photo;
    };



    // FIXED: Get video URL with proper handling
    const getVideoUrl = () => {
        if (!listingVideos || listingVideos.length === 0) return null;

        const video = listingVideos[0];

        if (video instanceof File) {
            // For new file uploads, create blob URL
            return URL.createObjectURL(video);
        }

        // For existing videos, return the URL directly
        return video;
    };

    // Handle video error
    const handleVideoError = (e) => {
        console.error("Video failed to load:", e.target.src);
        setVideoError(true);
    };

    // const videoUrl = getVideoUrl();
    // const isNewVideo = listingVideos.length > 0 && listingVideos[0] instanceof File;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photos Upload Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                            <Camera className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Photos
                                <span className="text-sm font-normal text-gray-500">
                                    ({listingPhotos.length}/5)
                                </span>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Showcase your item with high-quality images
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <label className="block cursor-pointer mb-6">
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${formErrors.photos
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                        }`}>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-gray-900 font-semibold mb-2">
                            Click to upload photos
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            PNG, JPG, WebP up to 5MB each
                        </p>
                        <p className="text-xs text-gray-400">
                            Upload up to 5 high-quality photos
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        multiple
                        onChange={handlePhotoChange}
                        className="hidden"
                        disabled={listingPhotos.length >= 5}
                    />
                </label>

                {formErrors.photos && (
                    <p className="text-sm text-red-600 mt-2">{formErrors.photos}</p>
                )}

                {/* Photos Grid */}
                {listingPhotos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {listingPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                                    <Image
                                        src={getImageUrl(photo)}
                                        alt={`Product ${index + 1}`}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        unoptimized={photo instanceof File}
                                        onError={(e) => {
                                            console.error("Image failed to load:", e.target.src);
                                            e.target.src = "/placeholder-image.jpg"; // Fallback image
                                        }}
                                    />
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => onRemovePhoto(index)}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                                    title="Remove photo"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Existing Photo Badge */}
                                {typeof photo === "string" && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                        Existing
                                    </div>
                                )}

                                {/* New Photo Badge */}
                                {photo instanceof File && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        New
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Placeholder */}
                        {listingPhotos.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                                <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                                <span className="text-xs text-gray-500 group-hover:text-blue-600">
                                    Add More
                                </span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                )}
            </div>

            {/* Video Upload Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                            <Film className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Video
                                <span className="text-sm font-normal text-gray-500">
                                    ({listingVideos.length}/1)
                                </span>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Add a video showcase (optional)
                            </p>
                        </div>
                    </div>
                </div>

                {listingVideos.length === 0 ? (
                    <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                    <Film className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                            <p className="text-gray-900 font-semibold mb-2">
                                Click to upload a video
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                                MP4, MOV up to 50MB
                            </p>
                            <p className="text-xs text-gray-400">
                                Max 1 video, show your item in action!
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime,video/mov"
                            onChange={handleVideoChange}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="space-y-4">
                        {/* Current Video Display */}
                        <div className="relative group">
                            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                                {videoPreviewUrl ? (
                                    <video
                                        key={videoPreviewUrl}
                                        src={videoPreviewUrl}
                                        controls
                                        className="w-full h-full object-contain"
                                        onError={handleVideoError}
                                        preload="metadata"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                                        <p>Loading video...</p>
                                    </div>
                                )}

                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={onRemoveVideo}
                                className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                                title="Remove video"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            {/* Video Badge */}
                            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium ${isNewVideo
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                                }`}>
                                {isNewVideo ? "New Video" : "Existing Video"}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="text-sm text-gray-600">
                            {isNewVideo ? (
                                <p>📁 New video ready to upload: {listingVideos[0]?.name}</p>
                            ) : (
                                <p>✓ Existing video from your listing</p>
                            )}
                        </div>

                        {/* Video Tips */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Film className="w-4 h-4 text-purple-600" />
                                Video Tips:
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li>• Show the item from all angles</li>
                                <li>• Demonstrate any features or sounds</li>
                                <li>• Keep videos under 50MB for best performance</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}