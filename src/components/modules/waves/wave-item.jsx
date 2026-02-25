"use client";
import Image from "next/image";
import { useState } from "react";
import { FiMusic, FiPlay, FiInfo } from "react-icons/fi";

export default function WaveItem({
  wave,
  isPlaying = false,
  onPlayClick
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get thumbnail URL with fallback
  const getThumbnailUrl = () => {
    if (wave.thumbnail && !imageError) {
      return wave.thumbnail;
    }

    // Fallback for YouTube videos
    if (wave.youtubeUrl) {
      const videoId = wave.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }

    return "/placeholder.svg";
  };

  // Truncate description
  const truncatedDescription = wave.description
    ? (wave.description.length > 60
      ? wave.description.substring(0, 60) + '...'
      : wave.description)
    : "No description available.";

  return (
    <div
      className={`shadow flex items-center gap-3 p-3 rounded-lg transition cursor-pointer group relative ${isPlaying
        ? 'bg-blue-50 border-2 border-blue-300'
        : 'bg-[#F9FAFB] hover:shadow-md hover:bg-blue-50'
        }`}
      onMouseEnter={() => wave.description && wave.description.length > 60 && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onPlayClick}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0">
        <Image
          src={getThumbnailUrl()}
          alt={wave.title}
          width={80}
          height={80}
          className="rounded-md object-cover w-[80px] h-[80px]"
          onError={() => setImageError(true)}
        />

        {/* Play/Active Indicator */}
        <div className={`absolute inset-0 flex items-center justify-center rounded-md ${isPlaying
          ? 'bg-blue-600/70 opacity-100'
          : 'bg-black/40 opacity-0 group-hover:opacity-100'
          } transition-opacity`}>
          {isPlaying ? (
            <FiMusic className="text-white w-5 h-5 animate-pulse" />
          ) : (
            <FiPlay className="text-white w-5 h-5" />
          )}
        </div>
      </div>

      {/* Wave Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-black truncate">
            {wave.title}
          </h3>
          {isPlaying && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
              Playing
            </span>
          )}
        </div>

        {/* Description with Info Icon */}
        <div className="flex items-start gap-1">
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">
            {truncatedDescription}
          </p>
          {wave.description && wave.description.length > 60 && (
            <FiInfo className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
          )}
        </div>

        {/* Source Badge */}
        <div className="mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
            YouTube
          </span>
        </div>
      </div>

      {/* Description Tooltip */}
      {/* {showTooltip && wave.description && (
        <div className="absolute z-50 left-0 -top-2 transform -translate-y-full bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 max-w-xs pointer-events-none animate-fadeIn">
          <div className="font-semibold text-white mb-2 flex items-center gap-2">
            <FiInfo className="w-3 h-3" />
            <span>Description</span>
          </div>
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {wave.description}
          </div>
          <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )} */}
    </div>
  );
}