"use client";

import { Loader2, Save, Trash2, Upload, Plus, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import toast from "react-hot-toast";
import { saveHeroData } from "./heroUtils";

export default function HeroEditor({ heroData, onChange, onNestedChange, onSave }) {
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newFlashWord, setNewFlashWord] = useState("");

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveHeroData(heroData);
            toast.success("Hero section saved successfully!");
            onSave();
        } catch (error) {
            toast.error(error.message || "Error saving hero section");
        } finally {
            setSaving(false);
        }
    };

    const removeVideo = () => {
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
        if (newFlashWord.trim()) {
            const updatedWords = [...(heroData.flashWords || []), newFlashWord.trim()];
            onChange("flashWords", updatedWords);
            setNewFlashWord("");
            toast.success("Flash word added");
        }
    };

    const removeFlashWord = (index) => {
        const updatedWords = heroData.flashWords.filter((_, i) => i !== index);
        onChange("flashWords", updatedWords);
        toast.success("Flash word removed");
    };

    return (
        <div className="space-y-4">
            {/* Text Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Text Content
                </h2>
                <div className="space-y-3">
                    {/* Main Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Main Title
                        </label>
                        <input
                            type="text"
                            value={heroData.title}
                            onChange={(e) => onChange("title", e.target.value)}
                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your main title"
                        />
                    </div>

                    {/* Subtitle Prefix */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle Prefix (before flash text)
                        </label>
                        <input
                            type="text"
                            value={heroData.subtitlePrefix}
                            onChange={(e) => onChange("subtitlePrefix", e.target.value)}
                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Experience the best with stunning"
                        />
                    </div>

                    {/* Flash Words */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Flash Words (rotating text)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {heroData.flashWords?.map((word, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                                >
                                    <span>{word}</span>
                                    <button
                                        onClick={() => removeFlashWord(index)}
                                        className="hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFlashWord}
                                onChange={(e) => setNewFlashWord(e.target.value)}
                                className="flex-1 text-gray-500 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add new flash word"
                                onKeyPress={(e) => e.key === 'Enter' && addFlashWord()}
                            />
                            <button
                                onClick={addFlashWord}
                                className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Animation Settings */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Animation Interval (ms)
                            </label>
                            <input
                                type="number"
                                value={heroData.animationSettings?.interval}
                                onChange={(e) => onNestedChange("animationSettings", "interval", parseInt(e.target.value))}
                                className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="500"
                                max="5000"
                                step="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Text Color
                            </label>
                            <input
                                type="color"
                                value={heroData.animationSettings?.textColor}
                                onChange={(e) => onNestedChange("animationSettings", "textColor", e.target.value)}
                                className="w-full h-[38px] border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Animation Toggle */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="animationEnabled"
                            checked={heroData.animationSettings?.isEnabled}
                            onChange={(e) => onNestedChange("animationSettings", "isEnabled", e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="animationEnabled" className="text-sm text-gray-700">
                            Enable Flash Animation
                        </label>
                    </div>

                    {/* Button Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Text
                        </label>
                        <input
                            type="text"
                            value={heroData.buttonText}
                            onChange={(e) => onChange("buttonText", e.target.value)}
                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter button text"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Text Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Bottom Right Text Box
                </h2>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Artist Name
                            </label>
                            <input
                                type="text"
                                value={heroData.bottomText?.artistName}
                                onChange={(e) => onNestedChange("bottomText", "artistName", e.target.value)}
                                className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Anna E. Westcoat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Song Name
                            </label>
                            <input
                                type="text"
                                value={heroData.bottomText?.songName}
                                onChange={(e) => onNestedChange("bottomText", "songName", e.target.value)}
                                className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Gulf County"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Separator
                        </label>
                        <input
                            type="text"
                            value={heroData.bottomText?.separator}
                            onChange={(e) => onNestedChange("bottomText", "separator", e.target.value)}
                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="-"
                            maxLength="5"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="bottomTextVisible"
                            checked={heroData.bottomText?.isVisible}
                            onChange={(e) => onNestedChange("bottomText", "isVisible", e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="bottomTextVisible" className="text-sm text-gray-700">
                            Show Bottom Text Box
                        </label>
                    </div>
                </div>
            </div>

            {/* Video Upload Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Hero Video
                    </h2>
                    {heroData.videoUrl && (
                        <button
                            onClick={removeVideo}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-medium"
                        >
                            <Trash2 className="w-3 h-3" />
                            Remove
                        </button>
                    )}
                </div>

                {heroData.videoUrl ? (
                    <div className="mb-3">
                        <p className="text-sm text-green-600 mb-2">✓ Video uploaded</p>
                        <div className="bg-gray-100 p-2 rounded-md">
                            <p className="text-xs text-gray-600 truncate">Public ID: {heroData.videoPublicId}</p>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 mb-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-1">
                            No video uploaded
                        </p>
                        <p className="text-xs text-gray-400">
                            Upload a background video for your hero section
                        </p>
                    </div>
                )}

                {/* Upload Button */}
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
                            className="w-full bg-[var(--primary)] hover:bg-primary/80 text-black py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[var(--primary)] hover:bg-primary/80 transition text-black py-3 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}