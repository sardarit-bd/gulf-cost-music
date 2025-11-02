"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Users, Filter, Loader2 } from "lucide-react";

export default function VenuesPage() {
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  const cities = ["All", "New Orleans", "Biloxi", "Mobile", "Pensacola"];

  // ✅ Fetch all venues from backend
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const cityParam = selectedCity === "All" ? "" : `?city=${selectedCity}`;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues${cityParam}`
        );
        const data = await res.json();

        if (res.ok) {
          // ✅ Fallback image if photos missing
          const fixed = (data.data.venues || []).map((v) => ({
            ...v,
            photos:
              v.photos?.length > 0
                ? v.photos
                : [
                    {
                      url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    },
                  ],
          }));
          setVenues(fixed);
        } else {
          console.error("Error fetching venues:", data.message);
        }
      } catch (error) {
        console.error("Server error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [selectedCity]);

  // Filter and sort venues
  const filteredAndSortedVenues = venues
    .filter(venue => 
      venue.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.biography?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.venueName?.localeCompare(b.venueName);
        case "capacity":
          return (b.seatingCapacity || 0) - (a.seatingCapacity || 0);
        case "city":
          return a.city?.localeCompare(b.city);
        default:
          return 0;
      }
    });

  const cityColors = {
    "New Orleans": "from-purple-600/80 to-indigo-700/80",
    "Biloxi": "from-teal-400/80 to-cyan-600/80",
    "Mobile": "from-orange-400/80 to-red-500/80",
    "Pensacola": "from-yellow-400/80 to-amber-600/80",
  };

  const getCapacityColor = (capacity) => {
    if (!capacity) return "text-gray-500";
    if (capacity > 1000) return "text-green-600";
    if (capacity > 500) return "text-blue-600";
    if (capacity > 200) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <section className="brandBg min-h-screen py-14 mt-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold brandColor mb-4">
            Venues Directory
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Discover the best music venues across the Gulf Coast. From intimate jazz clubs to grand concert halls.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search venues by name, city, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder:text-gray-500 text-gray-800"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* City Filter */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 min-w-[140px]"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{selectedCity}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 ml-1 transform transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                    {cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedCity(c);
                          setDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition ${
                          selectedCity === c
                            ? "bg-yellow-50 font-semibold text-gray-800 border-r-2 border-yellow-400"
                            : "text-gray-600"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[140px]"
              >
                <option value="name">Sort by Name</option>
                <option value="capacity">Sort by Capacity</option>
                <option value="city">Sort by City</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <p className="text-gray-200">
            Showing{" "}
            <span className="font-semibold text-white">{filteredAndSortedVenues.length}</span>{" "}
            {selectedCity === "All" ? "venues" : `${selectedCity} venues`}
            {searchTerm && (
              <span className="text-yellow-300">
                {" "}for "{searchTerm}"
              </span>
            )}
          </p>
          
          {loading && (
            <div className="flex items-center gap-2 text-yellow-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading venues...</span>
            </div>
          )}
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-200 text-lg">Loading amazing venues...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedVenues.map((venue) => (
                <div
                  key={venue._id}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
                >
                  {/* Image with Gradient Overlay */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={venue.photos?.[0]?.url}
                      alt={venue.venueName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        cityColors[venue.city] || "from-gray-800/90 to-gray-900/70"
                      }`}
                    ></div>
                    
                    {/* City Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 backdrop-blur-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {venue.city || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                      {venue.venueName}
                    </h2>
                    
                    {venue.biography && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {venue.biography}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm font-semibold ${getCapacityColor(venue.seatingCapacity)}`}>
                          {venue.seatingCapacity ? `${venue.seatingCapacity} capacity` : "Capacity N/A"}
                        </span>
                      </div>
                      <Link
                        href={`/venues/${venue.city?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}/${venue._id}`}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredAndSortedVenues.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">
                    No venues found
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    {searchTerm || selectedCity !== "All" 
                      ? "Try adjusting your search terms or filters to find more venues."
                      : "No venues are currently available. Check back later!"
                    }
                  </p>
                  {(searchTerm || selectedCity !== "All") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCity("All");
                      }}
                      className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}