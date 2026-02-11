"use client";

import { Camera, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PhotoViewer from "./PhotoViewer";

export default function PhotoGallery({
  photos,
  MAX_PHOTOS,
  uploadingPhotos,
  deletingId,
  onUpload,
  onDelete,
  onConfirmDelete,
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index) => {
    setCurrentIndex(index);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6 border-2 border-blue-100">
          <Camera className="w-12 h-12 text-blue-300" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Photos Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start building your portfolio by uploading your best photography work
        </p>
        <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-md">
          <Upload className="w-5 h-5" />
          Upload First Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onUpload}
            disabled={uploadingPhotos}
          />
        </label>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {photos.map((photo, index) => (
          <div key={photo._id || index} className="relative group">
            {/* Image Container - Click to open fullscreen */}
            <div
              className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-3 cursor-pointer"
              onClick={() => openViewer(index)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={photo.url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium truncate">
                        {photo.caption || `Photo #${index + 1}`}
                      </p>
                      <p className="text-gray-300 text-sm">
                        Click to view full screen
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onConfirmDelete(photo);
                      }}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {photo.caption || `Photo ${index + 1}`}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded:{" "}
                  {new Date(photo.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onConfirmDelete(photo)}
                disabled={deletingId === photo._id}
                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                title="Delete photo"
              >
                {deletingId === photo._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Add More Button */}
        {photos.length < MAX_PHOTOS && (
          <label className="cursor-pointer">
            <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:from-blue-200 group-hover:to-purple-200">
                <Plus className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-gray-700 font-medium group-hover:text-blue-600">
                Add More
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {MAX_PHOTOS - photos.length} remaining
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onUpload}
              disabled={uploadingPhotos}
            />
          </label>
        )}
      </div>

      {/* Full Screen Photo Viewer */}
      <PhotoViewer
        isOpen={viewerOpen}
        onClose={closeViewer}
        photos={photos}
        currentIndex={currentIndex}
        onNext={nextImage}
        onPrev={prevImage}
        onDelete={onConfirmDelete}
      />
    </>
  );
}
