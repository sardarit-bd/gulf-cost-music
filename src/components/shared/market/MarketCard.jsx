// components/market/MarketCard.jsx
"use client";

import {
    AlertCircle,
    Building2,
    Camera,
    Clock,
    Heart, MapPin,
    Mic,
    Music,
    Store,
    User,
    Users,
    Video
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ItemDetailModal from "./ItemDetailModal";

const sellerTypeIcons = {
    artist: Mic,
    venue: Building2,
    photographer: Camera,
    studio: Music,
    journalist: Users,
    fan: User
};

const sellerTypeColors = {
    artist: "bg-purple-100 text-purple-800 border-purple-200",
    venue: "bg-green-100 text-green-800 border-green-200",
    photographer: "bg-orange-100 text-orange-800 border-orange-200",
    studio: "bg-indigo-100 text-indigo-800 border-indigo-200",
    journalist: "bg-yellow-100 text-yellow-800 border-yellow-200",
    fan: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function MarketCard({ item, userType = "all", currentUser, isOwnListing = false, viewMode = "grid", onItemUpdate }) {
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const SellerIcon = sellerTypeIcons[item.sellerType] || Store;
    const colorClass = sellerTypeColors[item.sellerType] || "bg-gray-100 text-gray-800";

    const mainPhoto = item.photos?.[0] || "/images/placeholder.jpg";
    const hasVideo = item.videos?.length > 0;

    // Fee calculation
    const feePercentage = item.seller?.subscriptionPlan === "pro" ? 5 : 10;
    const feeAmount = (item.price * feePercentage) / 100;
    const totalWithFee = item.price + feeAmount;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    // Don't show pending items to public
    if (item.status === "pending" && !isOwnListing) {
        return null;
    }

    const handleCardClick = (e) => {
        // Don't open modal if clicking on like button or edit link
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        setShowDetailModal(true);
    };

    // List View
    if (viewMode === "list") {
        return (
            <>
                <div
                    onClick={handleCardClick}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden cursor-pointer"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-48 h-48 relative bg-gray-100">
                            {!imageError ? (
                                <Image
                                    src={mainPhoto}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Store className="w-12 h-12 text-gray-400" />
                                </div>
                            )}

                            {/* Video Indicator */}
                            {hasVideo && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white p-1.5 rounded-lg">
                                    <Video className="w-4 h-4" />
                                </div>
                            )}

                            {/* Status Badge for own listing */}
                            {isOwnListing && item.status === "pending" && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                                            {item.sellerType}
                                        </span>
                                        {item.seller?.isVerified && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                ✓ Verified
                                            </span>
                                        )}
                                        {isOwnListing && (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                                Your Item
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                                </div>

                                {!isOwnListing && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsLiked(!isLiked);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <SellerIcon className="w-4 h-4" />
                                    <span>{item.seller?.name || 'Unknown'}</span>
                                </div>
                                {item.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{item.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-bold text-gray-900">
                                            ${formatPrice(item.price)}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            + ${formatPrice(feeAmount)} fee
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Total: ${formatPrice(totalWithFee)} (incl. {feePercentage}% fee)
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">
                                        {item.photos?.length || 0} 📸
                                    </span>
                                </div>
                            </div>

                            {/* Stripe Required Warning for own pending listing */}
                            {isOwnListing && item.status === "pending" && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-xs text-yellow-800 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Connect Stripe to activate this listing
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail Modal */}
                <ItemDetailModal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    itemId={item._id}
                    onItemUpdate={onItemUpdate}
                />
            </>
        );
    }

    // Grid View
    return (
        <>
            <div
                onClick={handleCardClick}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden group cursor-pointer"
            >
                {/* Image */}
                <div className="aspect-square relative bg-gray-100">
                    {!imageError ? (
                        <Image
                            src={mainPhoto}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-16 h-16 text-gray-400" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                            {item.sellerType}
                        </span>
                        {isOwnListing && (
                            <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                                Your Item
                            </span>
                        )}
                        {isOwnListing && item.status === "pending" && (
                            <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                            </span>
                        )}
                    </div>

                    {/* Video Indicator */}
                    {hasVideo && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-lg">
                            <Video className="w-4 h-4" />
                        </div>
                    )}

                    {/* Like Button */}
                    {!isOwnListing && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLiked(!isLiked);
                            }}
                            className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">{item.title}</h3>
                        {item.seller?.isVerified && (
                            <span className="text-blue-600 text-xs ml-1">✓</span>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <SellerIcon className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{item.seller?.name || 'Unknown'}</span>
                        </div>
                    </div>

                    {item.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                            <p className="text-lg font-bold text-gray-900">
                                ${formatPrice(item.price)}
                            </p>
                            <p className="text-xs text-gray-500">
                                +${formatPrice(feeAmount)} fee
                            </p>
                        </div>
                        <span className="text-xs text-gray-500">
                            {item.photos?.length || 0} 📸
                        </span>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <ItemDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                itemId={item._id}
                onItemUpdate={onItemUpdate}
            />
        </>
    );
}