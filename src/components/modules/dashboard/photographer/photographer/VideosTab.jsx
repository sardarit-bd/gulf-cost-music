"use client";

import { Crown, Loader2, Plus, Trash2, Upload, Video, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Utility to get cookie safely
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

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
    if (subscriptionPlan === "free") {
      toast.error("Video uploads require Pro plan. Upgrade to Pro.");
      e.target.value = "";
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // Check video limit for pro users
    if (subscriptionPlan === "pro" && videos.length >= 5) {
      toast.error("Maximum 5 videos allowed for Pro plan");
      e.target.value = "";
      return;
    }

    // Validation
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      toast.error("Video file size must be less than 200MB");
      return;
    }

    setUploadingVideos(true);

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await handleCloudinaryUpload(file);

      // Save to backend
      const backendData = await saveVideoToBackend({
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        duration: cloudinaryResult.duration,
        bytes: cloudinaryResult.bytes,
        format: cloudinaryResult.format,
      });

      // Call parent callback to update state
      if (onVideoAdded && backendData.data) {
        onVideoAdded(backendData.data.videos);
      }

      toast.success("Video uploaded successfully!");
      e.target.value = "";
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error(error.message || "Failed to upload video");
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

    if (subscriptionPlan === "free") {
      toast.error("Adding videos requires Pro plan. Upgrade to Pro.");
      return;
    }

    if (!newVideo.url || !newVideo.title) {
      toast.error("Video title and URL are required");
      return;
    }

    // Check video limit for pro users
    if (subscriptionPlan === "pro" && videos.length >= 5) {
      toast.error("Maximum 5 videos allowed for Pro plan");
      return;
    }

    setUploadingVideos(true);

    try {
      const backendData = await saveVideoToBackend(newVideo);

      // Call parent callback to update state
      if (onVideoAdded && backendData.data) {
        onVideoAdded(backendData.data.videos);
      }

      toast.success("Video added successfully!");
      setShowUploadForm(false);
      setNewVideo({ title: "", url: "", public_id: "" });
    } catch (error) {
      console.error("Add video error:", error);
      toast.error(error.message || "Failed to add video");
    } finally {
      setUploadingVideos(false);
    }
  };

  // Handle Video Deletion
  const handleDeleteVideo = async (videoId, public_id) => {
    if (subscriptionPlan === "free") {
      toast.error("Managing videos requires Pro plan. Upgrade to Pro.");
      return;
    }

    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const token = getCookie("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_BASE}/api/photographers/videos/${videoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ public_id }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to delete video");

      // Call parent callback to update state
      if (onVideoDeleted && data.data) {
        onVideoDeleted(data.data.videos);
      }

      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Delete video error:", error);
      toast.error(error.message || "Failed to delete video");
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
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 rounded-full mb-6">
              <Video size={32} className="text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Video Portfolio <span className="text-yellow-500">(Pro Feature)</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Upgrade to Pro to upload and manage your video portfolio.
              Showcase your work through videos to attract more clients.
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Video size={24} />
            Video Portfolio
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-medium ml-2">
              {videos.length}/5 videos
            </span>
          </h3>

          <div className="flex gap-3">
            {/* Cloudinary File Upload */}
            <label
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition ${uploadingVideos || videos.length >= 5
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-500"
                }`}
            >
              {uploadingVideos ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              Upload Video
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoFileUpload}
                disabled={uploadingVideos || videos.length >= 5}
              />
            </label>

            {/* URL Add Button */}
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              disabled={videos.length >= 5}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${videos.length >= 5
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
            >
              <Plus size={18} />
              Add URL
            </button>
          </div>
        </div>

        {/* URL Upload Form */}
        {showUploadForm && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-white">
                Add Video by URL
              </h4>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
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
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploadingVideos || videos.length >= 5}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${uploadingVideos || videos.length >= 5
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-500"
                    }`}
                >
                  {uploadingVideos ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}
                  Add Video
                </button>

                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Videos Grid */}
        {videos.length > 0 ? (
          <div className="grid gap-6">
            {videos.map((video, index) => (
              <div
                key={video._id || index}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-600 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Video Player */}
                  <div className="md:w-1/2">
                    <div className="aspect-video bg-black">
                      <video
                        src={video.url}
                        controls
                        className="w-full h-full object-contain"
                        poster={
                          video.public_id
                            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/w_500,h_300,c_fill/${video.public_id}.jpg`
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="md:w-1/2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white font-semibold text-lg">
                        {video.title || `Video ${index + 1}`}
                      </h4>
                      <button
                        onClick={() =>
                          handleDeleteVideo(video._id, video.public_id)
                        }
                        className="p-2 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300">
                      {video.duration && (
                        <p>Duration: {formatDuration(video.duration)}</p>
                      )}
                      {video.bytes && (
                        <p>Size: {formatFileSize(video.bytes)}</p>
                      )}
                      {video.format && (
                        <p>Format: {video.format.toUpperCase()}</p>
                      )}
                      <p className="text-xs text-gray-400 break-all">
                        URL: {video.url}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
            <Video size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No videos uploaded yet</p>
            <p className="text-gray-500 text-sm">
              Upload videos or add video URLs to showcase your work
            </p>
          </div>
        )}

        {/* Uploading Indicator */}
        {uploadingVideos && (
          <div className="flex items-center justify-center gap-2 py-4 text-purple-400">
            <Loader2 size={20} className="animate-spin" />
            <span>Uploading video to Cloudinary...</span>
          </div>
        )}

        {/* Limit Warning */}
        {videos.length >= 5 && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              You have reached the maximum limit of 5 videos for Pro plan.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-purple-900/20 rounded-2xl p-6 border border-purple-700/30">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Video size={20} />
          Video Upload Guidelines
        </h4>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>
            • Maximum file size: <strong>200MB</strong> per video
          </li>
          <li>
            • Supported formats: <strong>MP4, MOV, AVI, WebM, MKV</strong>
          </li>
          <li>
            • Videos are uploaded directly to <strong>Cloudinary</strong>
          </li>
          <li>
            • Keep videos under <strong>10 minutes</strong> for best performance
          </li>
          <li>• Ensure you have rights to use the videos</li>
          <li className="text-yellow-400 font-medium">
            • Pro plan limit: <strong>5 videos</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}