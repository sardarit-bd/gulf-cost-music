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

            if (response.success && response.data?.artist) {
                const artistData = response.data.artist;

                // Set artist basic info
                setArtist({
                    name: artistData.name || "",
                    city: artistData.city || "",
                    genre: artistData.genre || "",
                    biography: artistData.biography || "",
                    photos: artistData.photos || [],
                    mp3Files: artistData.mp3Files || [],
                    isVerified: artistData.isVerified || false,
                });

                // Process photos - ensure valid URLs
                const validPhotos = (artistData.photos || [])
                    .filter(photo => photo && photo.url && typeof photo.url === "string")
                    .map(photo => ({
                        url: photo.url,
                        filename: photo.filename || photo.url.split("/").pop(),
                        publicId: photo.publicId,
                        isExisting: true,
                    }));

                setPreviewImages(validPhotos);

                // Process audio files - ensure valid URLs
                const validAudios = (artistData.mp3Files || [])
                    .filter(audio => audio && audio.url && typeof audio.url === "string")
                    .map(audio => ({
                        url: audio.url,
                        filename: audio.filename || audio.url.split("/").pop(),
                        name: audio.originalName || audio.filename || "Audio Track",
                        publicId: audio.publicId,
                        isExisting: true,
                    }));

                setAudioPreview(validAudios);

                console.log("✅ Profile loaded:", {
                    photos: validPhotos.length,
                    audios: validAudios.length
                });
            } else {
                // New profile - empty state
                setPreviewImages([]);
                setAudioPreview([]);
            }
        } catch (error) {
            console.error("❌ Error loading artist profile:", error);
            toast.error(error.message || "Failed to load profile");
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

            // Log FormData contents for debugging
            console.log("📦 Sending FormData:");
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`  ${pair[0]}: ${pair[1].name} (${(pair[1].size / 1024).toFixed(2)} KB)`);
                } else {
                    console.log(`  ${pair[0]}: ${pair[1]}`);
                }
            }

            const response = await api.updateArtistProfile(formData);

            if (response.success) {
                toast.success("Profile updated successfully!");
                await loadArtistProfile(); // Reload fresh data
                await refreshUser(); // Refresh user context
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (files) => {
        const totalPhotos = previewImages.length + files.length;
        if (totalPhotos > 5) {
            toast.error(`You can upload maximum 5 photos.`);
            return;
        }

        const newImages = [...previewImages];
        files.forEach((file) => {
            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file);

            newImages.push({
                url: objectUrl,
                filename: file.name,
                file: file,
                isExisting: false,
                isNew: true,
            });
        });

        setPreviewImages(newImages);
    };

    const handleAudioUpload = (files) => {
        const totalAudios = audioPreview.length + files.length;
        if (totalAudios > 5) {
            toast.error(`You can upload maximum 5 audio files.`);
            return;
        }

        const newAudios = [...audioPreview];
        files.forEach((file) => {
            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file);

            newAudios.push({
                url: objectUrl,
                filename: file.name,
                name: file.name,
                file: file,
                isExisting: false,
                isNew: true,
            });
        });
        setAudioPreview(newAudios);
    };

    // Handle image removal
    const handleRemoveImage = (index) => {
        const imageToRemove = previewImages[index];

        // Revoke object URL to free memory (for blob URLs)
        if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.url);
        }

        const newImages = [...previewImages];
        newImages.splice(index, 1);
        setPreviewImages(newImages);
    };

    // Handle audio removal
    const handleRemoveAudio = (index) => {
        const audioToRemove = audioPreview[index];

        // Revoke object URL to free memory (for blob URLs)
        if (audioToRemove.url && audioToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(audioToRemove.url);
        }

        const newAudios = [...audioPreview];
        newAudios.splice(index, 1);
        setAudioPreview(newAudios);
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            previewImages.forEach(img => {
                if (img.url && img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url);
                }
            });
            audioPreview.forEach(audio => {
                if (audio.url && audio.url.startsWith('blob:')) {
                    URL.revokeObjectURL(audio.url);
                }
            });
        };
    }, [previewImages, audioPreview]);

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
            <Toaster position="top-right" />
            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
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
                            onRemoveImage={handleRemoveImage}
                            onAudioUpload={handleAudioUpload}
                            onRemoveAudio={handleRemoveAudio}
                            onSave={handleSave}
                            saving={saving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}