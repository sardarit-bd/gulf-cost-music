"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  FileVideo,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VideoUploadForm } from "./VideoUploadForm";
import { EditVideoModal } from "./EditVideoModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { SuccessModal } from "./SuccessModal";

// Utility to get cookie safely
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function VideosTab({
  videos = [],
  subscriptionPlan = "free",
  onVideoAdded,
  onVideoDeleted,
}) {
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Edit Modal States
  const [editModal, setEditModal] = useState({
    isOpen: false,
    video: null,
    isLoading: false,
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

  // Handle File Upload with Title & Description
  const handleVideoUpload = async (file, title, description) => {
    if (videos.length >= 1) {
      toast.error("Maximum 1 video allowed");
      return;
    }

    setUploadingVideos(true);

    try {
      const cloudinaryResult = await handleCloudinaryUpload(file);

      const backendData = await saveVideoToBackend({
        title: title || file.name.replace(/\.[^/.]+$/, "") || "Untitled Video",
        description: description || "",
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
        message: "Video uploaded successfully!",
      });

      setShowUploadModal(false);
    } catch (error) {
      toast.error(error.message || "Video upload failed");
    } finally {
      setUploadingVideos(false);
    }
  };

  // Handle URL Upload with Title & Description
  const handleVideoURLUpload = async (url, title, description) => {
    if (videos.length >= 1) {
      toast.error("Maximum 1 video allowed");
      return;
    }

    if (!url.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    setUploadingVideos(true);

    try {
      const backendData = await saveVideoToBackend({
        title: title || "Untitled Video",
        description: description || "",
        url: url,
        public_id: `url_video_${Date.now()}`,
      });

      if (onVideoAdded && backendData.data) {
        onVideoAdded(backendData.data.videos);
      }

      setSuccessModal({
        isOpen: true,
        message: "Video added successfully!",
      });

      setShowUploadModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to add video URL");
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

  // Update Video Title & Description
  const updateVideoDetails = async (videoId, updatedData) => {
    try {
      setEditModal(prev => ({ ...prev, isLoading: true }));

      const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
      const token = getCookie("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_BASE}/api/photographers/videos/${videoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update video");
      }

      // Update parent state
      if (data.data?.video) {
        const updatedVideos = videos.map(video =>
          video._id === videoId ? { ...video, ...data.data.video } : video
        );
        onVideoAdded(updatedVideos);
      }

      setSuccessModal({
        isOpen: true,
        message: "Video details updated successfully!",
      });

      setEditModal({ isOpen: false, video: null, isLoading: false });

    } catch (error) {
      console.error("Update video error:", error);
      toast.error(error.message || "Failed to update video");
      setEditModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Open Edit Modal
  const openEditModal = (video) => {
    setEditModal({
      isOpen: true,
      video,
      isLoading: false,
    });
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      video: null,
      isLoading: false,
    });
  };

  // Open Delete Modal
  const openDeleteModal = (videoId, publicId, videoTitle) => {
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

  // Handle Video Deletion
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

      if (onVideoDeleted && data.data) {
        onVideoDeleted(data.data.videos);
      }

      closeDeleteModal();

      setSuccessModal({
        isOpen: true,
        message: "Video deleted successfully!",
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="animate-fadeIn space-y-8">
        {/* Header Card - White Theme */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Video size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Video Portfolio
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {videos.length}/1 video
                  </span>
                  <span className="text-sm">• All subscription plans</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              disabled={videos.length >= 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm ${videos.length >= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg"
                }`}
            >
              <Plus size={20} />
              Add Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileVideo className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Video Limit</p>
                  <p className="text-lg font-semibold text-gray-900">1 video</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Info className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="text-lg font-semibold text-gray-900">Up to 200MB</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Edit className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Editable</p>
                  <p className="text-lg font-semibold text-gray-900">Title & Description</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid - White Theme */}
        {videos.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Video ({videos.length})</h2>
                <p className="text-gray-600 text-sm">Click play to preview, or edit details</p>
              </div>
            </div>

            {videos.map((video, index) => (
              <div
                key={video._id || index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Video Player */}
                  <div className="lg:w-1/2 relative">
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <video
                        src={video.url}
                        controls
                        className="w-full h-full object-contain bg-black"
                        poster={
                          video.public_id
                            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/w_500,h_300,c_fill,q_auto/${video.public_id}.jpg`
                            : undefined
                        }
                      />
                      <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Video
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(video)}
                          className="p-2.5 bg-white text-blue-600 rounded-lg transition transform hover:scale-105 shadow-md border border-blue-200"
                          title="Edit details"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteModal(
                              video._id,
                              video.public_id,
                              video.title
                            )
                          }
                          className="p-2.5 bg-white text-red-600 rounded-lg transition transform hover:scale-105 shadow-md border border-red-200"
                          title="Delete video"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="lg:w-1/2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {video.title || `Video ${index + 1}`}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Added on {formatDate(video.uploadedAt || Date.now())}
                        </p>
                      </div>
                      <div className="lg:hidden flex gap-2">
                        <button
                          onClick={() => openEditModal(video)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          title="Edit details"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteModal(
                              video._id,
                              video.public_id,
                              video.title
                            )
                          }
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Delete video"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Video Description */}
                    {video.description && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={16} className="text-gray-500" />
                          <p className="text-gray-700 text-sm font-medium">Description</p>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {video.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {video.duration && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className="text-gray-500" />
                            <p className="text-gray-500 text-xs">Duration</p>
                          </div>
                          <p className="text-gray-900 font-medium">
                            {formatDuration(video.duration)}
                          </p>
                        </div>
                      )}
                      {video.bytes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-xs mb-1">Size</p>
                          <p className="text-gray-900 font-medium">
                            {formatFileSize(video.bytes)}
                          </p>
                        </div>
                      )}
                      {video.format && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-xs mb-1">Format</p>
                          <p className="text-gray-900 font-medium">
                            {video.format.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-gray-500 text-xs mb-1">Video URL</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm truncate hover:text-blue-700 flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        {video.url}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <Video size={40} className="text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              No videos yet
            </h4>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Showcase your work with a video. Upload a video file or add a video URL to get started.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              disabled={videos.length >= 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition shadow-sm ${videos.length >= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
                }`}
            >
              <Plus size={20} />
              Add Your First Video
            </button>
          </div>
        )}

        {/* Guidelines Section - White Theme */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info size={20} className="text-blue-600" />
            Video Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">File Requirements</h4>
                  <p className="text-gray-600 text-sm">
                    Maximum 200MB per video. Supported formats: MP4, MOV, AVI, WebM, MKV
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Title & Description</h4>
                  <p className="text-gray-600 text-sm">
                    Add descriptive titles (max 100 chars) and descriptions (max 500 chars) for better engagement
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Edit size={16} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Easy Editing</h4>
                  <p className="text-gray-600 text-sm">
                    You can edit video title and description anytime by clicking the edit button
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock size={16} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Processing Time</h4>
                  <p className="text-gray-600 text-sm">
                    Videos may take a few minutes to process after upload, depending on file size
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
        uploadingVideos={uploadingVideos}
        videosCount={videos.length}
        maxVideos={1}
      />

      {/* Edit Video Modal */}
      <EditVideoModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        video={editModal.video}
        onSave={updateVideoDetails}
        isLoading={editModal.isLoading}
      />

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

      {/* Uploading Indicator */}
      {uploadingVideos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <Loader2
                size={48}
                className="text-blue-600 animate-spin mb-4"
              />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Uploading Video
              </h4>
              <p className="text-gray-600 mb-4">
                Please wait while we upload and process your video...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}