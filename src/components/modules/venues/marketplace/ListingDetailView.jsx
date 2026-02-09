import { Building2, Edit2, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ListingDetailView({
  listing,
  venue,
  marketplaceLoading,
  onEditListing,
  onDeleteListing,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (marketplaceLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading your listing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {/* Status Banner */}
        <div
          className={`px-6 py-3 ${
            listing.status === "active"
              ? "bg-green-50 border-b border-green-200"
              : listing.status === "sold"
                ? "bg-red-50 border-b border-red-200"
                : listing.status === "reserved"
                  ? "bg-orange-50 border-b border-orange-200"
                  : "bg-yellow-50 border-b border-yellow-200"
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
                    ? "text-green-800"
                    : listing.status === "sold"
                      ? "text-red-800"
                      : listing.status === "reserved"
                        ? "text-orange-800"
                        : "text-yellow-800"
                }`}
              >
                {listing.status.charAt(0).toUpperCase() +
                  listing.status.slice(1)}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              Listed on {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Photos */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 pr-4">
                    {listing.title}
                  </h2>
                  <span className="text-2xl font-bold text-blue-700">
                    ${listing.price}
                  </span>
                </div>
              </div>

              {/* Main Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200">
                  <Image
                    src={listing.photos[selectedImageIndex]}
                    alt={listing.title}
                    fill
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/800/450";
                      e.target.className = "w-full h-full bg-gray-100";
                    }}
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
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300
                                                    ${
                                                      selectedImageIndex ===
                                                      index
                                                        ? "border-blue-500"
                                                        : "border-gray-200 hover:border-blue-400"
                                                    }`}
                      >
                        <Image
                          width={96}
                          height={96}
                          src={photo}
                          alt={`${listing.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/96/96";
                            e.target.className = "w-full h-full bg-gray-100";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Description
                  </h3>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Details & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${listing.price}
                      </span>
                      <span className="text-gray-600">USD</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Fixed price</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={onEditListing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Listing
                    </button>

                    <button
                      onClick={onDeleteListing}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 border border-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>

                  {/* Venue Info */}
                  <div className="mt-8 pt-6 border-t border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">
                      Seller Info
                    </h4>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {venue.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {venue.city} • Verified Venue
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">
                      Listing Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Photos</p>
                        <p className="text-lg font-bold text-gray-900">
                          {listing.photos?.length || 0}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">
                          {listing.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Condition</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">
                          {listing.itemCondition?.replace("-", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Category</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">
                          {listing.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  {listing.video && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Listing Video
                      </h4>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-300">
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
    </div>
  );
}
