"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AccessDenied from "./AccessDenied";
import CreateListingTab from "./CreateListingTab";
import LoadingState from "./LoadingState";
import MarketplaceHeader from "./MarketplaceHeader";
import MarketplaceStats from "./MarketplaceStats";
import MarketplaceTabs from "./MarketplaceTabs";
import MyListingsTab from "./MyListingsTab";
import StripeConnectPrompt from "./StripeConnectPrompt";

const getToken = () => {
    if (typeof window === "undefined") return null;

    // Check localStorage first
    const token = localStorage.getItem("token");
    if (token) return token;

    // Fallback to cookie
    if (typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;)\s*token=([^;]+)/);
        return match ? match[1] : null;
    }

    return null;
};

export default function MarketplacePage({ API_BASE, subscriptionPlan, user }) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("create");
    const [existingItem, setExistingItem] = useState(null);
    const [stripeConnected, setStripeConnected] = useState(false);

    // Check permissions
    const isVerified = !!user?.isVerified;
    const isAllowedSeller = ["artist", "venue", "photographer"].includes(
        String(user?.userType || "").toLowerCase()
    );
    const hasMarketplaceAccess = isVerified && isAllowedSeller;

    // Load marketplace data
    useEffect(() => {
        const loadMarketplaceData = async () => {
            if (!hasMarketplaceAccess) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = getToken();

                if (!token) {
                    throw new Error("Not authenticated");
                }

                // Load user's listing
                const res = await fetch(`${API_BASE}/api/market/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.data) {
                        setExistingItem(data.data);
                        setActiveTab("listings");
                    }
                } else if (res.status !== 404) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to load listing");
                }

                // Check Stripe connection
                if (user?.stripeAccountId && user?.stripeOnboardingComplete) {
                    setStripeConnected(true);
                }
            } catch (error) {
                console.error("Load error:", error);
                if (!error.message.includes("404")) {
                    toast.error(error.message || "Failed to load marketplace data");
                }
            } finally {
                setLoading(false);
            }
        };

        if (API_BASE) {
            loadMarketplaceData();
        }
    }, [API_BASE, hasMarketplaceAccess, user]);

    // Handle listing creation/update
    const handleListingUpdate = (updatedItem) => {
        setExistingItem(updatedItem);
        setActiveTab("listings");
        toast.success(updatedItem ? "Listing updated successfully!" : "Listing created successfully!");
    };

    // Handle listing deletion
    const handleListingDelete = () => {
        setExistingItem(null);
        setActiveTab("create");
        toast.success("Listing deleted successfully!");
    };

    if (!hasMarketplaceAccess) {
        return <AccessDenied />;
    }

    if (loading) {
        return <LoadingState message="Loading Marketplace..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="space-y-8">
                {/* Header */}
                <MarketplaceHeader
                    existingItem={existingItem}
                    user={user}
                />

                {/* Stripe Connect Prompt */}
                {!stripeConnected && (
                    <StripeConnectPrompt />
                )}

                {/* Stats Cards */}
                <MarketplaceStats
                    existingItem={existingItem}
                    stripeConnected={stripeConnected}
                />

                {/* Tabs Navigation */}
                <MarketplaceTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    existingItem={existingItem}
                />

                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {activeTab === "create" ? (
                        <CreateListingTab
                            API_BASE={API_BASE}
                            existingItem={existingItem}
                            onSuccess={handleListingUpdate}
                            onDelete={handleListingDelete}
                            user={user}
                        />
                    ) : (
                        <MyListingsTab
                            existingItem={existingItem}
                            onEdit={() => setActiveTab("create")}
                            onDelete={handleListingDelete}
                            API_BASE={API_BASE}
                            user={user}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}