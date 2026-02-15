"use client";

import Image from "next/image";
import { useState } from "react";
import YouTubePlayer from "./youtube-player";

export default function FeaturedCast({ cast, sectionText }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube Video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
    );
    return match ? match[1] : null;
  };

  if (!cast) {
    return (
      <div className="text-center text-gray-500">
        No featured podcast available.
      </div>
    );
  }

  const videoId = getYouTubeVideoId(cast.youtubeUrl);

  return (
    <div className="space-y-9">
      {/* Header */}
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">
          {sectionText?.sectionTitle || "Cast"}
        </h2>
        <p className="text-gray-600">
          {sectionText?.sectionSubtitle ||
            "Tune into engaging podcast episodes featuring your favorite personalities"}
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black group">
        {!isPlaying && cast.thumbnail ? (
          <div
            className="relative h-[550px] w-full cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={cast.thumbnail}
              alt={cast.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              onError={(e) => {
                e.currentTarget.src = cast.thumbnail.replace(
                  "maxresdefault",
                  "hqdefault",
                );
              }}
            />

            {/* Improved Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Ripple Effect Background */}
                <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping"></div>

                {/* Main Play Button */}
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-8 text-white shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/50">
                  <svg
                    className="w-8 h-8 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h3 className="text-xl font-bold text-white mb-2">
                {cast.title}
              </h3>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <span>🎙️</span>
                <span>CLICK TO PLAY</span>
              </div>
            </div>
          </div>
        ) : (
          videoId && (
            <>
              <YouTubePlayer videoId={videoId} autoPlay />

              {/* Now Playing Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2">
                  {cast.title}
                </h3>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <span>🎙️</span>
                  <span>NOW PLAYING</span>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
