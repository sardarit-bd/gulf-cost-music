"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import { Link, Loader2, Play, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminHeroSectionPage() {
    const [heroData, setHeroData] = useState({
        title: "",
        subtitle: "",
        buttonText: "",
        videoUrl: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Fetch Hero Data
    const fetchHeroData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/hero-video`);
            const data = await res.json();

            if (data.success) {
                // Fix: Check if data exists directly or in data property
                const heroDataFromAPI = data.data || data;
                setHeroData({
                    title: heroDataFromAPI?.title || "",
                    subtitle: heroDataFromAPI?.subtitle || "",
                    buttonText: heroDataFromAPI?.buttonText || "",
                    videoUrl: heroDataFromAPI?.videoUrl || ""
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load hero section data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroData();
    }, []);

    // Handle input changes
    const handleChange = (field, value) => {
        setHeroData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Remove video URL
    const removeVideo = () => {
        setHeroData(prev => ({
            ...prev,
            videoUrl: ""
        }));
        toast.success("Video URL removed");
    };

    // Save Hero Section - FIXED VERSION
    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                title: heroData.title,
                subtitle: heroData.subtitle,
                buttonText: heroData.buttonText,
                videoUrl: heroData.videoUrl || ""
            };

            const res = await fetch(`${API_BASE}/api/hero-video/update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Hero section updated successfully!");
                // Fix: Wait a bit before refreshing to ensure DB is updated
                setTimeout(() => {
                    fetchHeroData();
                }, 500);
            } else {
                toast.error(data.message || "Failed to save hero section.");
            }
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Error updating hero section");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading hero section data...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Toaster />

            <div className="p-6 max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
                        <p className="text-gray-600 mt-2">Manage your homepage hero section content and video URL</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                </div>


                {/* Content Section */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Text Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Text Content</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Title
                                </label>
                                <input
                                    type="text"
                                    value={heroData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter main title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtitle
                                </label>
                                <textarea
                                    value={heroData.subtitle}
                                    onChange={(e) => handleChange("subtitle", e.target.value)}
                                    rows={3}
                                    className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter subtitle description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={heroData.buttonText}
                                    onChange={(e) => handleChange("buttonText", e.target.value)}
                                    className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter button text"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Video URL Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Link className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Video URL</h2>
                            </div>
                            {heroData.videoUrl && (
                                <button
                                    onClick={removeVideo}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove Video
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Video Preview */}
                            {heroData.videoUrl ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <video
                                            src={heroData.videoUrl}
                                            controls
                                            className="w-full h-64 rounded-xl bg-black object-cover"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black bg-opacity-50 rounded-full p-4">
                                                <Play className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <strong>Current Video URL:</strong>
                                        <a
                                            href={heroData.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 underline break-all block mt-1"
                                        >
                                            {heroData.videoUrl}
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                                    <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-2">No video URL set</p>
                                    <p className="text-sm text-gray-400">Add a video URL for your hero section background</p>
                                </div>
                            )}

                            {/* Video URL Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Video URL
                                </label>
                                <input
                                    type="url"
                                    value={heroData.videoUrl || ""}
                                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                                    className="text-gray-500 w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    placeholder="https://example.com/video.mp4"
                                />
                                <p className="text-sm text-gray-500">
                                    Enter direct URL to MP4 video file. Recommended: Use cloud storage like AWS S3, Cloudinary, or Vimeo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
                        </div>

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {heroData.title || "Your Title Here"}
                                </h1>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    {heroData.subtitle || "Your subtitle will appear here"}
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                                    {heroData.buttonText || "Button Text"}
                                </button>

                                {heroData.videoUrl && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm text-green-700">
                                            Video URL is set
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}