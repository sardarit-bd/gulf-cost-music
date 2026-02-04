"use client";
import { Headphones, MapPin, Music, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudiosPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  const states = ["All", "Louisiana", "Mississippi", "Alabama", "Florida"];
  const citiesByState = {
    Louisiana: [
      "All",
      "new orleans",
      "baton rouge",
      "lafayette",
      "shreveport",
      "lake charles",
      "monroe",
    ],
    Mississippi: [
      "All",
      "jackson",
      "biloxi",
      "gulfport",
      "oxford",
      "hattiesburg",
    ],
    Alabama: ["All", "birmingham", "mobile", "huntsville", "tuscaloosa"],
    Florida: [
      "All",
      "tampa",
      "st. petersburg",
      "clearwater",
      "pensacola",
      "panama city",
      "fort myers",
    ],
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/location`,
      );
      const data = await res.json();
      if (data.success) setStudios(data.data);
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter studios
  const filteredStudios = studios.filter((studio) => {
    const matchesSearch =
      studio.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.biography?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.services?.some((service) =>
        service.service.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesState =
      selectedState === "All" || studio.state === selectedState;

    const matchesCity =
      selectedCity === "All" ||
      studio.city?.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesState && matchesCity;
  });

  const currentCities = citiesByState[selectedState] || ["All"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-400">
        <div className="text-center">
          <Headphones size={48} className="mx-auto mb-4 animate-pulse" />
          <p>Loading studios...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-14 mt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <Music className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recording Studios
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Professional recording studios across the Gulf Coast with
            state-of-the-art equipment
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search studios, services, or gear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity("All");
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={selectedState === "All"}
              >
                {currentCities.map((city) => (
                  <option key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedState !== "All" && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-1">
                <MapPin size={14} />
                {selectedState}
              </span>
            )}
            {selectedCity !== "All" && selectedCity !== "All" && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
              </span>
            )}
            {searchTerm && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Search: {searchTerm}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-300">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredStudios.length}
            </span>{" "}
            {selectedState === "All"
              ? "studios"
              : `studios in ${selectedCity !== "All" ? selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1) + ", " : ""}${selectedState}`}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-300">Featured</span>
            </div>
          </div>
        </div>

        {/* Studios Grid */}
        {filteredStudios.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Headphones size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Studios Found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Studio Card Component
function StudioCard({ studio }) {
  // Fix: Use lowercase state name for URL
  const stateUrl = studio.state.toLowerCase();

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-700">
      {/* Studio Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex justify-between">
        <div className="flex gap-2">
          {studio.isVerified && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold backdrop-blur-sm">
              ✓ Verified
            </span>
          )}
          {studio.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold backdrop-blur-sm">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* Studio Photo */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={studio.photos?.[0]?.url || "/default-studio.jpg"}
          alt={studio.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Studio Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
            {studio.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-gray-300 mb-4">
          <MapPin size={16} className="text-yellow-500" />
          <span className="text-sm capitalize">
            {studio.city}, {studio.state}
          </span>
        </div>

        {/* Biography Excerpt */}
        {studio.biography && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {studio.biography}
          </p>
        )}

        {/* Services Preview */}
        {studio.services && studio.services.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {studio.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full font-medium border border-gray-600"
                >
                  {service.service}
                </span>
              ))}
              {studio.services.length > 3 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                  +{studio.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Audio File Indicator */}
        {studio.audioFile && (
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-4">
            <Headphones size={14} />
            <span>Audio Sample Available</span>
          </div>
        )}

        {/* FIXED LINK: Use lowercase state name */}
        <Link
          href={`/studios/${stateUrl}`}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-center py-3 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-[1.02] block"
        >
          View Studios in {studio.state}
        </Link>
      </div>
    </div>
  );
}
