"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function ImageModal({
  images = [],
  initialIndex = 0,
  isOpen,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter valid images
  const validImages = images.filter((img) => {
    if (!img) return false;
    const url = typeof img === "object" ? img.url : img;
    return url && url.trim() !== "" && url !== "undefined" && url !== "null";
  });

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  const toggleFullscreen = useCallback(async () => {
    const modalElement = document.getElementById("image-modal-content");
    if (!modalElement) return;

    try {
      if (!document.fullscreenElement) {
        await modalElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const currentImage = validImages[currentIndex];
      const imageUrl =
        typeof currentImage === "object" ? currentImage.url : currentImage;

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  }, [currentIndex, validImages]);

  const handleImageClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || validImages.length === 0) return null;

  const currentImage = validImages[currentIndex];
  const imageUrl =
    typeof currentImage === "object" ? currentImage.url : currentImage;
  const imageAlt =
    typeof currentImage === "object"
      ? currentImage.alt || `Image ${currentIndex + 1}`
      : `Image ${currentIndex + 1}`;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={handleImageClick}
    >
      <div
        id="image-modal-content"
        className="relative w-full h-full max-w-7xl max-h-[90vh] bg-black rounded-lg overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all"
        >
          <X size={24} />
        </button>

        {/* Navigation Buttons */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/80 transition"
            title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
          >
            <Maximize2 size={20} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/80 transition"
            title="Download Image"
          >
            <Download size={20} />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
          {currentIndex + 1} / {validImages.length}
        </div>

        {/* Main Image */}
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Thumbnail Strip */}
        {validImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent p-4">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {validImages.map((img, index) => {
                const thumbUrl = typeof img === "object" ? img.url : img;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-blue-500 scale-110"
                        : "border-transparent hover:border-gray-500"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Instructions */}
        <div className="absolute bottom-4 right-4 z-10 hidden md:block">
          <div className="text-xs text-gray-400 bg-black/50 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-4">
              <span>← → Navigate</span>
              <span>ESC Close</span>
              <span>F Fullscreen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
