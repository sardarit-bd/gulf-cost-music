"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewsDetailsPage() {
  const { city, article } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchSingleNews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${article}`);
        const data = await res.json();
<<<<<<< HEAD
        console.log("this is new data:",data)

        if (res.ok && data.data?.news) {
          setNews(data.data.news);
        } else {
          setNews(null);
        }
=======
        if (res.ok && data.data?.news) setNews(data.data.news);
>>>>>>> origin/main
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchSingleNews();
  }, [article]);

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
    <section className="brandBg min-h-screen text-white mt-12">
      {/* ===== Header Banner ===== */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={news.photos?.[0]?.url || "/placeholder.jpg"}
          alt={news.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>
        <div className="container relative mx-auto h-full flex flex-col md:flex-row md:items-end md:justify-start justify-end bottom-10 left-10">
          <div className="flex gap-3 items-end">
            <div className="border-3 border-yellow-400 w-[170px] rounded-md  h-[200px]">
              <Image
                src={news.photos?.[0]?.url || "/placeholder.jpg"}
                alt={news.title}
                width={1000}
                height={1000}
                className="object-cover h-full w-full"
              />
            </div>
            <div>
              <h1 className="md:text-5xl text-3xl font-bold text-[var(--primary)]">
                {news.title}
              </h1>
              <p className="text-gray-300 mt-2 capitalize">
                {news.location} • {new Date(news.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
          {/* Description */}
          <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
            {news.description}
          </p>

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-300 mt-8">
            {news.credit && <div>🪶 Credit: {news.credit}</div>}
            {news.journalist && <div>✍️ Author: {news.journalist.fullName}</div>}
          </div>

          {/* Gallery */}
          {news.photos?.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {news.photos.slice(1).map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden">
                  <Image src={photo.url} alt={`photo-${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div className="pt-10">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform"
            >
              ← Back to {city} News
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
