"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ArtistProfile() {
  const { genre, artist:artistID } = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch artist from backend
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/artists/${artistID}`);
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

  if (loading) {
    return (
      <div className="brandBg text-white min-h-screen flex justify-center items-center">
        <p className="text-lg text-yellow-400">Loading artist details...</p>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-10 left-10 text-white max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 brandColor">
            {artist.name}
          </h1>
          <p className="text-lg text-gray-200 capitalize">{artist.genre} Artist</p>
        </div>
      </div>

      {/* ====== Info Section ====== */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
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

            {/* Optional section: followers (if future feature) */}
            {artist.followers && (
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  👥 {artist.followers}
                </p>
                <p className="text-sm text-gray-300">Followers</p>
              </div>
            )}
          </div>

          {/* ====== Photos ====== */}
          {artist.photos?.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {artist.photos.map((p, i) => (
                <div key={i} className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={p.url}
                    alt={`photo-${i}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ====== Audio Player ====== */}
          {artist.mp3File?.url && (
            <div className="mt-10">
              <p className="text-lg font-semibold mb-2 text-yellow-400">
                🎵 Listen to a sample track:
              </p>
              <audio controls className="w-full rounded-lg">
                <source src={artist.mp3File.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
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
    </section>
  );
}
