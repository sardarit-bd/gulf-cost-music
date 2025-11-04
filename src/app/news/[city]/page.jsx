"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CityNewsPage() {
  const { city } = useParams();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news?location=${city.toLowerCase()}`
        );
        const data = await res.json();
        if (res.ok && data.data?.news) {
          setNews(data.data.news);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching city news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityNews();
  }, [city]);

  if (loading) {
    return (
      <div className="brandBg text-white min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading {city} news...</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">
          No news found for {city} 😢
        </h1>
        <button
          onClick={() => router.push("/news")}
          className="px-6 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="py-14 mt-20 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] capitalize">
            {city} News
          </h1>
          <button
            onClick={() => router.push("/news")}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border hover:bg-yellow-100 transition"
          >
            ← Back
          </button>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {news.map((item) => (
            <div
              key={item._id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white"
            >
              <div className="relative w-full h-56">
                <Image
                  src={item.photos?.[0]?.url || "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 text-left">
                <h2 className="text-lg font-bold text-[var(--primary)] mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  {item.location}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    🗓 {new Date(item.createdAt).toLocaleDateString()}
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
      </div>
    </section>
  );
}
