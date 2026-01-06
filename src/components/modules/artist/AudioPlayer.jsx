"use client";

import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ audio, index, isPlaying, onToggle, onNext, onPrevious }) {
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Update time and duration
    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        const updateTime = () => {
            if (!isDragging) {
                setCurrentTime(audioEl.currentTime);
            }
        };

        const updateDuration = () => {
            setDuration(audioEl.duration || 0);
        };

        const handleEnded = () => {
            setCurrentTime(0);
            onToggle(index);
        };

        audioEl.addEventListener("timeupdate", updateTime);
        audioEl.addEventListener("loadedmetadata", updateDuration);
        audioEl.addEventListener("ended", handleEnded);

        return () => {
            audioEl.removeEventListener("timeupdate", updateTime);
            audioEl.removeEventListener("loadedmetadata", updateDuration);
            audioEl.removeEventListener("ended", handleEnded);
        };
    }, [index, onToggle, isDragging]);

    // Volume control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Play/pause based on isPlaying prop
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error("Error playing audio:", error);
                });
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Format time to MM:SS
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Handle progress bar click
    const handleProgressClick = (e) => {
        if (!progressBarRef.current || !audioRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const newTime = clickPosition * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Handle progress bar drag
    const handleProgressDragStart = () => setIsDragging(true);

    const handleProgressDrag = (e) => {
        if (!isDragging || !progressBarRef.current || !audioRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clickPosition = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newTime = clickPosition * duration;

        setCurrentTime(newTime);
    };

    const handleProgressDragEnd = () => {
        if (isDragging && audioRef.current) {
            audioRef.current.currentTime = currentTime;
        }
        setIsDragging(false);
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    // Handle mute toggle
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // Handle play/pause
    const handlePlayPause = () => {
        onToggle(index);
    };

    return (
        <div className={`group relative p-4 rounded-xl border transition-all ${isPlaying
            ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
            : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            }`}>
            <audio
                ref={audioRef}
                src={audio.url}
                preload="metadata"
                onError={(e) => console.error("Audio load error:", e)}
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Play/Pause Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePlayPause}
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${isPlaying
                            ? "bg-yellow-500 text-black shadow-lg"
                            : "bg-gray-700 text-white hover:bg-yellow-500 hover:text-black"
                            }`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause size={20} className="fill-current" />
                        ) : (
                            <Play size={20} className="fill-current ml-0.5" />
                        )}
                    </button>

                    {/* Skip Controls (Desktop only) */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={onPrevious}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                            aria-label="Previous track"
                            disabled={!onPrevious}
                        >
                            <SkipBack size={18} />
                        </button>
                        <button
                            onClick={onNext}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                            aria-label="Next track"
                            disabled={!onNext}
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="font-semibold text-white truncate">
                                {audio.name || `Audio Track ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span className="text-gray-600">/</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Volume Control (Desktop only) */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="p-1.5 text-gray-400 hover:text-white transition hover:bg-gray-700/50 rounded"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-20 accent-yellow-500 cursor-pointer"
                                aria-label="Volume"
                            />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div
                            ref={progressBarRef}
                            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden relative group/progress"
                            onClick={handleProgressClick}
                            onMouseDown={handleProgressDragStart}
                            onMouseMove={handleProgressDrag}
                            onMouseUp={handleProgressDragEnd}
                            onMouseLeave={handleProgressDragEnd}
                            onTouchStart={handleProgressDragStart}
                            onTouchMove={handleProgressDrag}
                            onTouchEnd={handleProgressDragEnd}
                        >
                            {/* Background */}
                            <div className="absolute inset-0 bg-gray-600"></div>

                            {/* Progress */}
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-100"
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                            />

                            {/* Thumb */}
                            <div
                                className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
                                style={{ left: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                            />
                        </div>

                        {/* Time Display */}
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>{formatTime(currentTime)}</span>
                            <span className="text-gray-400">
                                -{formatTime(Math.max(0, duration - currentTime))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Volume Control */}
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        className="p-2 text-gray-400 hover:text-white transition"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="flex-1 accent-yellow-500 cursor-pointer"
                        aria-label="Volume"
                    />
                    <span className="text-xs text-gray-400 min-w-[40px] text-right">
                        {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
                    </span>
                </div>
            </div>

            {/* Status Indicator */}
            {isPlaying && (
                <div className="absolute top-3 bottom-3 right-3">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-yellow-500 font-medium">Now Playing</span>
                    </div>
                </div>
            )}

            {/* Waveform Animation (Optional) */}
            {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
                    <div className="flex items-end h-full gap-[2px] px-2">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-yellow-500/30 rounded-t"
                                style={{
                                    height: `${20 + Math.sin(i * 0.5 + Date.now() * 0.01) * 15}%`,
                                    animation: `wave 1.2s ease-in-out ${i * 0.05}s infinite alternate`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* CSS for waveform animation */}
            <style jsx>{`
        @keyframes wave {
          0% {
            height: 20%;
          }
          100% {
            height: 80%;
          }
        }
        
        /* Custom scrollbar for audio player */
        ::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        ::-webkit-slider-thumb:hover {
          background: #fbbf24;
          transform: scale(1.1);
        }
        
        ::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    );
}