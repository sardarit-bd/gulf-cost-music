"use client";
import { Download, Headphones, Music, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
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
      <div className="brandBg text-white min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg text-yellow-400">Loading artist details...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">Artist Not Found 😢</h1>
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
    <section className="brandBg min-h-screen text-white mt-12">
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
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
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

        <div className="container relative mx-auto h-full flex flex-col md:flex-row md:items-end md:justify-start justify-end bottom-10 left-10 text-white">
          <div className="flex items-end gap-3">
            <div className="border-3 border-yellow-400 w-[170px] rounded-md h-[200px]">
              <Image
                src={artist.photos?.[0]?.url || "/default.jpg"}
                alt={artist.name}
                width={1000}
                height={1000}
                className="object-cover h-full w-full"
              />
            </div>
            <div>
              <h1 className="md:text-5xl text-3xl font-bold mb-3 brandColor">
                {artist.name}
              </h1>
              <p className="text-lg text-gray-200 capitalize">{artist.genre} Artist</p>

              {/* Audio Stats */}
              {audioTracks.length > 0 && (
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Music size={16} />
                    <span>{audioTracks.length} Tracks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Headphones size={16} />
                    <span>Now Playing</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== Info Section ====== */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
              <p className="text-gray-300 text-sm mb-3 capitalize">
                {artist.genre} • {artist.city}
              </p>
              <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                {artist.biography || "No biography available."}
              </p>
            </div>

            {/* Audio Stats Card */}
            {audioTracks.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {audioTracks.length}
                  </p>
                  <p className="text-sm text-gray-300">Music Tracks</p>
                </div>
              </div>
            )}
          </div>

          {/* ====== Photos Gallery Section ====== */}
          {artist.photos?.length > 1 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <span className="text-black font-bold">📸</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Gallery</h3>
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  {artist.photos.length} photos
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artist.photos.map((p, i) => (
                  <div key={i} className="group relative w-full h-64 rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                    <Image
                      src={p.url}
                      alt={`${artist.name} photo ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="text-white text-sm font-medium">Photo {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== Modern Audio Player Section ====== */}
          {audioTracks.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Music size={24} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white">Music Collection</h3>
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  {audioTracks.length} tracks
                </span>
              </div>

              {/* Main Audio Player */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
                {/* Now Playing */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Music size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {audioTracks[currentTrackIndex]?.title}
                      </h4>
                      <p className="text-gray-400 text-sm">
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>

                {/* Progress Bar with Time */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div
                    className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-between">
                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-yellow-500"
                    />
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={prevTrack}
                      className="p-3 text-gray-400 hover:text-white transition"
                      disabled={audioTracks.length <= 1}
                    >
                      <SkipBack size={24} />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="p-4 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition transform hover:scale-105"
                    >
                      {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>

                    <button
                      onClick={nextTrack}
                      className="p-3 text-gray-400 hover:text-white transition"
                      disabled={audioTracks.length <= 1}
                    >
                      <SkipForward size={24} />
                    </button>
                  </div>

                  {/* Track Info */}
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {currentTrackIndex + 1} / {audioTracks.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Track List */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">All Tracks</h4>
                <div className="space-y-3">
                  {audioTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition ${index === currentTrackIndex
                        ? 'bg-yellow-500/20 border border-yellow-500/30'
                        : 'bg-gray-700/50 hover:bg-gray-700'
                        }`}
                      onClick={() => playTrack(index)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === currentTrackIndex
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-600 text-gray-300'
                          }`}>
                          {index === currentTrackIndex && isPlaying ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-white">{track.title}</h5>
                          {/* <p className="text-sm text-gray-400">{track.duration}</p> */}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Audio Visualizer for current track */}
                        {index === currentTrackIndex && isPlaying && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-3 bg-yellow-500 rounded-full animate-audio-bar"></div>
                            <div className="w-1 h-5 bg-yellow-500 rounded-full animate-audio-bar" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-4 bg-yellow-500 rounded-full animate-audio-bar" style={{ animationDelay: '0.4s' }}></div>
                            <div className="w-1 h-6 bg-yellow-500 rounded-full animate-audio-bar" style={{ animationDelay: '0.6s' }}></div>
                          </div>
                        )}

                        {/* Download Button for each track */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadTrack(track.src, track.originalName);
                          }}
                          className="p-2 text-gray-400 hover:text-green-400 transition"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====== Back Button ====== */}
          <div className="pt-10 text-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform"
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