"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiMusic, FiPlay } from "react-icons/fi";

export default function FavoriteItem({ favorite, isActive = false }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const descriptionRef = useRef(null);
  const itemRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (!favorite.description || favorite.description.length <= 60) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 10,
      left: rect.left
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => setShowTooltip(false);
  }, []);

  const truncatedDescription = favorite.description
    ? (favorite.description.length > 60
      ? favorite.description.substring(0, 60) + '...'
      : favorite.description)
    : "No description available.";

  return (
    <>
      <div
        ref={itemRef}
        className={`shadow flex items-center gap-3 p-3 rounded-lg transition cursor-pointer group relative ${isActive
          ? 'bg-blue-50 border-2 border-blue-300'
          : 'bg-[#F9FAFB] hover:shadow-md hover:bg-blue-50'
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative shrink-0">
          <Image
            src={favorite.thumbnail || "/placeholder.svg"}
            alt={favorite.title}
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
          <div className={`absolute inset-0 flex items-center justify-center rounded-md ${isActive
            ? 'bg-blue-600/70 opacity-100'
            : 'bg-black/40 opacity-0 group-hover:opacity-100'
            } transition-opacity`}>
            {isActive ? (
              <FiMusic className="text-white w-6 h-6 animate-pulse" />
            ) : (
              <FiPlay className="text-white w-6 h-6" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-black truncate">{favorite.title}</h3>
            {isActive && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                Playing
              </span>
            )}
          </div>
          <p
            ref={descriptionRef}
            className="text-sm text-gray-600 line-clamp-2"
            title={favorite.description || "No description available."}
          >
            {truncatedDescription}
            {favorite.description && favorite.description.length > 60 && (
              <span className="text-blue-500 text-xs ml-1"></span>
            )}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && favorite.description && favorite.description.length > 60 && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 max-w-xs pointer-events-none transition-opacity duration-200"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="mb-1 font-semibold text-white">Description:</div>
          <div className="whitespace-normal break-words">
            {favorite.description}
          </div>
          <div className="absolute bottom-0 left-4 transform translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}
    </>
  );
}