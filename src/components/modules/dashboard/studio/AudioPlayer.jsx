"use client";

import {
    Clock,
    Download,
    Music,
    Pause,
    Play,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
    Trash2,
    Volume2,
    VolumeX
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({
    audio,
    isPlaying: externalIsPlaying,
    onPlay: externalOnPlay,
    onDelete,
    editable = true
}) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [internalIsPlaying, setInternalIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const userInteractedRef = useRef(false);

    // Determine which isPlaying state to use
    const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (audioRef.current && audio?.url) {
            // Reset when audio changes
            setCurrentTime(0);
            setDuration(0);
            setInternalIsPlaying(false);

            // Load new audio
            audioRef.current.src = audio.url;
            audioRef.current.load();
        }
    }, [audio?.url]);

    // User interaction handler
    const handleUserInteraction = () => {
        userInteractedRef.current = true;
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handlePlayPause = async () => {
        // Mark user interaction
        handleUserInteraction();

        if (!audioRef.current) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
                if (externalOnPlay) {
                    externalOnPlay(false);
                } else {
                    setInternalIsPlaying(false);
                }
            } else {
                // Check if we can play (for autoplay policies)
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            if (externalOnPlay) {
                                externalOnPlay(true);
                            } else {
                                setInternalIsPlaying(true);
                            }
                        })
                        .catch(error => {
                            console.error("Play failed:", error);
                            // Show user they need to interact
                            alert("Please click the play button again to start audio");
                        });
                }
            }
        } catch (error) {
            console.error("Play/Pause error:", error);
        }
    };

    const handleSeek = (e) => {
        const value = parseFloat(e.target.value);
        setCurrentTime(value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
        }
    };

    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        setIsMuted(value === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleDownload = () => {
        if (!audio?.url) return;

        const link = document.createElement('a');
        link.href = audio.url;
        link.download = audio.name || 'audio-sample';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEnded = () => {
        if (externalOnPlay) {
            externalOnPlay(false);
        } else {
            setInternalIsPlaying(false);
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime += 10;
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime -= 10;
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // Handle click on the entire player for user interaction
    const handlePlayerClick = () => {
        handleUserInteraction();
    };

    return (
        <div
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
            onClick={handlePlayerClick}
        >
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={audio?.url}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onPlay={() => {
                    if (externalOnPlay) {
                        externalOnPlay(true);
                    } else {
                        setInternalIsPlaying(true);
                    }
                }}
                onPause={() => {
                    if (externalOnPlay) {
                        externalOnPlay(false);
                    } else {
                        setInternalIsPlaying(false);
                    }
                }}
                className="hidden"
                controls // Add controls for debugging
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow">
                        <Music className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                            {audio?.name || "Studio Audio Sample"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                MP3
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(duration)}
                            </span>
                            <span className="text-xs text-gray-600">
                                Demo Track
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {editable && (
                        <button
                            onClick={handleDownload}
                            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    )}
                    {editable && onDelete && (
                        <button
                            onClick={onDelete}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Player Controls */}
            <div className="space-y-6">
                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setShuffle(!shuffle)}
                        className={`p-2 rounded-lg ${shuffle ? 'text-purple-600 bg-purple-100' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Shuffle className="w-5 h-5" />
                    </button>

                    <button
                        onClick={skipBackward}
                        className="p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl"
                    >
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        {isPlaying ? (
                            <Pause className="w-7 h-7" />
                        ) : (
                            <Play className="w-7 h-7 ml-1" />
                        )}
                    </button>

                    <button
                        onClick={skipForward}
                        className="p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setRepeat(!repeat)}
                        className={`p-2 rounded-lg ${repeat ? 'text-purple-600 bg-purple-100' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Repeat className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                    />
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        className="p-2 text-gray-600 hover:text-purple-600"
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                        ) : (
                            <Volume2 className="w-5 h-5" />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600"
                    />
                    <span className="text-sm text-gray-600 w-12 text-right">
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                    </span>
                </div>
            </div>

            {/* Audio Stats */}
            <div className="mt-6 pt-6 border-t border-purple-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Format</p>
                        <p className="font-semibold text-gray-900">MP3</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Bitrate</p>
                        <p className="font-semibold text-gray-900">320 kbps</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Sample Rate</p>
                        <p className="font-semibold text-gray-900">44.1 kHz</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Plays</p>
                        <p className="font-semibold text-gray-900">124</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {editable && (
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex-1 px-4 py-3 bg-white text-purple-600 border border-purple-300 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download Sample
                    </button>
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="flex-1 px-4 py-3 bg-red-50 text-red-600 border border-red-300 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Audio
                        </button>
                    )}
                </div>
            )}

            {/* Debug info (remove in production) */}
            <div className="mt-4 text-xs text-gray-500">
                Audio URL: {audio?.url ? "Loaded" : "Not loaded"}
            </div>
        </div>
    );
}