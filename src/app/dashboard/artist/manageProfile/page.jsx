"use client";

import { api } from "@/components/modules/artist/apiService";
import EditProfileTab from "@/components/modules/artist/EditProfileTab";
import { useAuth } from "@/context/AuthContext";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function ManageProfilePage() {
    const { user, refreshUser } = useAuth();
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
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [uploadLimits] = useState({
        photos: 5,
        audios: 5,
        marketplace: true,
    });

    const subscriptionPlan = user?.subscriptionPlan || "free";

    // Load artist profile
    useEffect(() => {
        loadArtistProfile();
    }, []);

    const loadArtistProfile = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtist((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (formData) => {
        try {
            setSaving(true);
            const response = await api.updateArtistProfile(formData);

            if (response.success) {
                toast.success("Profile updated successfully!");
                await loadArtistProfile();
                await refreshUser();
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (files) => {
        const totalPhotos = previewImages.length + files.length;
        if (totalPhotos > 5) {
            toast.error(`You can upload maximum 5 photos.`);
            return;
        }

        const newImages = [...previewImages];
        files.forEach((file) => {
            newImages.push({
                url: URL.createObjectURL(file),
                filename: file.name,
                file,
                isNew: true,
            });
        });

        setPreviewImages(newImages);
    };

    const handleAudioUpload = async (files) => {
        const totalAudios = audioPreview.length + files.length;
        if (totalAudios > 5) {
            toast.error(`You can upload maximum 5 audio files.`);
            return;
        }

        const newAudios = [...audioPreview];
        files.forEach((file) => {
            newAudios.push({
                name: file.name,
                url: URL.createObjectURL(file),
                file: file,
            });
        });
        setAudioPreview(newAudios);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Please sign in to continue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Toaster />

            {/* Header Section */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <Link
                                href="/dashboard/artist"
                                className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-3"
                            >
                                <ArrowLeft size={18} />
                                Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold">Edit Profile</h1>
                            <p className="text-blue-100 mt-1">
                                Update your artist information and upload content
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-blue-100">Plan</p>
                                <p className="font-semibold capitalize">
                                    {subscriptionPlan}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Main Content */}
            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-100">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Complete your profile to get discovered by fans
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                                    <Upload size={16} />
                                    <span className="text-sm font-medium">
                                        {previewImages.length}/5 Photos • {audioPreview.length}/5 Tracks
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <EditProfileTab
                            artist={artist}
                            previewImages={previewImages}
                            audioPreview={audioPreview}
                            subscriptionPlan={subscriptionPlan}
                            uploadLimits={uploadLimits}
                            onChange={handleChange}
                            onImageUpload={handleImageUpload}
                            onAudioUpload={handleAudioUpload}
                            onSave={handleSave}
                            saving={saving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}