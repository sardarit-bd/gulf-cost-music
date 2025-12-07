"use client";
import YouTubePlayer from "@/components/modules/Casts/youtube-player";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FeaturedWave({ wave }) {
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (wave) setAutoPlay(true);
  }, [wave]);

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
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(wave.youtubeUrl);

  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2">Waves</h2>
        <p className="text-gray-600">
          Explore the freshest waves and top audio experiences.
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">

        {/* CASE 1: YouTube video available */}
        {videoId ? (
          <YouTubePlayer videoId={videoId} autoPlay={autoPlay} />
        ) : wave.audioUrl ? (

          /* CASE 2: Audio URL available */
          <audio
            src={wave.audioUrl}
            controls
            autoPlay={autoPlay}
            className="w-full h-[80px] bg-black text-white"
          />

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

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent space-y-4">
          <h3 className="text-xl font-bold text-white">{wave.title}</h3>

          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <span>🌊</span>
            <span>{videoId ? "VIDEO WAVE" : wave.audioUrl ? "AUDIO WAVE" : "NO MEDIA"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
