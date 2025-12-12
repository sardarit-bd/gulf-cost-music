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
    ZoomOut
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function PhotoGallery({ images = [], subscriptionPlan = "free" }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [zoom, setZoom] = useState(1);
    const imageRef = useRef(null);

    const openLightbox = (index) => {
        if (subscriptionPlan === "free") {
            // Show upgrade message for free users
            alert("Photo gallery view is a Pro feature. Upgrade to view photos in detail.");
            return;
        }
        setSelectedIndex(index);
        setZoom(1);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
        document.body.style.overflow = 'unset';
    };

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setZoom(1);
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setZoom(1);
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
        if (selectedIndex !== null && images[selectedIndex]) {
            const link = document.createElement('a');
            link.href = images[selectedIndex];
            link.download = `photo-${selectedIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (selectedIndex === null) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                goToPrevious();
                break;
            case 'ArrowRight':
                goToNext();
                break;
            case '+':
            case '=':
                handleZoomIn();
                break;
            case '-':
                handleZoomOut();
                break;
            case '0':
                handleResetZoom();
                break;
            default:
                break;
        }
    };

    // Add keyboard event listener
    useState(() => {
        const handleKeyPress = (e) => handleKeyDown(e);
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedIndex]);

    if (images.length === 0) {
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
                {images.map((src, idx) => (
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
                            {idx + 1}/{images.length}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedIndex !== null && (
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

                    {/* Image container */}
                    <div
                        className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center"
                        ref={imageRef}
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`Photo ${selectedIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
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
                        <div className="text-white text-sm font-medium ml-2">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
                            <div className="flex gap-2 overflow-x-auto max-w-[90vw] py-2">
                                {images.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedIndex(idx);
                                            setZoom(1);
                                        }}
                                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${selectedIndex === idx
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