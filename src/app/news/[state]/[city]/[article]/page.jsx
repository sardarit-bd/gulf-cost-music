"use client";

import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Eye,
  MapPin,
  Share2,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewsDetailsPage() {
  const { state, city, article } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);

  // State colors
  const stateColors = {
    louisiana: "from-purple-600 to-indigo-700",
    mississippi: "from-teal-400 to-cyan-600",
    alabama: "from-orange-400 to-red-500",
    florida: "from-yellow-400 to-amber-600",
  };

  useEffect(() => {
    const fetchNewsDetails = async () => {
      setLoading(true);
      try {
        // Fetch main article
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${article}`,
        );
        const data = await res.json();

        if (res.ok && data.data?.news) {
          setNews(data.data.news);

          // Fetch related news from same city
          if (data.data.news.location) {
            const relatedRes = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/news?location=${data.data.news.location}&limit=3`,
            );
            const relatedData = await relatedRes.json();
            if (relatedData.success) {
              setRelatedNews(
                relatedData.data.news.filter(
                  (item) => item._id !== data.data.news._id,
                ),
              );
            }
          }
        } else {
          setNews(null);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [article]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.description?.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="brandBg min-h-screen text-white pt-20">
        {/* Hero Skeleton */}
        <div className="relative w-full h-[400px] overflow-hidden bg-gray-700/50 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-6 py-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 animate-pulse">
            <div className="space-y-4 mb-8">
              <div className="h-8 bg-gray-600/50 rounded w-3/4"></div>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-600/50 rounded w-full"
                ></div>
              ))}
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
          <h1 className="text-3xl font-bold mb-3">Article Not Found</h1>
          <p className="text-gray-300 mb-6 max-w-md">
            The article you're looking for doesn't exist or may have been
            removed.
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

  const decodedState = decodeURIComponent(state);
  const decodedCity = decodeURIComponent(city);
  const stateKey = decodedState.toLowerCase();
  const currentColor = stateColors[stateKey] || "from-gray-600 to-gray-800";

  return (
    <section className="brandBg min-h-screen text-white pt-20">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-700/50 animate-pulse z-10"></div>
        )}

        {/* Background Image */}
        {news.photos?.[0]?.url && (
          <Image
            src={news.photos[0].url}
            alt={news.title}
            fill
            className="object-cover"
            priority
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        )}

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${currentColor}/90 via-black/60 to-transparent`}
        ></div>

        {/* Back Button */}
        <div className="container relative mx-auto px-6 pt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-105 z-20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Article Info */}
        <div className="container relative mx-auto h-full flex items-end px-6 pb-12">
          <div className="max-w-4xl">
            {/* Location Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
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
              <Link
                href={`/news/${stateKey}/${city}`}
                className="hover:text-white capitalize"
              >
                {decodedCity}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {news.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="capitalize">
                  {news.location}, {news.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(news.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{news.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 mb-8">
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">
                  Article
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                    {news.description}
                  </p>
                </div>
              </div>

              {/* Photo Gallery */}
              {news.photos?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-6">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {news.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                        onClick={() => window.open(photo.url, "_blank")}
                      >
                        <Image
                          src={photo.url}
                          alt={`${news.title} - Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                            Click to view full size
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm border border-white/20 transition transform hover:scale-105"
                >
                  <Share2 className="w-4 h-4" />
                  Share Article
                </button>
                <button
                  onClick={() => router.push(`/news/${stateKey}/${city}`)}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full font-semibold transition transform hover:scale-105"
                >
                  <Building2 className="w-4 h-4" />
                  More from {decodedCity}
                </button>
              </div>
            </div>

            {/* Related Articles */}
            {relatedNews.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  More from {decodedCity}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedNews.map((item) => (
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
                          className={`absolute inset-0 bg-gradient-to-t ${currentColor}/80 to-transparent`}
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
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link
                            href={`/news/${stateKey}/${city}/${item._id}`}
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
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Info */}
              {news.journalist && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Author
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-700/50 overflow-hidden">
                      {news.journalist.profilePhoto ? (
                        <Image
                          src={news.journalist.profilePhoto}
                          alt={news.journalist.username}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">
                        {news.journalist.fullName || news.journalist.username}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {news.journalist.email}
                      </p>
                      {news.journalist.city && (
                        <p className="text-sm text-gray-400 mt-1">
                          {news.journalist.city}, {news.journalist.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Info */}
              {news.credit && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Credit
                  </h3>
                  <p className="text-gray-300">{news.credit}</p>
                </div>
              )}

              {/* Stats */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">
                  Article Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Published</span>
                    <span className="text-white font-medium">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Views</span>
                    <span className="text-white font-medium">
                      {news.views || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Photos</span>
                    <span className="text-white font-medium">
                      {news.photos?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${news.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {news.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">
                  Navigation
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/news/${stateKey}/${city}`)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      More {decodedCity} News
                    </span>
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      →
                    </span>
                  </button>
                  <button
                    onClick={() => router.push(`/news/${stateKey}`)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      All {decodedState} News
                    </span>
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      →
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/news")}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      All Gulf Coast News
                    </span>
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
