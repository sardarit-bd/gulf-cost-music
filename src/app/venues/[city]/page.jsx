"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CityWiseVenues() {
  const { city } = useParams();
  const router = useRouter();

  // Dummy venue data
  const venues = [
    {
      id: "arena-center",
      name: "Arena Center",
      city: "New Orleans",
      capacity: "8,000",
      address: "123 Bourbon St, New Orleans, LA",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "music-hall",
      name: "Music Hall",
      city: "New Orleans",
      capacity: "5,200",
      address: "18 Royal Ave, New Orleans, LA",
      image:
        "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "mobile-event-hub",
      name: "Mobile Event Hub",
      city: "Mobile",
      capacity: "3,200",
      address: "22 State Dock Rd, Mobile, AL",
      image:
        "https://images.unsplash.com/photo-1541976076758-25a71c4200d1?auto=format&fit=crop&w=900&q=60",
    },
    {
      id: "biloxi-beach-hall",
      name: "Biloxi Beach Hall",
      city: "Biloxi",
      capacity: "5,500",
      address: "11 Beachside Rd, Biloxi, MS",
      image:
        "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=900&q=60",
    },
  ];

  // Filter by city (case insensitive)
  const filteredVenues = venues.filter(
    (v) => v.city.toLowerCase() === city.toLowerCase()
  );

  if (filteredVenues.length === 0) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">No Venues Found in {city} 😢</h1>
        <button
          onClick={() => router.push("/venues")}
          className="px-6 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
        >
          ← Back to All Venues
        </button>
      </div>
    );
  }

  return (
    <section className="brandBg min-h-screen py-14 mt-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold brandColor capitalize">
            {city} Venues
          </h1>
          <button
            onClick={() => router.push("/venues")}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border hover:bg-yellow-100 transition"
          >
            ← Back
          </button>
        </div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white"
            >
              <div className="relative w-full h-56">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-5 text-left">
                <h2 className="text-lg font-bold brandColor mb-1">
                  {venue.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{venue.address}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    🏟 {venue.capacity} Capacity
                  </span>
                  <Link
                    href={`/venues/${venue.city}/${venue.id}`}
                    className="px-4 py-1 bg-yellow-400 text-sm font-semibold rounded-full hover:bg-yellow-500 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
