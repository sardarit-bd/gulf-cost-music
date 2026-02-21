// components/market/CreateListingModal.jsx
"use client";

// import { api } from "@/lib/api";
import { AlertCircle, Camera, DollarSign, Loader2, MapPin, Video, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

export default function CreateListingModal({ isOpen, onClose, userType, onSuccess }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        photos: [],
        video: null
    });
    const [errors, setErrors] = useState({});
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const locationOptions = [
        { value: "", label: "Select location (optional)" },
        { value: "Louisiana", label: "Louisiana" },
        { value: "Mississippi", label: "Mississippi" },
        { value: "Alabama", label: "Alabama" },
        { value: "Florida", label: "Florida" }
    ];

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalPhotos = formData.photos.length + files.length;

        if (totalPhotos > 5) {
            toast.error("Maximum 5 photos allowed");
            return;
        }

        // Validate each file
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            return true;
        });

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPhotoPreviews([...photoPreviews, ...newPreviews]);
        setFormData({
            ...formData,
            photos: [...formData.photos, ...validFiles]
        });
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate video
        if (!file.type.startsWith('video/')) {
            toast.error("Please upload a valid video file");
            return;
        }
        if (file.size > 100 * 1024 * 1024) { // 100MB
            toast.error("Video is too large (max 100MB)");
            return;
        }

        // Create preview
        setVideoPreview(URL.createObjectURL(file));
        setFormData({
            ...formData,
            video: file
        });
    };

    const removePhoto = (index) => {
        const newPhotos = [...formData.photos];
        const newPreviews = [...photoPreviews];
        newPhotos.splice(index, 1);
        newPreviews.splice(index, 1);
        setFormData({ ...formData, photos: newPhotos });
        setPhotoPreviews(newPreviews);
    };

    const removeVideo = () => {
        setVideoPreview(null);
        setFormData({ ...formData, video: null });
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length > 120) {
            newErrors.title = "Title must be less than 120 characters";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.length > 2000) {
            newErrors.description = "Description must be less than 2000 characters";
        }
        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(formData.price) || formData.price <= 0) {
            newErrors.price = "Please enter a valid price";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateStep1()) {
            setStep(1);
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            if (formData.location) {
                formDataToSend.append('location', formData.location);
            }

            // Append photos
            formData.photos.forEach(photo => {
                formDataToSend.append('photos', photo);
            });

            // Append video if exists
            if (formData.video) {
                formDataToSend.append('video', formData.video);
            }

            const response = await api.upload('/api/market/me', formDataToSend);

            toast.success('Item listed successfully!');
            onSuccess();

        } catch (error) {
            console.error('Error creating listing:', error);
            if (error.status === 400) {
                toast.error(error.data.message || 'Validation failed');
            } else if (error.status === 403) {
                toast.error('You must be verified to list items');
            } else {
                toast.error('Failed to create listing');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            List Your Item
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Step {step} of 2: {step === 1 ? 'Basic Info' : 'Media Upload'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex gap-2">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    </div>
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Studio Recording Session, Custom Beat, etc."
                                className={`text-gray-900 w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                maxLength={120}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.title && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.title}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 ml-auto">
                                    {formData.title.length}/120
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your item in detail..."
                                rows="5"
                                className={`text-gray-900 w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                maxLength={2000}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.description && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.description}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 ml-auto">
                                    {formData.description.length}/2000
                                </p>
                            </div>
                        </div>

                        {/* Price and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="99.99"
                                        min="0"
                                        step="0.01"
                                        className={`text-gray-900 w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location (Optional)
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="text-gray-900 w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        {locationOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Fee Info */}
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <h4 className="font-medium text-blue-800 mb-2">Fee Structure</h4>
                            <p className="text-sm text-blue-700">
                                Pro accounts pay 5% fee • Free accounts pay 10% fee
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                Shipping and tax will be calculated at checkout based on buyer's location
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Media Upload */}
                {step === 2 && (
                    <div className="p-6 space-y-6">
                        {/* Photos Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photos (Max 5)
                            </label>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100px, 150px"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10 shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {photoPreviews.length < 5 && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50"
                                    >
                                        <Camera className="w-6 h-6 text-gray-400" />
                                        <span className="text-xs text-gray-500">Add Photo</span>
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500">
                                {photoPreviews.length}/5 photos • Max 10MB per photo
                            </p>
                        </div>

                        {/* Video Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video (Optional, Max 1)
                            </label>
                            {videoPreview ? (
                                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={removeVideo}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 z-10 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => videoInputRef.current?.click()}
                                    className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50"
                                >
                                    <Video className="w-8 h-8 text-gray-400" />
                                    <span className="text-gray-600">Click to upload video</span>
                                    <span className="text-xs text-gray-500">Max 100MB</span>
                                </button>
                            )}
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-2">Listing Summary</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-gray-600">Title:</span>
                                <span className="text-gray-900 font-medium">{formData.title}</span>
                                <span className="text-gray-600">Price:</span>
                                <span className="text-gray-900 font-medium">${formData.price}</span>
                                <span className="text-gray-600">Photos:</span>
                                <span className="text-gray-900 font-medium">{formData.photos.length}/5</span>
                                <span className="text-gray-600">Video:</span>
                                <span className="text-gray-900 font-medium">{formData.video ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between z-10">
                    <button
                        onClick={() => step === 1 ? onClose() : setStep(1)}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    <button
                        onClick={() => step === 1 ? setStep(2) : handleSubmit()}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            step === 1 ? 'Next: Upload Media' : 'List Item'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}