"use client";

import { useAuth } from "@/context/AuthContext";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import all components
import DeleteModal from "@/ui/DeleteModal";
import SuccessModal from "@/ui/SuccessModal";
import PhotoGallery from "./PhotoGallery";
import PhotoStats from "./PhotoStats";
import UploadSection from "./UploadSection";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function PhotosPage() {
  const { user, loading: authLoading } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 🔥 NEW: Toast ID for managing delete toast
  const [deleteToastId, setDeleteToastId] = useState(null);

  const MAX_PHOTOS = 5;
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch photos
  useEffect(() => {
    const fetchPhotos = async () => {
      if (authLoading) return;

      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/photographers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch profile.");
        }

        const data = await res.json();

        if (data.data?.photographer?.photos) {
          setPhotos(data.data.photographer.photos);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        toast.error("Failed to load photos");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPhotos();
    }
  }, [authLoading, API_BASE]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check photo limit
    const totalAfterUpload = photos.length + files.length;
    if (totalAfterUpload > MAX_PHOTOS) {
      toast.error(
        `Maximum ${MAX_PHOTOS} photos allowed. You have ${photos.length} already.`,
      );
      e.target.value = "";
      return;
    }

    setUploadingPhotos(true);

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await fetch(`${API_BASE}/api/photographers/photos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Update photos state with new photos from backend
      if (data.data?.photos) {
        setPhotos(data.data.photos);
        setSuccessMessage(
          `${files.length} photo(s) uploaded successfully! Your portfolio has been updated.`,
        );
        setShowSuccessModal(true);
      }

      toast.success(`${files.length} photo(s) uploaded successfully!`);
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error(error.message || "Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
      e.target.value = "";
    }
  };

  // 🔥 FIXED: Handle Delete Photo with Toast Loading State
  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;

    const token = getCookie("token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    // Get photo name for display
    const photoName =
      selectedPhoto.caption ||
      `Photo ${photos.indexOf(selectedPhoto) + 1}` ||
      "Untitled";

    // 🔥 SHOW LOADING TOAST
    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div>
          <p className="font-medium">Deleting photo...</p>
          <p className="text-sm text-gray-500">{photoName}</p>
        </div>
      </div>,
      {
        duration: Infinity, // Keep until manually dismissed
        icon: "🗑️",
        style: {
          background: "#f3f4f6",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      },
    );

    setDeleteToastId(toastId);
    setDeletingId(selectedPhoto._id);

    try {
      const response = await fetch(
        `${API_BASE}/api/photographers/photos/${selectedPhoto._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Delete failed");

      // ✅ SUCCESS: Dismiss loading toast and show success
      toast.dismiss(toastId);

      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <div>
            <p className="font-medium">Photo deleted successfully!</p>
            <p className="text-sm text-gray-600">{photoName}</p>
          </div>
        </div>,
        {
          duration: 4000,
          icon: "🗑️",
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
        },
      );

      // Update photos state
      setPhotos((prev) =>
        prev.filter((photo) => photo._id !== selectedPhoto._id),
      );

      setShowDeleteModal(false);
      setSelectedPhoto(null);

      setSuccessMessage(
        `"${photoName}" has been successfully deleted from your portfolio.`,
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Delete photo error:", error);

      // ❌ ERROR: Dismiss loading toast and show error
      toast.dismiss(toastId);

      toast.error(
        <div className="flex items-center gap-2">
          <span className="text-lg">❌</span>
          <div>
            <p className="font-medium">Delete failed</p>
            <p className="text-sm text-gray-600">
              {error.message || "Please try again"}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          icon: "⚠️",
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        },
      );
    } finally {
      setDeletingId(null);
      setDeleteToastId(null);
    }
  };

  const confirmDelete = (photo) => {
    setSelectedPhoto(photo);
    setShowDeleteModal(true);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Portfolio Photos
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your photography portfolio images
              </p>
            </div>
          </div>
        </div>

        {/* Stats and Upload Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Section - 2/3 width */}
          <div className="lg:col-span-2">
            <UploadSection
              photos={photos}
              MAX_PHOTOS={MAX_PHOTOS}
              uploadingPhotos={uploadingPhotos}
              onUpload={handleImageUpload}
            />
          </div>

          {/* Stats Section - 1/3 width */}
          <div className="lg:col-span-1">
            <PhotoStats photos={photos} MAX_PHOTOS={MAX_PHOTOS} />
          </div>
        </div>

        {/* Photos Gallery */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Photo Gallery
              </h2>
              <p className="text-gray-600 mt-1">
                {photos.length} photo{photos.length !== 1 ? "s" : ""} • Click
                any photo to view full screen
              </p>
            </div>
            {photos.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {photos.length}/{MAX_PHOTOS} Photos
                </span>
              </div>
            )}
          </div>

          <PhotoGallery
            photos={photos}
            MAX_PHOTOS={MAX_PHOTOS}
            uploadingPhotos={uploadingPhotos}
            deletingId={deletingId}
            onUpload={handleImageUpload}
            onDelete={handleDeletePhoto}
            onConfirmDelete={confirmDelete}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePhoto}
        photo={selectedPhoto}
        deleting={deletingId === selectedPhoto?._id}
        photoName={
          selectedPhoto?.caption ||
          (selectedPhoto && `Photo ${photos.indexOf(selectedPhoto) + 1}`) ||
          "this photo"
        }
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
}
