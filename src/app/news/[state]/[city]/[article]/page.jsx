"use client";

import {
  ArrowLeft,
  Bookmark,
  Building2,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  Globe,
  Heart,
  MapPin,
  Maximize2,
  Share2,
  Tag,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// State colors based on your brand system
const stateColors = {
  louisiana: {
    bg: "from-[var(--primary)]/30 to-[var(--secondary)]/40",
    text: "text-[var(--primary)]",
    border: "border-[var(--primary)]",
    badge: "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30",
    gradient: "bg-gradient-to-r from-[var(--primary)]/20 via-[var(--secondary)]/30 to-[var(--primary)]/20",
    hover: "hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/50",
  },
  mississippi: {
    bg: "from-[var(--accent)]/30 to-[var(--secondary)]/40",
    text: "text-[var(--accent)]",
    border: "border-[var(--accent)]",
    badge: "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30",
    gradient: "bg-gradient-to-r from-[var(--accent)]/20 via-[var(--secondary)]/30 to-[var(--accent)]/20",
    hover: "hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/50",
  },
  alabama: {
    bg: "from-[var(--chart-2)]/30 to-[var(--secondary)]/40",
    text: "text-[var(--chart-2)]",
    border: "border-[var(--chart-2)]",
    badge: "bg-[var(--chart-2)]/20 text-[var(--chart-2)] border border-[var(--chart-2)]/30",
    gradient: "bg-gradient-to-r from-[var(--chart-2)]/20 via-[var(--secondary)]/30 to-[var(--chart-2)]/20",
    hover: "hover:bg-[var(--chart-2)]/10 hover:border-[var(--chart-2)]/50",
  },
  florida: {
    bg: "from-[var(--primary)]/40 to-[var(--accent)]/40",
    text: "text-[var(--primary)]",
    border: "border-[var(--primary)]",
    badge: "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30",
    gradient: "bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/30 to-[var(--primary)]/20",
    hover: "hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/50",
  },
};

// Lightbox Modal Component
function LightboxModal({ images, currentIndex, onClose, onNavigate }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const imageUrl = images[currentIndex].url;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `news-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNavigate('prev');
    if (e.key === 'ArrowRight') onNavigate('next');
  }, [onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="absolute top-6 right-20 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110 disabled:opacity-50"
      >
        {isDownloading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download className="w-6 h-6" />
        )}
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="relative z-0 w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex items-center justify-center">
          <Image
            src={images[currentIndex].url}
            alt={`News image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Thumbnail Strip (for multiple images) */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-xl">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentIndex
                ? 'border-[var(--primary)] scale-110'
                : 'border-transparent hover:border-white/50'
                }`}
            >
              <Image
                src={images[index].url}
                alt={`Thumbnail ${index + 1}`}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsDetailsPage() {
  const { state, city, article } = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/news?location=${data.data.news.location}&limit=4`,
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

  const handleLike = () => {
    setLiked(!liked);
    toast.success(!liked ? "Added to likes!" : "Removed from likes");
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(
      !bookmarked ? "Article bookmarked!" : "Removed from bookmarks",
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  // Lightbox Functions
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const navigateLightbox = (direction) => {
    if (direction === 'prev') {
      setLightboxIndex(prev =>
        prev === 0 ? news.photos.length - 1 : prev - 1
      );
    } else if (direction === 'next') {
      setLightboxIndex(prev =>
        prev === news.photos.length - 1 ? 0 : prev + 1
      );
    } else if (typeof direction === 'number') {
      setLightboxIndex(direction);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
        <Toaster />
        {/* Hero Skeleton */}
        <div className="relative w-full h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--card)] via-[var(--muted)] to-[var(--card)] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-[var(--card)]/50 rounded-lg w-3/4 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-[var(--card)]/50 rounded w-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-[var(--card)]/50 rounded-xl animate-pulse"></div>
                <div className="h-32 bg-[var(--card)]/50 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!news) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-center items-center px-4">
        <Toaster />
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 bg-[var(--card)] rounded-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-[var(--muted-foreground)]" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
            Article Not Found
          </h1>
          <p className="text-[var(--muted-foreground)] mb-8 text-lg">
            The article you're looking for doesn't exist or may have been
            removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => router.push("/news")}
              className="px-8 py-3 bg-[var(--card)] hover:bg-[var(--card)]/80 text-[var(--foreground)] font-semibold rounded-full border border-[var(--border)] transition-all duration-300"
            >
              Browse News
            </button>
          </div>
        </div>
      </div>
    );
  }

  const decodedState = decodeURIComponent(state);
  const decodedCity = decodeURIComponent(city);
  const stateKey = decodedState.toLowerCase();
  const currentColor = stateColors[stateKey] || {
    bg: "from-[var(--muted)]/30 to-[var(--secondary)]/40",
    text: "text-[var(--muted-foreground)]",
    border: "border-[var(--border)]",
    badge: "bg-[var(--muted)]/20 text-[var(--muted-foreground)] border border-[var(--border)]",
    gradient: "bg-gradient-to-r from-[var(--muted)]/20 via-[var(--secondary)]/30 to-[var(--muted)]/20",
    hover: "hover:bg-[var(--muted)]/10 hover:border-[var(--border)]",
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      <Toaster />

      {/* Lightbox Modal */}
      {lightboxOpen && news.photos && (
        <LightboxModal
          images={news.photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}

      {/* Hero Section with Enhanced Design */}
      <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        {news.photos?.[0]?.url && (
          <div className="absolute inset-0">
            <Image
              src={news.photos[0].url}
              alt={news.title}
              fill
              className="object-cover transform scale-105"
              priority
              quality={100}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--card)] via-[var(--muted)] to-[var(--card)] animate-pulse"></div>
            )}
          </div>
        )}

        {/* Gradient Overlay with Animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-transparent"></div>
        <div
          className={`absolute inset-0 bg-gradient-to-t ${currentColor.bg} via-transparent to-transparent`}
        ></div>

        {/* Floating Action Buttons */}
        <div className="container relative mx-auto px-4 sm:px-6 pt-8">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 px-4 py-3 bg-[var(--card)]/60 backdrop-blur-lg text-[var(--foreground)] rounded-full border border-[var(--border)] hover:bg-[var(--card)] hover:border-[var(--primary)] transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`p-3 rounded-full backdrop-blur-lg border transition-all duration-300 transform hover:scale-110 ${liked
                  ? "bg-[var(--destructive)]/20 border-[var(--destructive)]/50 text-[var(--destructive)]"
                  : "bg-[var(--card)]/60 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)]"
                  }`}
              >
                <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-3 rounded-full backdrop-blur-lg border transition-all duration-300 transform hover:scale-110 ${bookmarked
                  ? "bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]"
                  : "bg-[var(--card)]/60 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)]"
                  }`}
              >
                <Bookmark className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full backdrop-blur-lg bg-[var(--card)]/60 border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)] transition-all duration-300 transform hover:scale-110"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Info Overlay */}
        <div className="container relative mx-auto h-full flex items-end px-4 sm:px-6 pb-12 lg:pb-16">
          <div className="max-w-4xl">
            {/* Location Breadcrumb with Icons */}
            <div className="flex items-center gap-2 text-sm mb-6">
              <Link
                href="/news"
                className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Globe className="w-4 h-4" />
                News
              </Link>
              <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
              <Link
                href={`/news/${stateKey}`}
                className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors capitalize"
              >
                <MapPin className="w-4 h-4" />
                {decodedState}
              </Link>
              <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
              <span className="flex items-center gap-1 text-[var(--foreground)] font-medium capitalize">
                <Building2 className="w-4 h-4" />
                {decodedCity}
              </span>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--muted-foreground)] to-[var(--muted)] bg-clip-text text-transparent">
                {news.title}
              </span>
            </h1>

            {/* Meta Info Cards */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-[var(--card)]/60 backdrop-blur-lg rounded-full border border-[var(--border)]">
                <Calendar className="w-5 h-5 text-[var(--muted-foreground)]" />
                <span className="text-[var(--muted-foreground)]">{getTimeAgo(news.createdAt)}</span>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-[var(--card)]/60 backdrop-blur-lg rounded-full border border-[var(--border)]">
                <Eye className="w-5 h-5 text-[var(--muted-foreground)]" />
                <span className="text-[var(--muted-foreground)]">{news.views || 0} views</span>
              </div>

              <div className={`px-4 py-2 rounded-full border ${currentColor.border} ${currentColor.badge}`}>
                <span className="flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4" />
                  {decodedCity}, {decodedState}
                </span>
              </div>
            </div>

            {/* Author Info */}
            {news.journalist && (
              <div className="flex items-center gap-4 p-4 bg-[var(--card)]/40 backdrop-blur-lg rounded-2xl border border-[var(--border)]">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--border)]">
                  {news.journalist.profilePhoto ? (
                    <Image
                      src={news.journalist.profilePhoto}
                      alt={news.journalist.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--muted)] to-[var(--card)] flex items-center justify-center">
                      <User className="w-6 h-6 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">
                    {news.journalist.fullName || news.journalist.username}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Journalist</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Content Card */}
              <div className="bg-gradient-to-br from-[var(--card)]/50 to-[var(--background)]/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10 border border-[var(--border)] mb-8 shadow-2xl">
                {/* Credit Section */}
                {news.credit && (
                  <div className="mb-8 p-4 bg-[var(--card)]/40 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <p className="text-sm text-[var(--muted-foreground)]">Credit</p>
                        <p className="text-[var(--foreground)] font-medium">{news.credit}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <div className="mb-10">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-[var(--muted-foreground)] leading-relaxed text-lg whitespace-pre-line">
                      {news.description}
                    </div>
                  </div>
                </div>

                {/* Tags (if any) */}
                {news.tags && news.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-[var(--muted-foreground)]" />
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {news.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[var(--card)] hover:bg-[var(--card)]/80 text-[var(--muted-foreground)] rounded-full text-sm transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Gallery with Thumbnails */}
                {news.photos?.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Camera className="w-6 h-6 text-[var(--primary)]" />
                        <h2 className="text-2xl font-bold text-[var(--foreground)]">
                          Photo Gallery
                        </h2>
                      </div>
                      <span className="text-[var(--muted-foreground)]">
                        {news.photos.length} photos
                      </span>
                    </div>

                    {/* Main Image with Lightbox Trigger */}
                    <div className="mb-6">
                      <div
                        className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(activeImageIndex)}
                      >
                        <Image
                          src={news.photos[activeImageIndex].url}
                          alt={`${news.title} - Image ${activeImageIndex + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* View Fullscreen Button */}
                        <div className="absolute bottom-4 left-4 bg-[var(--background)]/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                          <Maximize2 className="w-4 h-4" />
                          <span className="text-sm text-[var(--foreground)]">
                            Click to view fullscreen
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnails with Lightbox Navigation */}
                    {news.photos.length > 1 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {news.photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setActiveImageIndex(index);
                              openLightbox(index);
                            }}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group ${activeImageIndex === index
                              ? "border-[var(--primary)] scale-105"
                              : "border-transparent hover:border-[var(--border)]"
                              }`}
                          >
                            <Image
                              src={photo.url}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {activeImageIndex === index && (
                              <div className="absolute inset-0 bg-[var(--primary)]/20"></div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Social Actions */}
                <div className="flex flex-wrap gap-4 pt-8 border-t border-[var(--border)]">
                  <button
                    onClick={() => router.push(`/news/${stateKey}/${city}`)}
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] font-semibold hover:opacity-90 transition-all duration-300"
                  >
                    <Building2 className="w-5 h-5" />
                    More from {decodedCity}
                  </button>
                </div>
              </div>

              {/* Related Articles */}
              {relatedNews.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                        More from {decodedCity}
                      </h2>
                      <p className="text-[var(--muted-foreground)]">
                        Discover more stories from {decodedCity}
                      </p>
                    </div>
                    <Link
                      href={`/news/${stateKey}/${city}`}
                      className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--accent)] font-medium transition-colors"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {relatedNews.map((item) => (
                      <div
                        key={item._id}
                        className={`group bg-gradient-to-br from-[var(--card)]/50 to-[var(--background)]/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-[var(--border)] ${currentColor.hover} transition-all duration-500 hover:shadow-2xl`}
                      >
                        <div className="relative h-48">
                          <Image
                            src={item.photos?.[0]?.url || "/placeholder.jpg"}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t ${currentColor.bg} via-transparent to-transparent`}
                          ></div>
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentColor.badge}`}>
                              {item.location}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-2">
                            {item.description?.substring(0, 100)}...
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                              <Calendar className="w-4 h-4" />
                              <span>{getTimeAgo(item.createdAt)}</span>
                            </div>
                            <Link
                              href={`/news/${stateKey}/${city}/${item._id}`}
                              className="flex items-center gap-1 text-[var(--primary)] hover:text-[var(--accent)] font-medium text-sm transition-colors group"
                            >
                              Read more
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              <div className="sticky top-28 space-y-6">
                {/* Article Stats */}
                <div className="bg-gradient-to-br from-[var(--card)]/50 to-[var(--background)]/50 backdrop-blur-xl rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Article Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--muted-foreground)]">Published</span>
                      <span className="text-[var(--foreground)] font-medium">
                        {formatDate(news.createdAt)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between items-center">
                      <span className="text-[var(--muted-foreground)]">Last Updated</span>
                      <span className="text-[var(--foreground)] font-medium">
                        {getTimeAgo(news.updatedAt)}
                      </span>
                    </div> */}
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--muted-foreground)]">Views</span>
                      <span className="text-[var(--foreground)] font-medium">
                        {news.views || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--muted-foreground)]">Photos</span>
                      <span className="text-[var(--foreground)] font-medium">
                        {news.photos?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--muted-foreground)]">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${news.isActive
                          ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                          : "bg-[var(--destructive)]/20 text-[var(--destructive)]"
                          }`}
                      >
                        {news.isActive ? "Active" : "Archived"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}