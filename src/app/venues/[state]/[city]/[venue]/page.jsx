"use client";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, Clock, Globe, MapPin, Maximize2, Phone, Star, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VenueProfile() {
  const { state, city, venue: venueId } = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // Gallery Modal States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Format state and city names
  const formattedState = decodeURIComponent(state)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedCity = decodeURIComponent(city)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    // Check if we can go back
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 2);
    }
  }, []);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      try {
        console.log("Fetching venue ID:", venueId);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/${venueId}`);

        console.log("Venue API response status:", res.status);

        if (!res.ok) {
          if (res.status === 404) {
            setVenue(null);
            return;
          }
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Venue data:", data);

        if (data.success && data.data?.venue) {
          setVenue(data.data.venue);
        } else {
          setVenue(null);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        setVenue(null);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchVenue function
    if (venueId) {
      fetchVenue();
    }
  }, [venueId]);

  // Handle back navigation
  const handleBack = () => {
    console.log("clicked")
    router.push(`/venues/${state}/${city}`);
  };


  // const handleBack = () => {
  //   router.push(`/venues/${state}/${city}`);
  // };

  // Open gallery modal
  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  // Close gallery modal
  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Navigate to next image
  const nextImage = () => {
    if (venue?.photos && venue.photos.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % venue.photos.length);
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    if (venue?.photos && venue.photos.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + venue.photos.length) % venue.photos.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;

      switch (e.key) {
        case 'Escape':
          closeGallery();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen]);

  // Loading State
  if (loading) {
    return (
      <div className="brandBg min-h-screen text-white pt-16">
        {/* Breadcrumb Skeleton */}
        <div className="container mx-auto px-4 sm:px-6 pt-6">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-600/50 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Header Skeleton */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-700/50 animate-pulse mt-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>
          <div className="container relative mx-auto h-full flex flex-col justify-end pb-4 sm:pb-6 md:pb-8 lg:pb-10 px-4 sm:px-6">
            <div className="flex gap-3 sm:gap-4 md:gap-6 items-end">
              <div className="border-2 sm:border-3 md:border-4 border-yellow-400 w-20 h-24 sm:w-28 sm:h-32 md:w-36 md:h-40 lg:w-44 lg:h-48 rounded-md bg-gray-600/50 animate-pulse flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-gray-600/50 rounded w-32 sm:w-40 md:w-56 lg:w-64 mb-2 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-600/50 rounded w-24 sm:w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/10 animate-pulse">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-4 bg-gray-600/50 rounded w-full"></div>
              <div className="h-4 bg-gray-600/50 rounded w-5/6"></div>
              <div className="h-4 bg-gray-600/50 rounded w-4/6"></div>
              <div className="h-4 bg-gray-600/50 rounded w-full"></div>
              <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="h-20 bg-gray-600/30 rounded-lg"></div>
              <div className="h-20 bg-gray-600/30 rounded-lg"></div>
              <div className="h-20 bg-gray-600/30 rounded-lg"></div>
            </div>

            <div className="pt-6 sm:pt-8 md:pt-10">
              <div className="h-8 sm:h-10 bg-gray-600/50 rounded-full w-24 sm:w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!venue) {
    return (
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-16">
        <div className="text-center">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Venue Not Found 😢</h1>
          <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
            The venue you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBack}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-500 transition flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Go Back
            </button>
            <button
              onClick={() => router.push('/venues')}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              Browse Venues
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Modal */}
      {isGalleryOpen && venue?.photos && venue.photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition z-50"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition z-50"
          >
            <ChevronRightIcon size={24} />
          </button>

          {/* Main Image */}
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] mx-4">
            <Image
              src={venue.photos[selectedImageIndex]?.url}
              alt={`${venue.venueName} - Image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {selectedImageIndex + 1} / {venue.photos.length}
          </div>

          {/* Thumbnail Strip */}
          {venue.photos.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 overflow-x-auto py-4">
              <div className="flex justify-center gap-2 px-4">
                {venue.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImageIndex === index ? 'border-yellow-400' : 'border-transparent'}`}
                  >
                    <Image
                      src={photo.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Download Button */}
          <a
            href={venue.photos[selectedImageIndex]?.url}
            download
            className="absolute bottom-4 right-4 p-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-600 transition z-50"
            title="Download image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      )}

      <section className="brandBg min-h-screen text-white pt-18">
        {/* Breadcrumb Navigation */}
        <div className="bg-black/50 border-b border-gray-800 py-3 px-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Link href="/venues" className="hover:text-yellow-400 transition">
                Venues
              </Link>
              <ChevronRight size={14} />
              <Link href={`/venues/${state}`} className="hover:text-yellow-400 transition">
                {formattedState}
              </Link>
              <ChevronRight size={14} />
              <Link href={`/venues/${state}/${city}`} className="hover:text-yellow-400 transition capitalize">
                {formattedCity}
              </Link>
              <ChevronRight size={14} />
              <span className="text-yellow-400 font-semibold truncate max-w-[200px]">
                {venue.venueName}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section with Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-700/50 animate-pulse z-10"></div>
          )}
          <Image
            src={venue.photos?.[0]?.url || "/default.jpg"}
            alt={venue.venueName}
            fill
            className="object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>

          {/* Back Button - Top Left */}
          <div className="absolute inset-x-0 top-4 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-yellow-300 px-4 py-2 rounded-lg hover:bg-black/70 transition"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            </div>
          </div>


          {/* Venue Verification Badge */}
          {venue.verifiedOrder > 0 && (
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-full font-semibold">
                <Star size={14} />
                Verified #{venue.verifiedOrder}
              </span>
            </div>
          )}

          <div className="container relative mx-auto h-full flex flex-col justify-end pb-4 sm:pb-6 md:pb-8 lg:pb-10 px-4 sm:px-6">
            <div className="flex gap-3 sm:gap-4 md:gap-6 items-end">
              {/* Venue Thumbnail */}
              <div className="border-2 sm:border-3 md:border-4 border-yellow-400 w-20 h-24 sm:w-28 sm:h-32 md:w-36 md:h-40 lg:w-44 lg:h-48 rounded-lg relative overflow-hidden shadow-2xl flex-shrink-0">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-600/50 animate-pulse"></div>
                )}
                <Image
                  src={venue.photos?.[0]?.url || "/default.jpg"}
                  alt={venue.venueName}
                  fill
                  className="object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>

              {/* Venue Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2 break-words">
                  {venue.venueName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-300 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="capitalize">{venue.city}, {venue.state}</span>
                  </div>
                  {venue.seatingCapacity && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{venue.seatingCapacity.toLocaleString()} capacity</span>
                    </div>
                  )}
                  {venue.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/10">
            {/* Biography */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">About</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                {venue.biography || "No description available for this venue."}
              </p>
            </div>

            {/* Venue Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {venue.address && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-400">Address</p>
                    <p className="text-white font-medium text-sm sm:text-base break-words">{venue.address}</p>
                  </div>
                </div>
              )}

              {venue.seatingCapacity && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Seating Capacity</p>
                    <p className="text-white font-medium text-sm sm:text-base">{venue.seatingCapacity.toLocaleString()} people</p>
                  </div>
                </div>
              )}

              {venue.openHours && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Open Hours</p>
                    <p className="text-white font-medium text-sm sm:text-base">{venue.openHours}</p>
                  </div>
                </div>
              )}

              {venue.openDays && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Open Days</p>
                    <p className="text-white font-medium text-sm sm:text-base">{venue.openDays}</p>
                  </div>
                </div>
              )}

              {venue.phone && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium text-sm sm:text-base">{venue.phone}</p>
                  </div>
                </div>
              )}

              {venue.website && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Website</p>
                    <a
                      href={venue.website.startsWith('http') ? venue.website : `https://${venue.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium text-sm sm:text-base hover:text-yellow-400 transition truncate block"
                    >
                      {venue.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}

              {/* Color Code Display */}
              {venue.colorCode && (
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border border-white/30"
                    style={{ backgroundColor: venue.colorCode }}
                  ></div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Venue Color</p>
                    <p className="text-white font-medium text-sm sm:text-base">{venue.colorCode}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Gallery Section */}
            {venue.photos && venue.photos.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">Gallery</h2>
                  {/* <button
                    onClick={() => openGallery(0)}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-yellow-400 transition"
                  >
                    <Maximize2 size={16} />
                    View All ({venue.photos.length})
                  </button> */}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {venue.photos.slice(0, 4).map((photo, index) => (
                    <div
                      key={index}
                      className="relative h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden group cursor-pointer"
                      onClick={() => openGallery(index)}
                    >
                      <Image
                        src={photo.url}
                        alt={`${venue.venueName} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Overlay Content */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Image Number Badge (for first 4 images) */}
                      {index === 3 && venue.photos.length > 4 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          +{venue.photos.length - 4} more
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* <div className="mt-3 text-gray-400 text-sm">
                  Click on any image to open full-screen gallery with navigation
                </div> */}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-white/10">
              {/* Back to City Venues */}
              <button
                onClick={() => router.push(`/venues/${state}/${city}`)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-0"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">Back to {formattedCity}</span>
              </button>

              {/* Back to State Venues */}
              <button
                onClick={() => router.push(`/venues/${state}`)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm border border-white/20 transition transform hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-0"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{formattedState} Venues</span>
              </button>

              {/* All Venues */}
              <button
                onClick={() => router.push('/venues')}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm border border-white/10 transition transform hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-0"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">All Venues</span>
              </button>

              {/* Contact Button (if phone available) */}
              {venue.phone && (
                <a
                  href={`tel:${venue.phone}`}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full font-semibold backdrop-blur-sm border border-green-500/30 transition transform hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-0"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Call Venue</span>
                </a>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-yellow-400">
                    {venue.seatingCapacity?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Capacity</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-blue-400">
                    {venue.photos?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Photos</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-purple-400">
                    {venue.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Listing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}