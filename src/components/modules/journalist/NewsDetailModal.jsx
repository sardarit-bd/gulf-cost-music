// components/journalist/NewsDetailModal.js
import { Calendar, MapPin, Newspaper, User, X } from "lucide-react";
import Image from "next/image";

export default function NewsDetailModal({ news, isOpen, onClose }) {
  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Newspaper size={24} />
            News Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Images Gallery */}
          {news.photos?.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <div
                className={`grid gap-4 ${
                  news.photos.length === 1
                    ? "grid-cols-1"
                    : news.photos.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {news.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={photo.url}
                      alt={`${news.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/300";
                        e.target.className = "w-full h-full bg-gray-100";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Calendar size={14} />
                  {new Date(news.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <MapPin size={14} />
                  {news.location}
                </div>
                {news.credit && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User size={14} />
                    {news.credit}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Story
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {news.description}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Status
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    news.published
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {news.published ? "Published" : "Draft"}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Last Updated
                </h4>
                <p className="text-gray-700 text-sm">
                  {new Date(news.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
