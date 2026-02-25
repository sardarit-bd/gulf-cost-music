"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import YouTubePlayer from "../Casts/youtube-player";

export default function FeaturedWave({ wave, sectionText, setPlayingWaveId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  // Reset playing state when wave changes
  useEffect(() => {
    setIsPlaying(false);
    setShowThumbnail(true);
  }, [wave?._id]);

  if (!wave) {
    return (
      <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-xl">
        <p>No featured wave available.</p>
      </div>
    );
  }

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(wave.youtubeUrl);

  const handlePlayClick = () => {
    setIsPlaying(true);
    setShowThumbnail(false);
    if (setPlayingWaveId) {
      setPlayingWaveId(wave._id);
    }
  };

  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">
          {sectionText?.sectionTitle || "Waves"}
        </h2>
        <p className="text-gray-600">
          {sectionText?.sectionSubtitle ||
            "Explore the freshest waves and top audio experiences."}
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black group">
        {/* Media Container */}
        <div className="relative h-[550px] w-full">
          {/* YouTube Video */}
          {videoId ? (
            <>
              {/* Thumbnail with Custom Play Button */}
              {showThumbnail && (
                <div
                  className="absolute inset-0 cursor-pointer z-20"
                  onClick={handlePlayClick}
                >
                  <Image
                    src={wave.thumbnail || "/placeholder.svg"}
                    alt={wave.title}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    }}
                  />

                  {/* Custom Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Ripple Effect */}
                      <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping"></div>

                      {/* Play Button */}
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
                </div>
              )}

              {/* YouTube Player */}
              <div
                className={`w-full h-full transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}
              >
                {isPlaying && <YouTubePlayer videoId={videoId} autoPlay={true} />}
              </div>
            </>
          ) : (
            /* Fallback - Just Thumbnail */
            <div className="relative h-[550px] w-full">
              <Image
                src={wave.thumbnail || "/placeholder.svg"}
                alt={wave.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30">
          <h3 className="text-xl font-bold text-white mb-2">{wave.title}</h3>

          {wave.description && (
            <p className="text-gray-200 text-sm mb-2 line-clamp-2">{wave.description}</p>
          )}

          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <span>🌊</span>
            <span>
              {isPlaying
                ? "NOW PLAYING"
                : videoId
                  ? "CLICK TO PLAY"
                  : "WAVE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}