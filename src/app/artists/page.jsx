"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [artists, setArtists] = useState([]);

  const genres = [
    "All", "Rap", "Country", "Pop", "Rock", "Jazz",
    "Reggae", "EDM", "Classical", "Other",
  ];


  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const genreParam =
          selectedGenre === "All" ? "" : `?genre=${selectedGenre.toLowerCase()}`;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artists${genreParam}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setArtists(data.data.artists || []);
        } else {
          setArtists([]);
          toast.error(data.message || "Failed to load artists");
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
        toast.error("Server error! Please try again later.");
      }
    };
    fetchArtists();
  }, [selectedGenre]);


  const genreColors = {
    Rap: "from-purple-500/80 to-indigo-600/80",
    Country: "from-yellow-400/70 to-orange-500/80",
    Pop: "from-pink-400/80 to-rose-500/80",
    Rock: "from-gray-700/80 to-gray-900/90",
    Jazz: "from-blue-400/80 to-indigo-700/80",
    Reggae: "from-green-400/80 to-lime-600/80",
    EDM: "from-fuchsia-400/80 to-purple-600/80",
    Classical: "from-amber-300/80 to-yellow-500/80",
    Other: "from-slate-400/80 to-slate-600/80",
  };

  return (
    <section className="brandBg min-h-screen py-14 mt-16 px-6">
      <Toaster/>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold brandColor">Artists Gallery</h1>

          {/* Genre Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition focus:outline-none"
            >
              <span className="font-medium">{selectedGenre}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ml-1 transform transition-transform ${dropdownOpen ? "rotate-180" : ""
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
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-dropdownIn">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGenre(g);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-yellow-100 transition ${selectedGenre === g
                        ? "bg-yellow-50 font-semibold text-gray-800"
                        : "text-gray-600"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-200 mb-8">
          Showing <span className="font-semibold text-white">{artists.length}</span>{" "}
          {selectedGenre === "All" ? "artists" : `${selectedGenre} artists`}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white"
            >
              <div className="relative w-full h-56">
                <Image
                  src={
                    artist.photos?.[0]?.url ||
                    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=60"
                  }
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${genreColors[artist.genre?.charAt(0).toUpperCase() + artist.genre?.slice(1)] ||
                    "from-gray-700 to-gray-900"
                    } opacity-70`}
                ></div>
              </div>

              <div className="p-5 text-left">
                <h2 className="text-lg font-bold brandColor mb-1">{artist.name}</h2>
                <p className="text-sm text-gray-600 mb-2 capitalize">{artist.genre}</p>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/artists/${artist.genre}/${artist._id}`}
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
