// components/modules/Casts/featured-cast.js
"use client";
import Image from "next/image";
import { useState } from "react";
import YouTubePlayer from "./youtube-player";

export default function FeaturedCast({ cast }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube Video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = cast ? getYouTubeVideoId(cast.youtubeUrl) : null;

  if (!cast) {
    return (
      <div className="text-center text-gray-500">
        No featured podcast available.
      </div>
    );
  }

  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">Cast</h2>
        <p className="text-gray-600">
          Tune into engaging podcast episodes featuring your favorite personalities
        </p>
      </div>

      {/* Video Player Section */}
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
        {videoId ? (
          <>
            <YouTubePlayer videoId={videoId} autoPlay={true} />
            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {cast.title}
                </h3>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <span>🎙️</span>
                  <span>NOW PLAYING</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Fallback to image if no valid YouTube URL
          <div className="relative h-[550px] w-full">
            <Image
              src={cast.thumbnail || "/placeholder.svg"}
              alt={cast.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {cast.title}
                </h3>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <span>🌴</span>
                  <span>PODCAST</span>
                </div>
              </div>
              <a
                href={cast.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
              >
                Watch on YouTube 🎥
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Additional Cast Info */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-bold text-lg text-black mb-3">About This Episode</h4>
        <p className="text-gray-700">
          {cast.description || "No description available."}
        </p>
      </div>
    </div>
  );
}