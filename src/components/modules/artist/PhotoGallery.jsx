"use client";

import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Download,
  ImageIcon,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PhotoGallery({
  images = [],
  subscriptionPlan = "free",
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef(null);

  // Filter out invalid/empty image URLs
  const validImages = useMemo(() => {
    return images.filter((img) => {
      if (!img) return false;

      // If img is a string
      if (typeof img === "string") {
        return (
          img.trim() !== "" &&
          img !== "undefined" &&
          img !== "null" &&
          !img.startsWith("data:,") &&
          img.length > 10
        ); // Basic length check
      }

      // If img is an object with url property
      if (typeof img === "object" && img !== null) {
        const url = img.url || img.src || img.image;
        return (
          url &&
          url.trim() !== "" &&
          url !== "undefined" &&
          url !== "null" &&
          !url.startsWith("data:,") &&
          url.length > 10
        );
      }

      return false;
    });
  }, [images]);

  // Extract URLs from valid images
  const imageUrls = useMemo(() => {
    return validImages
      .map((img) => {
        if (typeof img === "string") return img;
        if (typeof img === "object") return img.url || img.src || img.image;
        return "";
      })
      .filter((url) => url.trim() !== "");
  }, [validImages]);

  const openLightbox = (index) => {
    if (index >= 0 && index < imageUrls.length) {
      setSelectedIndex(index);
      setZoom(1);
      document.body.style.overflow = "hidden";
    }
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && imageUrls.length > 0) {
      setSelectedIndex((prev) =>
        prev === 0 ? imageUrls.length - 1 : prev - 1,
      );
      setZoom(1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && imageUrls.length > 0) {
      setSelectedIndex((prev) =>
        prev === imageUrls.length - 1 ? 0 : prev + 1,
      );
      setZoom(1);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleDownload = () => {
    if (
      selectedIndex !== null &&
      selectedIndex < imageUrls.length &&
      imageUrls[selectedIndex]
    ) {
      const link = document.createElement("a");
      link.href = imageUrls[selectedIndex];
      link.download = `photo-${selectedIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, imageUrls.length]);

  if (imageUrls.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <ImageIcon size={24} className="text-gray-400" />
          </div>
          <div>
            <p className="text-gray-400 mb-2">No photos uploaded yet</p>
            {subscriptionPlan === "free" ? (
              <div className="flex items-center justify-center gap-2">
                <Crown size={14} className="text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  Photo uploads require Pro plan
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Upload photos to showcase your work
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((src, idx) => {
          if (!src || src.trim() === "") return null;

          return (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => openLightbox(idx)}
            >
              {/* Image */}
              <Image
                src={src}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={(e) => {
                  // Show fallback when image fails to load
                  e.target.style.display = "none";
                  const parent = e.target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "absolute inset-0 bg-gray-700 flex items-center justify-center";
                    fallback.innerHTML = `
                                            <div class="text-center">
                                                <ImageIcon class="w-8 h-8 text-gray-500 mb-2" />
                                                <p class="text-xs text-gray-400">Failed to load</p>
                                            </div>
                                        `;
                    parent.appendChild(fallback);
                  }
                }}
                onLoad={(e) => {
                  // Remove any existing fallback
                  const parent = e.target.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector(".bg-gray-700");
                    if (fallback) {
                      parent.removeChild(fallback);
                    }
                  }
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">
                    Photo {idx + 1}
                  </p>
                </div>
              </div>

              {/* View button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 size={16} className="text-white" />
                </div>
              </div>

              {/* Image counter badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                {idx + 1}/{imageUrls.length}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && imageUrls[selectedIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Navigation buttons */}
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image container */}
          <div
            className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center"
            ref={imageRef}
          >
            <Image
              src={imageUrls[selectedIndex]}
              alt={`Photo ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.2s",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                const container = imageRef.current;
                if (container) {
                  container.innerHTML = `
                                        <div class="text-center">
                                            <ImageIcon class="w-16 h-16 text-gray-500 mb-4" />
                                            <p class="text-gray-400">Failed to load image</p>
                                        </div>
                                    `;
                }
              }}
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 text-white hover:bg-white/20 rounded disabled:opacity-30"
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </button>

              <span className="text-white text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 text-white hover:bg-white/20 rounded disabled:opacity-30"
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </button>

              <button
                onClick={handleResetZoom}
                className="p-2 text-white hover:bg-white/20 rounded"
                aria-label="Reset zoom"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/30 mx-2"></div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="p-2 text-white hover:bg-white/20 rounded"
              aria-label="Download"
            >
              <Download size={18} />
            </button>

            {/* Image counter */}
            {imageUrls.length > 1 && (
              <div className="text-white text-sm font-medium ml-2">
                {selectedIndex + 1} / {imageUrls.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
              <div className="flex gap-2 overflow-x-auto max-w-[90vw] py-2">
                {imageUrls.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setZoom(1);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${
                      selectedIndex === idx
                        ? "border-yellow-500 scale-105"
                        : "border-transparent hover:border-white/50"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const parent = e.target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                                                        <div class="w-full h-full bg-gray-700 flex items-center justify-center">
                                                            <ImageIcon class="w-6 h-6 text-gray-500" />
                                                        </div>
                                                    `;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm">
            <p>Use ← → keys to navigate, +/- to zoom, ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
}
