"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Download as DownloadIcon,
  Image as ImageIcon,
  Info,
  Maximize2,
  Minimize2,
  Trash2,
  X,
  ZoomIn,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function MediaGallery({
  photos,
  viewMode = "grid",
  selectedPhotos = new Set(),
  onSelect,
  onDelete,
  onView,
}) {
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  // ===== FULL SCREEN VIEWER STATE =====
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState({});

  // Current photo
  const currentPhoto = photos[currentIndex];

  // ===== OPEN VIEWER =====
  const openViewer = (index) => {
    if (!photos.length) return;
    setCurrentIndex(index);
    setViewerOpen(true);
    setShowInfo(false);
    setLoading(true);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  };

  // ===== CLOSE VIEWER =====
  const closeViewer = () => {
    setViewerOpen(false);
    document.body.style.overflow = "unset";
  };

  // ===== NAVIGATION =====
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setLoading(true);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setLoading(true);
  };

  // ===== TOGGLE FULLSCREEN =====
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // ===== DOWNLOAD IMAGE =====
  const downloadImage = async () => {
    if (!currentPhoto) return;
    try {
      const response = await fetch(currentPhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `studio-photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ===== KEYBOARD NAVIGATION =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!viewerOpen) return;

      switch (e.key) {
        case "Escape":
          closeViewer();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "i":
          setShowInfo((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerOpen, currentIndex]);

  // ===== CLEANUP ON UNMOUNT =====
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ===== HANDLE IMAGE ERROR =====
  const handleImageError = (photoId) => {
    setImageError((prev) => ({ ...prev, [photoId]: true }));
  };

  // ===== FULL SCREEN VIEWER COMPONENT =====
  const FullScreenViewer = () => {
    if (!viewerOpen || !currentPhoto) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          onClick={closeViewer}
        />

        {/* Close Button */}
        <button
          onClick={closeViewer}
          className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Bar */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <span className="px-4 py-2 bg-black/50 text-white rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </span>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
            title="Photo info"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 z-10 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 z-10 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === photos.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Bottom Toolbar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
          <button
            onClick={downloadImage}
            className="p-3 hover:bg-white/10 text-white rounded-full transition-all hover:scale-110"
            title="Download"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 hover:bg-white/10 text-white rounded-full transition-all hover:scale-110"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          <button
            onClick={() => {
              onDelete?.(currentPhoto._id);
              if (photos.length === 1) closeViewer();
            }}
            className="p-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full transition-all hover:scale-110"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 max-w-2xl w-full px-6">
            <div className="bg-black/70 backdrop-blur-md text-white rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-3">Photo Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Photo ID</p>
                  <p className="font-mono text-sm">
                    {currentPhoto._id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Uploaded</p>
                  <p className="text-sm">
                    {new Date(
                      currentPhoto.uploadedAt || Date.now(),
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Dimensions</p>
                  <p className="text-sm">1920 x 1080</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Format</p>
                  <p className="text-sm">JPEG</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            {/* Loading Spinner */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {/* Image */}
            <img
              src={currentPhoto.url}
              alt={`Studio photo ${currentIndex + 1}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                handleImageError(currentPhoto._id);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // ===== GRID VIEW =====
  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo._id || index}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredPhoto(photo._id)}
              onMouseLeave={() => setHoveredPhoto(null)}
              onClick={() => openViewer(index)}
            >
              {/* Photo */}
              <div className="relative w-full h-full">
                <img
                  src={photo.url || "/placeholder.jpg"}
                  alt={`Studio photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(photo._id)}
                />

                {/* Fallback for broken images */}
                {imageError[photo._id] && (
                  <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Image failed to load
                    </p>
                  </div>
                )}
              </div>

              {/* Selection Overlay */}
              <div
                className={`absolute inset-0 transition-colors ${
                  selectedPhotos.has(photo._id)
                    ? "bg-blue-600/30"
                    : "bg-black/0 group-hover:bg-black/20"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Selection Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(photo._id);
                  }}
                  className={`absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    selectedPhotos.has(photo._id)
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white/90 border-white/90 text-transparent hover:bg-blue-100 hover:border-blue-300"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {/* Hover Actions */}
              {hoveredPhoto === photo._id && (
                <div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewer(index);
                    }}
                    className="p-3 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors hover:scale-110"
                    title="View Full Screen"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(photo._id);
                    }}
                    className="p-3 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors hover:scale-110"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Photo Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Photo {index + 1}</span>
                  <span className="text-xs opacity-75">
                    {new Date(
                      photo.uploadedAt || Date.now(),
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {photos.length < 5 && (
            <div
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => onView?.("upload")}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 mb-1">Add More Photos</p>
              <p className="text-sm text-gray-600">
                {5 - photos.length} slot{5 - photos.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>
          )}
        </div>

        {/* Full Screen Viewer */}
        <FullScreenViewer />
      </>
    );
  }

  // ===== LIST VIEW =====
  return (
    <>
      <div className="space-y-3">
        {photos.map((photo, index) => (
          <div
            key={photo._id || index}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => openViewer(index)}
          >
            {/* Selection Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(photo._id);
              }}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selectedPhotos.has(photo._id)
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-300 text-transparent hover:border-blue-400"
              }`}
            >
              <Check className="w-3 h-3" />
            </button>

            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={photo.url || "/placeholder.jpg"}
                alt={`Studio photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(photo._id)}
              />
              {imageError[photo._id] && (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">
                Studio Photo {index + 1}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-600">
                  {new Date(photo.uploadedAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-blue-600 font-medium">
                  Click to view full screen
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openViewer(index);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                title="View Full Screen"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage();
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all hover:scale-110"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(photo._id);
                }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty state for list view */}
        {photos.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Upload photos to showcase your studio
            </p>
            <button
              onClick={() => onView?.("upload")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            >
              Upload Photos
            </button>
          </div>
        )}
      </div>

      <FullScreenViewer />
    </>
  );
}
