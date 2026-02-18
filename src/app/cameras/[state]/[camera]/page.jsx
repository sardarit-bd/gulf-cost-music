"use client";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  MapPin,
  Maximize2,
  Video,
  X
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PhotographerProfile() {
  const { state, camera: photographerId } = useParams();
  const router = useRouter();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [emailCopied, setEmailCopied] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State mapping for display
  const stateMap = {
    LA: "Louisiana",
    MS: "Mississippi",
    AL: "Alabama",
    FL: "Florida"
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

  // Copy email function
  const copyEmailToClipboard = () => {
    if (photographer?.user?.email) {
      navigator.clipboard.writeText(photographer.user.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  // Lightbox functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? photographer.photos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === photographer.photos.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Get latest 4 services
  const latestServices = photographer?.services
    ? [...photographer.services].reverse().slice(0, 4)
    : [];

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
      {/* Lightbox Modal */}
      {lightboxOpen && photographer.photos && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {photographer.photos.length}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Main image */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto p-4">
            <div className="relative w-full h-full">
              <Image
                src={photographer.photos[currentImageIndex].url}
                alt={`Portfolio ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

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
          {/* Navigation */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
            <button
              onClick={() => router.push(`/cameras/${state}`)}
              className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-all duration-300 bg-black/30 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/10 hover:border-yellow-400/30 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5" />
              <span className="hidden xs:inline">Back to {formattedState}</span>
              <span className="xs:hidden">Back</span>
            </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Contact Card */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 border border-gray-700/50 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Contact Info
              </h3>
              <div className="flex items-center justify-between gap-2 p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Mail size={16} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {photographer.user?.email}
                  </span>
                </div>
                <button
                  onClick={copyEmailToClipboard}
                  className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0"
                  title="Copy email"
                >
                  {emailCopied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-yellow-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Latest Services Card - Only 4 latest services */}
            {latestServices.length > 0 && (
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Latest Services
                  </h3>
                  {photographer.services.length > 4 && (
                    <button
                      onClick={() => setActiveTab("services")}
                      className="text-xs text-yellow-400 hover:text-yellow-300 transition"
                    >
                      View all ({photographer.services.length})
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {latestServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-300 group"
                    >
                      <span className="font-medium text-white group-hover:text-yellow-400 transition-colors truncate mr-2 text-xs sm:text-sm">
                        {service.service}
                      </span>
                      <span className="font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                        ${Number(service.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Information Card */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Information
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <div className="text-lg font-bold text-yellow-400">
                    {photographer.state}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    State
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <div className="text-lg font-bold text-green-400 capitalize truncate">
                    {photographer.city}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    City
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs - Added Services Tab */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl mb-6 sm:mb-8 border border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-700/50">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    {
                      id: "portfolio",
                      label: "Portfolio",
                      icon: Camera,
                    },
                    {
                      id: "services",
                      label: "Services",
                      icon: Briefcase,
                      count: photographer.services?.length
                    },
                    { id: "about", label: "About", icon: MapPin },
                    {
                      id: "videos",
                      label: "Videos",
                      icon: Video,
                      count: photographer.videos?.length
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
                      <tab.icon size={18} className="sm:w-5" />
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id
                            ? "bg-yellow-400 text-black"
                            : "bg-gray-700 text-gray-300"
                          }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === "portfolio" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                      Portfolio Gallery
                    </h3>

                    {photographer.photos && photographer.photos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {photographer.photos.map((photo, index) => (
                          <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                          >
                            <Image
                              src={photo.url}
                              alt={`Portfolio ${index + 1}`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                              <span className="text-white font-semibold text-sm sm:text-base">
                                Photo {index + 1}
                              </span>
                            </div>
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/60 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Maximize2 size={16} />
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

                {activeTab === "services" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      All Services & Pricing
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Complete list of services offered by {photographer.name}
                    </p>

                    {photographer.services && photographer.services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {photographer.services.map((service, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-5 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-300 group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                {service.service}
                              </h4>
                              <span className="font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm">
                                ${Number(service.price).toLocaleString()}
                              </span>
                            </div>
                            {service.category && (
                              <span className="inline-block px-2 py-1 bg-gray-600/30 text-gray-300 rounded-full text-xs mt-2 capitalize">
                                {service.category}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase size={48} className="mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-400">No services available yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "about" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      About {photographer.name}
                    </h3>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-base sm:text-lg bg-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                        {photographer.biography ||
                          "No biography available yet. This photographer prefers to let their work speak for itself."}
                      </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                        <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                          <MapPin className="text-yellow-400" size={20} />
                          Location
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg text-sm sm:text-base">
                            <span className="text-gray-300">Based in</span>
                            <span className="text-white font-semibold capitalize">
                              {photographer.city}, {formattedState}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                        <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                          <Camera className="text-green-400" size={20} />
                          Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[...new Set(photographer.services?.map(s => s.category))].map((category, index) => (
                            <span
                              key={index}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30 capitalize"
                            >
                              {category}
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
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-white text-base sm:text-lg truncate mr-2">
                                {video.title || `Video ${index + 1}`}
                              </h4>
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