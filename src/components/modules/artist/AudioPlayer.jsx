"use client";

import {
  Heart,
  MoreVertical,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({
  audio,
  index,
  isPlaying,
  isLiked,
  onToggle,
  onLike,
  onNext,
  onPrevious,
}) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Audio URL নির্ধারণ
  const audioUrl = typeof audio === "object" ? audio.url || audio : audio;
  const audioName =
    typeof audio === "object"
      ? audio.name || `Track ${index + 1}`
      : `Track ${index + 1}`;

  // Audio metadata লোড
  useEffect(() => {
    if (!audioRef.current) return;

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    };

    const handleEnded = () => {
      onNext?.();
    };

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [onNext]);

  // Play/Pause নিয়ন্ত্রণ
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume নিয়ন্ত্রণ
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Progress bar ক্লিক হ্যান্ডলার
  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  // Time format ফাংশন
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return "0:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Volume toggle
  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  // Volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Like toggle
  const handleLikeClick = () => {
    onLike?.(index);
  };

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-start gap-4">
        {/* Album Art/Thumbnail */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white">
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-white animate-pulse"></div>
                    <div className="w-1 h-6 bg-white animate-pulse delay-75"></div>
                    <div className="w-1 h-8 bg-white animate-pulse delay-150"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-bold">MP3</div>
                    <div className="text-xs">AUDIO</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          <button
            onClick={() => onToggle?.(index)}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-gray-900 truncate">{audioName}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLikeClick}
                className={`p-2 rounded-full transition-all ${isLiked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div
              className="h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer group/progress"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative group-hover/progress:from-blue-600 group-hover/progress:to-purple-600 transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onPrevious}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                disabled={!onPrevious}
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={() => onToggle?.(index)}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-md transition-shadow"
              >
                {isPlaying ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" className="ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                disabled={!onNext}
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleVolumeToggle}
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                {isMuted || volume === 0 ? (
                  <Volume2 size={16} className="text-gray-400" />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
