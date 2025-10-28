"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function VenueProfile() {
    const { city, slug } = useParams();
    const router = useRouter();

    const venues = [
        {
            id: "arena-center",
            name: "Arena Center",
            city: "New Orleans",
            capacity: "8,000",
            image:
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=60",
        },
        {
            id: "biloxi-beach-hall",
            name: "Biloxi Beach Hall",
            city: "Biloxi",
            capacity: "5,500",
            image:
                "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=60",
        },
        {
            id: "mobile-event-hub",
            name: "Mobile Event Hub",
            city: "Mobile",
            capacity: "3,200",
            image:
                "https://images.unsplash.com/photo-1541976076758-25a71c4200d1?auto=format&fit=crop&w=900&q=60",
        },
        {
            id: "pensacola-arena",
            name: "Pensacola Arena",
            city: "Pensacola",
            capacity: "6,000",
            image:
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60",
        },
    ];

    const venue = venues.find(
        (v) => v.id === slug && v.city.toLowerCase() === city.toLowerCase()
    );

    if (!venue) {
        return (
            <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-3">Venue Not Found 😢</h1>
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
            {/* Banner */}
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
                <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-10 left-10">
                    <h1 className="text-5xl font-bold brandColor">{venue.name}</h1>
                    <p className="text-gray-300 mt-2">{venue.city}</p>
                </div>
            </div>

            {/* Info Card */}
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
                    <div className="space-y-6">
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {venue.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-300 mt-6">
                            <div>📍 Address: {venue.address}</div>
                            <div>🏟 Capacity: {venue.capacity}</div>
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform"
                            >
                                ← Back to {city} Venues
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
