"use client";
import YouTubePlayer from "@/components/modules/Casts/youtube-player";
import Image from "next/image";
import { useState } from "react";

export default function FeaturedWave({ wave, sectionText }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  if (!wave) {
    return (
      <div className="text-center text-gray-500">
        No featured wave available.
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
          {/* CASE 1: YouTube video available */}
          {videoId ? (
            <>
              {/* Thumbnail with Custom Play Button (visible when not playing) */}
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

              {/* YouTube Player (visible only when playing) */}
              <div
                className={`w-full h-full transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}
              >
                <YouTubePlayer videoId={videoId} autoPlay={isPlaying} />
              </div>
            </>
          ) : wave.audioUrl ? (
            /* CASE 2: Audio URL available */
            <div className="relative w-full h-full">
              <Image
                src={wave.thumbnail || "/placeholder.svg"}
                alt={wave.title}
                fill
                className="object-cover"
              />

              <audio
                src={wave.audioUrl}
                controls
                className="absolute bottom-0 left-0 right-0 w-full h-[80px] bg-black/80 text-white z-10"
              />
            </div>
          ) : (
            /* CASE 3: Thumbnail fallback */
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

          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <span>🌊</span>
            <span>
              {isPlaying
                ? "NOW PLAYING"
                : videoId
                  ? "VIDEO WAVE"
                  : wave.audioUrl
                    ? "AUDIO WAVE"
                    : "NO MEDIA"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
