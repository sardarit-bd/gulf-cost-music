"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function NewsDetailsPage() {
  const { city, article } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${article}`);
        const data = await res.json();
        console.log("this is new data:",data)

        if (res.ok && data.data?.news) {
          setNews(data.data.news);
        } else {
          setNews(null);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleNews();
  }, [article]);

  if (loading) {
    return (
      <div className="brandBg text-white min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading news...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-3">News Not Found 😢</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="brandBg min-h-screen py-16 px-6 mt-12">
      <div className="max-w-5xl mx-auto bg-white text-black rounded-2xl shadow-2xl overflow-hidden">
        {/* Image Banner */}
        <div className="relative w-full h-80 bg-gray-300">
          <Image
            src={news.photos?.[0]?.url || "/placeholder.jpg"}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-4">
          <h1 className="text-3xl font-bold brandColor">{news.title}</h1>
          <p className="text-gray-500 text-sm capitalize">
            {news.location} • {new Date(news.createdAt).toLocaleDateString()}
          </p>

          <p className="text-gray-800 leading-relaxed mt-4 whitespace-pre-line">
            {news.description}
          </p>

          {news.credit && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Credit:</span> {news.credit}
            </p>
          )}

          {news.journalist && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Author:</span>{" "}
              {news.journalist.fullName}
            </p>
          )}

          {/* Multiple Photos */}
          {news.photos?.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {news.photos.slice(1).map((photo, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-md overflow-hidden"
                >
                  <Image
                    src={photo.url}
                    alt={`photo-${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div className="pt-8">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition"
            >
              ← Back to {city} News
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
