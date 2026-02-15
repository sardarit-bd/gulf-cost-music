"use client";
import { ArrowLeft, Building2, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CityNewsPage() {
  const { state, city } = useParams();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityData, setCityData] = useState(null);

  // State and city information
  const statesData = {
    louisiana: { name: "Louisiana", color: "from-purple-600 to-indigo-700" },
    mississippi: { name: "Mississippi", color: "from-teal-400 to-cyan-600" },
    alabama: { name: "Alabama", color: "from-orange-400 to-red-500" },
    florida: { name: "Florida", color: "from-yellow-400 to-amber-600" },
  };

  useEffect(() => {
    const fetchCityNews = async () => {
      try {
        setLoading(true);
        const decodedState = decodeURIComponent(state);
        const decodedCity = decodeURIComponent(city);

        // Set city info
        setCityData({
          name: decodedCity,
          state: decodedState,
          color:
            statesData[decodedState.toLowerCase()]?.color ||
            "from-gray-600 to-gray-800",
        });

        // Fetch news for this specific city
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news?location=${decodedCity.toLowerCase()}`,
        );

        const data = await res.json();

        if (res.ok && data.data?.news) {
          setNews(data.data.news);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching city news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    if (state && city) {
      fetchCityNews();
    }
  }, [state, city]);

  if (loading) {
    return (
      <div className="brandBg text-white min-h-screen pt-28">
        <div className="container mx-auto px-6">
          <div className="h-12 bg-gray-700/50 rounded-lg w-64 mb-10 animate-pulse"></div>
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
  const decodedCity = decodeURIComponent(city);
  const stateKey = decodedState.toLowerCase();

  return (
    <section className="brandBg min-h-screen pt-24 px-6">
      <div className="container mx-auto">
        {/* City Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push(`/news/${stateKey}`)}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {decodedState}
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-white/10">
                  <Building2 className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
                    {decodedCity} News
                  </h1>
                  <p className="text-gray-300 capitalize">
                    Latest news from {decodedCity}, {decodedState}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">
                  {news.length}
                </div>
                <div className="text-sm text-gray-300">Articles</div>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
            <Link href="/news" className="hover:text-white">
              News
            </Link>
            <span>›</span>
            <Link
              href={`/news/${stateKey}`}
              className="hover:text-white capitalize"
            >
              {decodedState}
            </Link>
            <span>›</span>
            <span className="text-yellow-400 capitalize">{decodedCity}</span>
          </div>
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
                No news articles are currently available for {decodedCity},{" "}
                {decodedState}.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push(`/news/${stateKey}`)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors border border-white/20"
                >
                  View {decodedState} News
                </button>
                <button
                  onClick={() => router.push("/news")}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors"
                >
                  Browse All News
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                    className={`absolute inset-0 bg-gradient-to-t ${cityData?.color || "from-gray-800/80"} to-transparent`}
                  ></div>

                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.state || decodedState}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {item.title}
                  </h3>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description?.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      href={`/news/${stateKey}/${city}/${item._id}`}
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

        {/* Related Cities */}
        {statesData[stateKey] && (
          <div className="mt-16 pt-10 border-t border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              More Cities in {decodedState}
            </h3>
            <div className="flex flex-wrap gap-3">
              {statesData[stateKey].cities
                ?.filter((c) => c.toLowerCase() !== decodedCity.toLowerCase())
                .map((relatedCity) => (
                  <Link
                    key={relatedCity}
                    href={`/news/${stateKey}/${relatedCity.toLowerCase().replace(" ", "-")}`}
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{relatedCity}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
