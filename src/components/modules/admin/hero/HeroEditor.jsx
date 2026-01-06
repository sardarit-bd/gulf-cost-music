"use client";

import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import toast from "react-hot-toast";
import VideoPreview from "./VideoPreview";
import { saveHeroData } from "./heroUtils";

export default function HeroEditor({ heroData, onChange, onSave }) {
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

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
        toast.success("Video removed");
    };

    const handleUploadSuccess = (result) => {
        setUploading(false);
        if (result.event === "success") {
            const publicId = result.info.public_id;
            onChange("videoUrl", publicId);
            toast.success("Video uploaded successfully!");
        }
    };

    const handleUploadError = (error) => {
        setUploading(false);
        toast.error("Upload failed: " + error.message);
    };

    return (
        <div className="space-y-4">
            {/* Text Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Text Content
                </h2>
                <div className="space-y-3">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                        </label>
                        <textarea
                            value={heroData.subtitle}
                            onChange={(e) => onChange("subtitle", e.target.value)}
                            rows={2}
                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your subtitle"
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
                            className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter button text"
                        />
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

                {/* Video Preview with Fallback */}
                <VideoPreview videoUrl={heroData.videoUrl} />

                {!heroData.videoUrl && (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50">
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
                            className="w-full mt-3 bg-[var(--primary)] hover:bg-primary/80 text-white py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            {uploading ? "Uploading..." : "Upload Video"}
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