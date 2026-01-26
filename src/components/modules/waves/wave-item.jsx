"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiMusic, FiPause, FiPlay, FiInfo } from "react-icons/fi";

export default function WaveItem({
  wave,
  isPlaying = false,
  onPlayClick
}) {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

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

  // Handle mouse move for tooltip
  const handleMouseMove = (e) => {
    if (wave.description && wave.description.length > 40) {
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Truncate description
  const truncatedDescription = wave.description
    ? (wave.description.length > 40
      ? wave.description.substring(0, 40) + '...'
      : wave.description)
    : "No description available.";

  return (
    <>
      <div
        className="shadow flex items-center gap-3 p-6 rounded-lg bg-[#F9FAFB] hover:shadow-md transition cursor-pointer group relative"
        onClick={() => onPlayClick && onPlayClick(wave._id)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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

            {/* Description with Info Icon */}
            <div className="flex items-center gap-1 mt-1">
              <p className="text-xs text-gray-500 truncate flex-1">
                {truncatedDescription}
                {wave.description && wave.description.length > 40 && (
                  <span className="text-blue-500 ml-1 cursor-help inline-block">
                    <FiInfo className="w-3 h-3" />
                  </span>
                )}
              </p>
            </div>
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

      {/* Description Tooltip */}
      {showTooltip && wave.description && wave.description.length > 40 && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 max-w-xs pointer-events-none animate-fadeIn"
          style={{
            top: `${tooltipPosition.y - 10}px`,
            left: `${tooltipPosition.x + 10}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-semibold text-white mb-2 flex items-center gap-2">
            <FiInfo className="w-3 h-3" />
            <span>Description</span>
          </div>
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {wave.description}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}
    </>
  );
}