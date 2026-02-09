// app/dashboard/venues/edit-profile/page.js
"use client";

import Select from "@/ui/Select";
import { AlertCircle, ArrowLeft, Building2, Clock, Edit3, Globe, ImageIcon, Loader2, MapPin, Phone, Save, Trash2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

const STATE_CITY_MAPPING = {
    'Louisiana': [
        { value: 'new orleans', label: 'New Orleans' },
        { value: 'baton rouge', label: 'Baton Rouge' },
        { value: 'lafayette', label: 'Lafayette' },
        { value: 'shreveport', label: 'Shreveport' }
    ],
    'Mississippi': [
        { value: 'jackson', label: 'Jackson' },
        { value: 'biloxi', label: 'Biloxi' },
        { value: 'gulfport', label: 'Gulfport' },
        { value: 'oxford', label: 'Oxford' }
    ],
    'Alabama': [
        { value: 'birmingham', label: 'Birmingham' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'huntsville', label: 'Huntsville' },
        { value: 'tuscaloosa', label: 'Tuscaloosa' }
    ],
    'Florida': [
        { value: 'tampa', label: 'Tampa' },
        { value: 'st. petersburg', label: 'St. Petersburg' },
        { value: 'clearwater', label: 'Clearwater' },
        { value: 'pensacola', label: 'Pensacola' }
    ]
};

const stateOptions = [
    { value: "Louisiana", label: "Louisiana" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Alabama", label: "Alabama" },
    { value: "Florida", label: "Florida" }
];

export default function EditProfilePage() {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    const [venueData, setVenueData] = useState({
        venueName: "",
        state: "",
        city: "",
        address: "",
        seatingCapacity: 0,
        biography: "",
        openHours: "",
        openDays: "",
        phone: "",
        website: "",
        isActive: false,
        colorCode: null,
        verifiedOrder: 0
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [removedPhotos, setRemovedPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [photoFiles, setPhotoFiles] = useState([]);

    useEffect(() => {
        fetchVenueData();
    }, []);

    const fetchVenueData = async () => {
        try {
            setLoading(true);
            const token = getCookie("token");
            if (!token) {
                toast.error("You must be logged in.");
                return;
            }

            const res = await fetch(`${API_BASE}/api/venues/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                toast.error("Session expired. Please login again.");
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch venue.");
            }

            if (data.data?.venue) {
                const v = data.data.venue;
                setVenueData({
                    venueName: v.venueName || "",
                    state: v.state || "",
                    city: v.city || "",
                    address: v.address || "",
                    seatingCapacity: v.seatingCapacity || 0,
                    biography: v.biography || "",
                    openHours: v.openHours || "",
                    openDays: v.openDays || "",
                    phone: v.phone || "",
                    website: v.website || "",
                    isActive: v.isActive || false,
                    colorCode: v.colorCode || null,
                    verifiedOrder: v.verifiedOrder || 0
                });
                setPreviewImages(v.photos?.map((p) => p.url) || []);
            }
        } catch (error) {
            console.error("Error fetching venue:", error);
            toast.error(error.message || "Server error while loading venue.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (name, value) => {
        setVenueData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!venueData.venueName?.trim()) {
            errors.venueName = "Venue name is required";
        }

        if (!venueData.state) {
            errors.state = "State is required";
        }

        if (!venueData.city) {
            errors.city = "City is required";
        }

        if (venueData.state && venueData.city) {
            const validCities = STATE_CITY_MAPPING[venueData.state]?.map(c => c.value) || [];
            if (!validCities.includes(venueData.city.toLowerCase())) {
                errors.city = `"${venueData.city}" is not a valid city for ${venueData.state}`;
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            const token = getCookie("token");
            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            const formData = new FormData();
            formData.append("venueName", venueData.venueName.trim());
            formData.append("state", venueData.state);
            formData.append("city", venueData.city.toLowerCase());

            if (venueData.address) formData.append("address", venueData.address.trim());
            if (venueData.seatingCapacity) formData.append("seatingCapacity", venueData.seatingCapacity);
            if (venueData.biography) formData.append("biography", venueData.biography.trim());
            if (venueData.openHours) formData.append("openHours", venueData.openHours.trim());
            if (venueData.openDays) formData.append("openDays", venueData.openDays.trim());
            if (venueData.phone) formData.append("phone", venueData.phone.trim());
            if (venueData.website) formData.append("website", venueData.website.trim());

            photoFiles.forEach(file => {
                formData.append("photos", file);
            });

            removedPhotos.forEach(filename => {
                formData.append("removedPhotos", filename);
            });

            setSaving(true);
            const saveToast = toast.loading("Saving venue...");

            const res = await fetch(`${API_BASE}/api/venues/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            toast.dismiss(saveToast);

            if (!res.ok) {
                throw new Error(data.message || "Failed to save venue");
            }

            toast.success("Venue profile saved successfully!");
            setRemovedPhotos([]);
            setPhotoFiles([]);

            if (data.data?.venue) {
                const v = data.data.venue;
                setVenueData(prev => ({
                    ...prev,
                    venueName: v.venueName || "",
                    state: v.state || "",
                    city: v.city || "",
                    address: v.address || "",
                    seatingCapacity: v.seatingCapacity || 0,
                    biography: v.biography || "",
                    openHours: v.openHours || "",
                    openDays: v.openDays || "",
                    phone: v.phone || "",
                    website: v.website || "",
                    isActive: v.isActive || false,
                    colorCode: v.colorCode || null
                }));
                setPreviewImages(v.photos?.map((p) => p.url) || []);
            }

        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.message || "Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (previewImages.length + files.length > 10) {
            toast.error("Maximum 10 photos allowed.");
            return;
        }

        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...urls]);
        setPhotoFiles([...photoFiles, ...files]);
    };

    const removeImage = (index) => {
        const urlToRemove = previewImages[index];

        if (!urlToRemove.startsWith('blob:')) {
            const filename = urlToRemove.split('/').pop();
            setRemovedPhotos(prev => [...prev, filename]);
        } else {
            URL.revokeObjectURL(urlToRemove);
            const fileIndex = index - (previewImages.length - photoFiles.length);
            if (fileIndex >= 0) {
                setPhotoFiles(prev => prev.filter((_, i) => i !== fileIndex));
            }
        }

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const getCityOptions = () => {
        if (!venueData.state) return [];
        return STATE_CITY_MAPPING[venueData.state] || [];
    };

    const formatCityDisplay = (city) => {
        if (!city) return "";
        return city.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading venue profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-16">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/venues"
                            className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Edit Venue Profile</h1>
                            <p className="text-gray-400">Update your venue information and photos</p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/venues/overview"
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                    >
                        View Overview
                    </Link>
                </div>

                {/* Verification Status */}
                {!venueData.isActive && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-yellow-400" size={20} />
                            <div>
                                <h4 className="text-yellow-400 font-semibold">Pending Verification</h4>
                                <p className="text-yellow-300/80 text-sm">
                                    Complete your profile and submit for verification to access all features.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Edit3 size={20} />
                                Venue Details
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* State Selection */}
                                <Select
                                    label="State *"
                                    value={venueData.state}
                                    onChange={(value) => handleInputChange("state", value)}
                                    options={stateOptions}
                                    placeholder="Select a state"
                                    required={true}
                                    icon={<MapPin size={18} />}
                                    error={formErrors.state}
                                    helperText="This determines your category on the homepage"
                                />

                                {/* City Selection */}
                                <Select
                                    label="City *"
                                    value={venueData.city}
                                    onChange={(value) => handleInputChange("city", value)}
                                    options={getCityOptions()}
                                    placeholder={venueData.state ? "Select a city" : "Select state first"}
                                    required={true}
                                    icon={<MapPin size={18} />}
                                    error={formErrors.city}
                                    disabled={!venueData.state}
                                    customDisplay={venueData.city ? formatCityDisplay(venueData.city) : ""}
                                    helperText={venueData.state ? `Cities in ${venueData.state}` : "Select state first"}
                                />

                                {/* Venue Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Venue Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="venueName"
                                            value={venueData.venueName}
                                            onChange={(e) => handleInputChange("venueName", e.target.value)}
                                            className={`w-full bg-gray-800 border ${formErrors.venueName ? "border-red-500" : "border-gray-700"} rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                                            placeholder="Enter venue name"
                                            disabled={saving}
                                        />
                                    </div>
                                    {formErrors.venueName && (
                                        <p className="mt-2 text-sm text-red-500">{formErrors.venueName}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="address"
                                            value={venueData.address}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            placeholder="Enter venue address"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={venueData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            placeholder="Enter phone number"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="url"
                                            name="website"
                                            value={venueData.website}
                                            onChange={(e) => handleInputChange("website", e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            placeholder="https://example.com"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Seating Capacity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Seating Capacity
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Users className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="number"
                                            name="seatingCapacity"
                                            value={venueData.seatingCapacity}
                                            onChange={(e) => handleInputChange("seatingCapacity", parseInt(e.target.value) || 0)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            placeholder="Enter seating capacity"
                                            min="0"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Open Hours */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Open Hours
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="openHours"
                                            value={venueData.openHours}
                                            onChange={(e) => handleInputChange("openHours", e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            placeholder="e.g., 6 PM - 2 AM"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Open Days */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Open Days
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            name="openDays"
                                            value={venueData.openDays}
                                            onChange={(e) => handleInputChange("openDays", e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            placeholder="e.g., Mon-Sat, Closed Sunday"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Biography */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Biography
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3">
                                            <Edit3 className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <textarea
                                            name="biography"
                                            value={venueData.biography}
                                            onChange={(e) => handleInputChange("biography", e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition min-h-[120px]"
                                            placeholder="Tell us about your venue, history, specialties..."
                                            disabled={saving}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Photo Upload */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ImageIcon size={20} />
                                    Venue Photos ({previewImages.length}/10)
                                </h3>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                    All Users
                                </span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="photo-upload"
                                disabled={saving || previewImages.length >= 10}
                            />

                            <label
                                htmlFor="photo-upload"
                                className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl transition ${previewImages.length >= 10
                                    ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                                    : "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 cursor-pointer"
                                    } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <ImageIcon size={32} />
                                <span className="text-sm font-medium text-center">
                                    {previewImages.length >= 10
                                        ? "Maximum 10 Photos Uploaded"
                                        : "Upload Venue Photos"}
                                </span>
                                <span className="text-xs text-gray-400 text-center">
                                    Maximum 10 photos allowed • JPG, PNG, WebP
                                </span>
                            </label>

                            {previewImages.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-400">Uploaded Photos:</p>
                                        <p className="text-xs text-yellow-400">
                                            {10 - previewImages.length} photos remaining
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {previewImages.map((src, i) => (
                                            <div
                                                key={i}
                                                className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 group"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`Venue photo ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    disabled={saving}
                                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location Info */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <MapPin size={18} />
                                Location Information
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
                                    <p className="text-sm text-blue-300 mb-1">📍 Listing Category</p>
                                    <p className="text-2xl font-bold text-yellow-400 text-center">
                                        {venueData.state || "Not selected"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">State:</span>
                                        <span className="text-sm font-medium">
                                            {venueData.state || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">City:</span>
                                        <span className="text-sm font-medium">
                                            {venueData.city ? formatCityDisplay(venueData.city) : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Profile Status:</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${venueData.venueName && venueData.state && venueData.city
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"}`}>
                                        {venueData.venueName && venueData.state && venueData.city ? "Complete" : "Incomplete"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Verification:</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${venueData.isActive
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"}`}>
                                        {venueData.isActive ? "Verified" : "Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}