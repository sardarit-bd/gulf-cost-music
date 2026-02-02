// components/modules/dashboard/photographer/PhotosPage.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Camera, CheckCircle, ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
        `Maximum ${MAX_PHOTOS} photos allowed. You have ${photos.length} already.`
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
        setSuccessMessage(`${files.length} photo(s) uploaded successfully! Your portfolio has been updated.`);
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

  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;

    const token = getCookie("token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      setDeletingId(selectedPhoto._id);
      const response = await fetch(
        `${API_BASE}/api/photographers/photos/${selectedPhoto._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Delete failed");

      // Update photos state
      setPhotos(prev => prev.filter(photo => photo._id !== selectedPhoto._id));
      setShowDeleteModal(false);
      setSelectedPhoto(null);
      setSuccessMessage("Photo deleted successfully! Your portfolio has been updated.");
      setShowSuccessModal(true);
      toast.success("Photo deleted successfully!");
    } catch (error) {
      console.error("Delete photo error:", error);
      toast.error(error.message || "Failed to delete photo");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (photo) => {
    setSelectedPhoto(photo);
    setShowDeleteModal(true);
  };

  const getFileSize = (url) => {
    // This is a mock function. In real app, you'd get file size from backend
    return "2.4 MB";
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
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Photos</h1>
              <p className="text-gray-600 mt-1">Manage your photography portfolio images</p>
            </div>
          </div>
        </div>

        {/* Stats and Upload Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h2>
                  <p className="text-gray-600">Add new photos to your portfolio</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Storage Used</p>
                    <p className="text-lg font-bold text-blue-600">
                      {Math.round((photos.length / MAX_PHOTOS) * 100)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <label
                className={`cursor-pointer flex flex-col items-center justify-center gap-6 p-10 border-2 border-dashed rounded-2xl transition-all duration-300 ${photos.length >= MAX_PHOTOS || uploadingPhotos
                  ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "border-blue-300 bg-blue-50 text-blue-600 hover:border-blue-400 hover:bg-blue-100 hover:scale-[1.01]"
                  }`}
              >
                {uploadingPhotos ? (
                  <div className="text-center">
                    <Loader2
                      size={48}
                      className="animate-spin mx-auto mb-4 text-blue-500"
                    />
                    <p className="text-lg font-medium text-blue-600">
                      Uploading Photos...
                    </p>
                    <p className="text-gray-500 mt-2">
                      Please wait while we process your photos
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                      <Upload size={36} className="text-blue-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-bold text-gray-900">
                        {photos.length >= MAX_PHOTOS
                          ? "Maximum Photos Reached"
                          : "Upload Your Photos"}
                      </p>
                      <p className="text-gray-600">
                        {photos.length >= MAX_PHOTOS
                          ? `You've reached the maximum of ${MAX_PHOTOS} photos`
                          : "Drag & drop or click to browse files"}
                      </p>
                      <p className="text-sm text-gray-500 mt-4">
                        Supported: JPG, PNG, WebP, GIF • Max 5MB per file
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageUpload}
                      disabled={photos.length >= MAX_PHOTOS || uploadingPhotos}
                    />
                  </>
                )}
              </label>

              {/* Upload Progress */}
              {uploadingPhotos && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Processing photos...</span>
                    <span>
                      {photos.length}/{MAX_PHOTOS}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(photos.length / MAX_PHOTOS) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Info */}
              {/* <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm font-medium text-gray-900">
                    Free Plan Feature
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Upload up to {MAX_PHOTOS} high-quality photos for your portfolio.
                  Showcase your best work to attract more clients.
                </p>
              </div> */}
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Total Photos</p>
                      <p className="text-gray-500 text-sm">Uploaded</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{photos.length}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Remaining</p>
                    <p className="text-xl font-bold text-green-600">
                      {MAX_PHOTOS - photos.length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Max Limit</p>
                    <p className="text-xl font-bold text-purple-600">{MAX_PHOTOS}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Photo Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Use high-resolution images (minimum 1200px width)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Include a mix of portrait, landscape, and detail shots</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Optimize file sizes for faster loading</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Add descriptive captions to each photo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Photo Gallery</h2>
              <p className="text-gray-600 mt-1">
                {photos.length} photo{photos.length !== 1 ? 's' : ''} • Click any photo to view options
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

          {photos.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6 border-2 border-blue-100">
                <Camera className="w-12 h-12 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Photos Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your portfolio by uploading your best photography work
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-md">
                <Upload className="w-5 h-5" />
                Upload First Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                  disabled={uploadingPhotos}
                />
              </label>
            </div>
          ) : (
            <>
              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {photos.map((photo, index) => (
                  <div
                    key={photo._id || index}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-3">
                      <Image
                        src={photo.url}
                        alt={photo.caption || `Photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium truncate">
                                {photo.caption || `Photo #${index + 1}`}
                              </p>
                              <p className="text-gray-300 text-sm">Click to manage</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(photo);
                              }}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                              title="Delete photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {photo.caption || `Photo ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {getFileSize(photo.url)} • #{index + 1}
                        </p>
                      </div>
                      <button
                        onClick={() => confirmDelete(photo)}
                        disabled={deletingId === photo._id}
                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete photo"
                      >
                        {deletingId === photo._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                {photos.length < MAX_PHOTOS && (
                  <label className="cursor-pointer">
                    <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:from-blue-200 group-hover:to-purple-200">
                        <Plus className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-gray-700 font-medium group-hover:text-blue-600">
                        Add More
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {MAX_PHOTOS - photos.length} remaining
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageUpload}
                      disabled={uploadingPhotos}
                    />
                  </label>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Photo</h3>
                <p className="text-gray-600 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-gray-800">
                Are you sure you want to delete this photo?
              </p>
              {selectedPhoto?.caption && (
                <p className="text-red-600 font-medium mt-2">
                  "{selectedPhoto.caption}"
                </p>
              )}
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                This will permanently remove the photo from your portfolio
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingId}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePhoto}
                disabled={deletingId}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-md"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}