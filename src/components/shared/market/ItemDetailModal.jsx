// components/market/ItemDetailModal.jsx
"use client";

import { useSession } from "@/lib/auth";
import {
    AlertCircle,
    CheckCircle,
    Edit,
    Heart,
    Loader2,
    MapPin,
    Share2,
    ShoppingCart,
    Store,
    Trash2,
    User,
    Video,
    X
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";
import EditListingModal from "./EditListingModal";

export default function ItemDetailModal({ isOpen, onClose, itemId, onItemUpdate }) {
    const { user } = useSession();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (isOpen && itemId) {
            fetchItem();
        }
    }, [isOpen, itemId]);

    const fetchItem = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/market/${itemId}`);
            setItem(response.data);
            console.log("Fetched item:", response.data); // ডিবাগ করার জন্য
            console.log("Current user:", user); // ডিবাগ করার জন্য
        } catch (error) {
            console.error("Error fetching item:", error);
            toast.error("Failed to load item details");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!user) {
            toast.error("Please login to purchase");
            return;
        }

        setPurchasing(true);
        try {
            const response = await api.post('/api/market/checkout', { itemId });

            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error("Purchase error:", error);
            toast.error(error.data?.message || "Failed to initiate checkout");
        } finally {
            setPurchasing(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await api.delete('/api/market/me');
            toast.success('Listing deleted successfully');
            onClose();
            if (onItemUpdate) onItemUpdate();
        } catch (error) {
            console.error('Error deleting listing:', error);
            toast.error('Failed to delete listing');
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchItem();
        if (onItemUpdate) onItemUpdate();
    };

    if (!isOpen) return null;

    const isOwner =
        user &&
        item?.seller?._id &&
        String(item.seller._id) === String(user.id);

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                            <X className="text-gray-500 w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : !item ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Item not found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Images */}
                                <div>
                                    {/* Main Image */}
                                    <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
                                        <div className="aspect-square relative">
                                            {item.photos?.[selectedImage] ? (
                                                <Image
                                                    src={item.photos[selectedImage]}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Store className="w-20 h-20 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    {item.photos?.length > 1 && (
                                        <div className="grid grid-cols-5 gap-2">
                                            {item.photos.map((photo, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-600' : 'border-transparent'
                                                        }`}
                                                >
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={photo}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Video */}
                                    {item.videos?.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Video className="w-5 h-5" />
                                                Video
                                            </h3>
                                            <video
                                                src={item.videos[0]}
                                                controls
                                                className="w-full rounded-2xl border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Details */}
                                <div>
                                    {/* Title and Actions */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                    ${item.sellerType === 'artist' ? 'bg-purple-100 text-purple-800' :
                                                        item.sellerType === 'venue' ? 'bg-green-100 text-green-800' :
                                                            item.sellerType === 'photographer' ? 'bg-orange-100 text-orange-800' :
                                                                item.sellerType === 'studio' ? 'bg-indigo-100 text-indigo-800' :
                                                                    'bg-gray-100 text-gray-800'}`}>
                                                    {item.sellerType}
                                                </span>
                                                {item.seller?.isVerified && (
                                                    <span className="flex items-center gap-1 text-sm text-blue-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Verified
                                                    </span>
                                                )}
                                                {item.status === 'pending' && (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                                        </div>

                                        {isOwner && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowEditModal(true)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                    title="Edit listing"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                {!showDeleteConfirm ? (
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(true)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                        title="Delete listing"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleDelete}
                                                            disabled={deleteLoading}
                                                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Non-owner Actions */}
                                        {!isOwner && (
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                                    <Share2 className="w-5 h-5 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => setIsLiked(!isLiked)}
                                                    className="p-2 hover:bg-gray-100 rounded-full"
                                                >
                                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Seller Info */}
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.seller?.name}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>{item.seller?.userType}</span>
                                                {item.location && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {item.location}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                        <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
                                    </div>

                                    {/* Price and Fees */}
                                    {(() => {
                                        const feePercentage = item.seller?.subscriptionPlan === "pro" ? 5 : 10;
                                        const feeAmount = (item.price * feePercentage) / 100;
                                        const totalWithFee = item.price + feeAmount;

                                        return (
                                            <div className={`rounded-xl p-6 ${item.status === 'active' ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gray-50'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-gray-700">Item Price:</span>
                                                    <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-3 text-sm">
                                                    <span className="text-gray-600">Platform Fee ({feePercentage}%):</span>
                                                    <span className="text-gray-800">+ ${feeAmount.toFixed(2)}</span>
                                                </div>
                                                <div className="border-t border-blue-200 my-3 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-gray-900">Total:</span>
                                                        <span className="text-2xl font-bold text-blue-600">${totalWithFee.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    *Shipping and tax will be calculated at checkout
                                                </p>
                                            </div>
                                        );
                                    })()}

                                    {/* Purchase Button */}
                                    {!isOwner && (
                                        <button
                                            onClick={handlePurchase}
                                            disabled={purchasing || item.status !== 'active' || !item.seller?.stripeAccountId}
                                            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {purchasing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : item.status !== 'active' ? (
                                                "Item not available for purchase"
                                            ) : !item.seller?.stripeAccountId ? (
                                                "Seller not ready to receive payments"
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Purchase Now
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Owner Message for Pending Items */}
                                    {isOwner && item.status === 'pending' && (
                                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                            <p className="text-sm text-yellow-800">
                                                This listing is pending. Connect Stripe to activate it.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isOwner && item && (
                <EditListingModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    listing={item}
                    onSuccess={handleEditSuccess}
                />
            )}
        </>
    );
}