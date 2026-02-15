"use client";
import {
  ArrowLeft,
  Camera,
  Heart,
  Mail,
  MapPin,
  Share2,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PhotographerProfile() {
  const { state, camera: photographerId } = useParams(); // Changed from {city, camera} to {state, camera}
  const router = useRouter();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isFavorite, setIsFavorite] = useState(false);

  // State mapping for display
  const stateMap = {
    louisiana: "Louisiana",
    mississippi: "Mississippi",
    alabama: "Alabama",
    florida: "Florida"
  };

  const formattedState = stateMap[state] || state;

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/photographers/${photographerId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPhotographer(data.data.photographer);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [photographerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-400 text-lg">
            Loading photographer profile...
          </p>
        </div>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <Camera size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Photographer Not Found</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black mt-[90px]">
      {/* Enhanced Hero Banner */}
      <div className="relative h-80 sm:h-96 md:h-[480px] overflow-hidden">
        <div className="absolute inset-0">
          {photographer.photos?.[0] && (
            <Image
              src={photographer.photos[0].url}
              alt={photographer.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent"></div>
        </div>

        <div className="relative container mx-auto h-full flex items-end pb-6 sm:pb-8 px-4 sm:px-6">
          {/* Navigation - Updated back link to use state */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
            <button
              onClick={() => router.push(`/cameras/${state}`)}
              className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-all duration-300 bg-black/30 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/10 hover:border-yellow-400/30 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5" />
              <span className="hidden xs:inline">Back to {formattedState}</span>
              <span className="xs:hidden">Back</span>
            </button>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 sm:p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 ${isFavorite
                    ? "bg-red-500/20 border-red-400/30 text-red-400"
                    : "bg-black/30 border-white/10 text-white/90 hover:border-red-400/30 hover:text-red-400"
                  }`}
              >
                <Heart
                  size={18}
                  className="sm:w-5"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
              <button className="p-2 sm:p-3 rounded-lg backdrop-blur-sm bg-black/30 border border-white/10 text-white/90 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300">
                <Share2 size={18} className="sm:w-5" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex items-end gap-4 sm:gap-6 text-white w-full">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-yellow-400 shadow-2xl">
                <Image
                  src={
                    photographer.photos?.[0]?.url || "/default-photographer.jpg"
                  }
                  alt={photographer.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="flex-1 pb-1 sm:pb-2 min-w-0">
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words">
                  {photographer.name}
                </h1>
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4 text-white/80 text-sm sm:text-base">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full w-fit">
                  <MapPin size={16} className="sm:w-4 text-yellow-400" />
                  <span className="capitalize font-medium">
                    {photographer.city}, {formattedState}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Camera size={16} className="sm:w-4 text-blue-400" />
                    <span>{photographer.services?.length || 0} Services</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span>{photographer.photos?.length || 0} Photos</span>
                  </div>
                  {photographer.videos?.length > 0 && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Video size={16} className="sm:w-4 text-purple-400" />
                      <span>{photographer.videos.length} Videos</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Contact Card */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Contact Info
              </h3>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-700/50 text-white rounded-lg sm:rounded-xl border border-gray-600/50 text-sm sm:text-base">
                <Mail size={18} className="sm:w-5 text-yellow-400" />
                <span className="font-medium truncate">
                  {photographer.user?.email}
                </span>
              </div>
            </div>

            {/* Services Card */}
            {photographer.services && photographer.services.length > 0 && (
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Services & Pricing
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {photographer.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-300 group text-sm sm:text-base"
                    >
                      <span className="font-medium text-white group-hover:text-yellow-400 transition-colors truncate mr-2">
                        {service.service}
                      </span>
                      <span className="font-bold text-yellow-500 bg-yellow-500/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                        {service.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Portfolio Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {photographer.services?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    Services
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">
                    {photographer.photos?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    Photos
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                    {photographer.videos?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    Videos
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400 capitalize">
                    {photographer.state}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    State
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            {/* Enhanced Tabs */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl mb-6 sm:mb-8 border border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-700/50">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    {
                      id: "portfolio",
                      label: "Portfolio",
                      icon: Camera,
                      count: photographer.photos?.length,
                    },
                    { id: "about", label: "About", icon: MapPin },
                    {
                      id: "videos",
                      label: "Videos",
                      icon: Video,
                      count: photographer.videos?.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-semibold transition-all duration-300 whitespace-nowrap border-b-2 text-sm sm:text-base ${activeTab === tab.id
                          ? "text-yellow-400 border-yellow-400 bg-yellow-400/5"
                          : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
                        }`}
                    >
                      <tab.icon size={18} className="sm:w-5 md:w-6" />
                      {tab.label}
                      {tab.count > 0 && (
                        <span
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${activeTab === tab.id
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-700 text-gray-300"
                            }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === "portfolio" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Portfolio Gallery
                    </h3>
                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                      Explore {photographer.name}'s stunning photography work
                    </p>

                    {photographer.photos && photographer.photos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {photographer.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                          >
                            <Image
                              src={photo.url}
                              alt={`Portfolio ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                              <span className="text-white font-semibold text-sm sm:text-base">
                                Photo {index + 1}
                              </span>
                            </div>
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/60 text-white px-2 py-1 rounded-lg text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 sm:py-16">
                        <Camera
                          size={48}
                          className="sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-500"
                        />
                        <p className="text-gray-400 text-base sm:text-lg">
                          No portfolio photos available yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "about" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      About {photographer.name}
                    </h3>
                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                      Get to know the artist behind the lens
                    </p>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-base sm:text-lg bg-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                        {photographer.biography ||
                          "No biography available yet. This photographer prefers to let their work speak for itself."}
                      </p>
                    </div>

                    {/* Enhanced Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                        <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                          <MapPin
                            className="text-yellow-400"
                            size={20}
                            className="sm:w-6"
                          />
                          Location & Coverage
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg text-sm sm:text-base">
                            <span className="text-gray-300">Based in</span>
                            <span className="text-white font-semibold capitalize">
                              {photographer.city}, {formattedState}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg text-sm sm:text-base">
                            <span className="text-gray-300">State</span>
                            <span className="text-white font-semibold capitalize">
                              {formattedState}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg text-sm sm:text-base">
                            <span className="text-gray-300">Coverage Area</span>
                            <span className="text-white font-semibold">
                              Gulf Coast Region
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                        <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                          <Camera
                            className="text-green-400"
                            size={20}
                            className="sm:w-6"
                          />
                          Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {photographer.services?.map((service, index) => (
                            <span
                              key={index}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30"
                            >
                              {service.service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "videos" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Video Portfolio
                    </h3>
                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                      Motion and storytelling through video
                    </p>

                    {photographer.videos && photographer.videos.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {photographer.videos.map((video, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30"
                          >
                            <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-black">
                              <video
                                src={video.url}
                                controls
                                className="w-full h-full object-contain"
                                poster={`https://res.cloudinary.com/demo/video/upload/w_500,h_300,c_fill/${video.public_id}.jpg`}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-white text-base sm:text-lg truncate mr-2">
                                {video.title}
                              </h4>
                              <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                                Video {index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 sm:py-16">
                        <Video
                          size={48}
                          className="sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-500"
                        />
                        <p className="text-gray-400 text-base sm:text-lg">
                          No videos available yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}