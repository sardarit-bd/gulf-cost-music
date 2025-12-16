"use client";

import {
    AlertCircle, Camera,
    CheckCircle,
    DollarSign,
    Eye, EyeOff,
    FileVideo,
    MapPin,
    Package,
    Save, ShoppingBag, Tag, Trash2, Upload,
    User,
    Video, X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";

// Use a consistent token retrieval method
const getToken = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (token) return token;
    if (typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;)\s*token=([^;]+)/);
        return match ? match[1] : null;
    }
    return null;
};


export default function MarketTab({ API_BASE, subscriptionPlan, user }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deletingPhotoIndex, setDeletingPhotoIndex] = useState(null);
    const [existingItem, setExistingItem] = useState(null);

    // Modal states
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
    const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
    const [photoToDeleteIndex, setPhotoToDeleteIndex] = useState(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("active");

    const [photoFiles, setPhotoFiles] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [showVideoPreview, setShowVideoPreview] = useState(false);

    // Check permissions
    const isVerified = !!user?.isVerified;
    const isAllowedSeller = ["artist", "venue", "photographer"].includes(
        String(user?.userType || "").toLowerCase()
    );
    const canUseMarket = isVerified && isAllowedSeller;

    // Calculate total photos
    const totalExistingPhotos = existingItem?.photos?.length || 0;
    const totalNewPhotos = photoFiles.length;
    const totalPhotos = totalExistingPhotos + totalNewPhotos;
    const isPhotoLimitReached = totalPhotos >= 5;
    const remainingPhotoSlots = 5 - totalPhotos;

    // Load my item
    useEffect(() => {
        const loadMyItem = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) throw new Error("Not authenticated");

                const res = await fetch(`${API_BASE}/api/market/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to load (${res.status})`);
                }

                const data = await res.json();
                setExistingItem(data.data || null);

                if (data.data) {
                    setTitle(data.data.title || "");
                    setDescription(data.data.description || "");
                    setPrice(String(data.data.price ?? ""));
                    setLocation(data.data.location || "");
                    setStatus(data.data.status || "active");
                }
            } catch (error) {
                console.error("Load error:", error);
                if (!error.message.includes("404")) {
                    toast.error(error.message || "Failed to load market info");
                }
            } finally {
                setLoading(false);
            }
        };

        if (API_BASE && canUseMarket) {
            loadMyItem();
        } else {
            setLoading(false);
        }
    }, [API_BASE, canUseMarket]);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        // Check if adding these files would exceed limit
        if (totalPhotos + files.length > 5) {
            toast.error(`You can only upload ${remainingPhotoSlots} more photos.`);
            e.target.value = "";
            return;
        }

        setPhotoFiles(prev => [...prev, ...files]);
        e.target.value = ""; // Reset input
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files?.[0] || null;
        setVideoFile(file);
        setShowVideoPreview(!!file);
    };

    const removeLocalPhoto = (index) => {
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeLocalVideo = () => {
        setVideoFile(null);
        setShowVideoPreview(false);
    };

    // Function to open delete photo modal
    const openDeletePhotoModal = (photoIndex) => {
        setPhotoToDeleteIndex(photoIndex);
        setShowDeletePhotoModal(true);
    };

    // Function to delete existing photo (after confirmation)
    const deleteExistingPhoto = async () => {
        if (photoToDeleteIndex === null) return;

        const token = getToken();
        if (!token) {
            toast.error("Please sign in again");
            return;
        }

        try {
            setDeletingPhotoIndex(photoToDeleteIndex);

            // First try the specific photo delete endpoint
            const res = await fetch(`${API_BASE}/api/market/me/photos/${photoToDeleteIndex}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                // If specific endpoint doesn't work, update with remaining photos
                const existingPhotos = [...(existingItem?.photos || [])];
                existingPhotos.splice(photoToDeleteIndex, 1);

                const updateRes = await fetch(`${API_BASE}/api/market/me`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: existingItem.title,
                        description: existingItem.description,
                        price: existingItem.price,
                        location: existingItem.location,
                        status: existingItem.status,
                        photos: existingPhotos
                    })
                });

                const updateData = await updateRes.json();

                if (!updateRes.ok) {
                    throw new Error(updateData.message || "Failed to delete photo");
                }

                setExistingItem(updateData.data);
            } else {
                const data = await res.json();
                setExistingItem(data.data);
            }

            toast.success("Photo deleted successfully");
        } catch (error) {
            console.error("Delete photo error:", error);
            toast.error(error.message || "Failed to delete photo");
        } finally {
            setDeletingPhotoIndex(null);
            setPhotoToDeleteIndex(null);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!canUseMarket) {
            toast.error("Only verified seller accounts can list items.");
            return;
        }

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!description.trim()) {
            toast.error("Description is required");
            return;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            toast.error("Please enter a valid price");
            return;
        }

        const token = getToken();
        if (!token) {
            toast.error("Please sign in again");
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("price", parseFloat(price).toFixed(2));
            formData.append("location", location.trim());
            formData.append("status", status);

            // Append new photos only
            photoFiles.forEach(file => {
                formData.append("photos", file);
            });

            if (videoFile) {
                formData.append("video", videoFile);
            }

            const endpoint = `${API_BASE}/api/market/me`;
            const method = existingItem ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `Save failed (${res.status})`);
            }

            setExistingItem(data.data);
            setVideoFile(null);
            setShowVideoPreview(false);
            setPhotoFiles([]);

            toast.success(existingItem ? "Item updated successfully!" : "Item listed successfully!");

        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.message || "Failed to save item");
        } finally {
            setSaving(false);
        }
    };

    // Function to delete item (after confirmation)
    const deleteItem = async () => {
        const token = getToken();
        if (!token) {
            toast.error("Please sign in again");
            return;
        }

        try {
            setDeleting(true);
            const res = await fetch(`${API_BASE}/api/market/me`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Delete failed");
            }

            setExistingItem(null);
            setTitle("");
            setDescription("");
            setPrice("");
            setLocation("");
            setStatus("active");
            setPhotoFiles([]);
            setVideoFile(null);
            setShowVideoPreview(false);

            toast.success("Market item deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Failed to delete item");
        } finally {
            setDeleting(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: "bg-emerald-500/20", text: "text-emerald-300", icon: <Eye size={12} />, label: "Active" },
            sold: { bg: "bg-purple-500/20", text: "text-purple-300", icon: <Package size={12} />, label: "Sold" },
            hidden: { bg: "bg-gray-500/20", text: "text-gray-300", icon: <EyeOff size={12} />, label: "Hidden" }
        };

        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon}
                {config.label}
            </span>
        );
    };

    const getPlanBadge = () => {
        const isPro = subscriptionPlan === "pro";
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isPro ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300'}`}>
                <CheckCircle size={12} />
                {isPro ? 'Pro Plan' : 'Free Plan'}
            </span>
        );
    };

    // ===== RENDER LOGIC =====
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                <div className="text-center">
                    <p className="text-white font-medium">Loading Marketplace</p>
                    <p className="text-gray-400 text-sm">Fetching your listing information...</p>
                </div>
            </div>
        );
    }

    if (!canUseMarket) {
        return (
            <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950 p-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/10 rounded-full mb-6">
                    <ShoppingBag className="w-10 h-10 text-yellow-400" />
                </div>
                <h2 className="text-white text-2xl font-bold mb-3">Marketplace Access Required</h2>
                <div className="max-w-md mx-auto space-y-4 mb-8">
                    <p className="text-gray-300">
                        To list items in the marketplace, your account needs to meet these requirements:
                    </p>
                    <div className="space-y-3 text-left">
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${isVerified ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <div className={`p-1.5 rounded-full ${isVerified ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {isVerified ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                            </div>
                            <span className={`text-sm ${isVerified ? 'text-emerald-300' : 'text-red-300'}`}>
                                {isVerified ? 'Account Verified ✓' : 'Account Not Verified'}
                            </span>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${isAllowedSeller ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <div className={`p-1.5 rounded-full ${isAllowedSeller ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {isAllowedSeller ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                            </div>
                            <span className={`text-sm ${isAllowedSeller ? 'text-emerald-300' : 'text-red-300'}`}>
                                {isAllowedSeller ? 'Seller Account ✓' : 'Invalid Account Type'}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => window.open("/contact", "_blank")}
                    className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition"
                >
                    <User size={16} />
                    Contact Support for Verification
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Delete Item Confirm Modal */}
            <ConfirmModal
                isOpen={showDeleteItemModal}
                onClose={() => setShowDeleteItemModal(false)}
                onConfirm={deleteItem}
                title="Delete Listing"
                message="Are you sure you want to delete this market item? This action cannot be undone."
                confirmText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                type="delete"
            />

            {/* Delete Photo Confirm Modal */}
            <ConfirmModal
                isOpen={showDeletePhotoModal}
                onClose={() => {
                    setShowDeletePhotoModal(false);
                    setPhotoToDeleteIndex(null);
                }}
                onConfirm={deleteExistingPhoto}
                title="Delete Photo"
                message="Are you sure you want to delete this photo? This action cannot be undone."
                confirmText={deletingPhotoIndex !== null ? "Deleting..." : "Delete"}
                cancelText="Keep Photo"
                type="delete"
            />

            <div className="space-y-8">
                {/* Dashboard Header */}
                <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-700 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-white text-2xl font-bold">Marketplace Dashboard</h1>
                                    {getPlanBadge()}
                                </div>
                                <p className="text-gray-400">
                                    List your photography equipment, services, or merchandise. Verified sellers can manage one active listing.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="text-center bg-gray-800/50 rounded-lg p-3 min-w-[120px]">
                                <p className="text-gray-400 text-sm mb-1">Your Plan</p>
                                <p className="text-white font-bold">{subscriptionPlan.toUpperCase()}</p>
                            </div>
                            <div className="text-center bg-gray-800/50 rounded-lg p-3 min-w-[120px]">
                                <p className="text-gray-400 text-sm mb-1">Photos</p>
                                <p className="text-white font-bold">{totalExistingPhotos}/5</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Listing Preview */}
                {existingItem && (
                    <div className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Tag className="text-yellow-400" size={20} />
                                    <h3 className="text-white text-lg font-semibold">Current Listing</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(existingItem.status)}
                                    <button
                                        onClick={() => setShowDeleteItemModal(true)}
                                        disabled={deleting}
                                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-4 py-2 rounded-lg border border-red-500/20 transition disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        {deleting ? "Deleting..." : "Delete Listing"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Item Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h4 className="text-white font-bold text-2xl mb-3">{existingItem.title}</h4>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-300 px-3 py-1.5 rounded-lg">
                                                <DollarSign size={16} />
                                                <span className="font-bold text-lg">${existingItem.price}</span>
                                            </div>
                                            {existingItem.location && (
                                                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-lg">
                                                    <MapPin size={16} />
                                                    <span className="font-medium">{existingItem.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/50 rounded-xl p-5">
                                        <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                                            <Package size={18} /> Description
                                        </h5>
                                        <p className="text-gray-300 leading-relaxed">{existingItem.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-800/50 rounded-xl p-4">
                                            <p className="text-gray-400 text-sm mb-1">Seller Type</p>
                                            <p className="text-white font-medium capitalize">{existingItem.sellerType}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-4">
                                            <p className="text-gray-400 text-sm mb-1">Listed On</p>
                                            <p className="text-white font-medium">
                                                {new Date(existingItem.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Media Preview */}
                                <div className="space-y-6">
                                    {/* Photo Gallery */}
                                    <div className="bg-gray-800/50 rounded-xl p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h5 className="text-white font-semibold flex items-center gap-2">
                                                <Camera size={18} /> Photos ({totalExistingPhotos}/5)
                                            </h5>
                                            <span className={`text-sm ${isPhotoLimitReached ? 'text-red-400' : 'text-gray-400'}`}>
                                                {isPhotoLimitReached ? 'Limit Reached' : `${remainingPhotoSlots} slots left`}
                                            </span>
                                        </div>

                                        {totalExistingPhotos > 0 ? (
                                            <div className="grid grid-cols-3 gap-3">
                                                {existingItem.photos.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 group"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`Listing photo ${index + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeletePhotoModal(index)}
                                                            disabled={deletingPhotoIndex === index}
                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                                        >
                                                            {deletingPhotoIndex === index ? (
                                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Trash2 size={12} />
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                                <p className="text-gray-400">No photos uploaded</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Video Preview */}
                                    {existingItem.video && (
                                        <div className="bg-gray-800/50 rounded-xl p-5">
                                            <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                <FileVideo size={18} /> Video Preview
                                            </h5>
                                            <div className="relative rounded-lg overflow-hidden bg-black">
                                                <video
                                                    controls
                                                    className="w-full"
                                                >
                                                    <source src={existingItem.video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create/Edit Form */}
                <div className="rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
                        <h3 className="text-white text-xl font-bold flex items-center gap-3">
                            {existingItem ? (
                                <>
                                    <Save size={20} /> Edit Listing
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={20} /> Create New Listing
                                </>
                            )}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                            {existingItem ? 'Update your marketplace listing details' : 'Fill in the details below to list your item'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Package className="w-5 h-5 text-blue-400" />
                                </div>
                                <h4 className="text-white text-lg font-semibold">Basic Information</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label className="text-white font-medium mb-2 block flex items-center gap-2">
                                        <span className="text-red-400">*</span> Title
                                    </label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                                        placeholder="Enter a descriptive title for your item..."
                                        required
                                    />
                                    <p className="text-gray-400 text-sm mt-2">Make it clear and descriptive to attract buyers</p>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="text-white font-medium mb-2 block flex items-center gap-2">
                                        <DollarSign size={16} /> <span className="text-red-400">*</span> Price (USD)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Enter the price in US dollars</p>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-white font-medium mb-2 block flex items-center gap-2">
                                        <Tag size={16} /> Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white appearance-none outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                                        >
                                            <option value="active" className="bg-gray-800">Active</option>
                                            <option value="sold" className="bg-gray-800">Sold</option>
                                            <option value="hidden" className="bg-gray-800">Hidden</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <X className="w-4 h-4 text-gray-400 rotate-45" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Set listing visibility</p>
                                </div>

                                {/* Location */}
                                <div className="md:col-span-2">
                                    <label className="text-white font-medium mb-2 block flex items-center gap-2">
                                        <MapPin size={16} /> Location (Optional)
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white appearance-none outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                                        >
                                            <option value="">Select a location</option>
                                            <option value="New Orleans">New Orleans</option>
                                            <option value="Biloxi">Biloxi</option>
                                            <option value="Mobile">Mobile</option>
                                            <option value="Pensacola">Pensacola</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <X className="w-4 h-4 text-gray-400 rotate-45" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">Where is your item located?</p>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="text-white font-medium mb-2 block flex items-center gap-2">
                                        <span className="text-red-400">*</span> Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={6}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition resize-none"
                                        placeholder="Describe your item in detail. Include condition, specifications, reason for selling, etc..."
                                        required
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-gray-400 text-sm">Detailed descriptions get more views</p>
                                        <span className={`text-xs ${description.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                                            {description.length}/1000 characters
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Upload Section */}
                        <div className="space-y-6 pt-6 border-t border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Camera className="w-5 h-5 text-purple-400" />
                                </div>
                                <h4 className="text-white text-lg font-semibold">Media Upload</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Photo Upload */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-white font-medium mb-3 block flex items-center gap-2">
                                            <Camera size={18} /> Photos (Max 5)
                                            <span className={`text-sm font-normal ml-auto ${isPhotoLimitReached ? 'text-red-400' : 'text-gray-400'}`}>
                                                {totalPhotos}/5 • {remainingPhotoSlots} slots available
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                                id="photo-upload"
                                                disabled={isPhotoLimitReached}
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className={`block w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors group ${isPhotoLimitReached
                                                    ? 'border-red-500/50 bg-red-500/5 cursor-not-allowed'
                                                    : 'border-gray-700 hover:border-yellow-500/50 hover:bg-gray-800/30'
                                                    }`}
                                            >
                                                <div className="space-y-3">
                                                    <div className={`inline-flex p-3 rounded-full group-hover:bg-yellow-500/20 transition-colors ${isPhotoLimitReached ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                                                        <Upload className={`w-6 h-6 ${isPhotoLimitReached ? 'text-red-400' : 'text-yellow-400'}`} />
                                                    </div>
                                                    <div>
                                                        {isPhotoLimitReached ? (
                                                            <>
                                                                <p className="text-red-300 font-medium">Photo Limit Reached</p>
                                                                <p className="text-red-400/80 text-sm mt-1">
                                                                    Delete existing photos to upload new ones
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-white font-medium">Click to upload photos</p>
                                                                <p className="text-gray-400 text-sm mt-1">or drag and drop</p>
                                                            </>
                                                        )}
                                                        <p className="text-gray-500 text-xs mt-2">Supports JPG, PNG, WEBP (Max 5MB each)</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Photo Preview */}
                                    {(photoFiles.length > 0 || totalExistingPhotos > 0) && (
                                        <div className="space-y-3">
                                            <p className="text-white font-medium">Photos Preview</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {/* Existing photos */}
                                                {(existingItem?.photos || []).map((url, index) => (
                                                    <div key={`existing-${index}`} className="relative group">
                                                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-700">
                                                            <img
                                                                src={url}
                                                                alt={`Existing ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeletePhotoModal(index)}
                                                            disabled={deletingPhotoIndex === index}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            {deletingPhotoIndex === index ? (
                                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <X size={12} />
                                                            )}
                                                        </button>
                                                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                                                            Existing
                                                        </span>
                                                    </div>
                                                ))}

                                                {/* Newly selected photos */}
                                                {photoFiles.map((file, index) => (
                                                    <div key={`new-${index}`} className="relative">
                                                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-yellow-500">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`New ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLocalPhoto(index)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <span className="absolute bottom-1 left-1 text-[10px] bg-yellow-500/80 text-black px-1 rounded">
                                                            New
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Photo Count Info */}
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-gray-700 rounded"></div>
                                                    <span>{totalExistingPhotos} existing</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-yellow-500/80 rounded"></div>
                                                    <span>{totalNewPhotos} new to upload</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Video Upload */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-white font-medium mb-3 block flex items-center gap-2">
                                            <Video size={18} /> Video (Optional)
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <label
                                                htmlFor="video-upload"
                                                className="block w-full border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/30 transition-colors group"
                                            >
                                                <div className="space-y-3">
                                                    <div className="inline-flex p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                                        <FileVideo className="w-6 h-6 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">Click to upload video</p>
                                                        <p className="text-gray-400 text-sm mt-1">or drag and drop</p>
                                                        <p className="text-gray-500 text-xs mt-2">Supports MP4, MOV (Max 50MB)</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Video Preview */}
                                    {(videoFile || existingItem?.video) && (
                                        <div className="space-y-3">
                                            <p className="text-white font-medium">Video Preview</p>
                                            <div className="relative rounded-lg overflow-hidden bg-black">
                                                {videoFile ? (
                                                    <video
                                                        controls
                                                        className="w-full"
                                                        src={URL.createObjectURL(videoFile)}
                                                    />
                                                ) : (
                                                    existingItem?.video && (
                                                        <video
                                                            controls
                                                            className="w-full"
                                                        >
                                                            <source src={existingItem.video} type="video/mp4" />
                                                        </video>
                                                    )
                                                )}
                                                {videoFile && (
                                                    <button
                                                        type="button"
                                                        onClick={removeLocalVideo}
                                                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Media Guidelines */}
                            <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-white font-medium">Upload Guidelines</p>
                                        <ul className="text-gray-400 text-sm space-y-1">
                                            <li>• Maximum 5 photos allowed per listing</li>
                                            <li>• High-quality photos increase sales by up to 95%</li>
                                            <li>• Use natural lighting for better product representation</li>
                                            <li>• Show the item from multiple angles</li>
                                            <li>• Videos should be under 2 minutes and showcase key features</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="pt-8 border-t border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                                                <User className="w-4 h-4 text-black" />
                                            </div>
                                            <span className="text-white font-medium">{user?.username || user?.email}</span>
                                        </div>
                                        <span className="text-gray-400">•</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${subscriptionPlan === 'pro' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                                            {subscriptionPlan.toUpperCase()} PLAN
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {existingItem
                                            ? 'Update your listing details and media to keep your item fresh'
                                            : 'Review all information before publishing your listing'
                                        }
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {existingItem && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTitle(existingItem.title || "");
                                                setDescription(existingItem.description || "");
                                                setPrice(String(existingItem.price || ""));
                                                setLocation(existingItem.location || "");
                                                setStatus(existingItem.status || "active");
                                                setPhotoFiles([]);
                                                setVideoFile(null);
                                                setShowVideoPreview(false);
                                            }}
                                            className="px-5 py-2.5 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition"
                                        >
                                            Reset Changes
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Save size={18} />
                                            {saving ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </span>
                                            ) : existingItem ? (
                                                'Update Listing'
                                            ) : (
                                                'Publish to Marketplace'
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}