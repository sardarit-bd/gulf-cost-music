"use client";
import Select from "@/ui/Select";
import axios from "axios";
import {
    AlertCircle,
    Calendar,
    Image as ImageIcon,
    MapPin,
    Newspaper,
    PenTool,
    Save,
    Trash2,
    Upload,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Function to get cookie value by name
const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const NewsDetailModal = ({ newsItem, onClose, onEdit, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        credit: "",
        isActive: true
    });
    const [photos, setPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [removedPhotos, setRemovedPhotos] = useState([]);
    const [errors, setErrors] = useState({});
    const [imageErrors, setImageErrors] = useState({});

    // Cities list for select options
    const cityOptions = [
        { value: "", label: "Select a location" },
        // Louisiana
        { value: "new orleans", label: "New Orleans, LA" },
        { value: "baton rouge", label: "Baton Rouge, LA" },
        { value: "lafayette", label: "Lafayette, LA" },
        { value: "shreveport", label: "Shreveport, LA" },
        { value: "lake charles", label: "Lake Charles, LA" },
        { value: "monroe", label: "Monroe, LA" },
        // Mississippi
        { value: "jackson", label: "Jackson, MS" },
        { value: "biloxi", label: "Biloxi, MS" },
        { value: "gulfport", label: "Gulfport, MS" },
        { value: "oxford", label: "Oxford, MS" },
        { value: "hattiesburg", label: "Hattiesburg, MS" },
        // Alabama
        { value: "birmingham", label: "Birmingham, AL" },
        { value: "mobile", label: "Mobile, AL" },
        { value: "huntsville", label: "Huntsville, AL" },
        { value: "tuscaloosa", label: "Tuscaloosa, AL" },
        // Florida
        { value: "tampa", label: "Tampa, FL" },
        { value: "st. petersburg", label: "St. Petersburg, FL" },
        { value: "clearwater", label: "Clearwater, FL" },
        { value: "pensacola", label: "Pensacola, FL" },
        { value: "panama city", label: "Panama City, FL" },
        { value: "fort myers", label: "Fort Myers, FL" }
    ];

    useEffect(() => {
        if (newsItem) {
            setFormData({
                title: newsItem.title || "",
                description: newsItem.description || "",
                location: newsItem.location || "",
                credit: newsItem.credit || "",
                isActive: newsItem.isActive || false
            });
            setPhotos(newsItem.photos || []);

            // Reset image error states
            const initialImageErrors = {};
            (newsItem.photos || []).forEach((photo, index) => {
                initialImageErrors[`existing-${index}`] = false;
            });
            setImageErrors(initialImageErrors);
        }
    }, [newsItem]);

    if (!newsItem) return null;

    const getLocationColor = (location) => {
        const colors = {
            'new orleans': 'bg-purple-100 text-purple-800 border-purple-200',
            'mobile': 'bg-blue-100 text-blue-800 border-blue-200',
            'biloxi': 'bg-green-100 text-green-800 border-green-200',
            'pensacola': 'bg-orange-100 text-orange-800 border-orange-200',
            'baton rouge': 'bg-red-100 text-red-800 border-red-200',
            'jackson': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'tampa': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
        return colors[location?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleImageError = (photoId) => {
        setImageErrors(prev => ({
            ...prev,
            [photoId]: true
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check total photos limit (max 5)
        if (photos.length + newPhotos.length + files.length > 5) {
            toast.error("Maximum 5 photos allowed");
            return;
        }

        // Check file size (max 5MB)
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max 5MB`);
                return false;
            }
            return true;
        });

        // Create preview URLs
        const newPhotoPreviews = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            url: null,
            id: `new-${Date.now()}-${Math.random()}`
        }));

        setNewPhotos([...newPhotos, ...newPhotoPreviews]);
    };

    const removeNewPhoto = (index) => {
        const photo = newPhotos[index];
        if (photo.preview) {
            URL.revokeObjectURL(photo.preview);
        }
        setNewPhotos(newPhotos.filter((_, i) => i !== index));
    };

    const removeExistingPhoto = (photoUrl) => {
        setPhotos(photos.filter(p => p.url !== photoUrl));
        setRemovedPhotos([...removedPhotos, photoUrl]);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title?.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length > 200) {
            newErrors.title = "Title cannot exceed 200 characters";
        }

        if (!formData.description?.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.length > 5000) {
            newErrors.description = "Description cannot exceed 5000 characters";
        }

        if (!formData.location) {
            newErrors.location = "Location is required";
        }

        if (!formData.credit?.trim()) {
            newErrors.credit = "Credit is required";
        } else if (formData.credit.length > 200) {
            newErrors.credit = "Credit cannot exceed 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        setLoading(true);
        setUploading(true);

        try {
            const token = getCookie("token");
            if (!token) {
                toast.error("Authentication token not found");
                return;
            }

            const formDataToSend = new FormData();

            // Append form fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('credit', formData.credit);
            formDataToSend.append('isActive', formData.isActive);

            // Append removed photos
            if (removedPhotos.length > 0) {
                formDataToSend.append('removedPhotoUrls', JSON.stringify(removedPhotos));
            }

            // Append new photos
            newPhotos.forEach((photo) => {
                if (photo.file) {
                    formDataToSend.append('photos', photo.file);
                }
            });

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/news/${newsItem._id}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                toast.success("News updated successfully!");
                setIsEditing(false);
                // Clean up object URLs
                newPhotos.forEach(photo => {
                    if (photo.preview) URL.revokeObjectURL(photo.preview);
                });
                if (onSave) onSave(response.data.data.news);
                onClose(); // Close modal after save
            }
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.response?.data?.message || "Failed to update news");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleCancelEdit = () => {
        // Clean up object URLs
        newPhotos.forEach(photo => {
            if (photo.preview) URL.revokeObjectURL(photo.preview);
        });
        // Reset form to original values
        setFormData({
            title: newsItem.title || "",
            description: newsItem.description || "",
            location: newsItem.location || "",
            credit: newsItem.credit || "",
            isActive: newsItem.isActive || false
        });
        setPhotos(newsItem.photos || []);
        setNewPhotos([]);
        setRemovedPhotos([]);
        setErrors({});
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg backdrop-saturate-150 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                            <Newspaper className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {isEditing ? "Edit News Article" : "News Details"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!isEditing ? (
                        /* ========== VIEW MODE ========== */
                        <div className="space-y-6">
                            {/* Title Section */}
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <Newspaper className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-bold text-gray-900">{newsItem.title}</h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <p className="text-gray-600 flex items-center text-sm">
                                            <PenTool className="w-4 h-4 mr-1" />
                                            {newsItem.journalist?.fullName || newsItem.journalist?.username}
                                        </p>
                                        <span className="text-gray-300">•</span>
                                        <p className="text-gray-600 flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(newsItem.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Location</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLocationColor(newsItem.location)}`}>
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {newsItem.location ?
                                                newsItem.location.split(' ').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')
                                                : "Not specified"}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${newsItem.isActive
                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${newsItem.isActive ? 'bg-green-500' : 'bg-red-500'
                                                }`}></span>
                                            {newsItem.isActive ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Views</label>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{newsItem.views || 0}</p>
                                </div>
                            </div>

                            {/* Credit */}
                            {newsItem.credit && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Credit</label>
                                    <p className="text-gray-900 mt-1">{newsItem.credit}</p>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4">
                                    {newsItem.description}
                                </p>
                            </div>

                            {/* Photos */}
                            {photos.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Photos</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {photos.map((photo, index) => (
                                            <div key={`existing-${index}`} className="relative group">
                                                {!imageErrors[`existing-${index}`] ? (
                                                    <img
                                                        src={photo.url}
                                                        alt={`News ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                                                        onError={() => handleImageError(`existing-${index}`)}
                                                    />
                                                ) : (
                                                    <div className="w-full h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200">
                                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                                        <p className="text-xs text-gray-400 mt-1">Image not available</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ========== EDIT MODE ========== */
                        <div className="space-y-6">
                            {/* Title Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-200'
                                        } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-400`}
                                    placeholder="Enter news title"
                                    maxLength={200}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.title}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-400 text-right">
                                    {formData.title.length}/200
                                </p>
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows="6"
                                    className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-200'
                                        } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-400`}
                                    placeholder="Enter news description"
                                    maxLength={5000}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.description}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-400 text-right">
                                    {formData.description.length}/5000
                                </p>
                            </div>

                            {/* Location Select - Using Custom Select Component */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    name="location"
                                    value={formData.location}
                                    options={cityOptions}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    icon={<MapPin className="w-4 h-4" />}
                                    placeholder="Select a location"
                                    error={errors.location}
                                    required
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            {/* Credit Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Credit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.credit}
                                    onChange={(e) => handleInputChange('credit', e.target.value)}
                                    className={`w-full px-4 py-3 border ${errors.credit ? 'border-red-500' : 'border-gray-200'
                                        } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-400`}
                                    placeholder="Enter credit (e.g., John Doe)"
                                    maxLength={200}
                                />
                                {errors.credit && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.credit}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-400 text-right">
                                    {formData.credit.length}/200
                                </p>
                            </div>

                            {/* Status Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.isActive === true}
                                            onChange={() => handleInputChange('isActive', true)}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Published</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.isActive === false}
                                            onChange={() => handleInputChange('isActive', false)}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Draft</span>
                                    </label>
                                </div>
                            </div>

                            {/* Photo Management */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Photos (Max 5)
                                </label>

                                {/* Existing Photos */}
                                {photos.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Current Photos:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {photos.map((photo, index) => (
                                                <div key={`existing-${index}`} className="relative group">
                                                    {!imageErrors[`existing-${index}`] ? (
                                                        <img
                                                            src={photo.url}
                                                            alt={`Existing ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                            onError={() => handleImageError(`existing-${index}`)}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => removeExistingPhoto(photo.url)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        title="Remove photo"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Photos Preview */}
                                {newPhotos.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">New Photos:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {newPhotos.map((photo, index) => (
                                                <div key={photo.id || `new-${index}`} className="relative group">
                                                    <img
                                                        src={photo.preview}
                                                        alt={`New ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        onClick={() => removeNewPhoto(index)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        title="Remove photo"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                {photos.length + newPhotos.length < 5 && (
                                    <div>
                                        <input
                                            type="file"
                                            id="photo-upload"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="inline-flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload Photos
                                        </label>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Max 5MB per photo. {5 - (photos.length + newPhotos.length)} slots remaining
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
                                >
                                    <PenTool className="w-4 h-4" />
                                    Edit Article
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            {uploading ? "Uploading..." : "Saving..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailModal;