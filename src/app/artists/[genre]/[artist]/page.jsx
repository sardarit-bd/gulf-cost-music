"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ArtistProfile() {
    const { genre, slug } = useParams();
    const router = useRouter();

  const artists = [
    {
      id: "drake",
      name: "Drake",
      genre: "Rap",
      followers: "12.5M",
      image:
        "https://images.unsplash.com/photo-1606851096605-29e42e7a4232?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "taylor-swift",
      name: "Taylor Swift",
      genre: "Country",
      followers: "18.2M",
      image:
        "https://images.unsplash.com/photo-1614289371518-2cb0b4e84c63?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "the-weeknd",
      name: "The Weeknd",
      genre: "Pop",
      followers: "20.1M",
      image:
        "https://images.unsplash.com/photo-1587049352849-4d31c8e8c6d4?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "imagine-dragons",
      name: "Imagine Dragons",
      genre: "Rock",
      followers: "10.4M",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "miles-davis",
      name: "Miles Davis",
      genre: "Jazz",
      followers: "5.7M",
      image:
        "https://images.unsplash.com/photo-1484778540542-46ec1d57a5b7?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "bob-marley",
      name: "Bob Marley",
      genre: "Reggae",
      followers: "7.9M",
      image:
        "https://images.unsplash.com/photo-1528715471579-d1bcf0e68b9b?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "martin-garrix",
      name: "Martin Garrix",
      genre: "EDM",
      followers: "9.6M",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "ludovico-einaudi",
      name: "Ludovico Einaudi",
      genre: "Classical",
      followers: "4.2M",
      image:
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=60",
    },
  ];

    const artist = artists.find(
        (a) =>
            a.slug === slug && a.genre.toLowerCase() === genre.toLowerCase()
    );

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
                    src={artist.image}
                    alt={artist.name}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Overlay info */}
                <div className="absolute bottom-10 left-10 text-white max-w-xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-3 brandColor">
                        {artist.name}
                    </h1>
                    <p className="text-lg text-gray-200">{artist.genre} Artist</p>
                </div>
            </div>

            {/* ====== Info Section ====== */}
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
                            <p className="text-gray-300 text-sm mb-3">{artist.genre}</p>
                            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                                {artist.about}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">
                                👥 {artist.followers}
                            </p>
                            <p className="text-sm text-gray-300">Followers</p>
                        </div>
                    </div>

                    {/* ====== Social Links ====== */}
                    <div className="flex flex-wrap gap-4 mt-10">
                        {artist.socials?.instagram && (
                            <a
                                href={artist.socials.instagram}
                                target="_blank"
                                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full font-semibold text-white hover:scale-105 transition transform"
                            >
                                Instagram
                            </a>
                        )}
                        {artist.socials?.twitter && (
                            <a
                                href={artist.socials.twitter}
                                target="_blank"
                                className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full font-semibold text-white hover:scale-105 transition transform"
                            >
                                Twitter
                            </a>
                        )}
                        {artist.socials?.youtube && (
                            <a
                                href={artist.socials.youtube}
                                target="_blank"
                                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-full font-semibold text-white hover:scale-105 transition transform"
                            >
                                YouTube
                            </a>
                        )}
                    </div>

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
