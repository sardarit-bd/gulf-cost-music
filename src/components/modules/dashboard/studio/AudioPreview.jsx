"use client";

import { useState, useRef } from "react";
import {
    Headphones,
    Play,
    Pause,
    Music,
    File,
    Clock,
    Volume2,
    Download,
    Trash2,
    X
} from "lucide-react";

export default function AudioPreview({ file, onRemove, editable = true }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const audioRef = useRef(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (!duration) setDuration(audioRef.current.duration || 0);
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
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleDownload = () => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getFileType = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        return ext.toUpperCase();
    };

    const getFileSize = (size) => {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        }
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={file ? URL.createObjectURL(file) : ""}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Music className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 truncate max-w-xs">
                            {file?.name || "Audio Preview"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {getFileType(file?.name || "")}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                                <File className="w-3 h-3" />
                                {getFileSize(file?.size || 0)}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>
                </div>

                {editable && onRemove && (
                    <button
                        onClick={onRemove}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Audio Player */}
            <div className="space-y-4">
                {/* Play/Pause Button */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={handlePlayPause}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                            }`}
                    >
                        {isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                        ) : (
                            <Play className="w-6 h-6 text-white ml-1" />
                        )}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600"
                    />
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600"
                    />
                    <span className="text-xs text-gray-600 w-10">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>

            {/* Audio Info */}
            <div className="mt-6 pt-6 border-t border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Audio Information</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">File Type</p>
                        <p className="font-medium text-gray-900">{getFileType(file?.name || "")}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Size</p>
                        <p className="font-medium text-gray-900">{getFileSize(file?.size || 0)}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Sample Rate</p>
                        <p className="font-medium text-gray-900">44.1 kHz</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600">Bit Depth</p>
                        <p className="font-medium text-gray-900">16-bit</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                <button
                    onClick={handleDownload}
                    className="flex-1 px-4 py-3 bg-white text-purple-600 border border-purple-300 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
                {editable && (
                    <button className="flex-1 px-4 py-3 bg-red-50 text-red-600 border border-red-300 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

// Simplified version for upload preview
export function SimpleAudioPreview({ file }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const getFileSize = (size) => {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <audio
                ref={audioRef}
                src={file ? URL.createObjectURL(file) : ""}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            <div className="flex items-center gap-4">
                <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5" />
                    ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Headphones className="w-4 h-4 text-purple-600" />
                        <p className="font-medium text-gray-900 truncate">{file?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">
                            {getFileSize(file?.size || 0)}
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-purple-600 font-medium">
                            Ready to upload
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}