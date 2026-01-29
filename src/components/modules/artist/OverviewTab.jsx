"use client";

import { ImageIcon, Music2, User } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import PhotoGallery from "./PhotoGallery";

export default function OverviewTab({
  artist,
  previewImages = [],
  audioPreview = [],
  subscriptionPlan,
  uploadLimits = { photos: 5, audios: 5 },
  listings,
  loadingListings,
}) {
  const [playingIndex, setPlayingIndex] = useState(null);

  const togglePlay = (index) => {
    setPlayingIndex((prev) => (prev === index ? null : index));
  };

  const playNext = () => {
    if (!audioPreview?.length) return;
    setPlayingIndex((prev) =>
      prev === null || prev === audioPreview.length - 1 ? 0 : prev + 1,
    );
  };

  const playPrevious = () => {
    if (!audioPreview?.length) return;
    setPlayingIndex((prev) =>
      prev === null || prev === 0 ? audioPreview.length - 1 : prev - 1,
    );
  };

  // Filter out empty/null image URLs
  const validPreviewImages = useMemo(() => {
    return previewImages.filter((img) => {
      if (!img) return false;
      if (typeof img === "string") {
        return img.trim() !== "" && img !== "undefined" && img !== "null";
      }
      if (typeof img === "object") {
        return img.url && img.url.trim() !== "";
      }
      return true;
    });
  }, [previewImages]);

  // Get first valid image for profile
  const firstImage = useMemo(() => {
    if (validPreviewImages.length > 0) {
      const img = validPreviewImages[0];
      if (typeof img === "string") return img;
      if (typeof img === "object" && img.url) return img.url;
    }
    return null;
  }, [validPreviewImages]);

  // Filter out empty/null audio files
  const validAudioPreview = useMemo(() => {
    return audioPreview.filter((audio) => {
      if (!audio) return false;
      if (typeof audio === "string") {
        return audio.trim() !== "" && audio !== "undefined" && audio !== "null";
      }
      if (typeof audio === "object") {
        return audio.url && audio.url.trim() !== "";
      }
      return true;
    });
  }, [audioPreview]);

  // Function to format state name (if available)
  const getDisplayState = () => {
    if (!artist?.state) return "Not set";

    // Format state name properly
    const stateMap = {
      louisiana: "Louisiana",
      mississippi: "Mississippi",
      alabama: "Alabama",
      florida: "Florida",
    };

    const stateKey = artist.state.toLowerCase();
    return stateMap[stateKey] || artist.state;
  };

  // Function to format city name
  const getDisplayCity = () => {
    if (!artist?.city) return "Not set";

    // Capitalize first letter of each word
    return artist.city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden bg-gray-700">
            {firstImage ? (
              <Image
                src={firstImage}
                alt="Profile"
                fill
                className="object-cover"
                sizes="96px"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-600">
                <User size={32} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {artist?.name || "Unnamed Artist"}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300 capitalize">
                  {artist?.genre || "No genre"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">{getDisplayCity()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">{getDisplayState()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {validPreviewImages.length}
              </div>
              <div className="text-xs text-gray-400">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {validAudioPreview.length}
              </div>
              <div className="text-xs text-gray-400">Tracks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Biography - ❌ Pro plan restriction removed */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-yellow-500 rounded"></div>
              Biography
            </h3>
            <div className="text-gray-300 leading-relaxed">
              {artist?.biography ? (
                <p className="whitespace-pre-line">{artist.biography}</p>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-500" />
                    </div>
                  </div>
                  {/* ❌ Pro upgrade prompt removed - সবাই বায়োগ্রাফি লিখতে পারবে */}
                  <p>No biography added yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Audio Tracks - ❌ Pro plan restriction removed */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-yellow-500 rounded"></div>
              Audio Tracks
              <span className="text-sm text-gray-400 ml-2">
                ({validAudioPreview.length}/{uploadLimits?.audios || 5})
              </span>
            </h3>

            {validAudioPreview.length > 0 ? (
              <div className="space-y-3">
                {validAudioPreview.map((audio, index) => (
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
                {/* ❌ Pro upgrade prompt removed - সবাই অডিও আপলোড করতে পারবে */}
                <p>No audio tracks uploaded yet.</p>
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
                <p className="text-white font-medium">
                  {artist?.name || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">State</label>
                <p className="text-white font-medium">{getDisplayState()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">City</label>
                <p className="text-white font-medium">{getDisplayCity()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Genre</label>
                <p className="text-white font-medium capitalize">
                  {artist?.genre || "Not set"}
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
                ({validPreviewImages.length}/{uploadLimits?.photos || 5})
              </span>
            </h3>

            <PhotoGallery
              images={validPreviewImages}
              subscriptionPlan={subscriptionPlan}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
