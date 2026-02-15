"use client";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StateNewsPage() {
  const { state } = useParams();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateInfo, setStateInfo] = useState(null);

  // State information mapping
  const statesData = {
    louisiana: {
      name: "Louisiana",
      cities: [
        "New Orleans",
        "Baton Rouge",
        "Lafayette",
        "Shreveport",
        "Lake Charles",
        "Monroe",
      ],
      color: "from-purple-600 to-indigo-700",
      // description: "News from the vibrant cities of Louisiana",
    },
    mississippi: {
      name: "Mississippi",
      cities: ["Jackson", "Biloxi", "Gulfport", "Oxford", "Hattiesburg"],
      color: "from-teal-400 to-cyan-600",
      description: "Latest updates from Mississippi",
    },
    alabama: {
      name: "Alabama",
      cities: ["Birmingham", "Mobile", "Huntsville", "Tuscaloosa"],
      color: "from-orange-400 to-red-500",
      description: "News from Alabama's Gulf Coast",
    },
    florida: {
      name: "Florida",
      cities: [
        "Tampa",
        "St. Petersburg",
        "Clearwater",
        "Pensacola",
        "Panama City",
        "Fort Myers",
      ],
      color: "from-yellow-400 to-amber-600",
      description: "Florida Gulf Coast news and updates",
    },
  };

  useEffect(() => {
    const fetchStateNews = async () => {
      try {
        setLoading(true);
        const decodedState = decodeURIComponent(state);
        const stateKey = decodedState.toLowerCase();

        // Set state info
        setStateInfo(
          statesData[stateKey] || {
            name: decodedState,
            color: "from-gray-600 to-gray-800",
            description: `News from ${decodedState}`,
          },
        );

        // Fetch news for this state
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news?state=${stateKey}`,
        );

        const data = await res.json();

        if (res.ok && data.data?.news) {
          setNews(data.data.news);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching state news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    if (state) {
      fetchStateNews();
    }
  }, [state]);

  // Group news by city
  const newsByCity = news.reduce((acc, item) => {
    const city = item.location || "Unknown City";
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="brandBg text-white min-h-screen pt-28">
        <div className="container mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-10">
            <div className="h-12 bg-gray-700/50 rounded-lg w-64 animate-pulse"></div>
            <div className="h-10 bg-gray-600/50 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-2xl p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-600/50 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-600/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const decodedState = decodeURIComponent(state);
  const stateKey = decodedState.toLowerCase();
  const currentState = statesData[stateKey];

  return (
    <section className="brandBg min-h-screen pt-24 px-6">
      <div className="container mx-auto">
        {/* Header with State Info */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <button
                onClick={() => router.push("/news")}
                className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All News
              </button>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 capitalize">
                {decodedState} News
              </h1>
              <p className="text-gray-300">
                {currentState?.description ||
                  `Latest news from ${decodedState}`}
              </p>
            </div>

            {/* State Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {news.length}
                </div>
                <div className="text-sm text-gray-300">Total Articles</div>
              </div>
            </div>
          </div>

          {/* City Navigation */}
          {/* {currentState?.cities && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Cities in {decodedState}
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentState.cities.map((city) => {
                  const cityNewsCount = news.filter(
                    (n) => n.location?.toLowerCase() === city.toLowerCase(),
                  ).length;

                  return (
                    <Link
                      key={city}
                      href={`/news/${stateKey}/${city.toLowerCase().replace(" ", "-")}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{city}</span>
                      {cityNewsCount > 0 && (
                        <span className="bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cityNewsCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )} */}
        </div>

        {/* News Content */}
        {news.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 max-w-2xl mx-auto">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                No News Found
              </h3>
              <p className="text-gray-300 mb-6">
                No news articles are currently available for {decodedState}.
              </p>
              <button
                onClick={() => router.push("/news")}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors"
              >
                Browse All News
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Display by City (Optional) */}
            {Object.keys(newsByCity).length > 1 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  News by City
                </h2>
                {Object.entries(newsByCity).map(([city, cityNews]) => (
                  <div key={city} className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <Link
                        href={`/news/${stateKey}/${city.toLowerCase().replace(" ", "-")}`}
                        className="text-xl font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-2"
                      >
                        <MapPin className="w-5 h-5" />
                        {city}
                        <span className="text-sm font-normal text-gray-300">
                          ({cityNews.length} articles)
                        </span>
                      </Link>
                      <Link
                        href={`/news/${stateKey}/${city.toLowerCase().replace(" ", "-")}`}
                        className="text-sm text-gray-300 hover:text-white"
                      >
                        View all →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cityNews.slice(0, 3).map((item) => (
                        <div
                          key={item._id}
                          className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-colors group"
                        >
                          <div className="relative h-48">
                            <Image
                              src={item.photos?.[0]?.url || "/placeholder.jpg"}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div
                              className={`absolute inset-0 bg-gradient-to-t ${currentState?.color ? `${currentState.color}/80` : "from-gray-800/80"} to-transparent`}
                            ></div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-gray-300">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    item.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <Link
                                href={`/news/${stateKey}/${city.toLowerCase().replace(" ", "-")}/${item._id}`}
                                className="text-yellow-400 hover:text-yellow-300 font-medium"
                              >
                                Read →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All News Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                All {decodedState} News
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {news.map((item) => (
                  <div
                    key={item._id}
                    className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white group"
                  >
                    <div className="relative w-full h-56 overflow-hidden">
                      <Image
                        src={item.photos?.[0]?.url || "/placeholder.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${currentState?.color ? `${currentState.color}/80` : "from-gray-800/80"} to-transparent`}
                      ></div>

                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.location || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          href={`/news/${stateKey}/${item.location?.toLowerCase().replace(" ", "-") || "unknown"}/${item._id}`}
                          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg"
                        >
                          Read
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
