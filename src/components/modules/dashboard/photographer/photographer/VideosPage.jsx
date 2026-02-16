"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  FileVideo,
  Info,
  Loader2,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EditVideoModal } from "./EditVideoModal";
import { VideoUploadForm } from "./VideoUploadForm";

// Utility to get cookie safely
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const token = getCookie("token");

      if (!token) {
        console.error("No token found");
        setVideos([]);
        return;
      }

      const response = await fetch(`${API_BASE}/api/photographers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      if (data.data?.photographer?.videos) {
        setVideos(data.data.photographer.videos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (file, title, description) => {
    // Frontend limit check
    if (videos.length >= 1) {
      toast.error(
        "You can only upload 1 video. Please delete existing video first.",
      );
      return;
    }

    setUploading(true);

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file);

      // Save to backend
      const savedData = await saveVideoToBackend({
        title: title || file.name.replace(/\.[^/.]+$/, "") || "Untitled Video",
        description: description || "",
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        duration: cloudinaryResult.duration,
        bytes: cloudinaryResult.bytes,
        format: cloudinaryResult.format,
      });

      // Show success message
      setSuccessMessage("Video uploaded successfully!");
      setShowSuccessModal(true);
      setShowUploadModal(false);

      // Refresh videos list
      await fetchVideos();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Video upload failed");
    } finally {
      setUploading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "video");
    formData.append("tags", "photographer_video");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Upload failed");
    }

    return {
      url: data.secure_url,
      public_id: data.public_id,
      duration: data.duration,
      bytes: data.bytes,
      format: data.format,
    };
  };

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

  // Handle URL upload
  const handleVideoURLUpload = async (url, title, description) => {
    if (videos.length >= 1) {
      toast.error(
        "You can only have 1 video. Please delete existing video first.",
      );
      return;
    }

    if (!url.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    setUploading(true);

    try {
      const savedData = await saveVideoToBackend({
        title: title || "Untitled Video",
        description: description || "",
        url: url,
        public_id: `url_video_${Date.now()}`,
      });

      setSuccessMessage("Video added successfully!");
      setShowSuccessModal(true);
      setShowUploadModal(false);

      await fetchVideos();
    } catch (error) {
      console.error("URL upload error:", error);
      toast.error(error.message || "Failed to add video URL");
    } finally {
      setUploading(false);
    }
  };

  // Handle video deletion
  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const token = getCookie("token");

      const response = await fetch(
        `${API_BASE}/api/photographers/videos/${videoToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ public_id: videoToDelete.public_id }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete video");
      }

      setSuccessMessage("Video deleted successfully!");
      setShowSuccessModal(true);
      setShowDeleteModal(false);
      setVideoToDelete(null);

      await fetchVideos();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete video");
    }
  };

  // Handle video edit
  const handleEditVideo = async (videoId, updatedData) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const token = getCookie("token");

      const response = await fetch(
        `${API_BASE}/api/photographers/videos/${videoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update video");
      }

      setSuccessMessage("Video updated successfully!");
      setShowSuccessModal(true);
      setShowEditModal(false);
      setVideoToEdit(null);

      await fetchVideos();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update video");
    }
  };

  // Simple Video Player Component
  const SimpleVideoPlayer = ({ video }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleError = () => {
      console.error("Video failed to load:", video.url);
      setError(true);
      setLoading(false);
    };

    const handleLoaded = () => {
      setLoading(false);
      setError(false);
    };

    if (error) {
      return (
        <div className="w-full aspect-video bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500 mb-3" />
          <p className="text-white text-center text-sm md:text-base mb-2">
            Video failed to load
          </p>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline text-xs md:text-sm"
          >
            Open video in new tab
          </a>
        </div>
      );
    }

    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-blue-500 animate-spin" />
          </div>
        )}
        <video
          src={video.url}
          controls
          className="w-full h-full object-contain"
          onError={handleError}
          onLoadedData={handleLoaded}
          preload="metadata"
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  // Format functions
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  // Cleanup extra videos (for existing 3 videos problem)
  const cleanupExtraVideos = async () => {
    if (videos.length <= 1) {
      toast.error("No extra videos to clean up");
      return;
    }

    if (
      !confirm(
        `You have ${videos.length} videos. Keep the most recent one and delete ${videos.length - 1} older videos?`,
      )
    ) {
      return;
    }

    try {
      setUploading(true);
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const token = getCookie("token");

      // Sort videos by date (newest first)
      const sortedVideos = [...videos].sort(
        (a, b) =>
          new Date(b.uploadedAt || b.createdAt) -
          new Date(a.uploadedAt || a.createdAt),
      );

      // Keep only the most recent video
      const videoToKeep = sortedVideos[0];
      const videosToDelete = sortedVideos.slice(1);

      // Delete extra videos
      for (const video of videosToDelete) {
        const response = await fetch(
          `${API_BASE}/api/photographers/videos/${video._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ public_id: video.public_id }),
          },
        );

        if (!response.ok) {
          console.warn(`Failed to delete video: ${video._id}`);
        }
      }

      setSuccessMessage(
        `Cleaned up ${videosToDelete.length} extra videos. Keeping 1 video.`,
      );
      setShowSuccessModal(true);

      await fetchVideos();
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error("Failed to cleanup extra videos");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10 md:space-y-10 py-5 px-3 sm:px-4 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-xl">
                <Video size={isMobile ? 20 : 28} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Video Portfolio
                </h1>
                <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                    {videos.length}/1 video
                  </span>
                  <span className="text-xs sm:text-sm">
                    • Maximum 1 video allowed
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              {videos.length > 1 && (
                <button
                  onClick={cleanupExtraVideos}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg md:rounded-xl font-medium transition shadow-sm text-sm sm:text-base"
                >
                  {uploading ? (
                    <Loader2
                      size={isMobile ? 14 : 16}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={isMobile ? 14 : 16} />
                  )}
                  <span className="hidden sm:inline">Cleanup Extra</span>
                  <span className="sm:hidden">Cleanup</span>
                </button>
              )}
              <button
                onClick={() => setShowUploadModal(true)}
                disabled={videos.length >= 1 || uploading}
                className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg md:rounded-xl font-medium transition shadow-sm text-sm sm:text-base ${videos.length >= 1 || uploading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg"
                  }`}
              >
                <Plus size={isMobile ? 16 : 20} />
                <span className="hidden sm:inline">
                  {videos.length === 0 ? "Add Video" : "Video Limit Reached"}
                </span>
                <span className="sm:hidden">
                  {videos.length === 0 ? "Add" : "Limit Reached"}
                </span>
              </button>
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-md md:rounded-lg">
                  <FileVideo
                    className="text-blue-600"
                    size={isMobile ? 16 : 20}
                  />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Video Limit
                  </p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    1 video
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-green-100">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-green-100 rounded-md md:rounded-lg">
                  <Info className="text-green-600" size={isMobile ? 16 : 20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Current Videos
                  </p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {videos.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-purple-100 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-purple-100 rounded-md md:rounded-lg">
                  <Edit className="text-purple-600" size={isMobile ? 16 : 20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Status</p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {videos.length >= 1 ? "Limit Reached" : "Ready to Upload"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for extra videos - Responsive */}
          {videos.length > 1 && (
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl">
              <div className="flex items-start gap-2 md:gap-3">
                <AlertCircle
                  className="text-red-500 mt-0.5 flex-shrink-0"
                  size={isMobile ? 16 : 20}
                />
                <div>
                  <p className="text-red-700 font-medium text-sm md:text-base">
                    ⚠️ You have {videos.length} videos (limit is 1)
                  </p>
                  <p className="text-red-600 text-xs md:text-sm mt-1">
                    Click "Cleanup Extra Videos" to delete older videos and keep
                    only the most recent one.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Videos List */}
        {videos.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Your Video{videos.length > 1 ? "s" : ""} ({videos.length})
                </h2>
                <p className="text-gray-600 text-xs md:text-sm">
                  Click play to preview, or edit details
                </p>
              </div>
            </div>

            {videos.map((video, index) => (
              <div
                key={video._id || index}
                className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Video Player */}
                  <div className="lg:w-1/2 p-4 md:p-6">
                    <div className="relative rounded-lg md:rounded-xl overflow-hidden">
                      <SimpleVideoPlayer video={video} />

                      <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2">
                        <Video size={isMobile ? 12 : 14} />
                        <span>Video {index + 1}</span>
                      </div>

                      <div className="absolute top-2 md:top-4 right-2 md:right-4 flex gap-1 md:gap-2">
                        <button
                          onClick={() => {
                            setVideoToEdit(video);
                            setShowEditModal(true);
                          }}
                          className="p-1.5 md:p-2.5 bg-white text-blue-600 rounded-md md:rounded-lg transition transform hover:scale-105 shadow-md border border-blue-200"
                          title="Edit details"
                        >
                          <Edit size={isMobile ? 16 : 20} />
                        </button>
                        <button
                          onClick={() => {
                            setVideoToDelete(video);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 md:p-2.5 bg-white text-red-600 rounded-md md:rounded-lg transition transform hover:scale-105 shadow-md border border-red-200"
                          title="Delete video"
                        >
                          <Trash2 size={isMobile ? 16 : 20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="lg:w-1/2 p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3 md:mb-4">
                      <div className="flex-1">
                        <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                          {video.title || `Video ${index + 1}`}
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Added on{" "}
                          {formatDate(video.uploadedAt || video.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 lg:hidden mt-2 sm:mt-0">
                        <button
                          onClick={() => {
                            setVideoToEdit(video);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition text-sm"
                          title="Edit details"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setVideoToDelete(video);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition text-sm"
                          title="Delete video"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Video Description */}
                    {video.description && (
                      <div className="mb-3 md:mb-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <FileText
                            size={isMobile ? 14 : 16}
                            className="text-gray-500"
                          />
                          <p className="text-gray-700 text-xs md:text-sm font-medium">
                            Description
                          </p>
                        </div>
                        <p className="text-gray-600 text-xs md:text-sm line-clamp-3">
                          {video.description}
                        </p>
                      </div>
                    )}

                    {/* Video Metadata Grid - Responsive */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                      {video.duration && (
                        <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                            <Clock
                              size={isMobile ? 12 : 14}
                              className="text-gray-500"
                            />
                            <p className="text-gray-500 text-xs">Duration</p>
                          </div>
                          <p className="text-gray-900 font-medium text-sm md:text-base">
                            {formatDuration(video.duration)}
                          </p>
                        </div>
                      )}
                      {video.bytes && (
                        <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                          <p className="text-gray-500 text-xs mb-0.5 md:mb-1">
                            Size
                          </p>
                          <p className="text-gray-900 font-medium text-sm md:text-base">
                            {formatFileSize(video.bytes)}
                          </p>
                        </div>
                      )}
                      {video.format && (
                        <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                          <p className="text-gray-500 text-xs mb-0.5 md:mb-1">
                            Format
                          </p>
                          <p className="text-gray-900 font-medium text-sm md:text-base">
                            {video.format?.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Video URL */}
                    <div className="bg-blue-50 p-2 md:p-3 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-500 text-xs">Video URL</p>
                        <ExternalLink
                          size={isMobile ? 10 : 12}
                          className="text-gray-400"
                        />
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs md:text-sm truncate hover:text-blue-700 block"
                        title={video.url}
                      >
                        {video.url.length > 40
                          ? video.url.substring(0, 40) + "..."
                          : video.url}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl border-2 border-dashed border-gray-300 mx-2 md:mx-0">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-blue-100 rounded-full mb-4 md:mb-6">
              <Video size={isMobile ? 28 : 40} className="text-blue-600" />
            </div>
            <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 px-4">
              No videos yet
            </h4>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto px-4 text-sm md:text-base">
              Showcase your work with a video. You can upload 1 video maximum.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-medium transition shadow-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 text-sm md:text-base"
            >
              <Plus size={isMobile ? 16 : 20} />
              Add Your First Video
            </button>
          </div>
        )}

        {/* Guidelines Section - Responsive */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm mx-2 md:mx-0">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <Info size={isMobile ? 16 : 20} className="text-blue-600" />
            Video Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-md md:rounded-lg flex-shrink-0">
                  <AlertCircle
                    size={isMobile ? 14 : 16}
                    className="text-blue-600"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm md:text-base">
                    File Requirements
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Maximum 200MB per video. Supported formats: MP4, MOV, AVI,
                    WebM, MKV
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-green-100 rounded-md md:rounded-lg flex-shrink-0">
                  <CheckCircle2
                    size={isMobile ? 14 : 16}
                    className="text-green-600"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm md:text-base">
                    Title & Description
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Add descriptive titles (max 100 chars) and descriptions (max
                    500 chars)
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-purple-100 rounded-md md:rounded-lg flex-shrink-0">
                  <Edit size={isMobile ? 14 : 16} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm md:text-base">
                    Easy Editing
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    You can edit video title and description anytime
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-yellow-100 rounded-md md:rounded-lg flex-shrink-0">
                  <Clock
                    size={isMobile ? 14 : 16}
                    className="text-yellow-600"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm md:text-base">
                    Processing Time
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Videos may take 1-2 minutes to process after upload
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <VideoUploadForm
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleVideoUpload}
        onAddURL={handleVideoURLUpload}
        uploadingVideos={uploading}
        videosCount={videos.length}
        maxVideos={1}
        isMobile={isMobile}
      />

      {/* Edit Modal */}
      {showEditModal && videoToEdit && (
        <EditVideoModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setVideoToEdit(null);
          }}
          video={videoToEdit}
          onSave={handleEditVideo}
          isLoading={uploading}
          isMobile={isMobile}
        />
      )}

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteModal && videoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-lg md:rounded-2xl p-4 md:p-6 max-w-md w-full mx-2 md:mx-4 border border-gray-200 shadow-2xl">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-2.5 bg-red-100 rounded-lg md:rounded-xl">
                <Trash2 size={isMobile ? 20 : 24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Delete Video
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
              Are you sure you want to delete "
              <span className="font-medium">
                {videoToDelete.title || "Untitled Video"}
              </span>
              "?
            </p>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVideoToDelete(null);
                }}
                className="flex-1 py-2.5 md:py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg md:rounded-xl font-medium transition text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                disabled={uploading}
                className="flex-1 py-2.5 md:py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg md:rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {uploading ? (
                  <>
                    <Loader2
                      size={isMobile ? 16 : 18}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={isMobile ? 16 : 18} />
                    Delete Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Responsive */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-lg md:rounded-2xl p-4 md:p-6 max-w-md w-full mx-2 md:mx-4 border border-gray-200 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <CheckCircle2
                  size={isMobile ? 24 : 32}
                  className="text-green-600"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Success!
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                {successMessage}
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg md:rounded-xl font-medium transition hover:from-blue-700 hover:to-cyan-600 text-sm md:text-base"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploading Indicator - Responsive */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white p-4 md:p-8 rounded-lg md:rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full mx-2 md:mx-4">
            <div className="flex flex-col items-center text-center">
              <Loader2
                size={isMobile ? 32 : 48}
                className="text-blue-600 animate-spin mb-3 md:mb-4"
              />
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                Processing Video
              </h4>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                Please wait while we process your video...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-1.5 md:h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
