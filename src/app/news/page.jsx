"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewsPage() {
  const [selectedCity, setSelectedCity] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <section className="brandBg min-h-screen py-14 mt-16 px-6">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold brandColor">
            City News Board
          </h1>

          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition"
            >
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
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-yellow-100 transition ${selectedCity === c
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

        {/* Loader */}
        {loading && (
          <div className="text-gray-300 italic animate-pulse">
            Loading latest {selectedCity === "All" ? "news" : `${selectedCity} news`}...
          </div>
        )}

        {/* Error */}
        {!loading && errorMsg && (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded-md mb-6 text-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* No news found */}
        {!loading && !errorMsg && newsData.length === 0 && (
          <p className="text-gray-300 italic">
            No news available for{" "}
            <span className="font-semibold text-white">{selectedCity}</span>.
          </p>
        )}

        {/* News Grid */}
        {!loading && newsData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {newsData.map((item) => (
              <div
                key={item._id}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={
                      item.photos?.[0]?.url ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cityColors[item.location] || "from-gray-700 to-gray-900"
                      } opacity-70`}
                  ></div>
                </div>

                <div className="p-5 text-left">
                  <h2 className="text-lg font-bold text-[var(--primary)] mb-1 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {item.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/news/${item.location}/${item._id}`}
                      className="px-4 py-1 bg-yellow-400 text-sm font-semibold rounded-full hover:bg-yellow-500 transition"
                    >
                      View
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
