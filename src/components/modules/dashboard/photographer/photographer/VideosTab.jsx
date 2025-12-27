"use client";

import { Crown, Loader2, Plus, Trash2, Upload, Video, X, AlertCircle, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Utility to get cookie safely
const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
                                     isOpen,
                                     onClose,
                                     onConfirm,
                                     videoTitle,
                                     isLoading
                                 }) => {
    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-red-500/30 shadow-2xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-red-500/20 rounded-xl">
                            <AlertTriangle size={24} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Delete Video</h3>
                            <p className="text-gray-400 text-sm">This action cannot be undone</p>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-gray-300">
                            Are you sure you want to delete <span className="text-white font-semibold">"{videoTitle || 'this video'}"</span>?
                        </p>
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                            <AlertTriangle size={14} />
                            This will permanently remove the video from your portfolio
                        </p>
                    </div>

                    {/* Video Info (if available) */}
                    {/*<div className="mb-6 p-3 bg-gray-800/50 rounded-lg">*/}
                    {/*    <p className="text-gray-400 text-sm mb-1">Action Details:</p>*/}
                    {/*    <ul className="text-gray-300 text-sm space-y-1">*/}
                    {/*        <li className="flex items-center gap-2">*/}
                    {/*            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>*/}
                    {/*            Video will be removed from Cloudinary storage*/}
                    {/*        </li>*/}
                    {/*        <li className="flex items-center gap-2">*/}
                    {/*            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>*/}
                    {/*            Video data will be deleted from database*/}
                    {/*        </li>*/}
                    {/*        <li className="flex items-center gap-2">*/}
                    {/*            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>*/}
                    {/*            This change is immediate and irreversible*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete Video
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 shadow-2xl w-full max-w-md transform transition-all">
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Success!</h3>
                    <p className="text-gray-300 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function VideosTab({
                                      videos = [],
                                      subscriptionPlan = "free",
                                      onVideoAdded,
                                      onVideoDeleted,
                                  }) {
    const [uploadingVideos, setUploadingVideos] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [newVideo, setNewVideo] = useState({
        title: "",
        url: "",
        public_id: "",
    });

    // Delete Modal States
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        videoId: null,
        publicId: null,
        videoTitle: "",
        isLoading: false,
    });

    // Success Modal State
    const [successModal, setSuccessModal] = useState({
        isOpen: false,
        message: "",
    });

    // Direct Cloudinary Upload Function
    const handleCloudinaryUpload = async (file) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary configuration is missing");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("resource_type", "video");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Upload failed");
            }

            return {
                url: data.secure_url,
                public_id: data.public_id,
                duration: data.duration,
                format: data.format,
                bytes: data.bytes,
            };
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    };

    // Handle File Upload to Cloudinary
    const handleVideoFileUpload = async (e) => {
        if (subscriptionPlan !== "pro") {
            toast.error("Video upload is available only for Pro plan");
            e.target.value = "";
            return;
        }

        if (videos.length >= 1) {
            toast.error("Pro plan allows only 1 video", {
                icon: "⚠️",
            });
            e.target.value = "";
            return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("video/")) {
            toast.error("Please select a valid video file");
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            toast.error("Video must be under 200MB");
            return;
        }

        setUploadingVideos(true);

        try {
            const cloudinaryResult = await handleCloudinaryUpload(file);

            const backendData = await saveVideoToBackend({
                title: file.name.replace(/\.[^/.]+$/, ""),
                url: cloudinaryResult.url,
                public_id: cloudinaryResult.public_id,
                duration: cloudinaryResult.duration,
                bytes: cloudinaryResult.bytes,
                format: cloudinaryResult.format,
            });

            if (onVideoAdded && backendData.data) {
                onVideoAdded(backendData.data.videos);
            }

            setSuccessModal({
                isOpen: true,
                message: "Video uploaded successfully! Your portfolio has been updated."
            });

            e.target.value = "";
        } catch (error) {
            toast.error(error.message || "Video upload failed");
        } finally {
            setUploadingVideos(false);
        }
    };

    // Save Video Info to Backend
    const saveVideoToBackend = async (videoData) => {
        const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
        const token = getCookie("token");

        if (!token) {
            throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_BASE}/api/photographers/videos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(videoData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to save video");
        }

        return data;
    };

    // Handle Manual Video URL Addition
    const handleAddVideoUrl = async (e) => {
        e.preventDefault();

        if (subscriptionPlan !== "pro") {
            toast.error("Only Pro users can add videos");
            return;
        }

        if (!newVideo.title || !newVideo.url) {
            toast.error("Video title and URL are required");
            return;
        }

        if (videos.length >= 1) {
            toast.error("Pro plan allows only 1 video", {
                icon: "⚠️",
            });
            return;
        }

        setUploadingVideos(true);

        try {
            const backendData = await saveVideoToBackend(newVideo);

            if (onVideoAdded && backendData.data) {
                onVideoAdded(backendData.data.videos);
            }

            setSuccessModal({
                isOpen: true,
                message: "Video added successfully! Your portfolio has been updated."
            });

            setShowUploadForm(false);
            setNewVideo({ title: "", url: "", public_id: "" });
        } catch (error) {
            console.error("Add video error:", error);
            toast.error(error.message || "Failed to add video");
        } finally {
            setUploadingVideos(false);
        }
    };

    // Open Delete Modal
    const openDeleteModal = (videoId, publicId, videoTitle) => {
        if (subscriptionPlan === "free") {
            toast.error("Managing videos requires Pro plan. Upgrade to Pro.");
            return;
        }

        setDeleteModal({
            isOpen: true,
            videoId,
            publicId,
            videoTitle: videoTitle || "Untitled Video",
            isLoading: false,
        });
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            videoId: null,
            publicId: null,
            videoTitle: "",
            isLoading: false,
        });
    };

    // Handle Video Deletion (Confirmed from Modal)
    const handleDeleteVideo = async () => {
        if (!deleteModal.videoId) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
            const token = getCookie("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(
                `${API_BASE}/api/photographers/videos/${deleteModal.videoId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ public_id: deleteModal.publicId }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete video");
            }

            // Call parent callback to update state
            if (onVideoDeleted && data.data) {
                onVideoDeleted(data.data.videos);
            }

            // Close delete modal and show success modal
            closeDeleteModal();

            setSuccessModal({
                isOpen: true,
                message: "Video deleted successfully! Your portfolio has been updated."
            });

        } catch (error) {
            console.error("Delete video error:", error);
            toast.error(error.message || "Failed to delete video");
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Format duration
    const formatDuration = (seconds) => {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // If free user, show upgrade prompt
    if (subscriptionPlan === "free") {
        return (
            <div className="animate-fadeIn">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
                            <Video size={40} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Video Portfolio <span className="text-yellow-400">(Pro Feature)</span>
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-md mx-auto text-lg leading-relaxed">
                            Showcase your work through high-quality videos. Upgrade to Pro and impress your clients with dynamic video content.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.open("/pricing", "_blank")}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                <Crown size={20} />
                                Upgrade to Pro Plan
                            </button>
                            <button
                                onClick={() => window.open("/features", "_blank")}
                                className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium transition-all border border-gray-600"
                            >
                                <Info size={20} />
                                View All Features
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="animate-fadeIn space-y-8">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                                <Video size={28} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Video Portfolio</h3>
                                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {videos.length}/1 video
                  </span>
                                    <span className="text-xs">• Pro Plan</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* Cloudinary File Upload */}
                            <label
                                className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                                    uploadingVideos || videos.length >= 1
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner"
                                        : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 shadow-md hover:shadow-lg"
                                }`}
                            >
                                {uploadingVideos ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Upload size={20} />
                                )}
                                Upload Video
                                <input
                                    type="file"
                                    accept="video/*"
                                    hidden
                                    onChange={handleVideoFileUpload}
                                    disabled={uploadingVideos || videos.length >= 1}
                                />
                            </label>

                            {/* URL Add Button */}
                            {/*<button*/}
                            {/*    onClick={() => setShowUploadForm(!showUploadForm)}*/}
                            {/*    disabled={videos.length >= 1}*/}
                            {/*    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${*/}
                            {/*        videos.length >= 1*/}
                            {/*            ? "bg-gray-600 text-gray-400 cursor-not-allowed"*/}
                            {/*            : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg"*/}
                            {/*    }`}*/}
                            {/*>*/}
                            {/*    <Plus size={20} />*/}
                            {/*    Add URL*/}
                            {/*</button>*/}
                        </div>
                    </div>

                    {/* URL Upload Form */}
                    {showUploadForm && (
                        <div className="mb-6 p-5 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-600 shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Plus size={20} />
                                    Add Video by URL
                                </h4>
                                <button
                                    onClick={() => setShowUploadForm(false)}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={handleAddVideoUrl} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Video Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newVideo.title}
                                        onChange={(e) =>
                                            setNewVideo({ ...newVideo, title: e.target.value })
                                        }
                                        placeholder="Enter video title"
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Video URL *
                                    </label>
                                    <input
                                        type="url"
                                        value={newVideo.url}
                                        onChange={(e) =>
                                            setNewVideo({ ...newVideo, url: e.target.value })
                                        }
                                        placeholder="https://example.com/video.mp4"
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={uploadingVideos || videos.length >= 1}
                                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition font-medium ${
                                            uploadingVideos || videos.length >= 1
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
                                        }`}
                                    >
                                        {uploadingVideos ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Plus size={20} />
                                        )}
                                        Add Video
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowUploadForm(false)}
                                        className="px-5 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Videos Grid */}
                {videos.length > 0 ? (
                    <div className="grid gap-6">
                        {videos.map((video, index) => (
                            <div
                                key={video._id || index}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl group"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Video Player */}
                                    <div className="lg:w-1/2 relative">
                                        <div className="aspect-video bg-black">
                                            <video
                                                src={video.url}
                                                controls
                                                className="w-full h-full object-contain"
                                                poster={
                                                    video.public_id
                                                        ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/w_500,h_300,c_fill,q_auto/${video.public_id}.jpg`
                                                        : undefined
                                                }
                                            />
                                        </div>
                                        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Video {index + 1}
                                        </div>
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openDeleteModal(video._id, video.public_id, video.title)}
                                                className="p-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition transform hover:scale-105 shadow-lg"
                                                title="Delete video"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Video Info */}
                                    <div className="lg:w-1/2 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-white font-bold text-xl mb-1">
                                                    {video.title || `Video ${index + 1}`}
                                                </h4>
                                                <p className="text-gray-400 text-sm">Added on {new Date().toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={() => openDeleteModal(video._id, video.public_id, video.title)}
                                                className="lg:hidden p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                                                title="Delete video"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {video.duration && (
                                                <div className="bg-gray-800/50 p-3 rounded-lg">
                                                    <p className="text-gray-400 text-xs">Duration</p>
                                                    <p className="text-white font-medium">{formatDuration(video.duration)}</p>
                                                </div>
                                            )}
                                            {video.bytes && (
                                                <div className="bg-gray-800/50 p-3 rounded-lg">
                                                    <p className="text-gray-400 text-xs">Size</p>
                                                    <p className="text-white font-medium">{formatFileSize(video.bytes)}</p>
                                                </div>
                                            )}
                                            {video.format && (
                                                <div className="bg-gray-800/50 p-3 rounded-lg">
                                                    <p className="text-gray-400 text-xs">Format</p>
                                                    <p className="text-white font-medium">{video.format.toUpperCase()}</p>
                                                </div>
                                            )}
                                            <div className="bg-gray-800/50 p-3 rounded-lg">
                                                <p className="text-gray-400 text-xs">Status</p>
                                                <p className="text-green-400 font-medium">Active</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-800/30 p-3 rounded-lg">
                                            <p className="text-gray-400 text-xs mb-1">Video URL</p>
                                            <p className="text-gray-300 text-sm break-all truncate" title={video.url}>
                                                {video.url}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border-2 border-dashed border-gray-700">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
                            <Video size={40} className="text-gray-500" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-300 mb-2">No videos yet</h4>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Upload your first video to showcase your work and attract more clients
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <label
                                className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                                    uploadingVideos || videos.length >= 1
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner"
                                        : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 shadow-md hover:shadow-lg"
                                }`}
                            >
                                {uploadingVideos ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Upload size={20} />
                                )}
                                Upload Video
                                <input
                                    type="file"
                                    accept="video/*"
                                    hidden
                                    onChange={handleVideoFileUpload}
                                    disabled={uploadingVideos || videos.length >= 1}
                                />
                            </label>
                            {/*<button*/}
                            {/*    onClick={() => setShowUploadForm(true)}*/}
                            {/*    className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"*/}
                            {/*>*/}
                            {/*    <Plus size={20} />*/}
                            {/*    Add Video URL*/}
                            {/*</button>*/}
                        </div>
                    </div>
                )}

                {/* Uploading Indicator */}
                {uploadingVideos && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                        <div className="relative bg-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full mx-4">
                            <div className="flex flex-col items-center text-center">
                                <Loader2 size={48} className="text-yellow-500 animate-spin mb-4" />
                                <h4 className="text-xl font-bold text-white mb-2">Uploading Video</h4>
                                <p className="text-gray-400 mb-4">
                                    Please wait while we upload and process your video...
                                </p>
                                <div className="w-full bg-gray-800 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full animate-pulse w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Guidelines Card */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 rounded-2xl p-6 border border-purple-700/30">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Video size={20} />
                            Upload Guidelines
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-300">
                                <div className="bg-purple-500/20 p-1 rounded mt-0.5">
                                    <AlertCircle size={14} className="text-purple-400" />
                                </div>
                                <span>
                  <strong className="text-white">Max size:</strong> 200MB per video
                </span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <div className="bg-blue-500/20 p-1 rounded mt-0.5">
                                    <AlertCircle size={14} className="text-blue-400" />
                                </div>
                                <span>
                  <strong className="text-white">Formats:</strong> MP4, MOV, AVI, WebM, MKV
                </span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/20 p-1 rounded mt-0.5">
                                    <AlertCircle size={14} className="text-green-400" />
                                </div>
                                <span>
                  <strong className="text-white">Duration:</strong> Under 10 minutes recommended
                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Plan Limits Card */}
                  {/*  <div className="bg-gradient-to-br from-yellow-900/10 to-orange-900/10 rounded-2xl p-6 border border-yellow-700/30">*/}
                  {/*      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">*/}
                  {/*          <Crown size={20} className="text-yellow-500" />*/}
                  {/*          Pro Plan Limits*/}
                  {/*      </h4>*/}
                  {/*      <div className="space-y-4">*/}
                  {/*          <div>*/}
                  {/*              <div className="flex justify-between items-center mb-2">*/}
                  {/*                  <span className="text-gray-300">Videos Used</span>*/}
                  {/*                  <span className="text-white font-bold">*/}
                  {/*  {videos.length}/1 video*/}
                  {/*</span>*/}
                  {/*              </div>*/}
                  {/*              <div className="w-full bg-gray-800 rounded-full h-2">*/}
                  {/*                  <div*/}
                  {/*                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"*/}
                  {/*                      style={{ width: `${(videos.length / 1) * 100}%` }}*/}
                  {/*                  ></div>*/}
                  {/*              </div>*/}
                  {/*          </div>*/}
                  {/*          <p className="text-yellow-400/80 text-sm">*/}
                  {/*              Need more videos? Consider our Premium plan for higher limits.*/}
                  {/*          </p>*/}
                  {/*      </div>*/}
                  {/*  </div>*/}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteVideo}
                videoTitle={deleteModal.videoTitle}
                isLoading={deleteModal.isLoading}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal({ isOpen: false, message: "" })}
                message={successModal.message}
            />
        </>
    );
}