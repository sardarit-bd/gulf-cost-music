"use client";

import { ArrowLeft, Calendar, CreditCard, MapPin, User } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewsDetailsPage() {
  const { city, article } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchSingleNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${article}`);
        const data = await res.json();

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

  // Loading State
  if (loading) {
    return (
      <div className="brandBg min-h-screen text-white mt-20">
        {/* Header Skeleton */}
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-700/50 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>
          <div className="container relative mx-auto h-full flex flex-col md:flex-row md:items-end md:justify-start justify-end bottom-10 left-10">
            <div className="flex gap-6 items-end">
              <div className="border-4 border-yellow-400 w-[170px] rounded-lg h-[200px] bg-gray-600/50 animate-pulse"></div>
              <div>
                <div className="h-12 bg-gray-600/50 rounded w-96 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-600/50 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10 animate-pulse">
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-gray-600/50 rounded w-full"></div>
              <div className="h-4 bg-gray-600/50 rounded w-5/6"></div>
              <div className="h-4 bg-gray-600/50 rounded w-4/6"></div>
              <div className="h-4 bg-gray-600/50 rounded w-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="h-4 bg-gray-600/50 rounded w-32"></div>
              <div className="h-4 bg-gray-600/50 rounded w-40"></div>
            </div>

            <div className="pt-10">
              <div className="h-10 bg-gray-600/50 rounded-full w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!news) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center px-6">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">News Article Not Found 😢</h1>
          <p className="text-gray-300 mb-6 max-w-md">
            The news article you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-500 transition flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const decodedCity = decodeURIComponent(city);

  return (
    <section className="brandBg min-h-screen text-white mt-20">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-700/50 animate-pulse z-10"></div>
        )}
        <Image
          src={news.photos?.[0]?.url || "/placeholder.jpg"}
          alt={news.title}
          fill
          className="object-cover"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="container relative mx-auto h-full flex flex-col md:flex-row md:items-end md:justify-start justify-end pb-10">
          <div className="flex gap-6 items-end">
            {/* News Thumbnail */}
            <div className="border-4 border-yellow-400 w-[170px] rounded-lg h-[200px] relative overflow-hidden shadow-2xl">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-600/50 animate-pulse"></div>
              )}
              <Image
                src={news.photos?.[0]?.url || "/placeholder.jpg"}
                alt={news.title}
                fill
                className="object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>

            {/* News Info */}
            <div className="flex-1">
              <h1 className="md:text-5xl text-3xl font-bold text-yellow-400 mb-2">
                {news.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="capitalize">{decodedCity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/10">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Article</h2>
            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
              {news.description || "No description available for this article."}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {news.credit && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <CreditCard className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Credit</p>
                  <p className="text-white font-medium">{news.credit}</p>
                </div>
              </div>
            )}

            {news.journalist && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <User className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Author</p>
                  <p className="text-white font-medium">{news.journalist.username}</p>
                </div>
              </div>
            )}
          </div>

          {/* Gallery */}
          {news.photos?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {news.photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={photo.url}
                      alt={`${news.title} photo ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {decodedCity} News
            </button>

            <button
              onClick={() => router.push('/news')}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm border border-white/20 transition transform hover:scale-105"
            >
              All News
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}