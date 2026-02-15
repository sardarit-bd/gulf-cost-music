"use client";
import AudioTab from "@/components/modules/studio/tabs/AudioTab";
import OverviewTab from "@/components/modules/studio/tabs/OverviewTab";
import PortfolioTab from "@/components/modules/studio/tabs/PortfolioTab";
import ServicesTab from "@/components/modules/studio/tabs/ServicesTab";
import axios from "axios";
import {
    ArrowLeft,
    ChevronRight,
    DollarSign,
    FileAudio,
    Headphones,
    Image as ImageIcon,
    Mail,
    MapPin,
    Music,
    Play,
    Star
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Import separated components
// import AudioTab from "./tabs/AudioTab";
// import OverviewTab from "./tabs/OverviewTab";
// import PortfolioTab from "./tabs/PortfolioTab";
// import ServicesTab from "./tabs/ServicesTab";

export default function StudioProfile() {
    const { state, city, studio: studioId } = useParams();
    const router = useRouter();
    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    // Fetch studio data
    useEffect(() => {
        fetchStudio();
    }, [studioId]);

    const fetchStudio = async () => {
        try {
            setLoading(true);
            // Use public API endpoint
            const response = await axios.get(
                `${API_BASE}/api/studios/public/${studioId}`,
            );
            setStudio(response.data.data.studio);
        } catch (error) {
            console.error("Error fetching studio:", error);
            // Fallback to try regular endpoint
            try {
                const fallbackResponse = await axios.get(
                    `${API_BASE}/api/studios/${studioId}`,
                );
                setStudio(fallbackResponse.data.data);
            } catch (fallbackError) {
                console.error("Fallback error:", fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-yellow-400 text-lg">Loading studio profile...</p>
                </div>
            </div>
        );
    }

    if (!studio) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center text-white px-4">
                <Music size={80} className="mb-6 text-gray-400" />
                <h1 className="text-3xl font-bold mb-4 text-center">
                    Studio Not Found
                </h1>
                <p className="text-gray-400 mb-8 text-center max-w-md">
                    The studio you're looking for doesn't exist or has been removed.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                    >
                        ← Go Back
                    </button>
                    <button
                        onClick={() => router.push("/studios")}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                        Browse Studios
                    </button>
                </div>
            </div>
        );
    }

    const formattedState = decodeURIComponent(state);
    const formattedCity = decodeURIComponent(city);

    // Format price
    const formatPrice = (price) => {
        if (!price) return "Contact for price";
        if (price.startsWith("$")) return price;
        return `$${price}`;
    };

    // Calculate average price
    const getAveragePrice = () => {
        if (!studio.services || studio.services.length === 0) return "Contact";

        const prices = studio.services
            .map((s) => parseFloat(s.price.replace(/[^0-9.]/g, "")))
            .filter((p) => !isNaN(p));

        if (prices.length === 0) return "Contact";

        const average = prices.reduce((a, b) => a + b, 0) / prices.length;
        return `$${Math.round(average)}`;
    };

    // Tabs configuration - ONLY 4 TABS: Overview, Services, Portfolio, Audio
    const tabs = [
        { id: "overview", label: "Overview", icon: Music },
        { id: "services", label: "Services & Pricing", icon: DollarSign },
        {
            id: "portfolio",
            label: "Portfolio",
            icon: ImageIcon,
            count: studio.photos?.length || 0,
        },
        {
            id: "audio",
            label: "Audio",
            icon: FileAudio,
            count: studio.audioFile ? 1 : 0,
        },
    ];

    // Handle tab content rendering
    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <OverviewTab
                        studio={studio}
                        formatPrice={formatPrice}
                        setActiveTab={setActiveTab}
                        setSelectedPhoto={setSelectedPhoto}
                        setShowPhotoModal={setShowPhotoModal}
                    />
                );
            case "services":
                return <ServicesTab studio={studio} formatPrice={formatPrice} />;
            case "portfolio":
                return (
                    <PortfolioTab
                        studio={studio}
                        setSelectedPhoto={setSelectedPhoto}
                        setShowPhotoModal={setShowPhotoModal}
                    />
                );
            case "audio":
                return (
                    <AudioTab studio={studio} setShowAudioPlayer={setShowAudioPlayer} />
                );
            default:
                return (
                    <OverviewTab
                        studio={studio}
                        formatPrice={formatPrice}
                        setActiveTab={setActiveTab}
                        setSelectedPhoto={setSelectedPhoto}
                        setShowPhotoModal={setShowPhotoModal}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20">
            {/* Breadcrumb Navigation */}
            <div className="bg-black/50 border-b border-gray-800 py-3 px-4 ">
                <div className="container mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <button
                            onClick={() => router.push("/studios")}
                            className="hover:text-yellow-400 transition"
                        >
                            Studios
                        </button>
                        <ChevronRight size={14} />
                        <button
                            onClick={() => router.push(`/studios/${formattedState}`)}
                            className="hover:text-yellow-400 transition"
                        >
                            {formattedState}
                        </button>
                        <ChevronRight size={14} />
                        <button
                            onClick={() =>
                                router.push(`/studios/${formattedState}/${formattedCity}`)
                            }
                            className="hover:text-yellow-400 transition capitalize"
                        >
                            {formattedCity}
                        </button>
                        <ChevronRight size={14} />
                        <span className="text-yellow-400 font-semibold truncate max-w-[200px]">
                            {studio.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative">
                {/* Background Image */}
                <div className="absolute inset-0 h-[500px]">
                    {studio.photos?.[0] && (
                        <Image
                            src={studio.photos[0].url}
                            alt={studio.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-4 pt-8 pb-12">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <button
                                onClick={() =>
                                    router.push(`/studios/${formattedState}/${formattedCity}`)
                                }
                                className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition"
                            >
                                <ArrowLeft size={20} />
                                Back to {formattedCity}
                            </button>

                            <div className="flex gap-2">
                                {/* <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-lg backdrop-blur-sm border transition ${
                    isFavorite
                      ? "bg-red-500/20 border-red-400/30 text-red-400"
                      : "bg-black/50 border-white/20 text-white hover:border-red-400/30"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button> */}
                                {/* <button className="p-3 rounded-lg backdrop-blur-sm bg-black/50 border border-white/20 text-white hover:border-yellow-500/30 transition">
                  <Share2 size={20} />
                </button> */}
                            </div>
                        </div>

                        {/* Studio Logo/Image */}
                        <div className="mt-16 lg:mt-24 relative">
                            <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-4 border-yellow-500 shadow-2xl">
                                <Image
                                    src={studio.photos?.[0]?.url || "/default-studio.jpg"}
                                    alt={studio.name}
                                    width={192}
                                    height={192}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Badges */}
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {studio.isVerified && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-full font-semibold">
                                        <Star size={14} />
                                        Verified
                                    </span>
                                )}
                                {studio.isFeatured && (
                                    <span className="px-3 py-1 bg-yellow-500 text-black text-sm rounded-full font-semibold">
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Studio Info */}
                        <div className="flex-1 text-white mt-8 lg:mt-24">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {studio.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-yellow-500" size={20} />
                                            <span className="text-lg capitalize">
                                                {studio.city}, {studio.state}
                                            </span>
                                        </div>

                                        <div className="hidden lg:flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Headphones className="text-blue-400" size={20} />
                                                <span>{studio.services?.length || 0} Services</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="text-green-400" size={20} />
                                                <span>{studio.photos?.length || 0} Photos</span>
                                            </div>

                                            {studio.audioFile && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-green-400">Audio Sample</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="text-2xl font-bold text-yellow-500">
                                                {getAveragePrice()}
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                Avg. Hour Rate
                                            </div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="text-2xl font-bold text-blue-500">
                                                {studio.services?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-300">Services</div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="text-2xl font-bold text-green-500">
                                                {studio.photos?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-300">Portfolio</div>
                                        </div>

                                        {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="text-2xl font-bold text-purple-500">
                                                {studio.audioFile ? "Audio Available" : "No Audio"}
                                            </div>
                                            <div className="text-sm text-gray-300">Audio</div>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {/* <div className="flex flex-col gap-3">
                                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition flex items-center justify-center gap-2">
                                        <Calendar size={20} />
                                        Book Studio
                                    </button>

                                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2 border border-white/20">
                                        <Phone size={20} />
                                        Contact
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Contact Card */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                Contact Information
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                                    <Mail className="text-yellow-500" size={20} />
                                    <div>
                                        <div className="text-sm text-gray-300">Email</div>
                                        <div className="text-white font-medium truncate">
                                            {studio.user?.email || "Email not available"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                                    <MapPin className="text-green-500" size={20} />
                                    <div>
                                        <div className="text-sm text-gray-300">Location</div>
                                        <div className="text-white font-medium capitalize">
                                            {studio.city}, {studio.state}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audio Sample Card */}
                        {studio.audioFile && (
                            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Audio Sample
                                </h3>

                                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-white font-semibold">
                                                Studio Demo
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                Quality Preview
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowAudioPlayer(true)}
                                            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            <Play size={20} />
                                        </button>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        Sample track showcasing studio quality
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Tabs - ONLY 4 TABS */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden mb-8">
                            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition ${activeTab === tab.id
                                            ? "text-yellow-400 border-yellow-400 bg-yellow-400/5"
                                            : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
                                            }`}
                                    >
                                        <tab.icon size={20} />
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">{renderTabContent()}</div>
                        </div>

                        {/* Booking Card */}
                        {/* <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-2xl p-8 border border-yellow-500/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to Book?
                  </h3>
                  <p className="text-gray-300">
                    Contact {studio.name} directly for rates and availability
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition">
                    Book Studio Session
                  </button>
                  <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition border border-white/20">
                    Send Message
                  </button>
                </div>
              </div>
            </div> */}
                    </div>
                </div>
            </div>

            {/* Photo Modal */}
            {showPhotoModal && studio.photos && studio.photos.length > 0 && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-6xl">
                        <button
                            onClick={() => setShowPhotoModal(false)}
                            className="absolute -top-20 right-0 text-white hover:text-yellow-400 transition z-10"
                        >
                            <div className="bg-black/50 mt-20 p-3 rounded-lg">✕ Close</div>
                        </button>

                        <div className="relative h-[70vh] rounded-2xl overflow-hidden">
                            <Image
                                src={studio.photos[selectedPhoto].url}
                                alt={`Studio photo ${selectedPhoto + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-white">
                                Photo {selectedPhoto + 1} of {studio.photos.length}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setSelectedPhoto((prev) =>
                                            prev > 0 ? prev - 1 : studio.photos.length - 1,
                                        )
                                    }
                                    className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() =>
                                        setSelectedPhoto((prev) =>
                                            prev < studio.photos.length - 1 ? prev + 1 : 0,
                                        )
                                    }
                                    className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                            {studio.photos.map((photo, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPhoto(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedPhoto === index
                                        ? "border-yellow-500"
                                        : "border-transparent"
                                        }`}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Player Modal */}
            {showAudioPlayer && studio.audioFile && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Audio Sample</h3>
                            <button
                                onClick={() => setShowAudioPlayer(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-6 mb-6">
                            <div className="text-center mb-4">
                                <Headphones
                                    size={48}
                                    className="mx-auto text-yellow-500 mb-3"
                                />
                                <div className="text-white font-semibold">
                                    Studio Demo Track
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Listen to the studio quality
                                </div>
                            </div>

                            <audio controls className="w-full">
                                <source src={studio.audioFile.url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>

                        <button
                            onClick={() => setShowAudioPlayer(false)}
                            className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
