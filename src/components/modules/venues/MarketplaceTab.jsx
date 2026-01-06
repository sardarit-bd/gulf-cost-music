"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle,
  DollarSign,
  Edit2,
  Edit3,
  FileText,
  ImageIcon,
  List,
  MapPin,
  Package,
  PlusCircle,
  Shield,
  Trash2,
  Upload,
  Video,
  X
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


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

  const handleStripeConnect = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/onboard`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Stripe connection failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };


  if (!venue?.isActive) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md mx-auto border border-gray-800">
          <Shield className="w-14 h-14 text-yellow-500 mx-auto mb-4" />

          <h3 className="text-xl font-bold text-white mb-2">
            Verification Required
          </h3>

          <p className="text-gray-400 mb-6 text-sm">
            Only verified venues can list one item on the marketplace. Please
            complete verification to continue.
          </p>

          <button
            onClick={() => window.open("/verification", "_blank")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition"
          >
            Get Verified
          </button>
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
          </div>
        </div>
      </div>

      {!venue.stripeAccountId && (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-md">
          <h3 className="text-yellow-400 font-semibold text-lg mb-2">
            Before listing an item
          </h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">1.</span>
              Connect your <strong>Stripe account</strong> to receive payments
            </li>

            <li className="flex items-start gap-2">
              <span className="text-yellow-400">2.</span>
              Complete venue verification (business details & payout info)
            </li>

            <li className="flex items-start gap-2">
              <span className="text-yellow-400">3.</span>
              Add at least one photo and a valid price
            </li>
          </ul>

          <button
            onClick={handleStripeConnect}
            className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Connect Stripe Account
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Stripe is required to securely send your earnings to you.
          </p>
        </div>
      )}



      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-800">
        <button
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${activeMarketSection === "create"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveMarketSection("create")}
        >
          {isEditingListing
            ? <>
              <Edit3 className="w-4 h-4 text-yellow-400" />
              Edit Listing
            </>
            : hasListing
              ? <>
                <Edit3 className="w-4 h-4 text-yellow-400" />
                Edit Listing
              </>
              : <>
                <PlusCircle className="w-4 h-4 text-yellow-400" />
                Create New Listing
              </>}
        </button>

        <button
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${activeMarketSection === "listings"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveMarketSection("listings")}
        >
          <List className="w-4 h-4 text-yellow-400" />
          My Listing {hasListing && `(1)`}
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
                  className={`w-full bg-gray-800 border ${formErrors.title ? "border-red-500" : "border-gray-700"
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
                    className={`w-full bg-gray-800 border ${formErrors.price ? "border-red-500" : "border-gray-700"
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

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pickup Location *
                  </span>
                </label>
                <select
                  name="location"
                  value={currentListing.location || ""}
                  onChange={handleListingChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select a location</option>
                  <option value="New Orleans">New Orleans</option>
                  <option value="Biloxi">Biloxi</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Pensacola">Pensacola</option>
                </select>
                <p className="mt-2 text-sm text-gray-400">
                  Select where the item can be picked up
                </p>
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
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                </select>
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
                className={`px-6 py-3 ${listing.status === "active"
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
                      className={`w-2 h-2 rounded-full ${listing.status === "active"
                        ? "bg-green-500"
                        : listing.status === "sold"
                          ? "bg-red-500"
                          : listing.status === "reserved"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                    ></span>
                    <span
                      className={`text-sm font-medium ${listing.status === "active"
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
                  <div className="lg:col-span-2 space-y-8">
                    {/* Title & Meta */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-3xl font-bold text-white pr-4">
                          {listing.title}
                        </h2>
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          ${listing.price}
                        </span>
                      </div>
                    </div>

                    {/* Main Image Gallery */}
                    <div className="space-y-4">
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 shadow-xl">
                        <Image
                          src={listing.photos[selectedImageIndex]}
                          alt={listing.title}
                          fill
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />

                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm text-white font-medium">
                            {selectedImageIndex + 1} / {listing.photos?.length || 1}
                          </span>
                        </div>
                      </div>

                      {/* Thumbnail Strip */}
                      {listing.photos && listing.photos.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {listing.photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300
                                  ${selectedImageIndex === index
                                  ? "border-yellow-500"
                                  : "border-gray-800 hover:border-yellow-500"
                                }`}
                            >
                              <Image
                                width="400"
                                height="400"
                                src={photo}
                                alt={`${listing.title} ${index + 1}`}
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
                        <h3 className="text-xl font-bold text-white">
                          Description
                        </h3>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {listing.description}
                        </p>
                      </div>
                    </div>
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

                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              handleEditListing(listing);
                              setActiveMarketSection("create");
                            }}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
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
                              <p className="text-gray-400 text-sm">Condition</p>
                              <p className="text-lg font-bold text-white capitalize">
                                {listing.itemCondition?.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {listing.video && (
                          <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">
                              Listing Video
                            </h4>

                            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700">
                              <video
                                src={listing.video}
                                controls
                                preload="metadata"
                                className="w-full h-full object-cover"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceTab;
