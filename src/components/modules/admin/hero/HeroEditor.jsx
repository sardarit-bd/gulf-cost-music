"use client";

import { Loader2, Play, Plus, Trash2, Upload, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import toast from "react-hot-toast";

export default function HeroEditor({ heroData, onChange, onNestedChange, isEditMode, refreshData }) {
    const [uploading, setUploading] = useState(false);
    const [newFlashWord, setNewFlashWord] = useState("");

    const removeVideo = () => {
        if (!isEditMode) return;
        onChange("videoUrl", "");
        onChange("videoPublicId", "");
        toast.success("Video removed");
    };

    const handleUploadSuccess = (result) => {
        setUploading(false);
        if (result.event === "success") {
            const publicId = result.info.public_id;
            onChange("videoUrl", publicId);
            onChange("videoPublicId", publicId);
            toast.success("Video uploaded successfully!");
        }
    };

    const handleUploadError = (error) => {
        setUploading(false);
        toast.error("Upload failed: " + error.message);
    };

    // Flash Words Management
    const addFlashWord = () => {
        if (!isEditMode) return;
        if (newFlashWord.trim()) {
            const updatedWords = [...(heroData.flashWords || []), newFlashWord.trim()];
            onChange("flashWords", updatedWords);
            setNewFlashWord("");
            toast.success("Flash word added");
        }
    };

    const removeFlashWord = (index) => {
        if (!isEditMode) return;
        const updatedWords = heroData.flashWords.filter((_, i) => i !== index);
        onChange("flashWords", updatedWords);
        toast.success("Flash word removed");
    };

    return (
        <div className="space-y-6">
            {/* Text Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                    Text Content
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Main Title
                        </label>
                        <input
                            type="text"
                            value={heroData.title}
                            onChange={(e) => onChange("title", e.target.value)}
                            disabled={!isEditMode}
                            className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                }`}
                            placeholder="Enter your main title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle Prefix
                        </label>
                        <input
                            type="text"
                            value={heroData.subtitlePrefix}
                            onChange={(e) => onChange("subtitlePrefix", e.target.value)}
                            disabled={!isEditMode}
                            className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                }`}
                            placeholder="e.g., Experience the best with stunning"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Text
                        </label>
                        <input
                            type="text"
                            value={heroData.buttonText}
                            onChange={(e) => onChange("buttonText", e.target.value)}
                            disabled={!isEditMode}
                            className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                }`}
                            placeholder="Enter button text"
                        />
                    </div>
                </div>
            </div>

            {/* Flash Words & Animation Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                    Flash Words & Animation
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Flash Words (rotating text)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {heroData.flashWords?.map((word, index) => (
                                <div
                                    key={index}
                                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    <span>{word}</span>
                                    {isEditMode && (
                                        <button
                                            onClick={() => removeFlashWord(index)}
                                            className="hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEditMode && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFlashWord}
                                    onChange={(e) => setNewFlashWord(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Add new flash word"
                                    onKeyPress={(e) => e.key === 'Enter' && addFlashWord()}
                                />
                                <button
                                    onClick={addFlashWord}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Animation Interval (ms)
                            </label>
                            <input
                                type="number"
                                value={heroData.animationSettings?.interval}
                                onChange={(e) => onNestedChange("animationSettings", "interval", parseInt(e.target.value))}
                                disabled={!isEditMode}
                                className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                    }`}
                                min="500"
                                max="5000"
                                step="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Text Color
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={heroData.animationSettings?.textColor}
                                    onChange={(e) => onNestedChange("animationSettings", "textColor", e.target.value)}
                                    disabled={!isEditMode}
                                    className={`w-12 h-10 border border-gray-300 rounded-lg cursor-pointer ${!isEditMode ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                />
                                <input
                                    type="text"
                                    value={heroData.animationSettings?.textColor}
                                    onChange={(e) => onNestedChange("animationSettings", "textColor", e.target.value)}
                                    disabled={!isEditMode}
                                    className={`flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                        }`}
                                    placeholder="#FBBF24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="animationEnabled"
                            checked={heroData.animationSettings?.isEnabled}
                            onChange={(e) => onNestedChange("animationSettings", "isEnabled", e.target.checked)}
                            disabled={!isEditMode}
                            className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                        />
                        <label htmlFor="animationEnabled" className="text-sm text-gray-700">
                            Enable Flash Animation
                        </label>
                    </div>
                </div>
            </div>

            {/* Bottom Text Card - Improved Layout with Inline Artist, Separator, Song */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                    Bottom Right Text Box
                </h2>

                <div className="space-y-4">
                    {/* Preview of how it will look */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Preview:</p>
                        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border-l-4 border-yellow-500 inline-block">
                            <p className="text-white text-xs font-medium">
                                <span className="text-yellow-400 font-bold">
                                    {heroData.bottomText?.artistName || "Anna E. Westcoat"}
                                </span>
                                <span className="text-gray-300 mx-2">
                                    {heroData.bottomText?.separator || "-"}
                                </span>
                                <span className="text-white italic">
                                    "{heroData.bottomText?.songName || "Gulf County"}"
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Artist Name, Separator, Song Name - Inline Layout */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Artist Name & Song Name
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                            {/* Artist Name */}
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    value={heroData.bottomText?.artistName}
                                    onChange={(e) => onNestedChange("bottomText", "artistName", e.target.value)}
                                    disabled={!isEditMode}
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                        }`}
                                    placeholder="Artist Name"
                                />
                            </div>

                            {/* Separator - Small width */}
                            <div className="w-24 sm:w-20 flex-shrink-0">
                                <input
                                    type="text"
                                    value={heroData.bottomText?.separator}
                                    onChange={(e) => onNestedChange("bottomText", "separator", e.target.value)}
                                    disabled={!isEditMode}
                                    className={`w-full text-center border border-gray-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                        }`}
                                    placeholder="•"
                                    maxLength="5"
                                />
                            </div>

                            {/* Song Name */}
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    value={heroData.bottomText?.songName}
                                    onChange={(e) => onNestedChange("bottomText", "songName", e.target.value)}
                                    disabled={!isEditMode}
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all ${!isEditMode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
                                        }`}
                                    placeholder="Song Name"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Format: Artist Name + Separator + Song Name (appears at bottom right of hero section)
                        </p>
                    </div>

                    {/* Show/Hide Toggle */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="bottomTextVisible"
                            checked={heroData.bottomText?.isVisible}
                            onChange={(e) => onNestedChange("bottomText", "isVisible", e.target.checked)}
                            disabled={!isEditMode}
                            className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                        />
                        <label htmlFor="bottomTextVisible" className="text-sm text-gray-700">
                            Show Bottom Text Box
                        </label>
                    </div>
                </div>
            </div>

            {/* Hero Video Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                        Hero Video
                    </h2>
                    {isEditMode && heroData.videoUrl && (
                        <button
                            onClick={removeVideo}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </button>
                    )}
                </div>

                {heroData.videoUrl ? (
                    <div className="mb-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <Play className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-800 mb-1">
                                        ✓ Video uploaded successfully
                                    </p>
                                    <p className="text-xs text-gray-600 font-mono bg-white/50 p-2 rounded">
                                        Video ID: {heroData.videoPublicId}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        This video will play as background on your hero section
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 mb-4">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-1">
                            No video uploaded
                        </p>
                        <p className="text-xs text-gray-400">
                            Upload a background video for your hero section (MP4, WebM, Max 100MB)
                        </p>
                    </div>
                )}

                {/* Upload Button - Only in edit mode */}
                {isEditMode && (
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{
                            sources: ["local"],
                            multiple: false,
                            resourceType: "video",
                            maxFileSize: 104857600,
                            clientAllowedFormats: ["mp4", "mov", "avi", "mkv", "webm"],
                        }}
                        onUpload={() => setUploading(true)}
                        onSuccess={handleUploadSuccess}
                        onError={handleUploadError}
                    >
                        {({ open }) => (
                            <button
                                onClick={() => open()}
                                disabled={uploading}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                {uploading ? "Uploading..." : heroData.videoUrl ? "Replace Video" : "Upload Video"}
                            </button>
                        )}
                    </CldUploadWidget>
                )}

                {!isEditMode && !heroData.videoUrl && (
                    <div className="text-center text-sm text-gray-500 py-2">
                        <p>Click Edit to upload a video</p>
                    </div>
                )}
            </div>
        </div>
    );
}