"use client";
import {
    ArrowLeft,
    Camera,
    CheckCircle,
    DollarSign,
    MapPin,
    ShoppingBag,
    Video
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MarketItemPage() {
    const { city, market } = useParams();
    const decodedCity = decodeURIComponent(city);
    const router = useRouter();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        fetchItem();
    }, [market]);

    const fetchItem = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/${market}?city=${decodedCity}`
            );
            const data = await res.json();
            console.log("market:", data)

            if (data.success) {
                setItem(data.data);
            } else {
                router.push(`/markets/${city}`);
            }
        } catch (error) {
            console.error("Error fetching item:", error);
            router.push(`/markets/${city}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market-checkout/checkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        itemId: item._id,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Checkout failed");
                return;
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (err) {
            console.error("Buy now error:", err);
            toast.error("Something went wrong. Please try again.");
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-yellow-400 text-lg">Loading item details...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white">
                <div className="text-center">
                    <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
                    <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
                    <button
                        onClick={() => router.push(`/markets/${city}`)}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                        ← Back to {decodedCity} Marketplace
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
                    {item.photos?.[0] && (
                        <Image
                            src={item.photos[0]}
                            alt={item.title}
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
                            onClick={() => router.push(`/markets/${city}`)}
                            className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-all duration-300 bg-black/30 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/10 hover:border-yellow-400/30"
                        >
                            <ArrowLeft size={18} className="sm:w-5" />
                            <span className="hidden xs:inline">Back to {decodedCity}</span>
                            <span className="xs:hidden">Back</span>
                        </button>
                    </div>

                    {/* Item Info */}
                    <div className="flex items-end gap-4 sm:gap-6 text-white w-full">
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-yellow-400 shadow-2xl">
                                {item.photos?.[0] ? (
                                    <Image
                                        src={item.photos[0]}
                                        alt={item.title}
                                        width={500}
                                        height={500}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                        <ShoppingBag size={32} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 pb-1 sm:pb-2 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words">
                                    {item.title}
                                </h1>
                                <div className="flex gap-2">
                                    <span className="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs sm:text-sm font-medium border border-yellow-500/30 capitalize">
                                        {item.sellerType}
                                    </span>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${item.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                        "bg-red-500/20 text-red-400 border-red-500/30"
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4 text-white/80 text-sm sm:text-base">
                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <DollarSign size={20} className="text-green-400" />
                                    <span className="text-2xl sm:text-3xl font-bold text-green-400">
                                        ${item.price}
                                    </span>
                                </div>

                                {/* Location */}
                                {item.location && (
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full w-fit">
                                        <MapPin size={16} className="sm:w-4 text-yellow-400" />
                                        <span className="font-medium">{item.location}, {decodedCity}</span>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <Camera size={16} className="sm:w-4 text-blue-400" />
                                        <span>{item.photos?.length || 0} Photos</span>
                                    </div>
                                    {item.videos?.length > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Video size={16} className="sm:w-4 text-purple-400" />
                                            <span>Video Available</span>
                                        </div>
                                    )}

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
                        {/* Seller Card */}
                        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50 lg:sticky lg:top-24">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Seller Information
                            </h3>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {item.seller?.name?.charAt(0) || "S"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{item.seller?.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-300 capitalize">{item.sellerType}</span>
                                        {item.seller?.isVerified && (
                                            <CheckCircle size={16} className="text-green-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                                        ${item.price}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-300 mt-1">
                                        Price
                                    </div>
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                                >
                                    Buy Now
                                </button>

                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700/50">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Item Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                                        ${item.price}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-300 mt-1">
                                        Price
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                                    <div className="text-xl sm:text-2xl font-bold text-blue-400">
                                        {item.photos?.length || 0}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-300 mt-1">
                                        Photos
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                                    <div className="text-xl sm:text-2xl font-bold text-purple-400">
                                        {item.videos?.length > 0 ? "Yes" : "No"}
                                    </div>

                                    <div className="text-xs sm:text-sm text-gray-300 mt-1">
                                        Video
                                    </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg sm:rounded-xl border border-gray-600/30">
                                    <div className={`text-xl sm:text-2xl font-bold ${item.status === "active" ? "text-green-400" : "text-red-400"
                                        }`}>
                                        {item.status}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-300 mt-1">
                                        Status
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl mb-6 sm:mb-8 border border-gray-700/50 overflow-hidden">
                            <div className="border-b border-gray-700/50">
                                <div className="flex overflow-x-auto scrollbar-hide">
                                    {[
                                        { id: "details", label: "Details", icon: ShoppingBag },
                                        { id: "gallery", label: "Gallery", icon: Camera, count: item.photos?.length },
                                        { id: "video", label: "Video", icon: Video },
                                        // { id: "seller", label: "Seller", icon: User },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-semibold transition-all duration-300 whitespace-nowrap border-b-2 ${activeTab === tab.id
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

                            {/* Tab Content */}
                            <div className="p-4 sm:p-6 md:p-8">
                                {activeTab === "details" && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Description</h3>
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-gray-300 leading-relaxed text-base sm:text-lg bg-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Details Grid */}
                                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                                            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                                                <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                                                    <Tag className="text-yellow-400" size={20} />
                                                    Item Details
                                                </h4>
                                                <div className="space-y-2 sm:space-y-3">
                                                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg">
                                                        <span className="text-gray-300">Seller Type</span>
                                                        <span className="text-white font-semibold capitalize">{item.sellerType}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg">
                                                        <span className="text-gray-300">Price</span>
                                                        <span className="text-white font-semibold">${item.price}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-600/30 rounded-lg">
                                                        <span className="text-gray-300">Status</span>
                                                        <span className={`font-semibold ${item.status === "active" ? "text-green-400" : "text-red-400"
                                                            }`}>
                                                            {item.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                                                <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                                                    <MapPin className="text-blue-400" size={20} />
                                                    Location
                                                </h4>
                                                <div className="p-3 sm:p-4 bg-gray-600/30 rounded-lg">
                                                    <p className="text-gray-300">{item.location || "Location not specified"}</p>
                                                    <p className="text-gray-400 text-sm mt-1">{decodedCity}</p>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                )}

                                {activeTab === "gallery" && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Photo Gallery</h3>

                                        {item.photos && item.photos.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                                {item.photos.map((photo, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                                                    >
                                                        <Image
                                                            src={photo}
                                                            alt={`Gallery ${index + 1}`}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                                                            <span className="text-white font-semibold">
                                                                Photo {index + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 sm:py-16">
                                                <Camera size={48} className="sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-500" />
                                                <p className="text-gray-400 text-base sm:text-lg">
                                                    No photos available for this item.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "video" && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Video Preview</h3>

                                        {item.videos?.length > 0 ? (
                                            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                                                <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-black">
                                                    <video
                                                        src={item.videos[0]}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                        poster={item.photos?.[0]}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 sm:py-16">
                                                <Video size={48} className="sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-500" />
                                                <p className="text-gray-400 text-base sm:text-lg">
                                                    No video available for this item.
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* {activeTab === "seller" && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Seller Profile</h3>

                                        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-600/30">
                                            <div className="flex items-center gap-4 sm:gap-6 mb-6">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl">
                                                    {item.seller?.name?.charAt(0) || "S"}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                                        {item.seller?.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30 capitalize">
                                                            {item.sellerType}
                                                        </span>
                                                        {item.seller?.isVerified && (
                                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                                                                ✓ Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                <div className="p-4 sm:p-6 bg-gray-600/30 rounded-xl">
                                                    <h5 className="font-semibold text-white mb-2">Contact Information</h5>
                                                    <p className="text-gray-300">{item.seller?.email || "Email not available"}</p>
                                                </div>
                                                <div className="p-4 sm:p-6 bg-gray-600/30 rounded-xl">
                                                    <h5 className="font-semibold text-white mb-2">Subscription</h5>
                                                    <p className="text-gray-300 capitalize">{item.seller?.subscriptionPlan || "Standard"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/* <div className="sticky bottom-6 bg-gray-800/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button className="flex-1 py-3 sm:py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition text-sm sm:text-base">
                                    Make Offer
                                </button>
                                <button className="flex-1 py-3 sm:py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-sm sm:text-base">
                                    Buy Now
                                </button>
                                <button className="flex-1 py-3 sm:py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition text-sm sm:text-base">
                                    Contact Seller
                                </button>
                            </div>
                            <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">
                                This item is listed by a {item.seller?.isVerified ? "verified" : ""} seller in {decodedCity}
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}