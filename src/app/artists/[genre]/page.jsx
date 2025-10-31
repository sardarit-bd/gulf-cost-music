"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function GenrePage() {
  const { genre } = useParams();
  const router = useRouter();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists?genre=${genre.toLowerCase()}`
        );
        const data = await res.json();

        if (res.ok && data.data?.artists) {
          setArtists(data.data.artists);
        } else {
          setArtists([]);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };

    if (genre) fetchArtists();
  }, [genre]);

  if (loading)
    return (
      <div className="brandBg min-h-screen flex justify-center items-center text-yellow-400">
        Loading {genre} artists...
      </div>
    );

  return (
    <section className="brandBg min-h-screen py-14 px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold brandColor capitalize">
            {genre} Artists
          </h1>
          <button
            onClick={() => router.push("/artists")}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border hover:bg-yellow-100 transition"
          >
            ← Back
          </button>
        </div>

        {/* Artist Grid */}
        {artists.length === 0 ? (
          <p className="text-gray-200">
            No artists found in this genre.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artists.map((artist) => (
              <div
                key={artist._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={
                      artist.photos?.[0]?.url ||
                      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=60"
                    }
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5 text-left">
                  <h2 className="text-lg font-bold text-black brandColor mb-1">
                    {artist.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {artist.genre}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/artists/${artist.genre}/${artist._id}`}
                      className="px-4 py-1 bg-yellow-400 text-sm font-semibold rounded-full hover:bg-yellow-500 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
