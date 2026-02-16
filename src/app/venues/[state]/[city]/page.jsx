"use client";
import { ArrowLeft, ChevronRight, MapPin, Music, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CityVenuesPage() {
  const { state, city } = useParams();
  const router = useRouter();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityInfo, setCityInfo] = useState(null);

  const formattedState = decodeURIComponent(state)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedCity = decodeURIComponent(city)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    fetchCityVenues();
  }, [state, city]);

  const fetchCityVenues = async () => {
    setLoading(true);
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues?state=${encodeURIComponent(formattedState)}&city=${encodeURIComponent(formattedCity.toLowerCase())}`
      );


      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        const fixed = (data.data.venues || []).map((v) => ({
          ...v,
          photos: v.photos?.length > 0 ? v.photos : [{
            url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          }],
        }));
        setVenues(fixed);

        // Calculate city stats
        const totalCapacity = fixed.reduce((sum, v) => sum + (v.seatingCapacity || 0), 0);
        const verifiedVenues = fixed.filter(v => v.verifiedOrder > 0).length;
        const featuredVenues = fixed.filter(v => v.isFeatured).length;

        setCityInfo({
          totalCapacity,
          verifiedVenues,
          featuredVenues,
          totalVenues: fixed.length
        });
      }
    } catch (error) {
      console.error("Error fetching city venues:", error);
      setVenues([]);
      setCityInfo({
        totalCapacity: 0,
        verifiedVenues: 0,
        featuredVenues: 0,
        totalVenues: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCityName = (city) => {
    if (!city) return "Unknown";
    return city
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  return (
    <section className="brandBg min-h-screen py-14 mt-20 px-6">
      <div className="container mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-gray-300 mb-6 text-sm">
          <Link href="/venues" className="hover:text-yellow-400 transition">
            Venues
          </Link>
          <ChevronRight size={14} />
          <Link href={`/venues/${state}`} className="hover:text-yellow-400 transition">
            {formattedState}
          </Link>
          <ChevronRight size={14} />
          <span className="text-yellow-400 font-semibold">{formattedCity}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <button
              onClick={() => router.push(`/venues/${state}`)}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition"
            >
              <ArrowLeft size={20} />
              Back to {formattedState}
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
              Venues in {formattedCity}, {formattedState}
            </h1>
            <p className="text-gray-300 mt-2">
              Find the perfect music venue in {formattedCity}
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-bold text-lg">
            {venues.length} {venues.length === 1 ? 'Venue' : 'Venues'}
          </div>
        </div>

        {/* City Stats */}
        {cityInfo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
              <div className="text-2xl font-bold text-white">{cityInfo.totalVenues}</div>
              <div className="text-gray-300 text-sm">Total Venues</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-white">{cityInfo.verifiedVenues}</div>
              <div className="text-gray-300 text-sm">Verified</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
              <div className="text-2xl font-bold text-white">{cityInfo.featuredVenues}</div>
              <div className="text-gray-300 text-sm">Featured</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
              <div className="text-2xl font-bold text-white">
                {cityInfo.totalCapacity.toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm">Total Capacity</div>
            </div>
          </div>
        )}

        {/* Venues Grid */}
        {venues.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Music size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Venues in {formattedCity}
            </h3>
            <p className="text-gray-400 mb-6">
              We don't have any venues registered in {formattedCity} yet.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/venues/${state}`)}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                View {formattedState} Venues
              </button>
              <button
                onClick={() => router.push("/venues")}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Browse All Venues
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2 group border border-gray-700"
              >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={venue.photos?.[0]?.url}
                    alt={venue.venueName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {venue.verifiedOrder > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        <Star size={10} />
                        Verified #{venue.verifiedOrder}
                      </span>
                    )}
                    {venue.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-semibold">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* City Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      {formatCityName(venue.city)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-white mb-1">
                    {venue.venueName}
                  </h2>

                  {venue.address && (
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                      <MapPin size={14} />
                      <span className="truncate">{venue.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {venue.seatingCapacity ? `${venue.seatingCapacity} capacity` : "Capacity N/A"}
                      </span>
                    </div>
                    <Link
                      href={`/venues/${venue.state.toLowerCase()}/${venue.city.toLowerCase()}/${venue._id}`}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-semibold rounded-full hover:from-yellow-600 hover:to-yellow-700 transition"
                    >
                      View Details
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