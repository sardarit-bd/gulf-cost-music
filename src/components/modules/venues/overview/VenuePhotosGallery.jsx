// components/venue/VenuePhotosGallery.js
import { ChevronLeft, ChevronRight, ImageIcon, Maximize2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function VenuePhotosGallery({ previewImages, venueName }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openFullscreen = (index) => {
    setCurrentIndex(index);
    setSelectedImage(previewImages[index]);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % previewImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(previewImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + previewImages.length) % previewImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(previewImages[newIndex]);
  };

  if (previewImages.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="text-center py-12">
          <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ImageIcon size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium mb-1">No photos yet</p>
          <p className="text-gray-500 text-sm mb-4">Add photos in edit profile</p>
          <Link
            href="/dashboard/venues/edit-profile"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            <ImageIcon size={16} />
            Upload Photos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <ImageIcon size={18} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Venue Photos</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {previewImages.length}
            </span>
          </div>
          <Link
            href="/dashboard/venue/edit"
            className="text-xs text-blue-600 hover:text-blue-800 transition font-medium"
          >
            Manage
          </Link>
        </div>

        {/* Image Grid - Compact Layout */}
        <div className="grid grid-cols-4 gap-2">
          {previewImages.slice(0, 4).map((src, idx) => (
            <button
              key={idx}
              onClick={() => openFullscreen(idx)}
              className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 hover:border-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Image
                src={src}
                alt={`${venueName} photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {idx === 3 && previewImages.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{previewImages.length - 4}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {previewImages.length > 0 && (
          <p className="text-xs text-gray-500 text-center mt-3">
            Click any photo to view fullscreen
          </p>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Navigation buttons */}
          {previewImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {previewImages.length}
          </div>

          {/* Image */}
          <div
            className="relative w-full max-w-5xl h-full max-h-[80vh] m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${venueName} photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}