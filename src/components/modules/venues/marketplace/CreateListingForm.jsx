import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  ImageIcon,
  MapPin,
  Package,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

export default function CreateListingForm({
  currentListing,
  displayPhotos,
  listingVideos,
  formErrors,
  isEditingListing,
  hasListing,
  listing,
  isSubmitting,
  photosToDelete,
  deleteVideo,
  onListingChange,
  onPhotoUpload,
  onVideoUpload,
  onRemovePhoto,
  onRemoveVideo,
  onCancelEdit,
  onDeleteListing,
  onCreateOrUpdate,
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoInputChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Use JPEG, PNG, or WebP`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Max 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onPhotoUpload(validFiles);
    }
    e.target.value = null;
  };

  const handleVideoInputChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["video/mp4", "video/quicktime", "video/mov", "video/avi", "video/webm"];
    const maxSize = 200 * 1024 * 1024; // 200MB

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Use MP4 or MOV`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Max 200MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onVideoUpload(validFiles);
    }
    e.target.value = null;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      toast.error("Please wait, submission in progress");
      return;
    }

    setIsUploading(true);
    try {
      await onCreateOrUpdate();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={currentListing.title}
              onChange={onListingChange}
              placeholder="e.g., Professional PA System, Stage Lighting Kit, Venue Chairs"
              className={`w-full bg-white border ${formErrors.title ? "border-red-300" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              disabled={isSubmitting}
            />
            {formErrors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="price"
                value={currentListing.price}
                onChange={onListingChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full bg-white border ${formErrors.price ? "border-red-300" : "border-gray-300"
                  } rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                disabled={isSubmitting}
              />
            </div>
            {formErrors.price && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.price}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Location *
              </span>
            </label>
            <select
              name="location"
              value={currentListing.location || ""}
              onChange={onListingChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isSubmitting}
            >
              <option value="">Select a location</option>
              <option value="Louisiana">Louisiana</option>
              <option value="Mississippi">Mississippi</option>
              <option value="Alabama">Alabama</option>
              <option value="Florida">Florida</option>
            </select>
            {formErrors.location && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.location}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Select where the item can be picked up
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Status
            </label>
            <select
              name="status"
              value={currentListing.status}
              onChange={onListingChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={currentListing.description}
                onChange={onListingChange}
                rows="4"
                className={`w-full bg-white border ${formErrors.description ? "border-red-300" : "border-gray-300"
                  } rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                placeholder="Describe your item in detail..."
                disabled={isSubmitting}
              />
            </div>
            {formErrors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Media Upload Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Media Upload</h3>
        </div>

        {/* Photos Upload */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photos (Max 5) *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Clear photos from multiple angles increase sales
              </p>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {displayPhotos.length}/5 uploaded
              {photosToDelete.length > 0 && ` (${photosToDelete.length} marked for deletion)`}
            </span>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {displayPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                  {typeof photo === 'string' ? (
                    <img
                      src={photo}
                      alt={`Listing photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.png";
                        e.target.className = "w-full h-full bg-gray-100";
                      }}
                    />
                  ) : photo instanceof File ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`New photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                </div>
                <button
                  onClick={() => onRemovePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition shadow-sm"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
                {photosToDelete.includes(photo) && (
                  <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-red-700 bg-white/90 px-2 py-1 rounded">
                      Will be deleted
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Upload Button */}
            {displayPhotos.length < 5 && (
              <label className="cursor-pointer">
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600 transition">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP (Max 10MB)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handlePhotoInputChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
            )}
          </div>

          {formErrors.photos && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {formErrors.photos}
            </p>
          )}
        </div>

        {/* Videos Upload */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video (Optional)
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Show equipment in action
              </p>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {listingVideos.length}/1 uploaded
              {deleteVideo && " (marked for deletion)"}
            </span>
          </div>

          {/* Video Upload Area */}
          {listingVideos.length === 0 ? (
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group max-w-md">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
                  <Video className="w-7 h-7 text-gray-400 group-hover:text-blue-600 transition" />
                </div>
                <p className="text-gray-600 group-hover:text-blue-600 transition text-sm">
                  Click to upload video
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, MOV, AVI, WebM • Max 200MB
                </p>
              </div>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/mov,video/avi,video/webm"
                onChange={handleVideoInputChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          ) : (
            <div className="relative max-w-md">
              <div className="rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                {listingVideos[0] instanceof File ? (
                  <video
                    src={URL.createObjectURL(listingVideos[0])}
                    controls
                    preload="metadata"
                    className="w-full h-auto max-h-[280px] object-contain"
                  />
                ) : (
                  <video
                    src={listingVideos[0]}
                    controls
                    preload="metadata"
                    className="w-full h-auto max-h-[280px] object-contain"
                  />
                )}
              </div>
              <button
                onClick={onRemoveVideo}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition shadow-sm"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>
              {deleteVideo && (
                <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-red-700 bg-white/90 px-2 py-1 rounded">
                    Will be deleted
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div>
          {isEditingListing && (
            <button
              onClick={onCancelEdit}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {hasListing && !isEditingListing && (
            <button
              onClick={() => onDeleteListing()}
              className="px-6 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition flex items-center gap-2 border border-red-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4" />
              Delete Listing
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting || isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {isEditingListing ? "Updating..." : "Publishing..."}
              </>
            ) : isEditingListing ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Update Listing
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Publish Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}