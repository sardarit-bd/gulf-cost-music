"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ImageIcon,
  MapPin,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Function to get cookie value by name
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Custom Progress Bar Component
const ProgressBar = ({ value, label, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Mini Stat Card Component
const MiniStatCard = ({ icon, label, value, change, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div
          className={`text-sm font-medium ${change > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </div>
      )}
    </div>
  );
};

export default function PhotographerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [photographer, setPhotographer] = useState({
    name: "",
    state: "",
    city: "",
    biography: "",
    services: [],
    photos: [],
    videos: [],
  });
  const [stats, setStats] = useState({
    totalBookings: 24,
    completedBookings: 18,
    pendingBookings: 6,
    revenue: 2450,
    responseTime: "2h",
  });
  const [loading, setLoading] = useState(true);

  // Fullscreen gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch Photographer Profile
  useEffect(() => {
    const fetchPhotographer = async () => {
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

        if (data.data?.photographer) {
          const p = data.data.photographer;
          setPhotographer({
            name: p.name || "",
            state: p.state || "",
            city: p.city || "",
            biography: p.biography || "",
            services: p.services || [],
            photos: p.photos || [],
            videos: p.videos || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPhotographer();
    }
  }, [authLoading, API_BASE]);

  // Handle keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;

      switch (e.key) {
        case "Escape":
          closeGallery();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen]);

  // Format city and state names for display
  const formatCityName = (city) => {
    if (!city) return "—";
    return city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatStateName = (state) => {
    if (!state) return "—";
    return state.charAt(0).toUpperCase() + state.slice(1);
  };

  // Gallery functions
  const openGallery = (index, image) => {
    setCurrentGalleryIndex(index);
    setSelectedImage(image);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (photographer.photos && photographer.photos.length > 0) {
      const nextIndex = (currentGalleryIndex + 1) % photographer.photos.length;
      setCurrentGalleryIndex(nextIndex);
      setSelectedImage(photographer.photos[nextIndex]);
    }
  };

  const prevImage = () => {
    if (photographer.photos && photographer.photos.length > 0) {
      const prevIndex =
        (currentGalleryIndex - 1 + photographer.photos.length) %
        photographer.photos.length;
      setCurrentGalleryIndex(prevIndex);
      setSelectedImage(photographer.photos[prevIndex]);
    }
  };

  // Navigation functions for buttons
  const handleEditProfile = () => {
    router.push("/dashboard/photographer/manageprofile");
  };

  const handleAddPhotos = () => {
    router.push("/dashboard/photographer/photos");
  };

  const handleViewAnalytics = () => {
    router.push("/dashboard/photographer/service");
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 md:px-6 lg:px-8">
        {/* Header with Quick Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {photographer.name || "Photographer"}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your photography business today.
              </p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div
                    className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
                    onClick={() =>
                      photographer.photos?.[0]?.url &&
                      openGallery(0, photographer.photos[0])
                    }
                  >
                    {photographer.photos?.[0]?.url ? (
                      <Image
                        src={photographer.photos[0].url}
                        alt="Profile"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Camera size={32} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {photographer.name || "Unknown Photographer"}
                      </h2>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Professional
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>
                          {photographer.city
                            ? formatCityName(photographer.city)
                            : "—"}
                          ,{" "}
                          {photographer.state
                            ? formatStateName(photographer.state)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {photographer.services?.length || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Services</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">
                      {photographer.photos?.length +
                        photographer.videos?.length || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Portfolio Items</p>
                  </div>
                </div>

                {/* Profile Progress */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Profile Completion
                  </h3>
                  <ProgressBar
                    value={85}
                    label="Basic Information"
                    color="blue"
                  />
                  <ProgressBar value={60} label="Portfolio" color="green" />
                  <ProgressBar value={45} label="Services" color="yellow" />
                  <ProgressBar
                    value={30}
                    label="Client Reviews"
                    color="purple"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Portfolio Highlights
                </h3>
                {photographer.photos && photographer.photos.length > 0 && (
                  <button
                    onClick={() => openGallery(0, photographer.photos[0])}
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                  >
                    View All →
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photographer.photos?.slice(0, 6).map((photo, idx) => (
                  <div
                    key={photo._id || idx}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                    onClick={() => openGallery(idx, photo)}
                  >
                    <Image
                      src={photo.url}
                      alt={`Portfolio ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm truncate">
                        {photo.caption || `Photo ${idx + 1}`}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full">
                        <Camera className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                ))}
                {(!photographer.photos || photographer.photos.length === 0) && (
                  <div className="col-span-3 text-center py-12">
                    <Camera size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No portfolio photos yet</p>
                    <button
                      onClick={handleAddPhotos}
                      className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Upload Photos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Details */}
          <div className="space-y-6">
            {/* Services Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Top Services</h3>
                <span className="text-sm text-gray-500">
                  {photographer.services?.length || 0} total
                </span>
              </div>
              <div className="space-y-3">
                {photographer.services?.slice(0, 3).map((service, idx) => (
                  <div
                    key={service._id || idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {service.service}
                      </p>
                      <p className="text-sm text-gray-600">Starting from</p>
                    </div>
                    <span className="font-bold text-yellow-600">
                      {service.price}
                    </span>
                  </div>
                ))}
                {(!photographer.services ||
                  photographer.services.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-gray-600">No services added yet</p>
                    <button
                      onClick={handleEditProfile}
                      className="mt-2 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                    >
                      Add Your First Service
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Update Profile Button */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer">
            <div
              className="flex items-center gap-3 mb-4"
              onClick={handleEditProfile}
            >
              <div className="p-3 bg-blue-50 rounded-lg">
                <Edit3 size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Update Profile</h4>
                <p className="text-sm text-gray-600">
                  Keep your information fresh
                </p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Add Photos Button */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer">
            <div
              className="flex items-center gap-3 mb-4"
              onClick={handleAddPhotos}
            >
              <div className="p-3 bg-green-50 rounded-lg">
                <ImageIcon size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Add Photos</h4>
                <p className="text-sm text-gray-600">
                  Upload new portfolio items
                </p>
              </div>
            </div>
            <button
              onClick={handleAddPhotos}
              className="w-full py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors"
            >
              Upload Now
            </button>
          </div>

          {/* Add Service Button */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer">
            <div
              className="flex items-center gap-3 mb-4"
              onClick={handleViewAnalytics}
            >
              <div className="p-3 bg-purple-50 rounded-lg">
                <Video size={24} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Add Service</h4>
                <p className="text-sm text-gray-600">
                  Add a new service to your portfolio
                </p>
              </div>
            </div>
            <button
              onClick={handleViewAnalytics}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-yellow-400 transition-colors z-10 p-3 bg-black/50 rounded-full hover:bg-black/70"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {photographer.photos && photographer.photos.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors z-10 p-3 bg-black/50 rounded-full hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors z-10 p-3 bg-black/50 rounded-full hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div className="relative w-full h-full max-w-7xl mx-auto p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.url}
                alt={`Portfolio Image ${currentGalleryIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image Counter */}
            {photographer.photos && photographer.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-medium">
                  {currentGalleryIndex + 1} / {photographer.photos.length}
                </span>
              </div>
            )}

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg max-w-md">
              <p className="text-sm font-medium">
                {selectedImage.caption || `Photo ${currentGalleryIndex + 1}`}
              </p>
              <p className="text-xs text-gray-300">By {photographer.name}</p>
            </div>

            {/* Thumbnail Strip */}
            {photographer.photos && photographer.photos.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-lg">
                {photographer.photos.map((photo, index) => (
                  <button
                    key={photo._id || index}
                    onClick={() => {
                      setCurrentGalleryIndex(index);
                      setSelectedImage(photo);
                    }}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      currentGalleryIndex === index
                        ? "border-yellow-400 scale-110"
                        : "border-transparent hover:border-white/50"
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
            <p>
              Use ← → arrows or click thumbnails to navigate • Press ESC to
              close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
