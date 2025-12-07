"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiMusic, FiPause, FiPlay } from "react-icons/fi";

export default function WaveItem({
  wave,
  isPlaying = false,
  onPlayClick
}) {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize audio when wave changes
  useEffect(() => {
    if (audioRef.current && wave.audioUrl) {
      audioRef.current.src = wave.audioUrl;

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsAudioPlaying(false);
      });
    }
  }, [wave]);

  // Handle play/pause
  const toggleAudio = (e) => {
    e.stopPropagation(); // Prevent parent onClick

    if (!audioRef.current || !wave.audioUrl) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play();
      setIsAudioPlaying(true);
      // Notify parent about which wave is playing
      if (onPlayClick) onPlayClick(wave._id);
    }
  };

  // Format time display
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="shadow flex items-center gap-3 p-6 rounded-lg bg-[#F9FAFB] hover:shadow-md transition cursor-pointer group"
      onClick={() => onPlayClick && onPlayClick(wave._id)}
    >
      {/* Audio Element (hidden) */}
      <audio ref={audioRef} preload="metadata" />

      {/* Thumbnail with Play Button */}
      <div className="relative shrink-0">
        <Image
          src={wave.thumbnail || "/placeholder.svg"}
          alt={wave.title}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
        <button
          onClick={toggleAudio}
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
        >
          {isAudioPlaying ? (
            <FiPause className="text-white w-6 h-6" />
          ) : (
            <FiPlay className="text-white w-6 h-6 ml-1" />
          )}
        </button>

        {/* Now Playing Indicator */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
              <FiMusic className="relative w-4 h-4 text-green-600" />
            </div>
          </div>
        )}
      </div>

      {/* Wave Info and Progress Bar */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-black truncate text-sm">
              {wave.title}
            </h3>
            {isAudioPlaying && (
              <span className="text-xs text-green-600 font-bold animate-pulse">
                LIVE
              </span>
            )}
          </div>

          {/* Artist/Description */}
          <p className="text-xs text-gray-500 truncate">
            {wave.artist || wave.description || "Audio Wave"}
          </p>
        </div>

        {/* Progress Bar */}
        {wave.audioUrl && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Audio Play Button (for mobile/fallback) */}
        {wave.audioUrl && (
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${isAudioPlaying
              ? 'bg-red-100 text-red-600'
              : 'bg-cyan-100 text-cyan-600'
              }`}
          >
            {isAudioPlaying ? (
              <>
                <FiPause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <FiPlay className="w-3 h-3" />
                <span>Play Preview</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}