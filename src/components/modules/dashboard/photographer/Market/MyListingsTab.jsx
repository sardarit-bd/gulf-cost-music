"use client";

import {
    BadgeCheck,
    Edit2,
    FileText,
    Image,
    MapPin,
    Trash2,
    Video
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

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

export default function MyListingsTab({
    existingItem,
    onEdit,
    onDelete,
    API_BASE
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const token = getToken();
            if (!token) {
                throw new Error("Please sign in again");
            }

            const res = await fetch(`${API_BASE}/api/market/me`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Delete failed");
            }

            onDelete();
            setShowDeleteModal(false);
            toast.success("Listing deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Failed to delete listing");
        } finally {
            setDeleting(false);
        }
    };

    if (!existingItem) {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                <div className="text-gray-400 text-4xl">+</div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No Active Listings
                    </h3>
                    <p className="text-gray-600 mb-8">
                        You haven't created any listings yet. Create your first listing to start selling.
                    </p>
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition"
                    >
                        Create Your First Listing
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'sold': return 'bg-red-100 text-red-800 border-red-200';
            case 'hidden': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="p-6">
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Listing"
                message="Are you sure you want to delete this listing? This action cannot be undone."
                confirmText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                type="delete"
            />

            {/* Status Header */}
            <div className={`mb-8 p-6 rounded-2xl ${getStatusColor(existingItem.status)} border`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${existingItem.status === 'active' ? 'bg-green-500 animate-pulse' :
                                existingItem.status === 'sold' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-1">Listing Status</h4>
                            <p className="text-lg font-bold">
                                {existingItem.status.charAt(0).toUpperCase() + existingItem.status.slice(1)}
                                {existingItem.status === 'active' && " • Accepting Offers"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm">Listed On</p>
                            <p className="font-medium">
                                {formatDate(existingItem.createdAt)}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                            <BadgeCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Media & Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title & Price */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {existingItem.title}
                            </h1>
                            {existingItem.location && (
                                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-sm">
                                    <MapPin size={14} />
                                    {existingItem.location}
                                </div>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                            ${existingItem.price}
                        </div>
                    </div>

                    {/* Main Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                            {existingItem.photos?.[activePhotoIndex] ? (
                                <img
                                    src={existingItem.photos[activePhotoIndex]}
                                    alt={existingItem.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Image className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {activePhotoIndex + 1} / {existingItem.photos?.length || 0}
                            </div>
                        </div>

                        {/* Photo Thumbnails */}
                        {existingItem.photos?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {existingItem.photos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActivePhotoIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activePhotoIndex === index
                                            ? "border-blue-500"
                                            : "border-gray-200 hover:border-blue-300"
                                            }`}
                                    >
                                        <img
                                            src={photo}
                                            alt={`${existingItem.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-bold text-gray-900">Description</h3>
                        </div>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {existingItem.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Actions & Info */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">Manage Listing</h4>
                            <div className="space-y-3">
                                <button
                                    onClick={onEdit}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    Edit Listing
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full bg-red-50 text-red-600 font-medium py-3 rounded-lg hover:bg-red-100 border border-red-200 transition flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete Listing
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                                    Listing Stats
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-gray-500 text-xs">Photos</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {existingItem.photos?.length || 0}/5
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-gray-500 text-xs">Videos</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {existingItem.videos?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Section */}
                        {existingItem.videos?.[0] && (
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Listing Video
                                    </h4>
                                    <Video className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="aspect-video rounded-lg overflow-hidden border border-gray-300">
                                    <video
                                        src={existingItem.videos[0]}
                                        controls
                                        className="w-full h-full object-cover"
                                        preload="metadata"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}