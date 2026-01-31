"use client";

import DeleteConfirmationModal from "@/components/modules/dashboard/photographer/photographer/DeleteConfirmationModal";
import SuccessModal from "@/components/modules/dashboard/photographer/photographer/SuccessModal";
import { CheckCircle, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PhotosTab({
  photos,
  subscriptionPlan,
  removeImage,
  handleImageUpload,
  uploadingPhotos,
  MAX_PHOTOS = 5, // All users get 5 photos for free
}) {
  const [isUploading, setIsUploading] = useState(false);

  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    photoIndex: null,
    isLoading: false,
  });

  // Success Modal State
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check photo limit - ALL USERS get 5 photos
    const totalAfterUpload = photos.length + files.length;
    if (totalAfterUpload > MAX_PHOTOS) {
      toast.error(
        `Maximum ${MAX_PHOTOS} photos allowed. You have ${photos.length} already.`
      );
      e.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      await handleImageUpload(e);
      setSuccessModal({
        isOpen: true,
        message: `${files.length} photo(s) uploaded successfully! Your portfolio has been updated.`,
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Failed to upload photos");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Open Delete Modal
  const openDeleteModal = (index) => {
    setDeleteModal({
      isOpen: true,
      photoIndex: index,
      isLoading: false,
    });
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      photoIndex: null,
      isLoading: false,
    });
  };

  // Handle Photo Deletion (Confirmed from Modal)
  const handleDeletePhoto = async () => {
    if (deleteModal.photoIndex === null) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call parent function to remove image
      removeImage(deleteModal.photoIndex);

      // Close delete modal and show success modal
      closeDeleteModal();

      setSuccessModal({
        isOpen: true,
        message: "Photo deleted successfully! Your portfolio has been updated.",
      });
    } catch (error) {
      console.error("Delete photo error:", error);
      toast.error("Failed to delete photo");
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <>
      <div className="animate-fadeIn space-y-8">
        {/* Upload Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <ImageIcon size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Portfolio Photos
                </h3>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {photos.length}/{MAX_PHOTOS} photos
                  </span>
                  <span className="text-xs">• Free Plan Included</span>
                </p>
              </div>
            </div>

            {/* Upload Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-white font-semibold">
                  {Math.round((photos.length / MAX_PHOTOS) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Free Plan Benefits */}
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Free Plan Feature:</span> Upload up to {MAX_PHOTOS} photos for your portfolio
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <label
            className={`cursor-pointer flex flex-col items-center justify-center gap-4 p-10 border-3 border-dashed rounded-2xl transition-all duration-300 ${photos.length >= MAX_PHOTOS || uploadingPhotos || isUploading
              ? "border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed"
              : "border-blue-400/50 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/70 hover:scale-[1.01]"
              }`}
          >
            {uploadingPhotos || isUploading ? (
              <div className="text-center">
                <Loader2
                  size={48}
                  className="animate-spin mx-auto mb-4 text-blue-500"
                />
                <p className="text-lg font-medium text-blue-400">
                  Uploading Photos...
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Please wait while we process your photos
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                  <Upload size={36} className="text-blue-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold">
                    {photos.length >= MAX_PHOTOS
                      ? "Maximum Photos Reached"
                      : "Upload Your Photos"}
                  </p>
                  <p className="text-gray-400">
                    {photos.length >= MAX_PHOTOS
                      ? `You've reached the maximum of ${MAX_PHOTOS} photos`
                      : "Drag & drop or click to browse files"}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: JPG, PNG, WebP, GIF
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileUpload}
                  disabled={
                    photos.length >= MAX_PHOTOS ||
                    uploadingPhotos ||
                    isUploading
                  }
                />
              </>
            )}
          </label>

          {/* Upload Progress */}
          {(uploadingPhotos || isUploading) && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Processing photos...</span>
                <span>
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(photos.length / MAX_PHOTOS) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Photos Grid */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Your Photo Gallery
              <span className="text-gray-400 text-sm font-normal">
                ({photos.length} photo{photos.length !== 1 ? "s" : ""})
              </span>
            </h3>

            {photos.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  Click photo to delete
                </span>
              </div>
            )}
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border-3 border-dashed border-gray-700">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-6">
                <ImageIcon size={40} className="text-blue-500/50" />
              </div>
              <h4 className="text-xl font-semibold text-gray-300 mb-2">
                No photos yet
              </h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start building your portfolio by uploading your best work
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-md">
                <Upload size={20} />
                Upload First Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileUpload}
                  disabled={uploadingPhotos || isUploading}
                />
              </label>
              <p className="text-green-400 text-sm mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={14} />
                Free plan includes {MAX_PHOTOS} photo uploads
              </p>
            </div>
          ) : (
            <>
              {/* Photo Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Total Photos</p>
                  <p className="text-2xl font-bold text-white">
                    {photos.length}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Remaining</p>
                  <p className="text-2xl font-bold text-white">
                    {MAX_PHOTOS - photos.length}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Storage Used</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round((photos.length / MAX_PHOTOS) * 100)}%
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Max Limit</p>
                  <p className="text-2xl font-bold text-white">{MAX_PHOTOS}</p>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo._id || index}
                    className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-700 cursor-pointer bg-gray-900"
                    onClick={() => openDeleteModal(index)}
                  >
                    {/* Image */}
                    <Image
                      src={photo.url}
                      alt={photo.caption || `Portfolio photo ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 4}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-3 right-3 bg-red-600/90 p-2 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Trash2 size={20} className="text-white" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium truncate">
                              {photo.caption || `Photo #${index + 1}`}
                            </p>
                            <p className="text-gray-300 text-sm">
                              Click to delete
                            </p>
                          </div>
                          <div className="bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeletePhoto}
        photoIndex={deleteModal.photoIndex}
        photoCount={photos.length}
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