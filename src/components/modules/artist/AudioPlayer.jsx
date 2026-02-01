"use client";

import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ audio, index, isPlaying, onToggle, onNext, onPrevious }) {
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load audio and set up event listeners
    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl || !audio?.url) return;

        const handleLoadStart = () => {
            setIsLoading(true);
            setError(null);
        };

        const handleLoadedData = () => {
            setIsLoading(false);
            setDuration(audioEl.duration || 0);
        };

        const handleTimeUpdate = () => {
            if (!isDragging) {
                setCurrentTime(audioEl.currentTime);
            }
        };

        const handleEnded = () => {
            setCurrentTime(0);
            onNext?.();
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
            setError("Failed to load audio");
            setIsLoading(false);
        };

        // Set initial volume
        audioEl.volume = volume;

        // Add event listeners
        audioEl.addEventListener("loadstart", handleLoadStart);
        audioEl.addEventListener("loadeddata", handleLoadedData);
        audioEl.addEventListener("timeupdate", handleTimeUpdate);
        audioEl.addEventListener("ended", handleEnded);
        audioEl.addEventListener("error", handleError);

        // Load the audio source
        audioEl.load();

        return () => {
            audioEl.removeEventListener("loadstart", handleLoadStart);
            audioEl.removeEventListener("loadeddata", handleLoadedData);
            audioEl.removeEventListener("timeupdate", handleTimeUpdate);
            audioEl.removeEventListener("ended", handleEnded);
            audioEl.removeEventListener("error", handleError);
        };
    }, [audio?.url, isDragging, volume, onNext]);

    // Handle play/pause based on isPlaying prop
    useEffect(() => {
        if (!audioRef.current || !audio?.url) return;

        const playAudio = async () => {
            try {
                if (isPlaying) {
                    await audioRef.current.play();
                } else {
                    audioRef.current.pause();
                }
            } catch (err) {
                console.error("Playback error:", err);
                setError("Playback failed");
            }
        };

        playAudio();
    }, [isPlaying, audio?.url]);

    // Format time to MM:SS
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Handle progress bar click
    const handleProgressClick = (e) => {
        if (!progressBarRef.current || !audioRef.current || !duration) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = clickPosition * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Handle progress bar drag
    const handleProgressDragStart = (e) => {
        e.preventDefault();
        setIsDragging(true);
        document.addEventListener("mousemove", handleProgressDrag);
        document.addEventListener("mouseup", handleProgressDragEnd);
        document.addEventListener("touchmove", handleProgressDrag);
        document.addEventListener("touchend", handleProgressDragEnd);
    };

    const handleProgressDrag = (e) => {
        if (!isDragging || !progressBarRef.current || !duration) return;

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newTime = clickPosition * duration;

        setCurrentTime(newTime);
    };

    const handleProgressDragEnd = () => {
        if (isDragging && audioRef.current && duration) {
            audioRef.current.currentTime = currentTime;
        }
        setIsDragging(false);

        // Clean up event listeners
        document.removeEventListener("mousemove", handleProgressDrag);
        document.removeEventListener("mouseup", handleProgressDragEnd);
        document.removeEventListener("touchmove", handleProgressDrag);
        document.removeEventListener("touchend", handleProgressDragEnd);
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Handle mute toggle
    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
        }
    };

    // Handle play/pause click
    const handlePlayPause = () => {
        if (isLoading || error) return;
        onToggle(index);
    };

    return (
        <div className={`relative p-4 rounded-2xl border transition-all duration-300 ${isPlaying
            ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50"
            : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
            }`}>

            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                preload="metadata"
                crossOrigin="anonymous"
            >
                <source src={audio?.url} type="audio/mpeg" />
                <source src={audio?.url} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Play/Pause Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePlayPause}
                        disabled={isLoading || error}
                        className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-100 hover:to-indigo-100 hover:text-blue-600"
                            }`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={20} className="fill-current" />
                        ) : (
                            <Play size={20} className="fill-current ml-0.5" />
                        )}
                    </button>

                    {/* Skip Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onPrevious}
                            disabled={!onPrevious}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Previous track"
                        >
                            <SkipBack size={18} />
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!onNext}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Next track"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                                {audio?.name || `Track ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span className="text-gray-400">/</span>
                                <span>{formatTime(duration)}</span>

                                {/* Loading/Error Indicators */}
                                {isLoading && (
                                    <span className="text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded">
                                        Loading...
                                    </span>
                                )}
                                {error && (
                                    <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded">
                                        {error}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Volume Control (Desktop only) */}
                        {/* <div className="hidden lg:flex items-center gap-2 min-w-[140px]">
                            <button
                                onClick={toggleMute}
                                className="p-1.5 text-gray-500 hover:text-blue-600 transition hover:bg-blue-100 rounded"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <div className="relative flex-1 group">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                                    aria-label="Volume"
                                />
                                <div className="absolute inset-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full pointer-events-none"
                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                            </div>
                        </div> */}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div
                            ref={progressBarRef}
                            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden relative group/progress"
                            onClick={handleProgressClick}
                            onMouseDown={handleProgressDragStart}
                            onTouchStart={handleProgressDragStart}
                        >
                            {/* Background */}
                            <div className="absolute inset-0 bg-gray-200"></div>

                            {/* Progress */}
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100"
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                            />

                            {/* Thumb */}
                            <div
                                className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity border-2 border-blue-500"
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
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        className="p-2 text-gray-500 hover:text-blue-600 transition"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                            aria-label="Volume"
                        />
                        <div className="absolute inset-y-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full pointer-events-none"
                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[45px] text-right">
                        {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
                    </span>
                </div>
            </div>

            {/* Status Indicator */}
            {isPlaying && (
                <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            <span className="font-medium">Playing</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Waveform Animation */}
            {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl opacity-30">
                    <div className="flex items-end h-full gap-[1px] px-2">
                        {[...Array(24)].map((_, i) => {
                            const height = 30 + Math.sin(i * 0.7 + Date.now() * 0.008) * 25;
                            const delay = i * 0.05;
                            return (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t"
                                    style={{
                                        height: `${height}%`,
                                        animation: `wave 1.4s ease-in-out ${delay}s infinite alternate`,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes wave {
                    0% {
                        height: 20%;
                    }
                    100% {
                        height: 80%;
                    }
                }

                /* Custom scrollbar for range inputs */
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                input[type="range"]::-webkit-slider-thumb:hover {
                    background: #2563eb;
                    transform: scale(1.1);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                }

                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                input[type="range"]::-moz-range-thumb:hover {
                    background: #2563eb;
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}