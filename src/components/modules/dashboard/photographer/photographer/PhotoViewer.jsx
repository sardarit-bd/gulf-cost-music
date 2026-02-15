"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Loader2,
  Maximize2,
  Minimize2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PhotoViewer({
  isOpen,
  onClose,
  photos = [],
  currentIndex = 0,
  onNext,
  onPrev,
  onDelete,
}) {
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentPhoto = photos[currentIndex];

  /* ===============================
     Reset loading when photo changes
  =============================== */
  useEffect(() => {
    setLoading(true);
  }, [currentIndex]);

  /* ===============================
     Fullscreen change listener
  =============================== */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const handleDelete = async () => {
    if (!currentPhoto) return;

    setDeleting(true);
    await onDelete(currentPhoto);
    setDeleting(false);

    if (photos.length === 1) {
      onClose();
    }
  };

  const handleDownload = async () => {
    if (!currentPhoto) return;

    try {
      const response = await fetch(currentPhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentPhoto.caption || `photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  /* ===============================
     Keyboard navigation
  =============================== */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) onPrev();
          break;
        case "ArrowRight":
          if (currentIndex < photos.length - 1) onNext();
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNext, onPrev]);

  /* ===============================
     Prevent body scroll
  =============================== */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ===============================
     Early return AFTER hooks
  =============================== */
  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Main Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Bar */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <span className="px-4 py-2 bg-black/50 text-white rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </span>

          {currentPhoto.caption && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
            >
              <Info className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="absolute left-6 z-10 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex === photos.length - 1}
              className="absolute right-6 z-10 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Bottom Toolbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
          <button
            onClick={handleDownload}
            className="p-3 hover:bg-white/10 text-white rounded-full transition-all"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 hover:bg-white/10 text-white rounded-full transition-all"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full transition-all disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Info Panel */}
        {showInfo && currentPhoto.caption && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 max-w-2xl w-full px-6">
            <div className="bg-black/70 backdrop-blur-md text-white rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentPhoto.caption}
              </h3>
              {currentPhoto.description && (
                <p className="text-gray-300">{currentPhoto.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Uploaded:{" "}
                {new Date(
                  currentPhoto.createdAt || Date.now(),
                ).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
              </div>
            )}

            <Image
              src={currentPhoto.url}
              alt={currentPhoto.caption || `Photo ${currentIndex + 1}`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setLoading(false)}
              priority
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
