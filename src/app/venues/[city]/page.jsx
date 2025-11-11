"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CityWiseVenues() {
  const { city } = useParams();
  const router = useRouter();
  const [venues, setVenues] = useState([]);

  const decodedCity = decodeURIComponent(city);

  useEffect(() => {
    const fetchCityVenues = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues?city=${decodedCity.toLowerCase()}`
        );
        const data = await res.json();
        if (res.ok && data.data?.venues) setVenues(data.data.venues);
      } catch (err) {
        console.error("Error fetching venues:", err);
      }
    };
    fetchCityVenues();
  }, [decodedCity]);

  if (!venues.length) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">
          No Venues Found in {decodedCity} 😢
        </h1>
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
    <section className="py-14 mt-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold brandColor capitalize mb-10">
          {decodedCity} Venues
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {venues.map((venue) => (
            <div key={venue._id} className="bg-white rounded-2xl shadow-lg">
              <div className="relative w-full h-56">
                <Image
                  src={venue.photos?.[0]?.url || "/default.jpg"}
                  alt={venue.venueName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-[var(--primary)] mb-1">
                  {venue.venueName}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{venue.address}</p>
                <Link
                  href={`/venues/${venue.city}/${venue._id}`}
                  className="px-4 py-1 bg-yellow-400 text-sm font-semibold rounded-full hover:bg-yellow-500 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
