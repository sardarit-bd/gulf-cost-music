"use client";

import {
    Camera,
    Eye,
    Grid,
    Headphones,
    Image,
    List,
    Music,
    Play,
    Plus,
    Trash2,
    Upload
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MediaGalleryPreview({ photos = [], audioFile = null }) {
    const [viewMode, setViewMode] = useState("grid");
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock audio file if none provided
    const defaultAudio = {
        url: "/demo-audio.mp3",
        name: "Studio Demo Track",
        duration: "3:45",
        plays: 124
    };

    const displayAudio = audioFile || defaultAudio;
    const photoCount = photos.length;
    const maxPhotos = 5;
    const remainingPhotos = maxPhotos - photoCount;

    const handlePlayAudio = () => {
        setIsPlaying(!isPlaying);
        // In real app, implement actual audio player
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Media Gallery</h2>
                        <p className="text-sm text-gray-600 mt-1">Showcase your studio & work</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : "text-gray-600"}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : "text-gray-600"}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <Link
                            href="/dashboard/studio/media/upload"
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Upload
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Photo Gallery Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Studio Photos</h3>
                                <p className="text-sm text-gray-600">
                                    {photoCount}/{maxPhotos} uploaded • {remainingPhotos} remaining
                                </p>
                            </div>
                        </div>

                        {photoCount > 0 && (
                            <Link
                                href="/dashboard/studio/media/gallery"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                View All →
                            </Link>
                        )}
                    </div>

                    {photoCount === 0 ? (
                        <EmptyPhotosState />
                    ) : (
                        <PhotoGallery
                            photos={photos}
                            viewMode={viewMode}
                            maxDisplay={viewMode === "grid" ? 4 : 3}
                        />
                    )}
                </div>

                {/* Audio Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                <Music className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Audio Sample</h3>
                                <p className="text-sm text-gray-600">
                                    Showcase your production quality
                                </p>
                            </div>
                        </div>

                        {displayAudio.url && (
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Replace Audio →
                            </button>
                        )}
                    </div>

                    {!displayAudio.url ? (
                        <EmptyAudioState />
                    ) : (
                        <AudioPlayer
                            audio={displayAudio}
                            isPlaying={isPlaying}
                            onPlay={handlePlayAudio}
                        />
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{photoCount}</p>
                        <p className="text-xs text-gray-600">Photos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{displayAudio.url ? 1 : 0}</p>
                        <p className="text-xs text-gray-600">Audio Samples</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{displayAudio.plays || 0}</p>
                        <p className="text-xs text-gray-600">Total Plays</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PhotoGallery({ photos, viewMode, maxDisplay }) {
    const displayedPhotos = photos.slice(0, maxDisplay);

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {displayedPhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img
                            src={photo.url || "/placeholder.jpg"}
                            alt={`Studio photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        <button className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {/* Add Photo Button */}
                {photos.length < 5 && (
                    <Link
                        href="/dashboard/studio/media/upload"
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center transition-colors"
                    >
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Add Photo</span>
                    </Link>
                )}
            </div>
        );
    }

    // List View
    return (
        <div className="space-y-3">
            {displayedPhotos.map((photo, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={photo.url || "/placeholder.jpg"}
                            alt={`Studio photo ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">Studio Photo {index + 1}</p>
                        <p className="text-sm text-gray-600">Uploaded 2 days ago</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function AudioPlayer({ audio, isPlaying, onPlay }) {
    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onPlay}
                        className="w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg"
                    >
                        {isPlaying ? (
                            <div className="w-5 h-5 bg-white"></div>
                        ) : (
                            <Play className="w-6 h-6 ml-1" />
                        )}
                    </button>

                    <div>
                        <h4 className="font-bold text-gray-900">{audio.name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">{audio.duration}</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{audio.plays} plays</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-purple-600">Demo Track</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                        <Headphones className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>0:00</span>
                    <span>{audio.duration}</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: isPlaying ? "45%" : "0%" }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

function EmptyPhotosState() {
    return (
        <Link
            href="/dashboard/studio/media/upload"
            className="block border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-8 text-center transition-colors"
        >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Photos Uploaded</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Upload photos of your studio space and equipment to attract clients
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Upload Studio Photos</span>
            </div>
        </Link>
    );
}

function EmptyAudioState() {
    return (
        <Link
            href="/dashboard/studio/media/upload"
            className="block border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 rounded-2xl p-8 text-center transition-colors"
        >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Audio Sample</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Add an audio sample to showcase your production quality
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-600">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Upload Audio Sample</span>
            </div>
        </Link>
    );
}