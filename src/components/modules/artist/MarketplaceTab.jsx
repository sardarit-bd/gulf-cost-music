"use client";

import BeforeListingNotice from "@/components/shared/BeforeListingNotice";
import Select from "@/ui/Select";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  CreditCard,
  DollarSign,
  Edit2,
  Edit3,
  Eye,
  FileText,
  Image as ImageIcon,
  List,
  MapPin,
  Plus,
  PlusCircle,
  Shield,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import ListingStatusBadge from "./ListingStatusBadge";
import MarketplaceStats from "./MarketplaceStats";
import MediaUploadSection from "./MediaUploadSection";

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
  { value: "reserved", label: "Reserved", icon: "⏳" },
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
  handleStripeConnect,
  stripeStatus = { isConnected: false, isReady: false },
  user,
}) {
  const [activeSection, setActiveSection] = useState("create");
  const [formErrors, setFormErrors] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deletedPhotoIndexes, setDeletedPhotoIndexes] = useState([]);
  const [stats, setStats] = useState({
    views: 124,
    clicks: 42,
    inquiries: 8,
    conversion: "3.2%",
  });

  const existingItem = useMemo(
    () => (Array.isArray(listings) && listings.length ? listings[0] : null),
    [listings]
  );

  const stripeConnected = Boolean(billingData?.stripeAccountId);
  const stripeReady =
    Boolean(billingData?.stripeAccountId) &&
    Boolean(billingData?.stripeOnboardingComplete);

  useEffect(() => {
    if (existingItem) {
      setActiveSection("create");
    }
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
        await handleUpdateListing();
      } else {
        await onCreateListing();
      }
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
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
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
    const validTypes = ["video/mp4", "video/quicktime"];
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

  const handleUpdateListing = async () => {
    try {
      if (!validateForm()) return;
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", currentListing.title);
      formData.append("description", currentListing.description);
      formData.append("price", currentListing.price);
      formData.append("location", currentListing.location);
      formData.append("status", currentListing.status);
      deletedPhotoIndexes.forEach((index) => {
        const photoUrl = existingItem?.photos?.[index];
        if (photoUrl) {
          formData.append("removedPhotos[]", photoUrl);
        }
      });
      listingPhotos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append("photos", photo);
        }
      });
      if (listingVideos[0] instanceof File) {
        formData.append("video", listingVideos[0]);
      } else if (listingVideos.length === 0 && existingItem?.videos?.length) {
        formData.append("removeVideo", "true");
      }
      await onUpdateListing(formData);
      setDeletedPhotoIndexes([]);
      await loadMarketplaceData();
      setIsEditingListing(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update listing");
    } finally {
      setSubmitting(false);
    }
  };

  const removeListingPhoto = (index) => {
    const photo = listingPhotos[index];
    if (typeof photo === "string" && existingItem) {
      setDeletedPhotoIndexes((prev) => [...prev, index]);
    }
    const newPhotos = [...listingPhotos];
    newPhotos.splice(index, 1);
    setListingPhotos(newPhotos);
  };

  if (!hasMarketplaceAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full border border-gray-200 shadow-2xl">
          <div className="text-center">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-10"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center border-2 border-gray-100">
                <ShoppingBag className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Unlock Marketplace
            </h3>
            <p className="text-gray-600 mb-8">
              Upgrade to <span className="text-blue-600 font-semibold">Pro</span> to sell gear, services, and merchandise
            </p>
            <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 w-full">
              <span className="flex items-center justify-center gap-3">
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                Upgrade to Pro Plan
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-600 font-bold">0%</div>
                <div className="text-gray-600">Commission</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-600 font-bold">Secure</div>
                <div className="text-gray-600">Payments</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-600 font-bold">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs - Now at the top */}
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

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                <ShoppingBag className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Artist Marketplace
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <span className="flex w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {activeSection === "create"
                    ? (isEditingListing || existingItem ? "Edit your listing details" : "Create a new listing to sell")
                    : "View and manage your listing"}
                </p>
              </div>
            </div>
            <MarketplaceStats stats={stats} />
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
              <Shield className="w-4 h-4" />
              Verified Artist
            </span>
            <span className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              <Target className="w-4 h-4" />
              Gulf Coast Market
            </span>
          </div>
        </div>
      </div>

      {/* Before Listing Notice */}
      <BeforeListingNotice
        steps={[
          "Connect your <strong>Stripe account</strong> to receive payouts",
          "Verify your artist profile",
          "Add at least one photo and set a valid price",
        ]}
        onButtonClick={handleStripeConnect}
        isConnected={stripeConnected}
        isReady={stripeReady}
      />

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
            onRemoveVideo={() => onRemoveVideo(0)}
            formErrors={formErrors}
          />

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <div>
              {isEditingListing && (
                <button
                  onClick={onCancelEdit}
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

// Sub-components
function EmptyListingState({ onStart }) {
  return (
    <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-transparent rounded-3xl border-2 border-dashed border-gray-300">
      <div className="max-w-md mx-auto">
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl"></div>
          <div className="relative bg-white rounded-full w-40 h-40 flex items-center justify-center border-2 border-gray-200">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto" />
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Sell?
        </h3>
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          List your music gear, offer services, or sell merchandise. Reach thousands of musicians and fans on Gulf Coast's premier marketplace.
        </p>
        <button
          onClick={onStart}
          className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-semibold px-12 py-5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 transform hover:-translate-y-1 w-full max-w-sm"
        >
          <span className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6" />
            Create Your First Listing
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </span>
        </button>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
          {[
            { value: "0%", label: "Commission Fee", desc: "No hidden fees" },
            { value: "24h", label: "Avg. Response", desc: "Fast replies" },
            { value: "100%", label: "Secure", desc: "Stripe protected" },
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-2">{item.value}</div>
              <div className="text-gray-700 font-medium">{item.label}</div>
              <div className="text-gray-500 text-sm mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingDetailView({
  existingItem,
  selectedImageIndex,
  setSelectedImageIndex,
  onEditListing,
  onDeleteListing,
  stats,
}) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
      <ListingStatusBadge status={existingItem.status} createdAt={existingItem.createdAt} />

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">
                  {existingItem.title}
                </h2>
                {existingItem.location && (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200">
                    <MapPin size={16} />
                    {existingItem.location}
                  </div>
                )}
              </div>
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Listed Price</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${existingItem.price}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Media */}
            <div className="space-y-6">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-xl">
                {existingItem.photos?.[selectedImageIndex] ? (
                  <img
                    src={existingItem.photos[selectedImageIndex]}
                    alt={existingItem.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm text-gray-900 font-medium">
                    {selectedImageIndex + 1} / {existingItem.photos?.length || 1}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {existingItem.photos && existingItem.photos.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {existingItem.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border-3 transition-all duration-300 ${selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
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
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Description</h3>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {existingItem.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Action Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-8">
                  Manage Listing
                </h4>
                <div className="space-y-4">
                  <button
                    onClick={onEditListing}
                    className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-4"
                  >
                    <div className="p-2.5 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Edit2 className="w-6 h-6" />
                    </div>
                    <span className="text-lg">Edit Listing</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this listing?")) {
                        onDeleteListing();
                      }
                    }}
                    className="group w-full bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-semibold py-4 rounded-xl hover:bg-red-100 border border-red-200 transition-all duration-300 flex items-center justify-center gap-4"
                  >
                    <div className="p-2.5 bg-red-500/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <span className="text-lg">Delete Listing</span>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Views", value: stats.views, icon: Eye, color: "blue" },
                      { label: "Clicks", value: stats.clicks, icon: TrendingUp, color: "green" },
                      { label: "Inquiries", value: stats.inquiries, icon: Users, color: "purple" },
                      { label: "Conversion", value: stats.conversion, icon: CreditCard, color: "yellow" },
                    ].map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                          <span className="text-green-600 text-xs font-medium">+12%</span>
                        </div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Section */}
              {existingItem.videos?.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="w-6 h-6 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Listing Video</h4>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-300">
                    <video
                      src={existingItem.videos[0]}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}