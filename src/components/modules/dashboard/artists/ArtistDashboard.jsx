// app/dashboard/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Components
import EditProfileTab from "../../artist/EditProfileTab";
import Header from "../../artist/Header";
import ArtistMarketplaceTab from "../../artist/MarketplaceTab";
import OverviewTab from "../../artist/OverviewTab";
import PlanStats from "../../artist/PlanStats";
import Tabs from "../../artist/Tabs";

export default function ArtistDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [artist, setArtist] = useState({
        name: "",
        city: "",
        genre: "",
        biography: ""
    });
    const [loading, setLoading] = useState(true);

    // Preview data
    const [previewImages, setPreviewImages] = useState([]);
    const [audioPreview, setAudioPreview] = useState([]);
    const [listings, setListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);

    // Edit states
    const [saving, setSaving] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [newAudios, setNewAudios] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [removedAudios, setRemovedAudios] = useState([]);

    // Marketplace states
    const [currentListing, setCurrentListing] = useState({
        title: "",
        description: "",
        price: "",
        category: "merchandise",
        condition: "new",
        status: "available"
    });
    const [listingPhotos, setListingPhotos] = useState([]);
    const [listingVideos, setListingVideos] = useState([]);
    const [isEditingListing, setIsEditingListing] = useState(false);

    // Subscription data
    const [subscriptionPlan, setSubscriptionPlan] = useState("free");
    const [uploadLimits, setUploadLimits] = useState({
        photos: 0,
        audios: 0,
        marketplace: false,
        biography: false
    });

    const fetchArtistData = async () => {
        try {
            setLoading(true);
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store'
                }
            );

            if (res.ok) {
                const data = await res.json();
                const artistData = data.data?.artist;

                if (artistData) {
                    setArtist({
                        name: artistData.name || "",
                        city: artistData.city || "",
                        genre: artistData.genre || "",
                        biography: artistData.biography || ""
                    });

                    // Set preview images with proper URL handling
                    const photos = (artistData.photos || []).map(photo => ({
                        ...photo,
                        preview: photo.url || "",
                        isNew: false
                    }));
                    setPreviewImages(photos);

                    // Set audio preview
                    const audios = (artistData.mp3Files || []).map(audio => ({
                        ...audio,
                        preview: audio.url || "",
                        isNew: false
                    }));
                    setAudioPreview(audios);

                    // Set subscription plan from user or artist data
                    const plan = artistData.user?.subscriptionPlan || "free";
                    setSubscriptionPlan(plan);

                    // Set upload limits based on plan
                    const limits = {
                        photos: plan === "pro" ? 10 : 0,
                        audios: plan === "pro" ? 5 : 0,
                        marketplace: plan === "pro",
                        biography: plan === "pro"
                    };
                    setUploadLimits(limits);
                } else {
                    // If no artist profile exists, set empty state
                    setArtist({
                        name: "",
                        city: "",
                        genre: "",
                        biography: ""
                    });
                }
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to load profile");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const fetchListings = async () => {
        try {
            setLoadingListings(true);
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                if (data.data) {
                    setListings([data.data]);
                } else {
                    setListings([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch listings:", error);
            setListings([]);
        } finally {
            setLoadingListings(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        if (user) {
            fetchArtistData();
            if (uploadLimits.marketplace) {
                fetchListings();
            }
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtist(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (!files || files.length === 0) return;

        // Check subscription plan
        if (subscriptionPlan !== "pro") {
            toast.error("Upgrade to Pro plan to upload photos");
            return;
        }

        // Check limits
        const totalPhotos = previewImages.length + files.length;
        if (totalPhotos > uploadLimits.photos) {
            toast.error(`You can only upload ${uploadLimits.photos} photos`);
            return;
        }

        const newFiles = files.map(file => {
            const preview = URL.createObjectURL(file);
            return {
                file,
                preview,
                url: preview,
                filename: file.name,
                isNew: true,
                originalName: file.name
            };
        });

        setNewImages(prev => [...prev, ...files]);
        setPreviewImages(prev => [...prev, ...newFiles]);

        // Clear file input
        e.target.value = null;
    };

    const removeImage = (index) => {
        const image = previewImages[index];

        if (image.isNew) {
            setNewImages(prev => prev.filter((_, i) => i !== index));
            if (image.preview && image.preview.startsWith('blob:')) {
                URL.revokeObjectURL(image.preview);
            }
        } else {
            setRemovedImages(prev => [...prev, image.filename]);
        }

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAudioUpload = (e) => {
        const files = Array.from(e.target.files);

        if (!files || files.length === 0) return;

        if (subscriptionPlan !== "pro") {
            toast.error("Upgrade to Pro plan to upload audio files");
            return;
        }

        // Check limits
        const totalAudios = audioPreview.length + files.length;
        if (totalAudios > uploadLimits.audios) {
            toast.error(`You can only upload ${uploadLimits.audios} audio files`);
            return;
        }

        const newFiles = files.map(file => {
            const preview = URL.createObjectURL(file);
            return {
                file,
                preview,
                url: preview,
                filename: file.name,
                originalName: file.name,
                isNew: true
            };
        });

        setNewAudios(prev => [...prev, ...files]);
        setAudioPreview(prev => [...prev, ...newFiles]);

        // Clear file input
        e.target.value = null;
    };

    const removeAudio = (index) => {
        const audio = audioPreview[index];

        if (audio.isNew) {
            // Remove from new audios
            setNewAudios(prev => prev.filter((_, i) => i !== index));
            // Revoke object URL
            if (audio.preview && audio.preview.startsWith('blob:')) {
                URL.revokeObjectURL(audio.preview);
            }
        } else {
            // Add to removed audios
            setRemovedAudios(prev => [...prev, audio.filename]);
        }

        setAudioPreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const formData = new FormData();

            // Basic info - check if artist exists
            if (artist) {
                formData.append("name", artist.name || "");
                formData.append("city", artist.city || "");
                formData.append("genre", artist.genre || "");
                if (uploadLimits.biography) {
                    formData.append("biography", artist.biography || "");
                }
            }

            // Removed files
            removedImages.forEach(filename => {
                formData.append("removedPhotos", filename);
            });

            removedAudios.forEach(filename => {
                formData.append("removedAudios", filename);
            });

            // New files
            newImages.forEach(file => {
                formData.append("photos", file);
            });

            newAudios.forEach(file => {
                formData.append("mp3Files", file);
            });

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Profile updated successfully");

                // Reset states
                setNewImages([]);
                setNewAudios([]);
                setRemovedImages([]);
                setRemovedAudios([]);

                // Refresh data
                await fetchArtistData();
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    // Marketplace handlers - UPDATED FOR NEW SCHEMA
    const handleListingChange = (e) => {
        const { name, value } = e.target;
        setCurrentListing(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleListingPhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            filename: file.name,
            url: URL.createObjectURL(file)
        }));
        setListingPhotos(prev => [...prev, ...newPhotos]);
    };

    const handleListingVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            filename: file.name,
            url: URL.createObjectURL(file)
        }));
        setListingVideos(prev => [...prev, ...newVideos]);
    };

    const removeListingPhoto = (index) => {
        const photo = listingPhotos[index];
        // Revoke object URL
        if (photo.preview && photo.preview.startsWith('blob:')) {
            URL.revokeObjectURL(photo.preview);
        }
        setListingPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeListingVideo = (index) => {
        const video = listingVideos[index];
        // Revoke object URL
        if (video.preview && video.preview.startsWith('blob:')) {
            URL.revokeObjectURL(video.preview);
        }
        setListingVideos(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateListing = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const formData = new FormData();
            formData.append("title", currentListing.title || "");
            formData.append("description", currentListing.description || "");
            formData.append("price", currentListing.price || "0");
            formData.append("location", currentListing.location || "");

            listingPhotos.forEach(photo => {
                formData.append("photos", photo.file);
            });

            if (listingVideos.length > 0) {
                formData.append("video", listingVideos[0].file);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok) {
                toast.success("Listing created successfully");
                setCurrentListing({
                    title: "",
                    description: "",
                    price: "",
                    category: "merchandise",
                    condition: "new",
                    status: "available"
                });
                setListingPhotos([]);
                setListingVideos([]);
                fetchListings();
            } else {
                toast.error(data.message || "Failed to create listing");
            }
        } catch (error) {
            console.error("Create listing error:", error);
            toast.error("Network error");
        }
    };

    const handleEditListing = (listing) => {
        setCurrentListing({
            title: listing.title || "",
            description: listing.description || "",
            price: listing.price || "",
            category: listing.category || "merchandise",
            condition: listing.condition || "new",
            status: listing.status || "available",
            location: listing.location || ""
        });
        setIsEditingListing(true);
        setActiveTab("marketplace");
    };

    const handleUpdateListing = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const formData = new FormData();
            formData.append("title", currentListing.title || "");
            formData.append("description", currentListing.description || "");
            formData.append("price", currentListing.price || "0");
            formData.append("location", currentListing.location || "");
            formData.append("status", currentListing.status || "active");

            listingPhotos.forEach(photo => {
                formData.append("photos", photo.file);
            });

            if (listingVideos.length > 0) {
                formData.append("video", listingVideos[0].file);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok) {
                toast.success("Listing updated successfully");
                setIsEditingListing(false);
                setCurrentListing({
                    title: "",
                    description: "",
                    price: "",
                    category: "merchandise",
                    condition: "new",
                    status: "available"
                });
                setListingPhotos([]);
                setListingVideos([]);
                fetchListings();
            } else {
                toast.error(data.message || "Failed to update listing");
            }
        } catch (error) {
            console.error("Update listing error:", error);
            toast.error("Network error");
        }
    };

    const handleDeleteListing = async (listingId) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (res.ok) {
                toast.success("Listing deleted successfully");
                setListings([]);
            } else {
                toast.error("Failed to delete listing");
            }
        } catch (error) {
            toast.error("Network error");
        }
    };

    const handleCancelEdit = () => {
        setCurrentListing({
            title: "",
            description: "",
            price: "",
            category: "merchandise",
            condition: "new",
            status: "available"
        });
        setListingPhotos([]);
        setListingVideos([]);
        setIsEditingListing(false);
    };

    useEffect(() => {
        return () => {
            previewImages.forEach(img => {
                if (img.preview && img.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(img.preview);
                }
            });
            audioPreview.forEach(audio => {
                if (audio.preview && audio.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(audio.preview);
                }
            });
            listingPhotos.forEach(photo => {
                if (photo.preview && photo.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.preview);
                }
            });
            listingVideos.forEach(video => {
                if (video.preview && video.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(video.preview);
                }
            });
        };
    }, [previewImages, audioPreview, listingPhotos, listingVideos]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-white text-xl text-center">
                    <p>Please login to access the dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 md:px-16">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                        border: '1px solid #374151'
                    }
                }}
            />

            <Header subscriptionPlan={subscriptionPlan} />

            <PlanStats
                subscriptionPlan={subscriptionPlan}
                photosCount={previewImages.length}
                audiosCount={audioPreview.length}
                listingsCount={listings.length}
                hasMarketplaceAccess={uploadLimits.marketplace}
            />

            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 mt-8">
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    hasMarketplaceAccess={uploadLimits.marketplace}
                />

                <div className="p-6 md:p-8">
                    {activeTab === "overview" && (
                        <OverviewTab
                            artist={artist}
                            previewImages={previewImages}
                            audioPreview={audioPreview}
                            subscriptionPlan={subscriptionPlan}
                            uploadLimits={uploadLimits}
                            listings={listings}
                            loadingListings={loadingListings}
                        />
                    )}

                    {activeTab === "edit" && (
                        <EditProfileTab
                            artist={artist}
                            previewImages={previewImages}
                            audioPreview={audioPreview}
                            subscriptionPlan={subscriptionPlan}
                            uploadLimits={uploadLimits}
                            onChange={handleChange}
                            onImageUpload={handleImageUpload}
                            onRemoveImage={removeImage}
                            onAudioUpload={handleAudioUpload}
                            onRemoveAudio={removeAudio}
                            onSave={handleSave}
                            saving={saving}
                        />
                    )}

                    {activeTab === "marketplace" && uploadLimits.marketplace && (
                        <ArtistMarketplaceTab
                            subscriptionPlan={subscriptionPlan}
                            hasMarketplaceAccess={uploadLimits.marketplace}
                            listings={listings}
                            loadingListings={loadingListings}
                            currentListing={currentListing}
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
                        />
                    )}

                    {activeTab === "marketplace" && !uploadLimits.marketplace && (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Marketplace Access Required
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Upgrade to Pro plan to access the marketplace features
                            </p>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                Upgrade to Pro
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}