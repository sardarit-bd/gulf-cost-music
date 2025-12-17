"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle,
  DollarSign,
  Edit2,
  ImageIcon,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Tag,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

const MarketplaceTab = ({
  subscriptionPlan,
  venue,
  marketplaceListings,
  marketplaceLoading,
  currentListing,
  listingPhotos,
  listingVideos,
  isEditingListing,
  activeMarketSection,
  setActiveMarketSection,
  handleListingChange,
  handleListingPhotoUpload,
  handleListingVideoUpload,
  removeListingPhoto,
  removeListingVideo,
  handleCreateListing,
  handleUpdateListing,
  handleEditListing,
  handleDeleteListing,
  handleCancelEdit,
}) => {
  const [formErrors, setFormErrors] = useState({});

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
      handleUpdateListing();
    } else {
      handleCreateListing();
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
      handleListingPhotoUpload(validFiles);
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
      handleListingVideoUpload(validFiles);
    }
  };

  // If not Pro user, show upgrade prompt
  if (subscriptionPlan !== "pro") {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md mx-auto border border-gray-800">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-gray-900" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Pro Feature</h3>
          <p className="text-gray-400 mb-6 text-sm">
            Sell your venue equipment, furniture, or services in our exclusive
            marketplace. List items directly to other venues and artists.
          </p>
          <div className="space-y-4">
            <div className="text-left">
              <h4 className="text-white font-semibold mb-2">Pro Benefits:</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  List venue equipment and services
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Reach other venues and artists
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Higher visibility with verified badge
                </li>
              </ul>
            </div>
            <button
              onClick={() => window.open("/pricing", "_blank")}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/20"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasListing = marketplaceListings.length > 0;
  const listing = hasListing ? marketplaceListings[0] : null;

  return (
    <div className="space-y-8">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Venue Marketplace
            </h1>
            <p className="text-gray-400">
              {hasListing
                ? "Sell your venue equipment and services to other venues"
                : "List equipment, furniture, or venue services for sale"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {venue.isActive && (
              <span className="flex items-center gap-2 bg-green-500/20 text-green-500 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Verified Venue
              </span>
            )}

            {!isEditingListing && hasListing && (
              <button
                onClick={() => {
                  handleEditListing(listing);
                  setActiveMarketSection("create");
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
                {hasListing ? "1" : "0"}
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
              <Tag className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Category</p>
              <p className="text-lg font-bold text-white capitalize">
                {currentListing.category?.replace("-", " ") || "Equipment"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-800">
        <button
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${
            activeMarketSection === "create"
              ? "text-white border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveMarketSection("create")}
        >
          {isEditingListing ? "✏️ Edit Listing" : "➕ Create New Listing"}
        </button>

        {hasListing && (
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${
              activeMarketSection === "listings"
                ? "text-white border-b-2 border-yellow-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveMarketSection("listings")}
          >
            📋 My Listing
          </button>
        )}

        <button
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${
            activeMarketSection === "guidelines"
              ? "text-white border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveMarketSection("guidelines")}
        >
          📚 Guidelines
        </button>
      </div>

      {/* Create/Edit Listing Form */}
      {activeMarketSection === "create" && (
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Item Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentListing.title}
                  onChange={handleListingChange}
                  placeholder="e.g., Professional PA System, Stage Lighting Kit, Venue Chairs"
                  className={`w-full bg-gray-800 border ${
                    formErrors.title ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
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
                    onChange={handleListingChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full bg-gray-800 border ${
                      formErrors.price ? "border-red-500" : "border-gray-700"
                    } rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                  />
                </div>
                {formErrors.price && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={currentListing.category}
                  onChange={handleListingChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                >
                  <option value="audio-equipment">🎤 Audio Equipment</option>
                  <option value="lighting">💡 Lighting & Effects</option>
                  <option value="stage-equipment">🎭 Stage Equipment</option>
                  <option value="furniture">🛋️ Venue Furniture</option>
                  <option value="bar-equipment">🍺 Bar Equipment</option>
                  <option value="kitchen">👨‍🍳 Kitchen Equipment</option>
                  <option value="security">🛡️ Security Equipment</option>
                  <option value="other">📦 Other Venue Items</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Condition *
                </label>
                <select
                  name="itemCondition"
                  value={currentListing.itemCondition}
                  onChange={handleListingChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                >
                  <option value="new">🆕 Brand New</option>
                  <option value="excellent">✨ Excellent (Like New)</option>
                  <option value="good">👍 Good (Lightly Used)</option>
                  <option value="fair">🔄 Fair (Shows Wear)</option>
                  <option value="needs-repair">🔧 Needs Repair</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pickup Location
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={currentListing.location || venue.address}
                  onChange={handleListingChange}
                  placeholder={venue.address || "Enter pickup address"}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Listing Status
                </label>
                <select
                  name="status"
                  value={currentListing.status}
                  onChange={handleListingChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                >
                  <option value="active">🟢 Active</option>
                  <option value="draft">🟡 Draft</option>
                  <option value="sold">🔴 Sold</option>
                  <option value="reserved">🟠 Reserved</option>
                </select>
              </div>

              {/* Contact Information */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Contact Information (Optional)
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={currentListing.contactPhone}
                        onChange={handleListingChange}
                        placeholder="Phone number"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="contactEmail"
                        value={currentListing.contactEmail}
                        onChange={handleListingChange}
                        placeholder="Email address"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  This information will be visible to potential buyers
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={currentListing.description}
                  onChange={handleListingChange}
                  rows="6"
                  placeholder="Describe your item in detail. Include:
• Brand, model, and specifications
• Age and usage history
• Any included accessories
• Reason for selling
• Pickup/delivery options
• Any known issues or repairs needed"
                  className={`w-full bg-gray-800 border ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                />
                {formErrors.description && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-400">
                  Detailed descriptions increase trust and sales
                </p>
              </div>
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
                        src={photo}
                        alt={`Listing photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <button
                      onClick={() => removeListingPhoto(index)}
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
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-yellow-500 hover:bg-gray-800/50 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition">
                      <Video className="w-8 h-8 text-gray-400 group-hover:text-yellow-500 transition" />
                    </div>
                    <p className="text-gray-400 group-hover:text-yellow-500 transition">
                      Click to upload video
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      MP4, MOV (max 50MB, under 2 minutes)
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
                <div className="relative group">
                  <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <div className="aspect-video flex items-center justify-center">
                      <Video className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                  <button
                    onClick={() => removeListingVideo(0)}
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
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="flex gap-4">
              {hasListing && !isEditingListing && (
                <button
                  onClick={() => handleDeleteListing(listing._id)}
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

      {/* My Listing View */}
      {activeMarketSection === "listings" && listing && (
        <div className="space-y-6">
          {marketplaceLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your listing...</p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              {/* Status Banner */}
              <div
                className={`px-6 py-3 ${
                  listing.status === "active"
                    ? "bg-green-500/20"
                    : listing.status === "sold"
                    ? "bg-red-500/20"
                    : listing.status === "reserved"
                    ? "bg-orange-500/20"
                    : "bg-yellow-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        listing.status === "active"
                          ? "bg-green-500"
                          : listing.status === "sold"
                          ? "bg-red-500"
                          : listing.status === "reserved"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <span
                      className={`text-sm font-medium ${
                        listing.status === "active"
                          ? "text-green-500"
                          : listing.status === "sold"
                          ? "text-red-500"
                          : listing.status === "reserved"
                          ? "text-orange-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Listed on {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Photos */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {listing.title}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {listing.category?.replace("-", " ") || "Equipment"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {listing.itemCondition?.replace("-", " ") || "Good"}
                        </span>
                        {listing.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {listing.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Photo */}
                    {listing.photos?.[0] && (
                      <div className="mb-6">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-800">
                          <img
                            src={listing.photos[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Thumbnail Photos */}
                    {listing.photos && listing.photos.length > 1 && (
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {listing.photos.slice(1).map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden bg-gray-800"
                          >
                            <img
                              src={photo}
                              alt={`${listing.title} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Description
                      </h3>
                      <p className="text-gray-300 whitespace-pre-line">
                        {listing.description}
                      </p>
                    </div>

                    {/* Contact Info */}
                    {(listing.contactPhone || listing.contactEmail) && (
                      <div className="bg-gray-800/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          {listing.contactPhone && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-300">
                                {listing.contactPhone}
                              </span>
                            </div>
                          )}
                          {listing.contactEmail && (
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-300">
                                {listing.contactEmail}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details & Actions */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-6">
                      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">
                              ${listing.price}
                            </span>
                            <span className="text-gray-400">USD</span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            Fixed price
                          </p>
                        </div>

                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              handleEditListing(listing);
                              setActiveMarketSection("create");
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                          >
                            <Edit2 className="w-5 h-5" />
                            Edit Listing
                          </button>

                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="w-full bg-red-500/20 text-red-500 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-5 h-5" />
                            Delete Listing
                          </button>
                        </div>

                        {/* Venue Info */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            Seller Info
                          </h4>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {venue.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {venue.city} • Verified Venue
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            Listing Stats
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 text-sm">Photos</p>
                              <p className="text-lg font-bold text-white">
                                {listing.photos?.length || 0}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Status</p>
                              <p className="text-lg font-bold text-white capitalize">
                                {listing.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Category</p>
                              <p className="text-lg font-bold text-white capitalize">
                                {listing.category?.replace("-", " ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Condition</p>
                              <p className="text-lg font-bold text-white capitalize">
                                {listing.itemCondition?.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      {activeMarketSection === "guidelines" && (
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Venue Marketplace Guidelines
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Allowed Items */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Allowed Items
                </h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-gray-300">
                    Audio equipment (PA systems, mixers, mics)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-gray-300">
                    Lighting & stage equipment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-gray-300">
                    Venue furniture & fixtures
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-gray-300">Bar & kitchen equipment</span>
                </li>
              </ul>
            </div>

            {/* Prohibited Items */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Prohibited Items
                </h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-gray-300">
                    Alcohol or controlled substances
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-gray-300">Firearms or weapons</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-gray-300">Stolen property</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-gray-300">
                    Counterfeit or illegal items
                  </span>
                </li>
              </ul>
            </div>

            {/* Photo Guidelines */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Photo Guidelines
                </h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-300">1</span>
                  </div>
                  <span className="text-gray-300">
                    Clear, well-lit photos from multiple angles
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-300">2</span>
                  </div>
                  <span className="text-gray-300">
                    Show any defects or wear clearly
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-300">3</span>
                  </div>
                  <span className="text-gray-300">
                    Include photos of included accessories
                  </span>
                </li>
              </ul>
            </div>

            {/* Transaction Safety */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-yellow-500" />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Safety Tips
                </h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3 h-3 text-yellow-500" />
                  </div>
                  <span className="text-gray-300">
                    Meet in public, well-lit areas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3 h-3 text-yellow-500" />
                  </div>
                  <span className="text-gray-300">
                    Use secure payment methods
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3 h-3 text-yellow-500" />
                  </div>
                  <span className="text-gray-300">
                    Bring someone with you for safety
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Benefits */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Pro User Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-300">Verified venue badge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-300">
                      Higher listing visibility
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-300">
                      Priority customer support
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-300">Advanced analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Important Notice
                </h4>
                <p className="text-gray-300">
                  You can only have{" "}
                  <strong>one active listing at a time</strong> as a Pro user.
                  Violation of marketplace guidelines may result in suspension
                  of your account. All transactions are between buyer and seller
                  - venue is not responsible for disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceTab;
