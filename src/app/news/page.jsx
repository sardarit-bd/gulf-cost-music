"use client";
import { Calendar, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewsPage() {
  const [selectedCity, setSelectedCity] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const cities = ["All", "New Orleans", "Biloxi", "Mobile", "Pensacola"];

  // Fetch data from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const query =
          selectedCity === "All" ? "" : `?location=${selectedCity.toLowerCase()}`;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news${query}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch news");
        }

        if (data.success && data.data?.news?.length > 0) {
          setNewsData(data.data.news);
        } else {
          setNewsData([]);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setErrorMsg(err.message || "Failed to load news");
        toast.error(err.message || "Failed to load news");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchNews();
  }, [selectedCity]);

  const cityColors = {
    "new orleans": "from-purple-600/80 to-indigo-700/80",
    biloxi: "from-teal-400/80 to-cyan-600/80",
    mobile: "from-orange-400/80 to-red-500/80",
    pensacola: "from-yellow-400/80 to-amber-600/80",
  };

  // Initial Loading State
  if (initialLoading) {
    return (
      <section className="brandBg min-h-screen py-14 mt-28 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex flex-wrap justify-between items-center mb-10">
            <div className="h-12 bg-gray-700/50 rounded-lg w-64 animate-pulse"></div>
            <div className="h-10 bg-gray-600/50 rounded w-32 animate-pulse"></div>
          </div>

          {/* News Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-gray-600/50"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-600/50 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600/50 rounded mb-3 w-20"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-600/50 rounded w-16"></div>
                    <div className="h-8 bg-gray-600/50 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="brandBg min-h-screen py-14 mt-16 px-6">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold brandColor mb-2">
              City News Board
            </h1>
            <p className="text-gray-300">
              Stay updated with the latest news from Gulf Coast cities
            </p>
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 min-w-[160px]"
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{selectedCity}</span>
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition ${selectedCity === c
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
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-200">
            Showing{" "}
            <span className="font-semibold text-white">{newsData.length}</span>{" "}
            {selectedCity === "All" ? "news articles" : `${selectedCity} news articles`}
          </p>

          {/* Loading indicator for city changes */}
          {loading && (
            <div className="flex items-center gap-2 text-yellow-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading news...</span>
            </div>
          )}
        </div>

        {/* Loading State for City Changes */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-200 text-lg">
                Loading {selectedCity === "All" ? "all news" : `${selectedCity} news`}...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Error */}
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* No news found */}
            {!errorMsg && newsData.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">
                    No News Found
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    {selectedCity === "All"
                      ? "No news articles are currently available. Check back later!"
                      : `No news articles found for ${selectedCity}. Try selecting "All" cities.`
                    }
                  </p>
                  {selectedCity !== "All" && (
                    <button
                      onClick={() => setSelectedCity("All")}
                      className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors"
                    >
                      Show All Cities
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* News Grid */}
            {!errorMsg && newsData.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {newsData.map((item) => (
                  <div
                    key={item._id}
                    className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
                  >
                    <div className="relative w-full h-56 overflow-hidden">
                      <Image
                        src={
                          item.photos?.[0]?.url ||
                          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                        }
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${cityColors[item.location] || "from-gray-800/90 to-gray-900/70"
                          }`}
                      ></div>

                      {/* City Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 backdrop-blur-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.location || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 text-left">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                        {item.title}
                      </h2>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          href={`/news/${item.location}/${item._id}`}
                          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}