"use client";

import AudioPlayer from "@/components/modules/dashboard/studio/AudioPlayer";
import EmptyState from "@/components/modules/dashboard/studio/EmptyState";
import MediaGallery from "@/components/modules/dashboard/studio/MediaGallery";
import UploadModal from "@/components/modules/dashboard/studio/UploadModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import DeleteModal from "@/ui/DeleteModal";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Eye,
  Grid,
  Headphones,
  Image,
  List,
  Music,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";

export default function StudioMediaPage() {
  const [activeTab, setActiveTab] = useState("photos");
  const [viewMode, setViewMode] = useState("grid");
  const [studioData, setStudioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "photo", // 'photo', 'audio', or 'bulk-photo'
    id: null,
    name: "",
    loading: false,
  });

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/studios/profile");
      setStudioData(response.data);
    } catch (error) {
      console.error("Error fetching studio data:", error);
      if (error.status === 401) {
        toast.error("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Open delete modal for photo
  const openDeletePhotoModal = (photoId, photoIndex) => {
    setDeleteModal({
      isOpen: true,
      type: "photo",
      id: photoId,
      name: `Photo ${photoIndex + 1}`,
      loading: false,
    });
  };

  // Open delete modal for audio
  const openDeleteAudioModal = () => {
    setDeleteModal({
      isOpen: true,
      type: "audio",
      id: null,
      name: "Audio Sample",
      loading: false,
    });
  };

  // Open delete modal for bulk photos
  const openBulkDeleteModal = () => {
    if (selectedPhotos.size === 0) return;

    setDeleteModal({
      isOpen: true,
      type: "bulk-photo",
      id: null,
      name: `${selectedPhotos.size} photos`,
      loading: false,
    });
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      if (deleteModal.type === "photo" && deleteModal.id) {
        await api.delete(`/api/studios/photos/${deleteModal.id}`);
        toast.success("Photo deleted successfully!");
      } else if (deleteModal.type === "audio") {
        await api.delete("/api/studios/audio");
        toast.success("Audio sample deleted successfully!");
      } else if (deleteModal.type === "bulk-photo") {
        const photoIds = Array.from(selectedPhotos);
        for (const photoId of photoIds) {
          await api.delete(`/api/studios/photos/${photoId}`);
        }
        setSelectedPhotos(new Set());
        toast.success(`${photoIds.length} photos deleted successfully!`);
      }

      // Close modal and refresh data
      setDeleteModal({
        isOpen: false,
        type: "photo",
        id: null,
        name: "",
        loading: false,
      });

      fetchStudioData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete. Please try again.");
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    if (!deleteModal.loading) {
      setDeleteModal({
        isOpen: false,
        type: "photo",
        id: null,
        name: "",
        loading: false,
      });
    }
  };

  const handlePhotoSelect = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  // Handle photo delete from MediaGallery
  const handleDeletePhoto = (photoId, photoIndex) => {
    openDeletePhotoModal(photoId, photoIndex);
  };

  // Handle audio delete
  const handleDeleteAudio = () => {
    openDeleteAudioModal();
  };

  // Handle bulk delete button click
  const handleBulkDelete = () => {
    openBulkDeleteModal();
  };

  if (loading) {
    return <LoadingSpinner message="Loading media..." />;
  }

  const photos = studioData?.photos || [];
  const audioFile = studioData?.audioFile;
  const photoCount = photos.length;
  const maxPhotos = 5;

  const tabs = [
    { id: "photos", label: "Photos", icon: Camera, count: photoCount },
    { id: "audio", label: "Audio", icon: Headphones, count: audioFile ? 1 : 0 },
    // { id: "uploads", label: "Recent Uploads", icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Studio Media
            </h1>
            <p className="text-gray-600 mt-2">
              Manage photos and audio samples to showcase your studio
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{photoCount}</p>
                <p className="text-xs text-gray-600">Photos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {audioFile ? 1 : 0}
                </p>
                <p className="text-xs text-gray-600">Audio Samples</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {maxPhotos - photoCount}
                </p>
                <p className="text-xs text-gray-600">Remaining</p>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Media
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Storage Usage
          </span>
          <span className="text-sm font-medium text-gray-900">
            {photoCount}/{maxPhotos} Photos
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${photoCount === maxPhotos ? "bg-red-500" : "bg-blue-500"}`}
            style={{ width: `${(photoCount / maxPhotos) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {photoCount === maxPhotos ? (
            <span className="text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Storage full. Delete some photos to upload more.
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {maxPhotos - photoCount} photo slots available
            </span>
          )}
        </p>
      </div>

      {/* Bulk Actions */}
      {selectedPhotos.size > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedPhotos.size} photos selected
                </p>
                <p className="text-sm text-gray-600">
                  Select actions to perform
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedPhotos(new Set())}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {viewMode === "grid" ? "Grid View" : "List View"}
          </span>
        </div>

        {/* <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div> */}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "photos" &&
            (photos.length === 0 ? (
              <EmptyState
                icon={Camera}
                title="No Photos Uploaded"
                description="Upload photos of your studio space and equipment to attract clients"
                actionText="Upload Photos"
                onAction={() => setUploadModalOpen(true)}
              />
            ) : (
              <MediaGallery
                photos={photos}
                viewMode={viewMode}
                onDelete={handleDeletePhoto}
                onSelect={handlePhotoSelect}
                selectedPhotos={selectedPhotos}
              />
            ))}

          {activeTab === "audio" &&
            (!audioFile ? (
              <EmptyState
                icon={Music}
                title="No Audio Sample"
                description="Add an audio sample to showcase your production quality"
                actionText="Upload Audio"
                onAction={() => setUploadModalOpen(true)}
              />
            ) : (
              <div className="space-y-6">
                <AudioPlayer
                  audio={audioFile}
                  isPlaying={isPlaying}
                  onPlay={() => setIsPlaying(!isPlaying)}
                  onDelete={handleDeleteAudio}
                />

                {/* Audio Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Audio Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Format</p>
                      <p className="font-semibold text-gray-900">MP3</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="font-semibold text-gray-900">5.2 MB</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">3:45</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Upload Date</p>
                      <p className="font-semibold text-gray-900">
                        Jan 15, 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upload Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Upload Media</h3>
                <p className="text-blue-100">Showcase your studio</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Photo Slots</span>
                <span className="font-bold">{maxPhotos - photoCount} left</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Audio Sample</span>
                <span className="font-bold">
                  {audioFile ? "✓ Uploaded" : "Not added"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="w-full mt-6 bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              disabled={photoCount >= maxPhotos}
            >
              <Plus className="w-5 h-5" />
              {photoCount >= maxPhotos ? "Storage Full" : "Upload Media"}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Media Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Upload high-quality, well-lit photos of your studio
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Choose your best work for audio samples
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Profiles with media get 3x more views
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          setUploadModalOpen(false);
          fetchStudioData();
        }}
        currentPhotoCount={photoCount}
        maxPhotos={maxPhotos}
        hasAudio={!!audioFile}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={
          deleteModal.type === "photo"
            ? "Delete Photo?"
            : deleteModal.type === "audio"
              ? "Delete Audio Sample?"
              : "Delete Multiple Photos?"
        }
        itemName={deleteModal.name}
        loading={deleteModal.loading}
        type="danger"
      />
    </div>
  );
}
