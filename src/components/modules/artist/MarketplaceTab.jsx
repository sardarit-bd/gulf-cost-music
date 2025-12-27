"use client";

import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  DollarSign,
  Edit2,
  Edit3,
  FileText,
  Image as ImageIcon,
  List,
  MapPin,
  Package,
  Plus,
  PlusCircle,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function ArtistMarketplaceTab({
  subscriptionPlan,
  hasMarketplaceAccess,
  listings = [],
  loadingListings,
  currentListing,
  listingPhotos = [],
  listingVideos = [],
  isEditingListing,
  onListingChange,
  onPhotoUpload,
  onVideoUpload,
  onRemovePhoto,
  onRemoveVideo,
  onCreateListing,
  onUpdateListing,
  onEditListing,
  onDeleteListing,
  onCancelEdit,
}) {
  const [activeSection, setActiveSection] = useState("create");
  const [formErrors, setFormErrors] = useState({});

  const existingItem = useMemo(
    () => (Array.isArray(listings) && listings.length ? listings[0] : null),
    [listings]
  );

  useEffect(() => {
    if (existingItem) setActiveSection("listings");
  }, [existingItem]);

  const statusLabel = (s) => {
    if (s === "active") return "Active";
    if (s === "sold") return "Sold";
    if (s === "hidden") return "Hidden";
    return "Active";
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!currentListing.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!currentListing.price || parseFloat(currentListing.price) <= 0) {
      errors.price = "Please enter a valid price";
    }

    if (!currentListing.description?.trim()) {
      errors.description = "Description is required";
    }

    const totalPhotos = listingPhotos.length;
    if (totalPhotos === 0) {
      errors.photos = "At least one photo is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOrUpdate = () => {
    if (!validateForm()) {
      return;
    }

    if (isEditingListing) {
      onUpdateListing();
    } else {
      onCreateListing();
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        return false;
      }
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onPhotoUpload(validFiles);
    }
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["video/mp4", "video/quicktime"];
    const maxSize = 50 * 1024 * 1024; // 50MB

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        return false;
      }
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onVideoUpload(validFiles);
    }
  };

  if (!hasMarketplaceAccess) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-900 rounded-xl p-8 max-w-md mx-auto border border-gray-800">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-900" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Marketplace Access Required
          </h3>
          <p className="text-gray-400 mb-6">
            Upgrade to{" "}
            <span className="text-yellow-400 font-semibold">Pro</span> plan to
            list your music gear, services, or merchandise.
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition">
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  const activeCount = existingItem?.status === "active" ? 1 : 0;

  return (
    <div className="space-y-8">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Artist Marketplace
            </h1>
            <p className="text-gray-400">
              {existingItem
                ? "Sell your music gear, services, or merchandise"
                : "List music gear, services, or merchandise for sale"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 bg-green-500/20 text-green-500 px-4 py-2 rounded-full text-sm font-medium">
              <Package className="w-4 h-4" />
              Verified Artist
            </span>

            {!isEditingListing && existingItem && (
              <button
                onClick={() => {
                  onEditListing(existingItem);
                  setActiveSection("create");
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Listing</p>
              <p className="text-2xl font-bold text-white">
                {activeCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Your Price</p>
              <p className="text-2xl font-bold text-white">
                {currentListing.price
                  ? `$${parseFloat(currentListing.price).toFixed(2)}`
                  : "$0.00"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Photos</p>
              <p className="text-lg font-bold text-white">
                {listingPhotos.length}/5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-800">
        {/* Create / Edit Listing */}
        <button
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${activeSection === "create"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveSection("create")}
        >
          {isEditingListing || existingItem ? (
            <>
              <Edit3 className="w-4 h-4 text-yellow-400" />
              Edit Listing
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-yellow-400" />
              Create New Listing
            </>
          )}
        </button>

        {/* My Listing */}
        <button
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${activeSection === "listings"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveSection("listings")}
        >
          <List className="w-4 h-4 text-yellow-400" />
          My Listing {existingItem && <span>(1)</span>}
        </button>
      </div>


      {/* Create/Edit Listing Form */}
      {activeSection === "create" && (
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#101828] p-3 rounded-2xl">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={currentListing.title}
                onChange={onListingChange}
                placeholder="e.g., Fender Stratocaster, Studio Session Service"
                className={`w-full bg-gray-800 border ${formErrors.title ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {formErrors.title && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="number"
                  name="price"
                  value={currentListing.price}
                  onChange={onListingChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full bg-gray-800 border ${formErrors.price ? "border-red-500" : "border-gray-700"
                    } rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
              </div>
              {formErrors.price && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.price}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Location *
              </label>
              <select
                name="location"
                value={currentListing.location || ""}
                onChange={onListingChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select a location</option>
                <option value="New Orleans">New Orleans</option>
                <option value="Biloxi">Biloxi</option>
                <option value="Mobile">Mobile</option>
                <option value="Pensacola">Pensacola</option>
              </select>
            </div>

            {/* Listing Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Listing Status
              </label>
              <select
                name="status"
                value={currentListing.status}
                onChange={onListingChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {/* Description (full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={currentListing.description}
                onChange={onListingChange}
                rows="6"
                className={`w-full bg-gray-800 border ${formErrors.description ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              <p className="mt-2 text-sm text-gray-400">
                Detailed descriptions increase trust and sales
              </p>
            </div>
          </div>


          {/* Media Upload Section */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Media Upload</h3>
            </div>

            {/* Photos Upload */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Photos (Max 5) *
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Clear photos from multiple angles increase sales
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {listingPhotos.length}/5 uploaded
                </span>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {listingPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                      <img
                        src={
                          photo instanceof File
                            ? URL.createObjectURL(photo)
                            : photo
                        }
                        alt={`Listing photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => onRemovePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {listingPhotos.length < 5 && (
                  <label className="cursor-pointer">
                    <div className="aspect-square border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-gray-800/50 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500/20 transition">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-yellow-500 transition" />
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-yellow-500 transition">
                        Click to upload
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WebP
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {formErrors.photos && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.photos}
                </p>
              )}
            </div>

            {/* Videos Upload */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Video (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Show equipment in action
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {listingVideos.length}/1 uploaded
                </span>
              </div>

              {/* Video Upload Area */}
              {listingVideos.length === 0 ? (
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-500 hover:bg-gray-800/50 transition-all duration-300 group max-w-md">
                    <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500/20 transition">
                      <Video className="w-7 h-7 text-gray-400 group-hover:text-yellow-500 transition" />
                    </div>
                    <p className="text-gray-400 group-hover:text-yellow-500 transition text-sm">
                      Click to upload video
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      MP4, MOV • Max 50MB • &lt; 2 min
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative max-w-md">
                  <div className="rounded-xl overflow-hidden border border-gray-700 bg-black">
                    <video
                      src={
                        listingVideos[0] instanceof File
                          ? URL.createObjectURL(listingVideos[0])
                          : listingVideos[0]
                      }
                      controls
                      preload="metadata"
                      className="w-full h-auto max-h-[280px] object-contain"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveVideo(0)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-800">
            <div>
              {isEditingListing && (
                <button
                  onClick={onCancelEdit}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="flex gap-4">
              {existingItem && !isEditingListing && (
                <button
                  onClick={() => onDeleteListing(existingItem._id)}
                  className="px-6 py-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Listing
                </button>
              )}

              <button
                onClick={handleCreateOrUpdate}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                {isEditingListing ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Update Listing
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Publish Listing
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Listing View - VENUE STYLE */}
      {activeSection === "listings" && (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Marketplace Listings</h2>
              <p className="text-gray-400 mt-1">Manage your active listings and track performance</p>
            </div>
          </div>

          {/* Loading State */}
          {loadingListings ? (
            <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-400 mt-6 text-lg font-medium">Loading your listing...</p>
                <p className="text-gray-500 text-sm mt-2">Fetching marketplace data</p>
              </div>
            </div>
          ) : !existingItem ? (
            /* Empty State */
            <div className="text-center py-20 bg-gradient-to-b from-gray-900/50 to-gray-900/20 rounded-2xl border border-gray-800">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-gray-800 shadow-2xl">
                  <div className="relative">
                    <Package className="w-16 h-16 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  No Active Listings
                </h3>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  Start your marketplace journey by listing gear, services, or merchandise.
                  Reach thousands of music enthusiasts and professionals.
                </p>
                <button
                  onClick={() => setActiveSection("create")}
                  className="group relative bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 text-white font-semibold px-10 py-4 rounded-2xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 transform hover:-translate-y-1"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    Create Your First Listing
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <div className="mt-12 grid grid-cols-3 gap-8 text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">0%</div>
                    <div className="text-sm">Commission Fee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">24h</div>
                    <div className="text-sm">Avg. Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">100%</div>
                    <div className="text-sm">Secure Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Listing Details */
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
              {/* Status Header */}
              <div className={`px-8 py-4 backdrop-blur-sm ${existingItem.status === "active"
                ? "bg-gradient-to-r from-green-500/10 to-emerald-500/5"
                : existingItem.status === "sold"
                  ? "bg-gradient-to-r from-red-500/10 to-rose-500/5"
                  : existingItem.status === "reserved"
                    ? "bg-gradient-to-r from-orange-500/10 to-amber-500/5"
                    : "bg-gradient-to-r from-yellow-500/10 to-yellow-500/5"
                }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${existingItem.status === "active"
                      ? "bg-green-500/20"
                      : existingItem.status === "sold"
                        ? "bg-red-500/20"
                        : existingItem.status === "reserved"
                          ? "bg-orange-500/20"
                          : "bg-yellow-500/20"
                      }`}>
                      <div className={`w-3 h-3 rounded-full ${existingItem.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : existingItem.status === "sold"
                          ? "bg-red-500"
                          : existingItem.status === "reserved"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300">Listing Status</h4>
                      <p className={`text-lg font-bold ${existingItem.status === "active"
                        ? "text-green-400"
                        : existingItem.status === "sold"
                          ? "text-red-400"
                          : existingItem.status === "reserved"
                            ? "text-orange-400"
                            : "text-yellow-400"
                        }`}>
                        {existingItem.status.charAt(0).toUpperCase() + existingItem.status.slice(1)}
                        {existingItem.status === "active" && " • Accepting Offers"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Listed</p>
                      <p className="font-medium text-white">
                        {new Date(existingItem.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Media & Details */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Title & Meta */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-3xl font-bold text-white pr-4">
                          {existingItem.title}
                        </h2>
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          ${existingItem.price}
                        </span>
                      </div>
                    </div>

                    {/* Main Image Gallery */}
                    <div className="space-y-4">
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 shadow-xl">
                        {existingItem.photos?.[0] ? (
                          <img
                            src={existingItem.photos[0]}
                            alt={existingItem.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-16 h-16 text-gray-700" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm text-white font-medium">
                            1 / {existingItem.photos?.length || 1}
                          </span>
                        </div>
                      </div>

                      {/* Thumbnail Strip */}
                      {existingItem.photos && existingItem.photos.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {existingItem.photos.map((photo, index) => (
                            <button
                              key={index}
                              className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-800 hover:border-yellow-500 transition-all duration-300"
                              onClick={() => {/* Add gallery navigation */ }}
                            >
                              <img
                                src={photo}
                                alt={`${existingItem.title} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                      <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white">Description</h3>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {existingItem.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Actions & Stats */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                      {/* Action Card */}
                      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-xl">
                        <h4 className="text-lg font-bold text-white mb-6">Manage Listing</h4>

                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              onEditListing(existingItem);
                              setActiveSection("create");
                            }}
                            className="group w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-2 rounded-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                              <Edit2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg">Edit Listing</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this listing?')) {
                                onDeleteListing(existingItem._id);
                              }
                            }}
                            className="group w-full bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 font-semibold py-2 rounded-xl hover:bg-red-500/20 border border-red-500/20 transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                              <Trash2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg">Delete Listing</span>
                          </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-8 pt-6 border-t border-gray-800">
                          <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                            Quick Stats
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Photos */}
                            <div className="bg-gray-800/50 rounded-xl p-4">
                              <p className="text-gray-400 text-sm">Photos</p>
                              <p className="text-2xl font-bold text-white mt-1">
                                {existingItem.photos?.length || 0}
                                <span className="text-gray-500 text-sm ml-1">/5 max</span>
                              </p>
                            </div>

                            {/* Videos */}
                            <div className="bg-gray-800/50 rounded-xl p-4">
                              <p className="text-gray-400 text-sm">Videos</p>
                              <p className="text-2xl font-bold text-white mt-1">
                                {Array.isArray(existingItem.videos)
                                  ? existingItem.videos.length
                                  : existingItem.video
                                    ? 1
                                    : 0}
                                <span className="text-gray-500 text-sm ml-1">uploaded</span>
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Listing Video */}
                      {existingItem.video && (
                        <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">
                            Listing Video
                          </h4>

                          <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700">
                            <video
                              src={existingItem.video}
                              controls
                              className="w-full h-full object-cover"
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}