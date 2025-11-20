"use client";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CityWiseVenues() {
  const { city } = useParams();
  const router = useRouter();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedCity = decodeURIComponent(city);

  useEffect(() => {
    const fetchCityVenues = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues?city=${decodedCity.toLowerCase()}`
        );
        const data = await res.json();
        if (res.ok && data.data?.venues) {
          setVenues(data.data.venues);
        }
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCityVenues();
  }, [decodedCity]);

  if (loading) {
    return (
      <section className="brandBg min-h-screen py-14 mt-20 px-6">
        <div className="container mx-auto">
          {/* Header Skeleton */}
          <div className="mb-10">
            <div className="h-12 bg-gray-700/50 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded w-48 animate-pulse"></div>
          </div>

          {/* Venues Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-gray-600/30"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-600/30 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600/30 rounded mb-3 w-3/4"></div>
                  <div className="h-8 bg-gray-600/30 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No Venues Found State
  if (!venues.length) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center px-6">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">
            No Venues Found in {decodedCity} 😢
          </h1>
          <p className="text-gray-300 mb-6 max-w-md">
            We couldn't find any venues in {decodedCity}. Try checking other cities or come back later!
          </p>
          <button
            onClick={() => router.push("/venues")}
            className="px-6 py-3 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-500 transition flex items-center gap-2 mx-auto"
          >
            ← Back to All Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-14 mt-20 px-6 brandBg min-h-screen">
      <div className="container mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold brandColor capitalize">
              {decodedCity} Venues
            </h1>
            <p className="text-gray-200 mt-2">
              Discover amazing music venues in {decodedCity}
            </p>
          </div>
          <button
            onClick={() => router.push("/venues")}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition backdrop-blur-sm border border-white/20"
          >
            ← All Venues
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-200">
            Found <span className="font-semibold text-white">{venues.length}</span> venues in {decodedCity}
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-full h-56">
                <Image
                  src={venue.photos?.[0]?.url || "/default.jpg"}
                  alt={venue.venueName}
                  fill
                  className="object-cover rounded-t-2xl"
                />
                {/* City Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {venue.city || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {venue.venueName}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{venue.address}</p>
                <Link
                  href={`/venues/${venue.city}/${venue._id}`}
                  className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}