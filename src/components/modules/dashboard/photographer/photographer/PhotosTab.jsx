"use client";

import { Crown, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

// Upgrade Prompt Component
const UpgradePrompt = ({ feature }) => (
    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="flex items-start gap-3">
            <Crown className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
            <div>
                <p className="text-sm text-gray-300">
                    <span className="font-medium">{feature}</span> is available for Pro users
                </p>
                <button
                    onClick={() => window.open("/pricing", "_blank")}
                    className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded font-medium transition"
                >
                    Upgrade to Pro
                </button>
            </div>
        </div>
    </div>
);

export default function PhotosTab({
    photos,
    subscriptionPlan,
    removeImage,
    handleImageUpload,
    uploadingPhotos,
    MAX_PHOTOS
}) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        if (subscriptionPlan === "free") {
            toast.error("Photo uploads require Pro plan. Upgrade to Pro.");
            e.target.value = "";
            return;
        }

        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Check photo limit
        const totalAfterUpload = photos.length + files.length;
        if (totalAfterUpload > MAX_PHOTOS) {
            toast.error(`Maximum ${MAX_PHOTOS} photos allowed. You have ${photos.length} already.`);
            e.target.value = "";
            return;
        }

        setIsUploading(true);

        try {
            await handleImageUpload(e);
            toast.success(`${files.length} photo(s) uploaded successfully!`);
        } catch (error) {
            console.error("Photo upload error:", error);
            toast.error("Failed to upload photos");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    if (subscriptionPlan === "free") {
        return (
            <div className="animate-fadeIn">
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/10 rounded-full mb-6">
                            <ImageIcon size={32} className="text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Photo Portfolio <span className="text-yellow-500">(Pro Feature)</span>
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Upgrade to Pro to upload and manage your portfolio photos.
                            Showcase your best work to attract more clients.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.open("/pricing", "_blank")}
                                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition"
                            >
                                <Crown size={18} />
                                Upgrade to Pro Plan
                            </button>
                            <button
                                onClick={() => window.open("/features", "_blank")}
                                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
                            >
                                View All Features
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ImageIcon size={24} />
                    Portfolio Photos
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium ml-2">
                        {photos.length}/{MAX_PHOTOS}
                    </span>
                </h3>

                {/* Upload Area */}
                <label className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl transition ${photos.length >= MAX_PHOTOS || uploadingPhotos || isUploading
                        ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                    }`}>
                    {uploadingPhotos || isUploading ? (
                        <>
                            <Loader2 size={40} className="animate-spin" />
                            <span className="text-lg font-medium text-center">Uploading Photos...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={40} />
                            <div className="text-center">
                                <p className="text-lg font-medium">
                                    {photos.length >= MAX_PHOTOS ? 'Maximum Photos Reached' : 'Upload Photos'}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Max {MAX_PHOTOS} photos • JPG, PNG, WebP
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleFileUpload}
                                disabled={photos.length >= MAX_PHOTOS || uploadingPhotos || isUploading}
                            />
                        </>
                    )}
                </label>

                {/* Upload Progress */}
                {(uploadingPhotos || isUploading) && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Processing photos...</span>
                    </div>
                )}
            </div>

            {/* Photos Grid */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    Your Photos ({photos.length})
                </h3>

                {photos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
                        <ImageIcon size={48} className="text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No photos uploaded yet</p>
                        <p className="text-gray-500 text-sm">Upload your best work to showcase your skills</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 text-sm mb-4">
                            {photos.length} photo(s) - Click on any photo to remove it
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo._id || index}
                                    className="relative aspect-square rounded-xl overflow-hidden group border border-gray-600 cursor-pointer"
                                    onClick={() => removeImage(index)}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.caption || `Portfolio photo ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                                        <Trash2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {photo.caption && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-sm truncate">
                                                {photo.caption}
                                            </p>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}