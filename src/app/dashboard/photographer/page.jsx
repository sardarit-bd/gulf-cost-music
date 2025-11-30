"use client";

import PhotographerDashboard from "@/components/modules/dashboard/photographer/PhotographerDashboard";
import { useSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PhotographerPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useSession();
    const [photographer, setPhotographer] = useState({
        name: "",
        city: "",
        biography: "",
        services: [],
        photos: [],
        videos: [],
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [newService, setNewService] = useState({ service: "", price: "" });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);

    const cityOptions = [
        { value: "new orleans", label: "New Orleans" },
        { value: "biloxi", label: "Biloxi" },
        { value: "mobile", label: "Mobile" },
        { value: "pensacola", label: "Pensacola" }
    ];


    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    const MAX_PHOTOS = 5;

    // === Fetch Photographer Profile ===
    useEffect(() => {
        const fetchPhotographer = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) return toast.error("You must be logged in.");

                const res = await fetch(`${API_BASE}/api/photographers/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to fetch profile.");

                if (data.data?.photographer) {
                    const p = data.data.photographer;
                    setPhotographer({
                        name: p.name,
                        city: p.city,
                        biography: p.biography,
                        services: p.services || [],
                        photos: p.photos || [],
                        videos: p.videos || [],
                    });
                    setPreviewImages(p.photos?.map((p) => p.url) || []);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error(error.message || "Server error while loading profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchPhotographer();
    }, []);

    // === Handle Input ===
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPhotographer({ ...photographer, [name]: value });
    };

    // === Image Upload ===
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        // Check total photo limit
        const totalAfterUpload = previewImages.length + files.length;
        if (totalAfterUpload > MAX_PHOTOS) {
            toast.error(`You can only upload maximum ${MAX_PHOTOS} photos. You have ${previewImages.length} already.`);
            return;
        }

        if (files.length === 0) return;

        setUploadingPhotos(true);

        try {
            // Create preview URLs for immediate display
            const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

            setPreviewImages(prev => [...prev, ...newPreviewUrls]);

            // Upload photos to backend
            await uploadPhotosToBackend(files);

            toast.success(`${files.length} photo(s) uploaded successfully!`);

        } catch (error) {
            console.error("Photo upload error:", error);
            toast.error("Failed to upload photos");

            // Remove failed uploads from preview
            setPreviewImages(prev => prev.slice(0, prev.length - files.length));
        } finally {
            setUploadingPhotos(false);
            // Clear file input
            e.target.value = '';
        }
    };

    // === Upload Photos to Backend ===
    const uploadPhotosToBackend = async (files) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const formData = new FormData();
        files.forEach(file => {
            formData.append('photos', file);
        });

        const response = await fetch(`${API_BASE}/api/photographers/photos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }

        // Update photographer state with new photos from backend
        if (data.data?.photos) {
            setPhotographer(prev => ({
                ...prev,
                photos: data.data.photos
            }));
            // Update preview images with actual URLs from backend
            setPreviewImages(data.data.photos.map(p => p.url));
        }

        return data;
    };

    // === Remove Image ===
    const removeImage = async (index) => {
        const photoToDelete = photographer.photos[index];
        if (!photoToDelete) {
            // If it's just a preview (not saved to backend yet)
            setPreviewImages(prev => prev.filter((_, i) => i !== index));
            toast.success("Photo removed from preview");
            return;
        }

        if (!confirm("Are you sure you want to delete this photo?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/photographers/photos/${photoToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Delete failed");

            // Update both preview and photographer state
            setPreviewImages(prev => prev.filter((_, i) => i !== index));
            setPhotographer(prev => ({
                ...prev,
                photos: prev.photos.filter((_, i) => i !== index)
            }));

            toast.success("Photo deleted successfully!");
        } catch (error) {
            console.error("Delete photo error:", error);
            toast.error("Failed to delete photo");
        }
    };

    // === Save Profile ===
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return toast.error("You are not logged in.");

            setSaving(true);
            const saveToast = toast.loading("Saving profile...");

            const res = await fetch(`${API_BASE}/api/photographers/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: photographer.name,
                    city: photographer.city.toLowerCase(),
                    biography: photographer.biography,
                }),
            });

            const data = await res.json();
            toast.dismiss(saveToast);

            if (!res.ok) throw new Error(data.message || "Failed to save profile.");

            toast.success("Profile updated successfully!");

        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.message || "Server error while saving profile.");
        } finally {
            setSaving(false);
        }
    };

    // === Add Service ===
    const handleAddService = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) return toast.error("You are not logged in.");

            setLoading(true);
            const res = await fetch(`${API_BASE}/api/photographers/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newService),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to add service.");

            setPhotographer(prev => ({
                ...prev,
                services: data.data.services
            }));
            setNewService({ service: "", price: "" });
            toast.success("Service added successfully!");

        } catch (error) {
            console.error("Add service error:", error);
            toast.error(error.message || "Error adding service.");
        } finally {
            setLoading(false);
        }
    };

    // === Delete Service ===
    const handleDeleteService = async (serviceId) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/photographers/services/${serviceId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to delete service.");

            setPhotographer(prev => ({
                ...prev,
                services: data.data.services
            }));
            toast.success("Service deleted successfully!");

        } catch (error) {
            console.error("Delete service error:", error);
            toast.error(error.message || "Error deleting service.");
        }
    };

    // === Add Video ===
    const handleAddVideo = async (updatedVideos) => {
        setPhotographer(prev => ({
            ...prev,
            videos: updatedVideos
        }));
    };

    // === Delete Video ===
    const handleDeleteVideo = async (updatedVideos) => {
        setPhotographer(prev => ({
            ...prev,
            videos: updatedVideos
        }));
    };


    if (!user)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-sm mx-auto">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-white mb-3">
                        Authentication Required
                    </h2>
                </div>
            </div>
        );

    return (
        <PhotographerDashboard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            photographer={photographer}
            previewImages={previewImages}
            newService={newService}
            setNewService={setNewService}
            loading={loading}
            saving={saving}
            uploadingPhotos={uploadingPhotos}
            cityOptions={cityOptions}
            MAX_PHOTOS={MAX_PHOTOS}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            handleSave={handleSave}
            handleAddService={handleAddService}
            handleDeleteService={handleDeleteService}
            handleAddVideo={handleAddVideo}
            handleDeleteVideo={handleDeleteVideo}
        />
    );
}