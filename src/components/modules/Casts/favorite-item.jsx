"use client";
import Image from "next/image";
import { FiMusic, FiPlay } from "react-icons/fi";

export default function FavoriteItem({ favorite, isActive = false }) {
  return (
    <div className={`shadow flex items-center gap-3 p-3 rounded-lg transition cursor-pointer group ${isActive
      ? 'bg-blue-50 border-2 border-blue-300'
      : 'bg-[#F9FAFB] hover:shadow-md hover:bg-blue-50'
      }`}>
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
        <p className="text-sm text-gray-600 line-clamp-2">
          {favorite.description || "No description available."}
        </p>
      </div>
    </div>
  );
}