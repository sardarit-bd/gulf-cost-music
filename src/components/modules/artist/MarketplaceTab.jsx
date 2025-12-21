"use client";

import {
  Edit2,
  Image as ImageIcon,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (currentListing?.status === "draft") {
      toast.error("Draft status is not supported. Using Hidden instead.");
    }
  }, [currentListing?.status]);

  if (!hasMarketplaceAccess) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-900 rounded-xl p-8 max-w-md mx-auto border border-gray-800">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
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
      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Listing</p>
              <p className="text-2xl font-bold text-white mt-1">
                {activeCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Listings</p>
              <p className="text-2xl font-bold text-white mt-1">
                {existingItem ? 1 : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Photo Slots</p>
              <p className="text-2xl font-bold text-white mt-1">
                {listingPhotos.length}/5
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-3 font-medium text-sm ${activeSection === "create"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveSection("create")}
        >
          {isEditingListing
            ? "Edit Listing"
            : existingItem
              ? "Update Listing"
              : "Create New Listing"}
        </button>

        <button
          className={`px-4 py-3 font-medium text-sm ${activeSection === "listings"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveSection("listings")}
        >
          My Listing ({existingItem ? 1 : 0})
        </button>

        <button
          className={`px-4 py-3 font-medium text-sm ${activeSection === "guidelines"
            ? "text-white border-b-2 border-yellow-500"
            : "text-gray-400 hover:text-white"
            }`}
          onClick={() => setActiveSection("guidelines")}
        >
          Guidelines
        </button>
      </div>

      {/* Create/Edit Listing Form */}
      {activeSection === "create" && (
        <div className="space-y-8">
          {/* banner like screenshot */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Marketplace Dashboard
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  List your music gear, services, or merchandise. Verified
                  sellers can manage one active listing.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400">Your Plan</div>
                  <div className="text-sm font-semibold text-white">
                    {String(subscriptionPlan || "free").toUpperCase()}
                  </div>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400">Photos</div>
                  <div className="text-sm font-semibold text-white">
                    {listingPhotos.length}/5
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">
              Basic Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentListing.title}
                  onChange={onListingChange}
                  placeholder="e.g. Fender Stratocaster, Studio Session Service, Band Merch Bundle..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Make it clear and attractive to buyers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={currentListing.price}
                    onChange={onListingChange}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-gray-400">
                    Enter the price in US dollars.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={
                      currentListing.status === "draft"
                        ? "hidden"
                        : currentListing.status
                    }
                    onChange={onListingChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                    <option value="sold">Sold</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-400">
                    Set listing visibility.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location (Optional)
                </label>

                <select
                  name="location"
                  value={currentListing.location || ""}
                  onChange={onListingChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select a location</option>
                  <option value="New Orleans">New Orleans</option>
                  <option value="Biloxi">Biloxi</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Pensacola">Pensacola</option>
                </select>

                <p className="mt-2 text-sm text-gray-400">
                  Where is your item/service located?
                </p>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={currentListing.category}
                  onChange={onListingChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="music-gear">Music Gear</option>
                  <option value="services">Artist Services</option>
                  <option value="merch">Merch</option>
                  <option value="other">Other</option>
                </select>
                <p className="mt-2 text-sm text-gray-400">
                  Optional (UI only unless backend stores it).
                </p>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={currentListing.description}
                  onChange={onListingChange}
                  rows="5"
                  placeholder="Describe your item/service in detail: condition, specs, delivery, what’s included, etc..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Detailed descriptions get more views.</span>
                  <span>
                    {String(currentListing.description || "").length}/2000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">
              Media Upload
            </h3>

            <div className="space-y-8">
              {/* Photos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Photos (Max 5) *
                  </label>
                  <span className="text-sm text-gray-400">
                    {listingPhotos.length}/5 uploaded
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {listingPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Listing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => onRemovePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {listingPhotos.length < 5 && (
                    <label className="cursor-pointer">
                      <div className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-yellow-500 transition">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">
                          Click to upload
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          onPhotoUpload(Array.from(e.target.files || []))
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  Supports JPG, PNG, WEBP (Max 5MB each)
                </p>
              </div>

              {/* Video (single) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Video (Optional)
                  </label>
                  <span className="text-sm text-gray-400">
                    {listingVideos.length}/1 uploaded
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {listingVideos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={
                          typeof video === "string"
                            ? video
                            : URL.createObjectURL(video)
                        }
                        controls
                        className="w-full h-32 object-cover rounded-lg"
                      />

                      <button
                        type="button"
                        onClick={() => onRemoveVideo(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {listingVideos.length < 1 && (
                    <label className="cursor-pointer">
                      <div className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-yellow-500 transition">
                        <Video className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">
                          Click to upload video
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          onVideoUpload(Array.from(e.target.files || []))
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  Supports MP4, MOV (Max 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {isEditingListing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={isEditingListing ? onUpdateListing : onCreateListing}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              {existingItem
                ? "Update Marketplace Listing"
                : "Publish to Marketplace"}
            </button>
          </div>
        </div>
      )}

      {/* My Listing */}
      {activeSection === "listings" && (
        <div className="space-y-6">
          {loadingListings ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto" />
              <p className="text-gray-400 mt-4">Loading listing...</p>
            </div>
          ) : !existingItem ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Listing Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your marketplace listing to start selling.
              </p>
              <button
                type="button"
                onClick={() => setActiveSection("create")}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition"
              >
                Create Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="relative h-48">
                  {existingItem.photos?.[0] ? (
                    <img
                      src={existingItem.photos[0]}
                      alt={existingItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${existingItem.status === "active"
                        ? "bg-green-500/20 text-green-500"
                        : existingItem.status === "sold"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-gray-500/20 text-gray-300"
                        }`}
                    >
                      {statusLabel(existingItem.status)}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {existingItem.title}
                  </h3>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-2xl font-bold text-yellow-500">
                      ${existingItem.price}
                    </span>
                    {/* <span className="text-sm text-gray-400">
                      {currentListing?.category || "artist"}
                    </span> */}
                  </div>

                  <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                    {existingItem.description}
                  </p>

                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      {existingItem.location || "Location not specified"}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => onEditListing(existingItem)}
                        className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteListing(existingItem._id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {existingItem.video ? (
                    <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video attached
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      {activeSection === "guidelines" && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-6">
            Upload Guidelines
          </h3>

          <div className="space-y-6">
            {[
              {
                t: "Photo Requirements",
                d: "Maximum 5 photos allowed per listing. Clear photos increase sales.",
              },
              {
                t: "Photo Quality",
                d: "Use natural lighting. Show multiple angles and any defects clearly.",
              },
              {
                t: "Video Guidelines",
                d: "Optional video under 2 minutes. Showcase key features or sound check.",
              },
              {
                t: "Listing Details",
                d: "Include condition, specs, what’s included, delivery method, and contact note.",
              },
              {
                t: "Pro Users Only",
                d: "Only Pro users can use marketplace features. Upgrade to start selling.",
              },
            ].map((x, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{x.t}</h4>
                  <p className="text-gray-400 text-sm">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
