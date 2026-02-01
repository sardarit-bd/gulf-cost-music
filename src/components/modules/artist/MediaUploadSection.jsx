"use client";

import { AlertCircle, ImageIcon, Upload, Video, X } from "lucide-react";

export default function MediaUploadSection({
    listingPhotos,
    listingVideos,
    onPhotoUpload,
    onVideoUpload,
    onRemovePhoto,
    onRemoveVideo,
    formErrors,
}) {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <ImageIcon className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Media Gallery</h3>
                    <p className="text-gray-600">Visuals that help sell your listing</p>
                </div>
            </div>

            {/* Photos Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Photos <span className="text-blue-600">*</span>
                        </h4>
                        <p className="text-gray-500 text-sm">
                            Upload up to 5 clear photos from different angles
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                            {listingPhotos.length}/5 uploaded
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {listingPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50 hover:border-blue-500 transition-all">
                                <img
                                    src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                                    alt={`Listing photo ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <button
                                onClick={() => onRemovePhoto(index)}
                                className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                                <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}

                    {listingPhotos.length < 5 && (
                        <label className="cursor-pointer">
                            <div className="aspect-square border-3 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-500 group">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition" />
                                </div>
                                <span className="text-gray-600 group-hover:text-blue-600 transition font-medium">
                                    Add Photos
                                </span>
                                <span className="text-xs text-gray-500 mt-2 text-center px-4">
                                    JPEG, PNG, WebP • Max 5MB
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={onPhotoUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {formErrors.photos && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                        <AlertCircle className="w-5 h-5" />
                        <span>{formErrors.photos}</span>
                    </div>
                )}
            </div>

            {/* Video Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Video</h4>
                        <p className="text-gray-500 text-sm">Optional video showcasing your item</p>
                    </div>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                        {listingVideos.length}/1 uploaded
                    </span>
                </div>

                {listingVideos.length === 0 ? (
                    <label className="cursor-pointer block max-w-md">
                        <div className="border-3 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-500 group">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition">
                                <Video className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition" />
                            </div>
                            <p className="text-gray-600 group-hover:text-blue-600 transition text-lg font-medium mb-2">
                                Upload Video
                            </p>
                            <p className="text-sm text-gray-500">
                                MP4, MOV • Max 50MB • &lt; 2 minutes recommended
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime"
                            onChange={onVideoUpload}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="relative max-w-2xl">
                        <div className="rounded-2xl overflow-hidden border-2 border-gray-300 bg-gray-50 shadow-xl">
                            <video
                                src={listingVideos[0] instanceof File ? URL.createObjectURL(listingVideos[0]) : listingVideos[0]}
                                controls
                                preload="metadata"
                                className="w-full h-auto max-h-[400px] object-contain"
                                poster={
                                    listingVideos[0] instanceof File
                                        ? URL.createObjectURL(listingVideos[0]) + "#t=0.1"
                                        : undefined
                                }
                            />
                        </div>
                        <button
                            onClick={() => onRemoveVideo(0)}
                            className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full p-2.5 hover:scale-110 transition-transform shadow-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}