"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function VenuesPage() {
  const [selectedCity, setSelectedCity] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [venues, setVenues] = useState([]);

  const cities = ["All", "New Orleans", "Biloxi", "Mobile", "Pensacola"];

  // ✅ Fetch all venues from backend
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const cityParam = selectedCity === "All" ? "" : `?city=${selectedCity}`;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/venues${cityParam}`);
        const data = await res.json();
        if (res.ok) {
          setVenues(data.data.venues || []);
        } else {
          console.error("Error fetching venues:", data.message);
        }
      } catch (error) {
        console.error("Server error fetching venues:", error);
      }
    };
    fetchVenues();
  }, [selectedCity]);

  const cityColors = {
    "New Orleans": "from-purple-600/80 to-indigo-700/80",
    Biloxi: "from-teal-400/80 to-cyan-600/80",
    Mobile: "from-orange-400/80 to-red-500/80",
    Pensacola: "from-yellow-400/80 to-amber-600/80",
  };

  return (
    <section className="brandBg min-h-screen py-14 mt-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold brandColor">
            Venues Directory
          </h1>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition"
            >
              <span className="font-medium">{selectedCity}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ml-1 transform transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-yellow-100 transition ${
                      selectedCity === c
                        ? "bg-yellow-50 font-semibold text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Venue count */}
        <p className="text-gray-200 mb-8">
          Showing{" "}
          <span className="font-semibold text-white">
            {venues.length}
          </span>{" "}
          {selectedCity === "All" ? "venues" : `${selectedCity} venues`}
        </p>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white"
            >
              <div className="relative w-full h-56">
                <Image
                  src={
                    venue.photos?.[0]?.url ||
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                  }
                  alt={venue.venueName}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    cityColors[venue.city] || "from-gray-700 to-gray-900"
                  } opacity-70`}
                ></div>
              </div>

              <div className="p-5 text-left">
                <h2 className="text-lg font-bold brandColor mb-1">
                  {venue.venueName}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{venue.city}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    🏟 Capacity: {venue.seatingCapacity}
                  </span>
                  <Link
                    href={`/venues/${venue.city}/${venue._id}`}
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
