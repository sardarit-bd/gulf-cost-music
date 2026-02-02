"use client";

import { api } from "@/components/modules/artist/apiService";
import OverviewTab from "@/components/modules/artist/OverviewTab";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ArtistDashboardPage() {
    const { user } = useAuth();
    const [artist, setArtist] = useState({
        name: "",
        city: "",
        genre: "",
        biography: "",
        photos: [],
        mp3Files: [],
        isVerified: false,
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [audioPreview, setAudioPreview] = useState([]);
    const [listings, setListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        monthlyEarnings: 0,
        followers: 0,
        engagement: 0
    });

    const subscriptionPlan = user?.subscriptionPlan || "free";

    // Load all data
    // useEffect(() => {
    //     loadArtistProfile();
    //     loadMarketplaceData();
    //     loadAnalytics();
    // }, []);


    useEffect(() => {
        if (!user) return;

        const init = async () => {
            setProfileLoading(true);
            await Promise.all([
                loadArtistProfile(),
                loadMarketplaceData(),
            ]);
            setProfileLoading(false);
        };

        init();
    }, [user]);


    const loadArtistProfile = async () => {
        try {
            const response = await api.getMyArtistProfile();
            if (response.success && response.data.artist) {
                const artistData = response.data.artist;
                setArtist(artistData);

                // Ensure we only set valid photos with URLs
                const validPhotos = (artistData.photos || [])
                    .filter(
                        (photo) =>
                            photo &&
                            photo.url &&
                            typeof photo.url === "string" &&
                            photo.url.trim() !== "" &&
                            !photo.url.includes("undefined") &&
                            !photo.url.includes("null"),
                    )
                    .map((p) => ({
                        url: p.url,
                        filename: p.filename || p.url.split("/").pop(),
                        isNew: false,
                    }));

                setPreviewImages(validPhotos);

                // Ensure valid audio files
                const validAudios = (artistData.mp3Files || []).filter(
                    (audio) =>
                        audio &&
                        audio.url &&
                        typeof audio.url === "string" &&
                        audio.url.trim() !== "" &&
                        !audio.url.includes("undefined") &&
                        !audio.url.includes("null"),
                );

                setAudioPreview(validAudios);
            } else {
                // Set empty arrays if no valid data
                setPreviewImages([]);
                setAudioPreview([]);
            }
        } catch (error) {
            console.error("Error loading artist profile:", error);
            toast.error("Failed to load profile");
            setPreviewImages([]);
            setAudioPreview([]);
        }
    };

    const loadMarketplaceData = async () => {
        try {
            setLoadingListings(true);
            const response = await api.getMyMarketItem();
            if (response.success) {
                if (response.data) {
                    setListings([response.data]);
                } else {
                    setListings([]);
                }
            }
        } catch (error) {
            console.error("Error loading marketplace data:", error);
            toast.error("Failed to load marketplace data");
        } finally {
            setLoadingListings(false);
        }
    };

    const loadAnalytics = async () => {
        // Mock analytics data - Replace with actual API call
        setStats({
            totalViews: 12450,
            monthlyEarnings: 2450,
            followers: 1280,
            engagement: 68
        });
    };

    const handleProCheckout = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                alert("You must be logged in to upgrade.");
                return;
            }

            const res = await fetch(`${API_URL}/api/subscription/checkout/pro`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.message || "Checkout failed");
            }

            window.location.href = data.url;
        } catch (error) {
            toast.error("Unable to start checkout. Please try again.");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Toaster />
            {/* Main Content */}
            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-100">
                        <div className="px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-900">Artist Overview</h1>
                            <p className="text-gray-600 mt-1">Manage your music profile and content</p>
                        </div>
                    </div>

                    {profileLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
                        </div>
                    ) : (
                        <OverviewTab
                            user={user}
                            artist={artist}
                            previewImages={previewImages}
                            audioPreview={audioPreview}
                            subscriptionPlan={subscriptionPlan}
                            uploadLimits={{ photos: 5, audios: 5 }}
                            listings={listings}
                            loadingListings={loadingListings}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}