"use client";
import AudioTab from "@/components/modules/studio/tabs/AudioTab";
import PortfolioTab from "@/components/modules/studio/tabs/PortfolioTab";
import ServicesTab from "@/components/modules/studio/tabs/ServicesTab";
import { formatCityName, formatLocation, formatStateName } from "@/utils/formatters";
import axios from "axios";
import {
    ArrowLeft,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Copy,
    DollarSign,
    FileAudio,
    Headphones,
    Image as ImageIcon,
    Mail,
    MapPin,
    Music,
    Play,
    Star,
    X
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudioProfile() {
    const { state, city, studio: studioId } = useParams();
    const router = useRouter();
    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("portfolio");
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    // Format location for display
    const formattedState = formatStateName(decodeURIComponent(state));
    const formattedCity = formatCityName(decodeURIComponent(city));

    // Fetch studio data
    useEffect(() => {
        fetchStudio();
    }, [studioId]);

    const fetchStudio = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE}/api/studios/public/${studioId}`,
            );
            setStudio(response.data.data.studio);
        } catch (error) {
            console.error("Error fetching studio:", error);
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

    // Copy email function
    const copyEmailToClipboard = () => {
        if (studio?.user?.email) {
            navigator.clipboard.writeText(studio.user.email);
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2000);
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

    // Format price
    const formatPrice = (price) => {
        if (!price) return "Contact for price";
        if (price.startsWith("$")) return price;
        return `$${price}`;
    };

    // Tabs configuration - ONLY 3 TABS: Services, Portfolio, Audio
    const tabs = [
        {
            id: "portfolio",
            label: "Portfolio",
            icon: ImageIcon,
            count: studio.photos?.length || 0,
        },
        {
            id: "services",
            label: "Services & Pricing",
            icon: DollarSign,
            count: studio.services?.length || 0
        },
        {
            id: "audio",
            label: "Audio Samples",
            icon: FileAudio,
            count: studio.audioFile ? 1 : 0,
        },
    ];

    // Handle tab content rendering
    const renderTabContent = () => {
        switch (activeTab) {
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
                return <PortfolioTab
                    studio={studio}
                    setSelectedPhoto={setSelectedPhoto}
                    setShowPhotoModal={setShowPhotoModal}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20">
            {/* Breadcrumb Navigation */}
            <div className="bg-black/50 border-b border-gray-800 py-3 px-4">
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
                            className="hover:text-yellow-400 transition"
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
                <div className="absolute inset-0 h-[400px] md:h-[480px]">
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

                {/* Navigation Back Button */}
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="container mx-auto">
                        <button
                            onClick={() =>
                                router.push(`/studios/${formattedState}/${formattedCity}`)
                            }
                            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-black/70 transition text-sm"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to {formattedCity}</span>
                        </button>
                    </div>
                </div>

                {/* Profile Info - Overlay */}
                <div className="relative container mx-auto px-4 pt-40 md:pt-56 pb-8">
                    <div className="flex items-end gap-4 sm:gap-6 text-white">
                        {/* Studio Logo/Image */}
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-yellow-400 shadow-2xl">
                                <Image
                                    src={studio.photos?.[0]?.url || "/default-studio.jpg"}
                                    alt={studio.name}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* Verified Badge */}
                            {studio.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-gray-900">
                                    <Star size={14} className="text-white" fill="white" />
                                </div>
                            )}
                        </div>

                        {/* Studio Info */}
                        <div className="flex-1 pb-1 sm:pb-2 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">
                                    {studio.name}
                                </h1>
                                {studio.isFeatured && (
                                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-semibold whitespace-nowrap">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-yellow-400" />
                                    <span>
                                        {formatLocation(studio.city, studio.state)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Contact Card */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                Contact
                            </h3>

                            <div className="space-y-2">
                                {/* Email with Copy */}
                                <div className="flex items-center justify-between gap-2 p-2 bg-gray-700/50 rounded-lg border border-gray-600">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Mail size={14} className="text-yellow-500 flex-shrink-0" />
                                        <span className="text-xs text-white truncate">
                                            {studio.user?.email || "Email not available"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={copyEmailToClipboard}
                                        className="p-1 hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                                        title="Copy email"
                                    >
                                        {emailCopied ? (
                                            <Check size={14} className="text-green-400" />
                                        ) : (
                                            <Copy size={14} className="text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg border border-gray-600">
                                    <MapPin size={14} className="text-green-500 flex-shrink-0" />
                                    <span className="text-xs text-white truncate">
                                        {formatLocation(studio.city, studio.state)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Audio Preview Card */}
                        {studio.audioFile && (
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Headphones size={16} className="text-purple-400" />
                                        <span className="text-xs text-white">Audio Available</span>
                                    </div>
                                    <button
                                        onClick={() => setShowAudioPlayer(true)}
                                        className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                    >
                                        <Play size={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Description Card - Collapsible */}
                        {studio.biography && (
                            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
                                <button
                                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <h3 className="text-sm font-semibold text-white">Description</h3>
                                    </div>
                                    {descriptionExpanded ? (
                                        <ChevronUp size={16} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={16} className="text-gray-400" />
                                    )}
                                </button>

                                {descriptionExpanded && (
                                    <div className="px-4 pb-4">
                                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                {studio.biography}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Tabs - Only 3 tabs */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
                            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition flex-1 justify-center ${activeTab === tab.id
                                            ? "text-yellow-400 border-yellow-400 bg-yellow-400/5"
                                            : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                                ? "bg-yellow-400 text-black"
                                                : "bg-gray-700 text-gray-300"
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">{renderTabContent()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Modal */}
            {showPhotoModal && studio.photos && studio.photos.length > 0 && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-6xl">
                        <button
                            onClick={() => setShowPhotoModal(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <div className="relative h-[70vh] rounded-lg overflow-hidden">
                            <Image
                                src={studio.photos[selectedPhoto].url}
                                alt={`Studio photo ${selectedPhoto + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-white">
                                {selectedPhoto + 1} / {studio.photos.length}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedPhoto(prev => prev > 0 ? prev - 1 : studio.photos.length - 1)}
                                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setSelectedPhoto(prev => prev < studio.photos.length - 1 ? prev + 1 : 0)}
                                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Player Modal */}
            {showAudioPlayer && studio.audioFile && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Audio Sample</h3>
                            <button
                                onClick={() => setShowAudioPlayer(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-4 mb-4">
                            <div className="text-center mb-3">
                                <Headphones size={40} className="mx-auto text-yellow-500 mb-2" />
                                <div className="text-white font-medium">Studio Demo Track</div>
                            </div>
                            <audio controls className="w-full">
                                <source src={studio.audioFile.url} type="audio/mpeg" />
                            </audio>
                        </div>

                        <button
                            onClick={() => setShowAudioPlayer(false)}
                            className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}