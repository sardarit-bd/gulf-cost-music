"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import {
    Eye,
    Loader2,
    RefreshCw,
    Save,
    Type,
    Upload,
    Video
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminHeroSection() {
    const [heroData, setHeroData] = useState({
        title: "",
        subtitle: "",
        buttonText: "",
        videoUrl: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [videoPreview, setVideoPreview] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Fetch current hero section data
    const fetchHeroData = async () => {
        try {
            setLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE}/api/hero-video`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (data.success && data.data) {
                setHeroData({
                    title: data.data.title || "",
                    subtitle: data.data.subtitle || "",
                    buttonText: data.data.buttonText || "",
                    videoUrl: data.data.videoUrl || ""
                });
                setVideoPreview(data.data.videoUrl || "");
            }
        } catch (error) {
            console.error("Error fetching hero data:", error);
            toast.error("Failed to load hero section data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroData();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHeroData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle video file selection
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            toast.error("Please select a video file");
            return;
        }

        // Validate file size (50MB limit)
        if (file.size > 200 * 1024 * 1024) {
            toast.error("Video must be less than 200MB");
            return;
        }

        setSelectedVideo(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setVideoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Remove selected video
    const handleRemoveVideo = () => {
        setSelectedVideo(null);
        setVideoPreview(heroData.videoUrl);
    };

    // Save hero section data
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", heroData.title);
            formData.append("subtitle", heroData.subtitle);
            formData.append("buttonText", heroData.buttonText);

            if (selectedVideo) {
                formData.append("video", selectedVideo);
            }

            const res = await fetch(`${API_BASE}/api/hero-video/update`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Hero section updated successfully!");
                setSelectedVideo(null);
                fetchHeroData(); // Refresh data
            } else {
                toast.error(data.message || "Failed to update hero section");
            }
        } catch (error) {
            console.error("Error saving hero section:", error);
            toast.error("Error saving hero section");
        } finally {
            setSaving(false);
        }
    };

    // Preview in new tab
    const handlePreview = () => {
        window.open('/', '_blank');
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Loading hero section data...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <Toaster />

                {/* Header */}
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
                            <p className="text-gray-600 mt-2">
                                Customize the main hero section of your website
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handlePreview}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Type className="w-5 h-5 text-blue-600" />
                                Content Settings
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Main Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={heroData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="Enter main title"
                                        maxLength={100}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {heroData.title.length}/100 characters
                                    </p>
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtitle *
                                    </label>
                                    <textarea
                                        name="subtitle"
                                        value={heroData.subtitle}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
                                        placeholder="Enter subtitle text"
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {heroData.subtitle.length}/200 characters
                                    </p>
                                </div>

                                {/* Button Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Button Text *
                                    </label>
                                    <input
                                        type="text"
                                        name="buttonText"
                                        value={heroData.buttonText}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="Enter button text"
                                        maxLength={30}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {heroData.buttonText.length}/30 characters
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Right Column - Video Upload */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-600" />
                                Background Video
                            </h2>

                            {/* Current Video Preview */}
                            {videoPreview && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Current Video Preview
                                    </label>
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                        <video
                                            src={videoPreview}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            loop
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('videoUpload').click()}
                                                className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Change Video
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Video Upload Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {videoPreview ? "Upload New Video" : "Upload Background Video"}
                                </label>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                                    {selectedVideo ? (
                                        <div className="text-center">
                                            <p className="text-green-600 font-medium mb-2">
                                                Video Selected: {selectedVideo.name}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Remove Video
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                {videoPreview ? "Replace Background Video" : "Upload Background Video"}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                MP4, WebM, MOV (Max 50MB)
                                            </p>

                                            <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                                <Upload className="w-4 h-4" />
                                                Choose Video File
                                                <input
                                                    id="videoUpload"
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>

                                {/* Upload Tips */}
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">Video Tips:</h4>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• Use landscape videos for best results</li>
                                        <li>• Optimal resolution: 1920x1080 (1080p)</li>
                                        <li>• Keep videos under 30 seconds for fast loading</li>
                                        <li>• Use MP4 format for best browser compatibility</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button for Mobile */}
                    <div className="lg:hidden fixed bottom-6 left-6 right-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}