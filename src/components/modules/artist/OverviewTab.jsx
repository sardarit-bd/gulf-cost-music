"use client";

import { ImageIcon, Music2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import PhotoGallery from "./PhotoGallery";

export default function OverviewTab({
    artist,
    previewImages,
    audioPreview,
    subscriptionPlan,
    uploadLimits,
}) {
    // ✅ ADD THIS
    const [playingIndex, setPlayingIndex] = useState(null);

    // ✅ ADD THIS
    const togglePlay = (index) => {
        setPlayingIndex((prev) => (prev === index ? null : index));
    };

    // ✅ ADD THIS
    const playNext = () => {
        if (!audioPreview?.length) return;
        setPlayingIndex((prev) =>
            prev === null || prev === audioPreview.length - 1 ? 0 : prev + 1
        );
    };

    // ✅ ADD THIS
    const playPrevious = () => {
        if (!audioPreview?.length) return;
        setPlayingIndex((prev) =>
            prev === null || prev === 0 ? audioPreview.length - 1 : prev - 1
        );
    };

    return (
        <div className="animate-fadeIn">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden bg-gray-700">
                        {previewImages.length > 0 ? (
                            <Image
                                src={previewImages[0]}
                                alt="Profile"
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-600">
                                <ImageIcon size={32} className="text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {artist.name || "Unnamed Artist"}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-gray-300 capitalize">
                                    {artist.genre || "No genre"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-300">{artist.city || "No city"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">
                                {previewImages.length}
                            </div>
                            <div className="text-xs text-gray-400">Photos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">
                                {audioPreview.length}
                            </div>
                            <div className="text-xs text-gray-400">Tracks</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Biography */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
                            Biography
                        </h3>
                        <div className="text-gray-300 leading-relaxed">
                            {artist.biography ? (
                                <p className="whitespace-pre-line">{artist.biography}</p>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                            <ImageIcon size={20} className="text-gray-500" />
                                        </div>
                                    </div>
                                    {subscriptionPlan === "free" ? (
                                        <div>
                                            <p>Biography feature requires Pro plan</p>
                                            <button
                                                onClick={() => window.open("/pricing", "_blank")}
                                                className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-medium transition"
                                            >
                                                Upgrade to Pro
                                            </button>
                                        </div>
                                    ) : (
                                        "No biography added yet."
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Audio Tracks */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
                            Audio Tracks
                            <span className="text-sm text-gray-400 ml-2">
                                ({audioPreview.length})
                            </span>
                        </h3>

                        {audioPreview.length > 0 ? (
                            <div className="space-y-3">
                                {audioPreview.map((audio, index) => (
                                    <AudioPlayer
                                        key={audio.id || index}
                                        audio={audio}
                                        index={index}
                                        isPlaying={playingIndex === index}
                                        onToggle={togglePlay}
                                        onNext={playNext}
                                        onPrevious={playPrevious}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="flex justify-center mb-2">
                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                        <Music2 size={20} className="text-gray-500" />
                                    </div>
                                </div>
                                {subscriptionPlan === "free" ? (
                                    <div>
                                        <p>Audio uploads require Pro plan</p>
                                        <button
                                            onClick={() => window.open("/pricing", "_blank")}
                                            className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-medium transition"
                                        >
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                ) : (
                                    "No audio tracks uploaded yet."
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Details */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
                            Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Name</label>
                                <p className="text-white font-medium">{artist.name || "Not set"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">City</label>
                                <p className="text-white font-medium">{artist.city || "Not set"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Genre</label>
                                <p className="text-white font-medium capitalize">
                                    {artist.genre || "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
                            Photos
                            <span className="text-sm text-gray-400 ml-2">
                                ({previewImages.length}/{uploadLimits.photos})
                            </span>
                        </h3>

                        <PhotoGallery images={previewImages} subscriptionPlan={subscriptionPlan} />
                    </div>
                </div>
            </div>
        </div>
    );
}
