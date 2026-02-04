"use client";
import { ArrowLeft, MapPin, Music } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudiosByState() {
  const params = useParams();
  const router = useRouter();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);

  const { state } = params;

  useEffect(() => {
    if (state) {
      fetchStudios();
    }
  }, [state]);

  const fetchStudios = async () => {
    try {
      // Convert URL param to proper case for API call
      const stateName = state.charAt(0).toUpperCase() + state.slice(1);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/location?state=${stateName}`,
      );
      const data = await res.json();
      if (data.success) {
        setStudios(data.data || []);
        const uniqueCities = [
          ...new Set((data.data || []).map((studio) => studio.city)),
        ];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group studios by city
  const studiosByCity = {};
  studios.forEach((studio) => {
    if (!studiosByCity[studio.city]) {
      studiosByCity[studio.city] = [];
    }
    studiosByCity[studio.city].push(studio);
  });

  const formattedState = state.charAt(0).toUpperCase() + state.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-400">
        <div className="text-center">
          <Music size={48} className="mx-auto mb-4 animate-pulse" />
          <p>Loading {formattedState} studios...</p>
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
              onClick={() => router.push("/studios")}
              className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 mb-4 transition group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to All Studios
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
                  Studios in {formattedState}
                </h1>
                <p className="text-gray-300 mt-1">
                  Recording studios across {formattedState}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
            {studios.length} {studios.length === 1 ? "Studio" : "Studios"}
          </div>
        </div>

        {/* Cities Grid */}
        {cities.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Music size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Studios Found in {formattedState}
            </h3>
            <p className="text-gray-400 mb-6">
              Check back soon or explore studios in nearby states.
            </p>
            <button
              onClick={() => router.push("/studios")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition transform hover:scale-105"
            >
              Browse All Studios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(studiosByCity).map(([city, cityStudios]) => (
              <div
                key={city}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white capitalize">
                        {city}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {cityStudios.length}{" "}
                        {cityStudios.length === 1 ? "studio" : "studios"}
                      </p>
                    </div>
                  </div>

                  {/* Featured Studios Preview */}
                  <div className="space-y-3 mb-6">
                    {cityStudios.slice(0, 3).map((studio) => (
                      <div
                        key={studio._id}
                        className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              studio.photos?.[0]?.url || "/default-studio.jpg"
                            }
                            alt={studio.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {studio.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {studio.isVerified && (
                              <span className="text-xs text-green-400">
                                ✓ Verified
                              </span>
                            )}
                            {studio.isFeatured && (
                              <span className="text-xs text-yellow-400">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Button */}
                  <Link
                    href={`/studios/${state}/${city.toLowerCase()}`}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-center py-3 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition block text-center"
                  >
                    View Studios in {city}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
