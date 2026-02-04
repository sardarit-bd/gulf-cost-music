"use client";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Headphones,
  Heart,
  Mail,
  MapPin,
  Music,
  Pause,
  Phone,
  Play,
  Share2,
  Star,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function StudioProfile() {
  const params = useParams();
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState("0:00");
  const [audioDuration, setAudioDuration] = useState("0:00");
  const [audioVolume, setAudioVolume] = useState(0.7);
  const audioRef = useRef(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const { state, city, studioId } = params;

  useEffect(() => {
    if (studioId) {
      fetchStudio();
    }
  }, [studioId]);

  const fetchStudio = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/${studioId}`,
      );
      const data = await res.json();
      if (data.success) setStudio(data.data);
    } catch (error) {
      console.error("Error fetching studio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Audio Player Functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setAudioProgress((current / duration) * 100);
      setAudioCurrentTime(formatTime(current));
      setAudioDuration(formatTime(duration));
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setAudioProgress(e.target.value);
    }
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value / 100;
    setAudioVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Lightbox Functions
  const openLightbox = (index) => {
    setSelectedPhotoIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = "auto";
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex < studio.photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-400 text-lg">Loading studio profile...</p>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <Music size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Studio Not Found</h1>
          <button
            onClick={() => router.push(`/studios/${state}/${city}`)}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105"
          >
            ← Back to {city}
          </button>
        </div>
      </div>
    );
  }

  const decodedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const decodedState = state.charAt(0).toUpperCase() + state.slice(1);

  return (
    <>
      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && studio.photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl z-50 hover:text-yellow-400 transition"
          >
            ✕
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50 hover:text-yellow-400 transition disabled:opacity-50"
            disabled={selectedPhotoIndex === 0}
          >
            ←
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50 hover:text-yellow-400 transition disabled:opacity-50"
            disabled={selectedPhotoIndex === studio.photos.length - 1}
          >
            →
          </button>

          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto p-4">
            <Image
              src={studio.photos[selectedPhotoIndex].url}
              alt={`Studio photo ${selectedPhotoIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-lg">
            {selectedPhotoIndex + 1} / {studio.photos.length}
          </div>
        </div>
      )}

      {/* Audio Player */}
      {studio.audioFile && (
        <audio
          ref={audioRef}
          src={studio.audioFile.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setAudioDuration(formatTime(audioRef.current.duration));
            }
          }}
          preload="metadata"
        />
      )}

      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black mt-[90px]">
        {/* Hero Banner */}
        <div className="relative h-80 sm:h-96 md:h-[480px] overflow-hidden">
          <div className="absolute inset-0">
            {studio.photos?.[0] && (
              <Image
                src={studio.photos[0].url}
                alt={studio.name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent"></div>
          </div>

          <div className="relative container mx-auto h-full flex items-end pb-6 sm:pb-8 px-4 sm:px-6">
            {/* Navigation */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
              <button
                onClick={() => router.push(`/studios/${state}/${city}`)}
                className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-all duration-300 bg-black/30 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/10 hover:border-yellow-400/30 text-sm sm:text-base"
              >
                <ArrowLeft size={18} className="sm:w-5" />
                <span className="hidden xs:inline">Back to {decodedCity}</span>
                <span className="xs:hidden">Back</span>
              </button>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 sm:p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                    isFavorite
                      ? "bg-red-500/20 border-red-400/30 text-red-400"
                      : "bg-black/30 border-white/10 text-white/90 hover:border-red-400/30 hover:text-red-400"
                  }`}
                >
                  <Heart
                    size={18}
                    className="sm:w-5"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
                <button className="p-2 sm:p-3 rounded-lg backdrop-blur-sm bg-black/30 border border-white/10 text-white/90 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300">
                  <Share2 size={18} className="sm:w-5" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-end gap-4 sm:gap-6 text-white w-full">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-yellow-400 shadow-2xl">
                  <Image
                    src={studio.photos?.[0]?.url || "/default-studio.jpg"}
                    alt={studio.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Verification Badge */}
                {studio.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 sm:p-2 rounded-full border-2 sm:border-4 border-gray-900">
                    <CheckCircle size={16} className="sm:w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 pb-1 sm:pb-2 min-w-0">
                <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words">
                    {studio.name}
                  </h1>

                  {studio.isFeatured && (
                    <span className="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
                      <Star size={12} className="sm:w-4" fill="currentColor" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4 text-white/80 text-sm sm:text-base">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full w-fit">
                    <MapPin size={16} className="sm:w-4 text-yellow-400" />
                    <span className="capitalize font-medium">
                      {studio.city}, {studio.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Music size={16} className="sm:w-4 text-blue-400" />
                      <span>{studio.services?.length || 0} Services</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span>{studio.photos?.length || 0} Photos</span>
                    </div>
                    {studio.audioFile && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Headphones
                          size={16}
                          className="sm:w-4 text-purple-400"
                        />
                        <span>Audio Sample</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Audio Player Card */}
              {studio.audioFile && (
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Headphones className="text-yellow-400" />
                    Audio Sample
                  </h3>

                  <div className="space-y-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlayPause}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-4 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition flex items-center justify-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={20} />
                          Pause Sample
                        </>
                      ) : (
                        <>
                          <Play size={20} />
                          Play Sample
                        </>
                      )}
                    </button>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{audioCurrentTime}</span>
                        <span>{audioDuration}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioProgress}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                      />
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioVolume * 100}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Card */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Contact & Booking
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50">
                    <Mail size={18} className="text-yellow-400" />
                    <span className="font-medium truncate">
                      {studio.user?.email || "Email not available"}
                    </span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg font-semibold hover:from-blue-400 hover:to-blue-500 transition flex items-center justify-center gap-2">
                    <Calendar size={18} />
                    Book Session
                  </button>

                  <button className="w-full bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2">
                    <Phone size={18} />
                    Call Studio
                  </button>
                </div>
              </div>

              {/* Services Card */}
              {studio.services && studio.services.length > 0 && (
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Services & Pricing
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {studio.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-300 group"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-white group-hover:text-yellow-400 transition-colors truncate">
                            {service.service}
                          </div>
                        </div>
                        <span className="font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm whitespace-nowrap flex-shrink-0">
                          ${service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Card */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Studio Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="text-xl font-bold text-yellow-400">
                      {studio.services?.length || 0}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">Services</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="text-xl font-bold text-green-400">
                      {studio.photos?.length || 0}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">Photos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="text-xl font-bold text-purple-400">
                      {studio.audioFile ? "Yes" : "No"}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">Audio</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="text-xl font-bold text-pink-400">
                      {studio.isVerified ? "✓" : "✗"}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">Verified</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl mb-6 sm:mb-8 border border-gray-700/50 overflow-hidden">
                <div className="border-b border-gray-700/50">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {[
                      {
                        id: "portfolio",
                        label: "Portfolio",
                        icon: Music,
                        count: studio.photos?.length,
                      },
                      { id: "about", label: "About", icon: MapPin },
                      {
                        id: "services",
                        label: "Services",
                        icon: DollarSign,
                        count: studio.services?.length,
                      },
                      {
                        id: "equipment",
                        label: "Equipment",
                        icon: Headphones,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 whitespace-nowrap border-b-2 text-sm sm:text-base ${
                          activeTab === tab.id
                            ? "text-yellow-400 border-yellow-400 bg-yellow-400/5"
                            : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
                        }`}
                      >
                        <tab.icon size={18} className="sm:w-5" />
                        {tab.label}
                        {tab.count > 0 && (
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                              activeTab === tab.id
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 sm:p-6 md:p-8">
                  {/* Portfolio Tab */}
                  {activeTab === "portfolio" && (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        Studio Portfolio
                      </h3>
                      <p className="text-gray-400 mb-4 sm:mb-6">
                        Explore {studio.name}'s recording space and equipment
                      </p>

                      {studio.photos && studio.photos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {studio.photos.map((photo, index) => (
                            <div
                              key={index}
                              onClick={() => openLightbox(index)}
                              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                            >
                              <Image
                                src={photo.url}
                                alt={`Studio photo ${index + 1}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <span className="text-white font-semibold">
                                  Studio View {index + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 sm:py-16">
                          <Music
                            size={48}
                            className="mx-auto mb-4 text-gray-500"
                          />
                          <p className="text-gray-400 text-lg">
                            No portfolio photos available yet.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        About {studio.name}
                      </h3>
                      <p className="text-gray-400 mb-4 sm:mb-6">
                        Learn about the studio and its facilities
                      </p>

                      <div className="space-y-6">
                        <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 border border-gray-600/30">
                          <h4 className="text-lg font-semibold text-white mb-3">
                            Studio Description
                          </h4>
                          <p className="text-gray-300 leading-relaxed">
                            {studio.biography ||
                              "This professional recording studio offers state-of-the-art equipment and experienced engineers to bring your music to life. Located in the heart of the Gulf Coast music scene."}
                          </p>
                        </div>

                        {/* Studio Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-600/30">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-3">
                              <MapPin className="text-yellow-400" size={20} />
                              Location Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between p-2 bg-gray-600/30 rounded-lg">
                                <span className="text-gray-300">City</span>
                                <span className="text-white font-semibold capitalize">
                                  {studio.city}
                                </span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-600/30 rounded-lg">
                                <span className="text-gray-300">State</span>
                                <span className="text-white font-semibold">
                                  {studio.state}
                                </span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-600/30 rounded-lg">
                                <span className="text-gray-300">Region</span>
                                <span className="text-white font-semibold">
                                  Gulf Coast
                                </span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-600/30 rounded-lg">
                                <span className="text-gray-300">Status</span>
                                <span
                                  className={`font-semibold ${studio.isActive ? "text-green-400" : "text-red-400"}`}
                                >
                                  {studio.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-600/30">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-3">
                              <Clock className="text-blue-400" size={20} />
                              Studio Hours
                            </h4>
                            <div className="space-y-2">
                              {[
                                {
                                  day: "Monday - Friday",
                                  hours: "9:00 AM - 10:00 PM",
                                },
                                {
                                  day: "Saturday",
                                  hours: "10:00 AM - 8:00 PM",
                                },
                                { day: "Sunday", hours: "12:00 PM - 6:00 PM" },
                              ].map((schedule, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between p-2 bg-gray-600/30 rounded-lg"
                                >
                                  <span className="text-gray-300">
                                    {schedule.day}
                                  </span>
                                  <span className="text-white font-semibold">
                                    {schedule.hours}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Services Tab */}
                  {activeTab === "services" && (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        Studio Services
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Professional recording and production services
                      </p>

                      {studio.services && studio.services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {studio.services.map((service, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-300 group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                  {service.service}
                                </h4>
                                <span className="text-2xl font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg">
                                  ${service.price}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">
                                Professional {service.service.toLowerCase()}{" "}
                                service with state-of-the-art equipment and
                                experienced engineers.
                              </p>
                              <button className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition">
                                Book This Service
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <DollarSign
                            size={48}
                            className="mx-auto mb-4 text-gray-500"
                          />
                          <p className="text-gray-400 text-lg">
                            No services listed yet.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Equipment Tab */}
                  {activeTab === "equipment" && (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        Studio Equipment
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Professional recording gear and technology
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Typical Studio Equipment */}
                        {[
                          {
                            name: "Digital Audio Workstation",
                            brand:
                              "Pro Tools | Ultimate, Logic Pro, Ableton Live",
                            icon: "💻",
                          },
                          {
                            name: "Microphones",
                            brand: "Neumann, Shure, AKG, Sony, Rode",
                            icon: "🎤",
                          },
                          {
                            name: "Studio Monitors",
                            brand: "Yamaha HS8, KRK, Genelec, Adam Audio",
                            icon: "🔊",
                          },
                          {
                            name: "Audio Interface",
                            brand: "Universal Audio Apollo, Focusrite, Apogee",
                            icon: "🎛️",
                          },
                          {
                            name: "Mixing Console",
                            brand: "SSL, Neve, API, Allen & Heath",
                            icon: "🎚️",
                          },
                          {
                            name: "Outboard Gear",
                            brand:
                              "Universal Audio, Warm Audio, Empirical Labs",
                            icon: "⚡",
                          },
                          {
                            name: "Acoustic Treatment",
                            brand: "Auralex, GIK Acoustics, Primacoustic",
                            icon: "🏢",
                          },
                          {
                            name: "Instruments",
                            brand: "Fender, Gibson, Roland, Nord, Korg",
                            icon: "🎹",
                          },
                        ].map((gear, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-300 group"
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <div className="text-2xl">{gear.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                  {gear.name}
                                </h4>
                                <p className="text-gray-400 text-sm mt-1">
                                  {gear.brand}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking CTA */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-yellow-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Ready to Record?
                    </h3>
                    <p className="text-gray-300">
                      Book your session today and bring your music to life
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition transform hover:scale-105">
                      Book Studio Session
                    </button>
                    <button className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition">
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
