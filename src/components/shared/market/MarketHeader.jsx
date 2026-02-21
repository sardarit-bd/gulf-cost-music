// components/market/MarketHeader.jsx
"use client";

import {
    Building2, Camera, Edit, Eye, Grid, Mic, Music, Plus,
    Store, Users, AlertCircle, CheckCircle, XCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateListingModal from "./CreateListingModal";
import StripeConnectPrompt from "./StripeConnectPrompt";

const userTypeConfig = {
    all: {
        title: "Marketplace",
        description: "Discover amazing items from our community",
        icon: Store,
        color: "from-blue-600 to-purple-600",
        sellText: "Sell Item"
    },
    artist: {
        title: "Artist Marketplace",
        description: "Music, merchandise, and exclusive content from artists",
        icon: Mic,
        color: "from-purple-600 to-pink-600",
        sellText: "Sell Music/Merch"
    },
    venue: {
        title: "Venue Marketplace",
        description: "Book venues, sell tickets, and promote events",
        icon: Building2,
        color: "from-green-600 to-teal-600",
        sellText: "List Venue"
    },
    photographer: {
        title: "Photographer Marketplace",
        description: "Professional photos, prints, and photography services",
        icon: Camera,
        color: "from-orange-600 to-red-600",
        sellText: "Sell Photos"
    },
    studio: {
        title: "Studio Marketplace",
        description: "Recording sessions, mixing, mastering, and studio services",
        icon: Music,
        color: "from-indigo-600 to-blue-600",
        sellText: "List Studio Services"
    },
    journalist: {
        title: "Journalist Marketplace",
        description: "Articles, interviews, and media content",
        icon: Users,
        color: "from-yellow-600 to-orange-600",
        sellText: "Sell Content"
    },
    fan: {
        title: "Fan Marketplace",
        description: "Connect with artists and discover exclusive content",
        icon: Grid,
        color: "from-pink-600 to-purple-600",
        sellText: "Sell Items"
    }
};

export default function MarketHeader({
    userType = "all",
    totalItems = 0,
    userListing,
    userListingLoading = false,
    onListingUpdate
}) {
    const config = userTypeConfig[userType] || userTypeConfig.all;
    const Icon = config.icon;
    const [showCreateModal, setShowCreateModal] = useState(false);

    const canSell = userType !== "all" && ["artist", "venue", "photographer", "studio", "journalist", "fan"].includes(userType);

    // Get listing status badge
    const getListingStatusBadge = () => {
        if (!userListing) return null;

        switch (userListing.status) {
            case "active":
                return (
                    <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                    </span>
                );
            case "pending":
                return (
                    <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Pending (Stripe Required)
                    </span>
                );
            case "sold":
                return (
                    <span className="px-2 py-1 bg-gray-500 text-white rounded-full text-xs flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Sold
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={`bg-gradient-to-r ${config.color} text-white`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Icon className="w-12 h-12" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
                                <p className="text-white/90 text-lg">{config.description}</p>
                                <div className="flex items-center gap-4 mt-2 flex-wrap">
                                    <p className="text-white/70">
                                        {totalItems} item{totalItems !== 1 ? 's' : ''} available
                                    </p>
                                    {userListing && (
                                        <div className="flex items-center gap-2">
                                            {getListingStatusBadge()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seller Actions */}
                        {canSell && (
                            <div className="flex gap-3">
                                {userListingLoading ? (
                                    <div className="px-6 py-3 bg-white/20 rounded-xl flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Loading...
                                    </div>
                                ) : userListing ? (
                                    <>
                                        <Link
                                            href={`/market/${userType}/edit/${userListing._id}`}
                                            className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                                        >
                                            <Edit className="w-5 h-5" />
                                            Edit Listing
                                        </Link>
                                        <Link
                                            href={`/market/item/${userListing._id}`}
                                            className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 backdrop-blur-sm"
                                        >
                                            <Eye className="w-5 h-5" />
                                            View Item
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        {config.sellText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Rules/Info Bar */}
                    <div className="mt-8 flex flex-wrap gap-4 text-sm bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span>Verified accounts only can sell</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span>Maximum 1 item per seller</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span>Up to 5 photos and 1 video</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span>5% fee for Pro, 10% for Free accounts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Show Stripe Connect Prompt if user has pending listing */}
            {userListing && userListing.status === "pending" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-4">
                    <StripeConnectPrompt userType={userType} />
                </div>
            )}

            {/* Create Listing Modal */}
            <CreateListingModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                userType={userType}
                onSuccess={() => {
                    setShowCreateModal(false);
                    onListingUpdate();
                }}
            />
        </>
    );
}