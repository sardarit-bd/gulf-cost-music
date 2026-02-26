"use client";
import Image from "next/image";
import { useState } from "react";
import { FiMusic, FiPlay } from "react-icons/fi";

export default function FavoriteItem({ favorite, isActive = false }) {
  const [imageError, setImageError] = useState(false);

  const getThumbnailUrl = () => {
    if (favorite.thumbnail && !imageError) {
      return favorite.thumbnail;
    }

    if (favorite.videoType === "youtube" && favorite.youtubeUrl) {
      const videoId = favorite.youtubeUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
      )?.[1];

      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }

    return "/placeholder.svg";
  };

  const truncatedDescription = favorite.description
    ? favorite.description.length > 60
      ? favorite.description.substring(0, 60) + "..."
      : favorite.description
    : "No description available.";

  return (
    <div
      className={`shadow flex items-center gap-3 p-3 rounded-lg transition cursor-pointer group relative ${isActive
          ? "bg-blue-50 border-2 border-blue-300"
          : "bg-[#F9FAFB] hover:shadow-md hover:bg-blue-50"
        }`}
    >
      <div className="relative shrink-0">
        <Image
          src={getThumbnailUrl()}
          alt={
            favorite?.title
              ? `${favorite.title} thumbnail`
              : "Podcast thumbnail"
          }
          width={120}
          height={120}
          className="rounded-md object-cover w-[120px] h-[120px]"
          onError={() => setImageError(true)}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-md ${isActive
              ? "bg-blue-600/70 opacity-100"
              : "bg-black/40 opacity-0 group-hover:opacity-100"
            } transition-opacity`}
        >
          {isActive ? (
            <FiMusic className="text-white w-6 h-6 animate-pulse" />
          ) : (
            <FiPlay className="text-white w-6 h-6" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-black truncate">
            {favorite.title}
          </h3>
          {isActive && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
              Playing
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {truncatedDescription}
        </p>

        <div className="mt-1">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${favorite.videoType === "youtube"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
              }`}
          >
            {favorite.videoType === "youtube" ? "YouTube" : "Uploaded"}
          </span>
        </div>
      </div>
    </div>
  );
}