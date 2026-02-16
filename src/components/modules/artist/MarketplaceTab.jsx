// components/modules/artist/MarketplaceTab.jsx
"use client";

import Select from "@/ui/Select";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Edit3,
  List,
  MapPin,
  PlusCircle,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import MediaUploadSection from "./MediaUploadSection";
import { EmptyListingState } from "./market/EmptyListingState";
import { ListingDetailView } from "./market/ListingDetailView";

const STATE_OPTIONS = [
  { value: "", label: "Select a state", disabled: true },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Alabama", label: "Alabama" },
  { value: "Florida", label: "Florida" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active", icon: "🟢" },
  { value: "hidden", label: "Hidden", icon: "👁️‍🗨️" },
  { value: "sold", label: "Sold", icon: "💰" },
];

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
  loadMarketplaceData,
  setListingPhotos,
  setIsEditingListing,
  billingData,
  user,
  stats: propStats = {},
}) {
  const [activeSection, setActiveSection] = useState("create");
  const [formErrors, setFormErrors] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deletedPhotos, setDeletedPhotos] = useState([]); // Store URLs of photos to delete
  const [deletedVideo, setDeletedVideo] = useState(null); // Store video URL to delete
  const [stats, setStats] = useState({
    views: propStats.totalViews || 124,
    clicks: propStats.totalClicks || 42,
    inquiries: propStats.totalInquiries || 8,
    conversion: "3.2%",
  });

  const existingItem = useMemo(
    () => (Array.isArray(listings) && listings.length ? listings[0] : null),
    [listings]
  );

  useEffect(() => {
    if (existingItem) {
      setActiveSection("create");
    }
  }, [existingItem]);

  // Reset deleted items when component mounts or existingItem changes
  useEffect(() => {
    setDeletedPhotos([]);
    setDeletedVideo(null);
  }, [existingItem]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const syntheticEvent = {
      target: {
        name,
        value,
      },
    };
    onListingChange(syntheticEvent);
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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
    if (!currentListing.location) {
      errors.location = "Please select a state";
    }
    if (listingPhotos.length === 0) {
      errors.photos = "At least one photo is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOrUpdate = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (existingItem) {
        // For update, pass deleted photos and video
        await handleUpdateListing();
      } else {
        // For create
        await onCreateListing();
      }

      // Reset deleted items after successful update
      setDeletedPhotos([]);
      setDeletedVideo(null);

    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (listingPhotos.length + files.length > 5) {
      toast.error(`You can only upload ${5 - listingPhotos.length} more photos.`);
      e.target.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, WebP allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onPhotoUpload(validFiles);
    }
    e.target.value = "";
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (listingVideos.length > 0) {
      toast.error("You can only upload one video");
      e.target.value = "";
      return;
    }

    const file = files[0];
    const validTypes = ["video/mp4", "video/quicktime", "video/mov"];
    const maxSize = 50 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only MP4, MOV allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      toast.error("File too large. Max size is 50MB.");
      e.target.value = "";
      return;
    }

    onVideoUpload([file]);
    e.target.value = "";
  };

  // FIXED: Remove photo and track for deletion
  const removeListingPhoto = (index) => {
    const photo = listingPhotos[index];

    // If it's an existing photo (string URL), add to deletedPhotos
    if (typeof photo === "string" && existingItem) {
      setDeletedPhotos(prev => [...prev, photo]);
    }

    // Remove from UI
    const newPhotos = [...listingPhotos];
    newPhotos.splice(index, 1);
    setListingPhotos(newPhotos);

    // Call parent's onRemovePhoto if needed
    if (onRemovePhoto) onRemovePhoto(index);
  };

  // FIXED: Remove video and track for deletion
  const removeListingVideo = () => {
    // If there's an existing video (string URL), add to deletedVideo
    if (listingVideos.length > 0 && typeof listingVideos[0] === "string" && existingItem) {
      setDeletedVideo(listingVideos[0]);
    }

    // Remove from UI
    onRemoveVideo(0);
  };

  // FIXED: Handle update with proper deletion tracking
  const handleUpdateListing = async () => {
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("title", currentListing.title);
      formData.append("description", currentListing.description);
      formData.append("price", currentListing.price);
      formData.append("location", currentListing.location);
      formData.append("status", currentListing.status || "active");

      // FIXED: Add photos to delete as JSON string
      if (deletedPhotos.length > 0) {
        formData.append("photosToDelete", JSON.stringify(deletedPhotos));
      }

      // FIXED: Add video to delete flag
      if (deletedVideo) {
        formData.append("deleteVideo", "true");
      }

      // Add new photos
      listingPhotos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append("photos", photo);
        }
      });

      // Add new video
      if (listingVideos.length > 0 && listingVideos[0] instanceof File) {
        formData.append("video", listingVideos[0]);
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      await onUpdateListing(formData);

      // Reset after successful update
      setDeletedPhotos([]);
      setDeletedVideo(null);

      toast.success("Listing updated successfully!");

    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update listing");
      throw err;
    }
  };

  const handleCancelEditWithReset = () => {
    setDeletedPhotos([]);
    setDeletedVideo(null);
    onCancelEdit();
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            className={`flex items-center gap-3 px-8 py-5 font-medium transition-all whitespace-nowrap ${activeSection === "create"
              ? "text-blue-600 border-b-2 border-blue-600 bg-gradient-to-t from-blue-50 to-transparent"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            onClick={() => setActiveSection("create")}
          >
            {isEditingListing || existingItem ? (
              <>
                <Edit3 className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold">Edit Listing</div>
                  <div className="text-xs text-gray-400 mt-0.5">Modify your current listing</div>
                </div>
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold">Create Listing</div>
                  <div className="text-xs text-gray-400 mt-0.5">Add a new item to sell</div>
                </div>
              </>
            )}
          </button>
          <button
            className={`flex items-center gap-3 px-8 py-5 font-medium transition-all whitespace-nowrap ${activeSection === "listings"
              ? "text-blue-600 border-b-2 border-blue-600 bg-gradient-to-t from-blue-50 to-transparent"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            onClick={() => setActiveSection("listings")}
          >
            <List className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold flex items-center gap-2">
                My Listing
                {existingItem && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    1
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">View and manage your listing</div>
            </div>
          </button>
        </div>
      </div>

      {/* Create/Edit Listing Form */}
      {activeSection === "create" && (
        <div className="space-y-8">
          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Title Input */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-blue-600">●</span>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentListing.title}
                    onChange={onListingChange}
                    placeholder="e.g., Fender Stratocaster 2022, Studio Recording Session"
                    className={`w-full bg-white border ${formErrors.title ? "border-red-500" : "border-gray-300"
                      } rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.title && (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Price Input */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-blue-600">●</span>
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={currentListing.price}
                      onChange={onListingChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full bg-white border ${formErrors.price ? "border-red-500" : "border-gray-300"
                        } rounded-xl pl-12 pr-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {formErrors.price && (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                {/* Location Select */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-blue-600">●</span>
                    State *
                  </label>
                  <Select
                    name="location"
                    value={currentListing.location || ""}
                    options={STATE_OPTIONS}
                    onChange={handleSelectChange}
                    placeholder="Select a state"
                    required={true}
                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                    error={formErrors.location}
                    className="!bg-white !border-gray-300"
                  />
                  {formErrors.location && (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Status Select */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-blue-600">●</span>
                    Listing Status
                  </label>
                  <Select
                    name="status"
                    value={currentListing.status || "active"}
                    options={STATUS_OPTIONS}
                    onChange={handleSelectChange}
                    placeholder="Select status"
                    className="!bg-white !border-gray-300"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active listings are visible to buyers
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-blue-600">●</span>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={currentListing.description}
                    onChange={onListingChange}
                    rows="8"
                    className={`w-full bg-white border ${formErrors.description ? "border-red-500" : "border-gray-300"
                      } rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                    placeholder="Describe your item in detail. Include condition, specifications, reason for selling, etc."
                  />
                  {formErrors.description && (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.description}
                    </p>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Detailed descriptions sell faster</span>
                    <span>{currentListing.description?.length || 0}/2000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <MediaUploadSection
            listingPhotos={listingPhotos}
            listingVideos={listingVideos}
            onPhotoUpload={handlePhotoUpload}
            onVideoUpload={handleVideoUpload}
            onRemovePhoto={removeListingPhoto}
            onRemoveVideo={removeListingVideo}
            formErrors={formErrors}
          />

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <div>
              {isEditingListing && (
                <button
                  onClick={handleCancelEditWithReset}
                  className="px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-3"
                >
                  <X className="w-5 h-5" />
                  Cancel Edit
                </button>
              )}
            </div>
            <div className="flex gap-4">
              {existingItem && !isEditingListing && (
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this listing?")) {
                      onDeleteListing(existingItem._id);
                    }
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-xl hover:bg-red-100 border border-red-200 transition-all duration-300 flex items-center gap-3 group"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Delete Listing
                </button>
              )}
              <button
                onClick={handleCreateOrUpdate}
                disabled={submitting}
                className={`relative px-10 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${submitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/30 text-white"
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {submitting ? (
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </span>
                ) : existingItem ? (
                  <span className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    Update Listing
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Upload className="w-6 h-6" />
                    Publish Listing
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Listing View */}
      {activeSection === "listings" && (
        <div className="space-y-8">
          {loadingListings ? (
            <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-transparent rounded-3xl border border-gray-200">
              <div className="inline-flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  Loading your listing...
                </p>
                <p className="text-gray-600">
                  Fetching marketplace data
                </p>
              </div>
            </div>
          ) : !existingItem ? (
            <EmptyListingState onStart={() => setActiveSection("create")} />
          ) : (
            <ListingDetailView
              existingItem={existingItem}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
              onEditListing={() => {
                onEditListing(existingItem);
                setActiveSection("create");
              }}
              onDeleteListing={() => onDeleteListing(existingItem._id)}
              stats={stats}
            />
          )}
        </div>
      )}
    </div>
  );
}