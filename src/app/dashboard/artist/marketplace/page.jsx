"use client";

import { api } from "@/components/modules/artist/apiService";
import ArtistMarketplaceTab from "@/components/modules/artist/MarketplaceTab";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw, Shield, ShoppingBag, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const FEATURES = {
    ENABLE_PRO: false,
};

export default function MarketplacePage() {
    const { user, refreshUser } = useAuth();
    const [listings, setListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [billingData, setBillingData] = useState(null);
    const [stripeStatus, setStripeStatus] = useState({
        isConnected: false,
        isReady: false,
    });

    const [currentListing, setCurrentListing] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        status: "active",
    });

    const [listingPhotos, setListingPhotos] = useState([]);
    const [listingVideos, setListingVideos] = useState([]);
    const [isEditingListing, setIsEditingListing] = useState(false);
    const [deletedPhotoIndexes, setDeletedPhotoIndexes] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalClicks: 0,
        totalInquiries: 0,
    });

    const subscriptionPlan = user?.subscriptionPlan || "free";
    const hasMarketplaceAccess = !FEATURES.ENABLE_PRO || subscriptionPlan === "pro";

    // Load initial data
    useEffect(() => {
        const initializeData = async () => {
            setPageLoading(true);
            try {
                await Promise.all([
                    loadMarketplaceData(),
                    loadBillingData(),
                    // loadAnalytics()
                ]);
            } catch (error) {
                console.error("Error initializing marketplace:", error);
                toast.error("Failed to load marketplace data");
            } finally {
                setPageLoading(false);
            }
        };

        if (user) {
            initializeData();
        }
    }, [user]);

    const loadMarketplaceData = async () => {
        try {
            setLoadingListings(true);
            const response = await api.getMyMarketItem();

            if (response.success) {
                if (response.data) {
                    const listing = response.data;
                    setListings([listing]);
                    setIsEditingListing(true);

                    setCurrentListing({
                        title: listing.title || "",
                        description: listing.description || "",
                        price: listing.price || "",
                        location: listing.location || "",
                        status: listing.status || "active",
                    });

                    setListingPhotos(listing.photos || []);
                    setListingVideos(
                        Array.isArray(listing.videos) ? listing.videos : [],
                    );
                } else {
                    setListings([]);
                    setIsEditingListing(false);
                }
            }
        } catch (error) {
            console.error("Error loading marketplace data:", error);
            toast.error("Failed to load marketplace data");
        } finally {
            setLoadingListings(false);
        }
    };

    const loadBillingData = async () => {
        try {
            const billingRes = await api.getBillingStatus();
            setBillingData(billingRes.data);

            if (user) {
                const isConnected = !!user.stripeAccountId;
                const isReady = isConnected && (user.stripeOnboardingComplete || true);
                setStripeStatus({ isConnected, isReady });
            }
        } catch (error) {
            console.error("Error loading billing data:", error);
        }
    };

    // const loadAnalytics = async () => {
    //     try {
    //         const analyticsRes = await api.getMarketplaceAnalytics();
    //         if (analyticsRes.success) {
    //             setStats(analyticsRes.data);
    //         }
    //     } catch (error) {
    //         console.error("Error loading analytics:", error);
    //     }
    // };

    const handleListingChange = (e) => {
        const { name, value } = e.target;
        setCurrentListing((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateListing = async () => {
        if (listings.length > 0) {
            toast.error("You already have a listing. Please edit it.");
            return;
        }

        if (!currentListing.title?.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!currentListing.price || parseFloat(currentListing.price) <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        if (!currentListing.description?.trim()) {
            toast.error("Please enter a description");
            return;
        }

        if (listingPhotos.length === 0) {
            toast.error("At least one photo is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", currentListing.title);
            formData.append("description", currentListing.description);
            formData.append("price", currentListing.price);
            formData.append("location", currentListing.location);
            formData.append("status", currentListing.status);

            listingPhotos.forEach((photo) => {
                if (photo instanceof File) {
                    formData.append("photos", photo);
                }
            });

            if (listingVideos.length > 0 && listingVideos[0] instanceof File) {
                formData.append("video", listingVideos[0]);
            }

            const response = await api.createMarketItem(formData);

            if (response.success) {
                toast.success("🎉 Listing created successfully!");
                await Promise.all([
                    loadMarketplaceData(),
                    // loadAnalytics()
                ]);
            } else {
                toast.error(response.message || "Failed to create listing");
            }
        } catch (error) {
            console.error("Error creating listing:", error);
            toast.error("Failed to create listing");
        }
    };

    const handleUpdateListing = async () => {
        try {
            const formData = new FormData();
            formData.append("title", currentListing.title);
            formData.append("description", currentListing.description);
            formData.append("price", currentListing.price);
            formData.append("location", currentListing.location);
            formData.append("status", currentListing.status);

            listingPhotos.forEach((photo) => {
                if (photo instanceof File) {
                    formData.append("photos", photo);
                }
            });

            deletedPhotoIndexes.forEach((index) => {
                formData.append("deletedPhotos[]", index);
            });

            if (listingVideos[0] instanceof File) {
                formData.append("video", listingVideos[0]);
            }

            const response = await api.updateMarketItem(formData);

            if (response.success) {
                toast.success("✅ Listing updated successfully!");
                setDeletedPhotoIndexes([]);
                await Promise.all([
                    loadMarketplaceData(),
                    // loadAnalytics()
                ]);
                setIsEditingListing(false);
            } else {
                toast.error(response.message || "Failed to update listing");
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            toast.error("Failed to update listing");
        }
    };

    const handleDeleteListing = async () => {
        if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await api.deleteMarketItem();

            if (response.success) {
                toast.success("🗑️ Listing deleted successfully!");
                setListings([]);
                setCurrentListing({
                    title: "",
                    description: "",
                    price: "",
                    location: "",
                    status: "active",
                });
                setListingPhotos([]);
                setListingVideos([]);
                setIsEditingListing(false);
                // await loadAnalytics();
            } else {
                toast.error(response.message || "Failed to delete listing");
            }
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("Failed to delete listing");
        }
    };

    const handleEditListing = (listing) => {
        setCurrentListing({
            title: listing.title,
            description: listing.description,
            price: listing.price,
            location: listing.location,
            status: listing.status,
        });
        setListingPhotos(listing.photos || []);
        setListingVideos(listing.video ? [listing.video] : []);
        setIsEditingListing(true);
    };

    const handleCancelEdit = () => {
        setIsEditingListing(false);
        if (listings.length > 0) {
            const listing = listings[0];
            setCurrentListing({
                title: listing.title,
                description: listing.description,
                price: listing.price,
                location: listing.location,
                status: listing.status,
            });
            setListingPhotos(listing.photos || []);
            setListingVideos(listing.video ? [listing.video] : []);
        } else {
            setCurrentListing({
                title: "",
                description: "",
                price: "",
                location: "",
                status: "active",
            });
            setListingPhotos([]);
            setListingVideos([]);
        }
    };

    const handleListingPhotoUpload = (files) => {
        const totalPhotos = listingPhotos.length + files.length;
        if (totalPhotos > 5) {
            toast.error(`Maximum 5 photos allowed. You can add ${5 - listingPhotos.length} more.`);
            return;
        }

        const newPhotos = [...listingPhotos];
        files.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`File ${file.name} is too large (max 5MB)`);
                return;
            }
            newPhotos.push(file);
        });
        setListingPhotos(newPhotos);
    };

    const handleListingVideoUpload = (files) => {
        if (files.length === 0) return;

        const file = files[0];
        if (file.size > 50 * 1024 * 1024) {
            toast.error("Video file is too large (max 50MB)");
            return;
        }

        setListingVideos([file]);
    };

    const removeListingPhoto = (index) => {
        const photo = listingPhotos[index];

        if (typeof photo === "string") {
            setDeletedPhotoIndexes((prev) => [...prev, index]);
        }

        const newPhotos = [...listingPhotos];
        newPhotos.splice(index, 1);
        setListingPhotos(newPhotos);
    };

    const removeListingVideo = () => {
        setListingVideos([]);
    };

    const handleStripeConnect = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/onboard`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await res.json();

            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Stripe connection failed");
            }
        } catch (err) {
            toast.error("Stripe connect failed");
        }
    };

    const handleRefreshData = async () => {
        setPageLoading(true);
        try {
            await Promise.all([
                loadMarketplaceData(),
                // loadAnalytics()
            ]);
            toast.success("Data refreshed successfully!");
        } catch (error) {
            toast.error("Failed to refresh data");
        } finally {
            setPageLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 mt-6 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 mt-6 text-lg">Loading marketplace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#fff',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Header */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-purple-50"></div>
                <div className="px-4 md:px-8 pt-8 pb-6 relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">Marketplace</h1>
                                    <p className="text-gray-600 mt-2">
                                        Sell your music gear, services, and merchandise
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalViews}</div>
                                        <div className="text-sm text-gray-600">Total Views</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Zap className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalClicks}</div>
                                        <div className="text-sm text-gray-600">Total Clicks</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Shield className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{listings.length}</div>
                                        <div className="text-sm text-gray-600">Active Listings</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRefreshData}
                                disabled={pageLoading}
                                className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 transition-all flex items-center gap-3 shadow-sm hover:shadow"
                            >
                                <RefreshCw className={`w-5 h-5 ${pageLoading ? "animate-spin" : ""}`} />
                                Refresh Data
                            </button>

                            {!hasMarketplaceAccess && (
                                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                                    Upgrade to Pro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 md:px-8 pb-12">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <ArtistMarketplaceTab
                            subscriptionPlan={subscriptionPlan}
                            hasMarketplaceAccess={hasMarketplaceAccess}
                            listings={listings}
                            loadingListings={loadingListings}
                            currentListing={currentListing}
                            billingData={billingData}
                            listingPhotos={listingPhotos}
                            listingVideos={listingVideos}
                            isEditingListing={isEditingListing}
                            onListingChange={handleListingChange}
                            onPhotoUpload={handleListingPhotoUpload}
                            onVideoUpload={handleListingVideoUpload}
                            onRemovePhoto={removeListingPhoto}
                            onRemoveVideo={removeListingVideo}
                            onCreateListing={handleCreateListing}
                            onUpdateListing={handleUpdateListing}
                            onEditListing={handleEditListing}
                            onDeleteListing={handleDeleteListing}
                            onCancelEdit={handleCancelEdit}
                            loadMarketplaceData={loadMarketplaceData}
                            setListingPhotos={setListingPhotos}
                            setIsEditingListing={setIsEditingListing}
                            setListingVideos={setListingVideos}
                            handleStripeConnect={handleStripeConnect}
                            stripeStatus={stripeStatus}
                            user={user}
                            stats={stats}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="container mx-auto px-4 md:px-8 pb-8">
                <div className="text-center text-gray-600 text-sm">
                    <p className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        All transactions are secured with Stripe. Your payment information is never stored on our servers.
                    </p>
                    <p className="mt-2">Need help? Contact support at support@gulfcoast.com</p>
                </div>
            </div>
        </div>
    );
}