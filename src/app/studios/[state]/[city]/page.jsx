"use client";
import { ArrowLeft, Headphones, MapPin, Music, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudiosByCity() {
  const params = useParams();
  const router = useRouter();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state, city } = params;

  useEffect(() => {
    if (state && city) {
      fetchStudios();
    }
  }, [state, city]);

  const fetchStudios = async () => {
    try {
      const stateName = state.charAt(0).toUpperCase() + state.slice(1);
      const cityName = city.toLowerCase();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/location?state=${stateName}&city=${cityName}`,
      );
      const data = await res.json();
      if (data.success) setStudios(data.data || []);
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Separate featured and regular studios
  const featuredStudios = studios.filter((studio) => studio.isFeatured);
  const regularStudios = studios.filter((studio) => !studio.isFeatured);

  const formattedState = state.charAt(0).toUpperCase() + state.slice(1);
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-400">
        <div className="text-center">
          <Music size={48} className="mx-auto mb-4 animate-pulse" />
          <p>Loading studios in {formattedCity}...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-14 mt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <button
              onClick={() => router.push(`/studios/${state}`)}
              className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 mb-4 transition group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to {formattedState}
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
                  Studios in {formattedCity}
                </h1>
                <p className="text-gray-300 mt-1 capitalize">
                  {formattedState} • Recording Studios & Producers
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
            {studios.length} {studios.length === 1 ? "Studio" : "Studios"}
          </div>
        </div>

        {/* Featured Studios Section */}
        {featuredStudios.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
              <h2 className="text-2xl font-bold text-white">
                Featured Studios
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/30 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStudios.map((studio) => (
                <FeaturedStudioCard
                  key={studio._id}
                  studio={studio}
                  state={state}
                  city={city}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Studios Section */}
        {regularStudios.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Headphones size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Other Studios in {formattedCity}
            </h3>
            <p className="text-gray-400 mb-6">
              Check back soon or explore studios in nearby cities.
            </p>
            <button
              onClick={() => router.push(`/studios/${state}`)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition transform hover:scale-105"
            >
              Back to {formattedState}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">All Studios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularStudios.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                  state={state}
                  city={city}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// Featured Studio Card Component
function FeaturedStudioCard({ studio, state, city }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={studio.photos?.[0]?.url || "/default-studio.jpg"}
          alt={studio.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

        {/* Featured Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
          <Star size={14} fill="currentColor" />
          Featured
        </div>

        {/* Verified Badge */}
        {studio.isVerified && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-bold text-sm">
            ✓ Verified
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {studio.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-300 mt-1">
              <MapPin size={16} className="text-yellow-500" />
              <span className="text-sm capitalize">
                {studio.city}, {studio.state}
              </span>
            </div>
          </div>

          {studio.audioFile && (
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Headphones className="w-5 h-5 text-blue-400" />
            </div>
          )}
        </div>

        {studio.biography && (
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {studio.biography}
          </p>
        )}

        {/* Services Preview */}
        {studio.services && studio.services.length > 0 && (
          <div className="mb-6">
            <h4 className="text-gray-300 font-semibold mb-2 text-sm">
              Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {studio.services.slice(0, 4).map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full font-medium border border-gray-600"
                >
                  {service.service}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/studios/${state}/${city}/${studio._id}`}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-center py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-[1.02] block"
        >
          View Studio Details
        </Link>
      </div>
    </div>
  );
}

// Regular Studio Card Component
function StudioCard({ studio, state, city }) {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-700">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={studio.photos?.[0]?.url || "/default-studio.jpg"}
          alt={studio.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <div className="flex gap-2">
            {studio.isVerified && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold backdrop-blur-sm">
                ✓
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {studio.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-300 mb-3">
          <MapPin size={14} className="text-yellow-500" />
          <span className="text-xs capitalize">
            {studio.city}, {studio.state}
          </span>
        </div>

        {studio.biography && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-3">
            {studio.biography}
          </p>
        )}

        {/* Services Chips */}
        {studio.services && studio.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {studio.services.slice(0, 2).map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {service.service}
              </span>
            ))}
            {studio.services.length > 2 && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                +{studio.services.length - 2}
              </span>
            )}
          </div>
        )}

        <Link
          href={`/studios/${state}/${city}/${studio._id}`}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-center py-2 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition text-sm block"
        >
          View Studio
        </Link>
      </div>
    </div>
  );
}
