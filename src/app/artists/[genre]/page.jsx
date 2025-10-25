"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function GenrePage() {
    const { genre } = useParams();
    const router = useRouter();

    const artists = [
        {
            id: "drake",
            name: "Drake",
            genre: "Rap",
            followers: "12.5M",
            slug: "drake",
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
            id: "the-ahsan",
            name: "The Ahsan",
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

    const filteredArtists = artists.filter(
        (a) => a.genre.toLowerCase() === genre.toLowerCase()
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
                {filteredArtists.length === 0 ? (
                    <p className="text-gray-200">No artists found in this genre.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredArtists.map((artist, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                            >
                                <div className="relative w-full h-56">
                                    <Image
                                        src={artist.image}
                                        alt={artist.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-5 text-left">
                                    <h2 className="text-lg font-bold text-black brandColor mb-1">
                                        {artist.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-2">{artist.genre}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">
                                            👥 {artist.followers}
                                        </span>
                                        <Link href={`/artists/${artist.genre}/${artist.id}`} className="px-4 py-1 bg-yellow-400 text-sm font-semibold rounded-full hover:bg-yellow-500 transition">
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
