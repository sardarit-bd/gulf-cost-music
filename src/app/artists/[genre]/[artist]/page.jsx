"use client";
import { ChevronLeft, ChevronRight, Download, Headphones, Maximize2, Music, Pause, Play, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ArtistProfile() {
  const { genre, artist: artistID } = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // ✅ Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch artist from backend
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/${artistID}`);
        const data = await res.json();

        if (res.ok && data.data?.artist) {
          setArtist(data.data.artist);
        } else {
          setArtist(null);
        }
      } catch (err) {
        console.error("Error fetching artist:", err);
      } finally {
        setLoading(false);
      }
    };

    if (artistID) fetchArtist();
  }, [artistID]);

  // ✅ Lightbox functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? artist.photos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === artist.photos.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Prepare audio tracks from actual mp3Files data
  const audioTracks = artist?.mp3Files?.map((file, index) => ({
    id: file._id,
    title: file.originalName.replace('.mp3', '').replace(/_/g, ' '),
    src: file.url,
    originalName: file.originalName,
    duration: "3:45" // You can get actual duration if available
  })) || [];

  // Audio player controls
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

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % audioTracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + audioTracks.length) % audioTracks.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = (e) => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const seekTime = percent * audio.duration;
      audio.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadTrack = (trackUrl, fileName) => {
    const link = document.createElement('a');
    link.href = trackUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="brandBg text-white min-h-screen flex justify-center items-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg text-yellow-400">Loading artist details...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center pt-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center px-4">Artist Not Found 😢</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="brandBg min-h-screen text-white pt-16">
      {/* ✅ Lightbox Modal */}
      {lightboxOpen && artist.photos && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {artist.photos.length}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Main image */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto p-4">
            <div className="relative w-full h-full">
              <Image
                src={artist.photos[currentImageIndex].url}
                alt={`${artist.name} photo ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      {audioTracks.length > 0 && (
        <audio
          ref={audioRef}
          src={audioTracks[currentTrackIndex]?.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
          onLoadedMetadata={handleTimeUpdate}
        />
      )}

      {/* ====== Banner Section ====== */}
      <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={
            artist.photos?.[0]?.url ||
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=60"
          }
          alt={artist.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>

        <div className="container relative mx-auto h-full flex flex-col justify-end pb-6 sm:pb-8 px-4 sm:px-6">
          <div className="flex items-end gap-3 sm:gap-4 md:gap-6">
            <div className="border-2 sm:border-3 border-yellow-400 w-24 h-28 sm:w-32 sm:h-36 md:w-40 md:h-44 lg:w-48 lg:h-52 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={artist.photos?.[0]?.url || "/default.jpg"}
                alt={artist.name}
                width={200}
                height={250}
                className="object-cover h-full w-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 brandColor break-words">
                {artist.name}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 capitalize">{artist.genre} Artist</p>

              {/* Audio Stats */}
              {audioTracks.length > 0 && (
                <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-300 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Music size={14} className="sm:w-4" />
                    <span>{audioTracks.length} Tracks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones size={14} className="sm:w-4" />
                    <span>Now Playing</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== Info Section ====== */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{artist.name}</h2>
              <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 capitalize">
                {artist.genre} • {artist.city}
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {artist.biography || "No biography available."}
              </p>
            </div>

            {/* Audio Stats Card */}
            {audioTracks.length > 0 && (
              <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700 flex-shrink-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {audioTracks.length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">Music Tracks</p>
                </div>
              </div>
            )}
          </div>

          {/* ====== Photos Gallery Section - FIXED with Lightbox ====== */}
          {artist.photos?.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
                <div className="p-1 sm:p-2 bg-yellow-500 rounded-lg">
                  <span className="text-black text-sm sm:text-base font-bold">📸</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Gallery</h3>
                <span className="bg-yellow-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {artist.photos.length} photos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {artist.photos.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="group relative w-full h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <Image
                      src={p.url}
                      alt={`${artist.name} photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 sm:pb-4">
                      <span className="text-white text-xs sm:text-sm font-medium">Photo {i + 1}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== Modern Audio Player Section ====== */}
          {audioTracks.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
                <div className="p-1 sm:p-2 bg-yellow-500 rounded-lg">
                  <Music size={18} className="sm:w-6 text-black" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Music Collection</h3>
                <span className="bg-yellow-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {audioTracks.length} tracks
                </span>
              </div>

              {/* Main Audio Player */}
              <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700 mb-6 sm:mb-8">
                {/* Now Playing */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music size={20} className="sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-white truncate">
                        {audioTracks[currentTrackIndex]?.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Track {currentTrackIndex + 1} of {audioTracks.length}
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => downloadTrack(
                      audioTracks[currentTrackIndex]?.src,
                      audioTracks[currentTrackIndex]?.originalName
                    )}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm sm:text-base flex-shrink-0"
                  >
                    <Download size={14} className="sm:w-4" />
                    Download
                  </button>
                </div>

                {/* Progress Bar with Time */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div
                    className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1">
                    <Volume2 size={16} className="sm:w-5 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 sm:w-24 accent-yellow-500"
                    />
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2">
                    <button
                      onClick={prevTrack}
                      className="p-2 sm:p-3 text-gray-400 hover:text-white transition"
                      disabled={audioTracks.length <= 1}
                    >
                      <SkipBack size={20} className="sm:w-6" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="p-3 sm:p-4 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition transform hover:scale-105"
                    >
                      {isPlaying ? <Pause size={24} className="sm:w-8" /> : <Play size={24} className="sm:w-8" />}
                    </button>

                    <button
                      onClick={nextTrack}
                      className="p-2 sm:p-3 text-gray-400 hover:text-white transition"
                      disabled={audioTracks.length <= 1}
                    >
                      <SkipForward size={20} className="sm:w-6" />
                    </button>
                  </div>

                  {/* Track Info */}
                  <div className="text-center sm:text-right order-3">
                    <p className="text-xs sm:text-sm text-gray-400">
                      {currentTrackIndex + 1} / {audioTracks.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Track List */}
              <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">All Tracks</h4>
                <div className="space-y-2 sm:space-y-3">
                  {audioTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition ${index === currentTrackIndex
                        ? 'bg-yellow-500/20 border border-yellow-500/30'
                        : 'bg-gray-700/50 hover:bg-gray-700'
                        }`}
                      onClick={() => playTrack(index)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${index === currentTrackIndex
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-600 text-gray-300'
                          }`}>
                          {index === currentTrackIndex && isPlaying ? (
                            <Pause size={14} className="sm:w-4" />
                          ) : (
                            <Play size={14} className="sm:w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-white text-sm sm:text-base truncate">{track.title}</h5>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Audio Visualizer for current track */}
                        {index === currentTrackIndex && isPlaying && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-2 sm:h-3 bg-yellow-500 rounded-full animate-audio-bar"></div>
                            <div className="w-1 h-3 sm:h-4 bg-yellow-500 rounded-full animate-audio-bar" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-2.5 sm:h-3.5 bg-yellow-500 rounded-full animate-audio-bar" style={{ animationDelay: '0.4s' }}></div>
                            <div className="w-1 h-3.5 sm:h-5 bg-yellow-500 rounded-full animate-audio-bar" style={{ animationDelay: '0.6s' }}></div>
                          </div>
                        )}

                        {/* Download Button for each track */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadTrack(track.src, track.originalName);
                          }}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-green-400 transition"
                          title="Download"
                        >
                          <Download size={14} className="sm:w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====== Back Button ====== */}
          <div className="pt-6 sm:pt-8 md:pt-10 text-center">
            <button
              onClick={() => router.back()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform text-sm sm:text-base"
            >
              ← Back to {genre} Artists
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for audio bars animation */}
      <style jsx>{`
        @keyframes audio-bar {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .animate-audio-bar {
          animation: audio-bar 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}