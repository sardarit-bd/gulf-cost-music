"use client";
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VenueProfile() {
  const { city, venue: venueId } = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/${venueId}`);
        const data = await res.json();
        if (res.ok && data.data?.venue) {
          setVenue(data.data.venue);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  // Loading State
  if (loading) {
    return (
      <div className="brandBg min-h-screen text-white pt-16">
        {/* Header Skeleton */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-700/50 animate-pulse">
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

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="h-4 bg-gray-600/50 rounded w-32"></div>
              <div className="h-4 bg-gray-600/50 rounded w-24"></div>
              <div className="h-4 bg-gray-600/50 rounded w-28"></div>
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
      <div className="brandBg text-white min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-16 ">
        <div className="text-center">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Venue Not Found 😢</h1>
          <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
            The venue you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-black rounded-full font-medium hover:bg-yellow-500 transition flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="brandBg min-h-screen text-white mt-[90px]">
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
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>

        {/* Back Button */}


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
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-gray-300 text-xs sm:text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="capitalize">{venue.city}</span>
                </div>
                {venue.seatingCapacity && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{venue.seatingCapacity} capacity</span>
                  </div>
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
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
              {venue.biography || "No description available for this venue."}
            </p>
          </div>

          {/* Venue Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {venue.address && (
              <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400">Address</p>
                  <p className="text-white font-medium text-sm sm:text-base truncate">{venue.address}</p>
                </div>
              </div>
            )}

            {venue.seatingCapacity && (
              <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Capacity</p>
                  <p className="text-white font-medium text-sm sm:text-base">{venue.seatingCapacity} people</p>
                </div>
              </div>
            )}

            {venue.openHours && (
              <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Open Hours</p>
                  <p className="text-white font-medium text-sm sm:text-base">{venue.openHours}</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Photos if available */}
          {venue.photos && venue.photos.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {venue.photos.map((photo, index) => (
                  <div key={index} className="relative h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden">
                    <Image
                      src={photo.url}
                      alt={`${venue.venueName} photo ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 hover:scale-105 transition transform text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-0"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Back to Venues</span>
            </button>

            <button
              onClick={() => router.push('/venues')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm border border-white/20 transition transform hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-0"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">All Venues</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}