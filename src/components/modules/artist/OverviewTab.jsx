"use client";

import { ImageIcon, Music2, User } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import AudioPlayer from "./AudioPlayer";

export default function OverviewTab({
  user,
  artist,
  previewImages = [],
  audioPreview = [],
  subscriptionPlan,
  uploadLimits = { photos: 5, audios: 5 },
  listings,
  loadingListings,
}) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [likedTracks, setLikedTracks] = useState([]);

  const togglePlay = (index) => {
    if (playingIndex === index) {
      setPlayingIndex(null); // Pause
    } else {
      setPlayingIndex(index); // Play new track
    }
  };

  const toggleLike = (index) => {
    setLikedTracks(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const playNext = () => {
    if (!validAudioPreview.length) return;
    const nextIndex = playingIndex === null || playingIndex === validAudioPreview.length - 1
      ? 0
      : playingIndex + 1;
    setPlayingIndex(nextIndex);
  };

  const playPrevious = () => {
    if (!validAudioPreview.length) return;
    const prevIndex = playingIndex === null || playingIndex === 0
      ? validAudioPreview.length - 1
      : playingIndex - 1;
    setPlayingIndex(prevIndex);
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

    return artist.city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="128px"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-blue-400" />
                </div>
              )}
            </div>
            {artist?.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                <div className="w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {artist?.name || "Unnamed Artist"}
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-medium capitalize">
                      {artist?.genre || "No genre"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">{getDisplayCity()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="font-medium">{getDisplayState()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {validPreviewImages.length}
                  </div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {validAudioPreview.length}
                  </div>
                  <div className="text-sm text-gray-600">Tracks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Biography */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Biography
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Edit
              </button>
            </div>
            <div className="text-gray-700 leading-relaxed">
              {artist?.biography ? (
                <p className="whitespace-pre-line">{artist.biography}</p>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-blue-400" />
                    </div>
                  </div>
                  <p className="text-lg mb-2">No biography added yet</p>
                  <p className="text-sm">Tell your fans about your musical journey</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Add Biography
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Audio Tracks */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                Audio Tracks
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({validAudioPreview.length}/{uploadLimits?.audios || 5})
                </span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Manage Tracks
              </button>
            </div>

            {validAudioPreview.length > 0 ? (
              <div className="space-y-4">
                {validAudioPreview.map((audio, index) => (
                  <AudioPlayer
                    key={index}
                    audio={audio}
                    index={index}
                    isPlaying={playingIndex === index}
                    isLiked={likedTracks.includes(index)}
                    onToggle={togglePlay}
                    onLike={toggleLike}
                    onNext={playNext}
                    onPrevious={playPrevious}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center">
                    <Music2 size={24} className="text-emerald-400" />
                  </div>
                </div>
                <p className="text-lg mb-2">No audio tracks uploaded yet</p>
                <p className="text-sm mb-4">Share your music with the world</p>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                  <Music2 className="w-4 h-4" />
                  Upload Your First Track
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Details Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
              Details
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Name</label>
                <p className="text-lg font-semibold text-gray-900">
                  {artist?.name || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Location</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{getDisplayCity()}</p>
                    <p className="text-sm text-gray-600">{getDisplayState()}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Genre</label>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span className="font-medium text-gray-900 capitalize">
                    {artist?.genre || "Not set"}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Verification</label>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${artist?.isVerified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${artist?.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  <span className="font-medium">
                    {artist?.isVerified ? 'Verified Artist' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photos Gallery */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                Photos
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({validPreviewImages.length}/{uploadLimits?.photos || 5})
                </span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Add Photos
              </button>
            </div>

            {validPreviewImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {validPreviewImages.slice(0, 4).map((img, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-100 group relative">
                    <Image
                      src={typeof img === 'object' ? img.url : img}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {index === 3 && validPreviewImages.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          +{validPreviewImages.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-rose-50 rounded-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-rose-400" />
                  </div>
                </div>
                <p className="text-lg mb-2">No photos uploaded yet</p>
                <p className="text-sm">Add photos to showcase your brand</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}