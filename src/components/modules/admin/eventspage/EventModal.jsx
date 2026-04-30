"use client";

import axios from "axios";
import { Building, Calendar, Clock, Loader2, MapPin, PenSquare, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast, { Toaster } from "react-hot-toast";
import CustomPeriodSelect from "./CustomPeriodSelect";
import EventCustomSelect from "./EventCustomSelect";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const capitalizeWords = (str) => {
    if (!str) return "";
    return str
        .toString()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

// Available states
const AVAILABLE_STATES = [
    { value: "Alabama", label: "Alabama" },
    { value: "Florida", label: "Florida" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Mississippi", label: "Mississippi" },
];

// Cities by state mapping
const CITIES_BY_STATE = {
    Alabama: [
        { value: "mobile", label: "Mobile" },
        { value: "gulf shores", label: "Gulf Shores" },
        { value: "orange beach", label: "Orange Beach" },
        { value: "huntsville", label: "Huntsville" },
        { value: "birmingham", label: "Birmingham" },
    ],
    Florida: [
        { value: "pensacola", label: "Pensacola" },
        { value: "panama city", label: "Panama City" },
        { value: "tampa", label: "Tampa" },
        { value: "st. petersburg", label: "St. Petersburg" },
        { value: "clearwater", label: "Clearwater" },
        { value: "fort myers", label: "Fort Myers" }
    ],
    Louisiana: [
        { value: "new orleans", label: "New Orleans" },
        { value: "baton rouge", label: "Baton Rouge" },
        { value: "lafayette", label: "Lafayette" },
        { value: "shreveport", label: "Shreveport" },
    ],
    Mississippi: [
        { value: "biloxi", label: "Biloxi" },
        { value: "gulfport", label: "Gulfport" },
        { value: "jackson", label: "Jackson" },
        { value: "hattiesburg", label: "Hattiesburg" },
    ],
};

// Date formatting function
const formatDate = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
        return cleaned;
    } else if (cleaned.length <= 4) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
};

// Handle date input change with auto-formatting
const handleDateChange = (value, setFormData, formData) => {
    let formatted = formatDate(value);
    if (value.length === 2 && !value.includes('/')) {
        formatted = value + '/';
    } else if (value.length === 5 && value.split('/').length === 2 && !value.endsWith('/')) {
        const parts = value.split('/');
        if (parts.length === 2 && parts[1].length === 2) {
            formatted = value + '/';
        }
    }
    setFormData({ ...formData, date: formatted });
};

// Format time as user types (HH:MM)
const formatTimeOnly = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
        return cleaned;
    } else if (cleaned.length <= 4) {
        return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
};

// Handle time input change
const handleTimeChange = (value, setFormData, formData) => {
    let formatted = formatTimeOnly(value);
    if (value.length === 2 && !value.includes(':')) {
        formatted = value + ':';
    }
    setFormData({ ...formData, time: formatted });
};

// Period options
const PERIOD_OPTIONS = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
];

export default function EventModal({ isOpen, onClose, onSuccess, venues, editingEvent }) {
    const [mounted, setMounted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [venueType, setVenueType] = useState("existing");

    const [formData, setFormData] = useState({
        venueType: "existing",
        venueId: "",
        customVenueName: "",
        state: "",
        city: "",
        artistBandName: "",
        date: "",
        time: "",
        timePeriod: "",
        description: "",
    });

    const [formErrors, setFormErrors] = useState({});

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    const isEditMode = !!editingEvent;

    const venueOptions = venues?.map(venue => ({
        value: venue._id,
        label: `${capitalizeWords(venue.venueName)} - ${capitalizeWords(venue.city)}, ${venue.state}`
    })) || [];

    const cityOptions = formData.state ? CITIES_BY_STATE[formData.state] || [] : [];

    // Combine time and period for display/submission
    const getFullTime = () => {
        if (formData.time && formData.timePeriod) {
            return `${formData.time} ${formData.timePeriod}`;
        }
        return "";
    };

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset form when modal opens OR editingEvent changes
    useEffect(() => {
        if (isOpen) {
            if (editingEvent) {
                // Edit mode: populate form with event data
                const isExistingVenue = !!editingEvent.venueId && editingEvent.venueId !== null;

                setVenueType(isExistingVenue ? "existing" : "custom");

                setFormData({
                    venueType: isExistingVenue ? "existing" : "custom",
                    venueId: editingEvent.venueId || "",
                    customVenueName: editingEvent.customVenueName || "",
                    state: editingEvent.state || "",
                    city: editingEvent.city || "",
                    artistBandName: editingEvent.artistBandName || "",
                    date: editingEvent.date || "",
                    time: editingEvent.time || "",
                    timePeriod: editingEvent.timePeriod || "",
                    description: editingEvent.description || "",
                });

                // Set image preview if exists
                if (editingEvent.imageUrl) {
                    setImagePreview(editingEvent.imageUrl);
                }
            } else {
                // Add mode: reset form
                setFormData({
                    venueType: "existing",
                    venueId: "",
                    customVenueName: "",
                    state: "",
                    city: "",
                    artistBandName: "",
                    date: "",
                    time: "",
                    timePeriod: "",
                    description: "",
                });
                setVenueType("existing");
                setSelectedImage(null);
                setImagePreview(null);
            }
            setFormErrors({});
        }
    }, [isOpen, editingEvent]);

    useEffect(() => {
        if (venueType === "custom" && formData.state) {
            setFormData(prev => ({ ...prev, city: "" }));
        }
    }, [formData.state, venueType]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const validateForm = () => {
        const errors = {};

        if (!formData.artistBandName.trim()) {
            errors.artistBandName = "Artist/Band name is required";
        }

        if (venueType === "existing") {
            if (!formData.venueId) {
                errors.venueId = "Please select a venue";
            }
        } else {
            if (!formData.customVenueName.trim()) {
                errors.customVenueName = "Custom venue name is required";
            }
            if (!formData.state) {
                errors.state = "Please select a state";
            }
            if (!formData.city) {
                errors.city = "Please select a city";
            }
        }

        if (!formData.date) {
            errors.date = "Event date is required";
        }
        if (!formData.time) {
            errors.time = "Event time is required";
        }
        if (!formData.timePeriod) {
            errors.timePeriod = "Please select AM/PM";
        }

        const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (formData.date && !dateRegex.test(formData.date)) {
            errors.date = "Use MM/DD/YYYY format (e.g., 01/21/2024)";
        }

        // Validate time format (HH:MM)
        const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
        if (formData.time && !timeRegex.test(formData.time)) {
            errors.time = "Use HH:MM format (e.g., 08:30)";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the form errors");
            return;
        }

        const token = getCookie("token");
        if (!token) {
            toast.error("Authentication token not found");
            return;
        }

        setSubmitting(true);

        try {
            if (isEditMode && editingEvent?._id) {
                // UPDATE EXISTING EVENT - Use FormData to support image upload
                const submitData = new FormData();
                submitData.append("artistBandName", formData.artistBandName.trim());
                submitData.append("date", formData.date);
                submitData.append("time", getFullTime());

                if (formData.description) {
                    submitData.append("description", formData.description);
                }

                if (selectedImage) {
                    submitData.append("image", selectedImage);
                }

                if (venueType === "existing") {
                    submitData.append("venueId", formData.venueId);
                } else {
                    submitData.append("customVenueName", formData.customVenueName.trim());
                    submitData.append("state", formData.state);
                    submitData.append("city", formData.city.toLowerCase());
                }

                const res = await axios.put(
                    `${API_BASE}/api/events/admin/${editingEvent._id}`,
                    submitData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );

                if (res.data.success) {
                    toast.success("Event updated successfully!");
                    onSuccess();
                    onClose();
                }
            } else {
                // CREATE NEW EVENT
                const submitData = new FormData();
                submitData.append("artistBandName", formData.artistBandName.trim());
                submitData.append("date", formData.date);
                submitData.append("time", getFullTime());

                if (formData.description) {
                    submitData.append("description", formData.description);
                }

                if (selectedImage) {
                    submitData.append("image", selectedImage);
                }

                if (venueType === "existing") {
                    submitData.append("venueId", formData.venueId);
                } else {
                    submitData.append("customVenueName", formData.customVenueName.trim());
                    submitData.append("state", formData.state);
                    submitData.append("city", formData.city.toLowerCase());
                }

                const res = await axios.post(`${API_BASE}/api/events/admin`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                });

                if (res.data.success) {
                    toast.success("Event added to calendar successfully!");
                    onSuccess();
                    onClose();
                }
            }
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error(error.response?.data?.message || "Failed to save event");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                style={{ zIndex: 99999 }}
                onClick={onClose}
            />

            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto" style={{ zIndex: 100000 }}>
                <Toaster />
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3.5 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="p-1 bg-yellow-100 rounded-lg">
                                    <Calendar className="w-4 h-4 text-yellow-600" />
                                </div>
                                {isEditMode ? "Edit Event" : "Add New Event"}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isEditMode ? "Update event information" : "Fill in the details to add an event"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Artist/Band Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Artist/Band Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.artistBandName}
                                    onChange={(e) => setFormData({ ...formData, artistBandName: e.target.value })}
                                    placeholder="e.g., Taylor Swift"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-700 ${formErrors.artistBandName ? "border-red-400" : "border-gray-200"
                                        }`}
                                />
                                {formErrors.artistBandName && (
                                    <p className="text-xs text-red-500 mt-0.5">{formErrors.artistBandName}</p>
                                )}
                            </div>

                            {/* Venue Type Selection - Show in both Add and Edit mode */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Venue Type *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="venueType"
                                            value="existing"
                                            checked={venueType === "existing"}
                                            onChange={(e) => {
                                                setVenueType(e.target.value);
                                                setFormData({ ...formData, venueType: e.target.value, venueId: "", customVenueName: "", state: "", city: "" });
                                            }}
                                            className="w-3.5 h-3.5 text-yellow-500 focus:ring-yellow-400"
                                        />
                                        <Building className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-sm text-gray-600">Existing Venue</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="venueType"
                                            value="custom"
                                            checked={venueType === "custom"}
                                            onChange={(e) => {
                                                setVenueType(e.target.value);
                                                setFormData({ ...formData, venueType: e.target.value, venueId: "", customVenueName: "", state: "", city: "" });
                                            }}
                                            className="w-3.5 h-3.5 text-yellow-500 focus:ring-yellow-400"
                                        />
                                        <PenSquare className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-sm text-gray-600">Custom Venue</span>
                                    </label>
                                </div>
                            </div>

                            {/* Existing Venue Dropdown - Show in both Add and Edit mode */}
                            {venueType === "existing" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Select Venue *
                                    </label>
                                    <EventCustomSelect
                                        value={formData.venueId}
                                        onChange={(val) => setFormData({ ...formData, venueId: val })}
                                        options={venueOptions}
                                        placeholder="Select a venue"
                                        error={!!formErrors.venueId}
                                        icon={MapPin}
                                    />
                                    {formErrors.venueId && (
                                        <p className="text-xs text-red-500 mt-0.5">{formErrors.venueId}</p>
                                    )}
                                </div>
                            )}

                            {/* Custom Venue Fields - Show in both Add and Edit mode */}
                            {venueType === "custom" && (
                                <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Custom Venue Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customVenueName}
                                            onChange={(e) => setFormData({ ...formData, customVenueName: e.target.value })}
                                            placeholder="e.g., The Grand Arena"
                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-700 ${formErrors.customVenueName ? "border-red-400" : "border-gray-200"
                                                }`}
                                        />
                                        {formErrors.customVenueName && (
                                            <p className="text-xs text-red-500 mt-0.5">{formErrors.customVenueName}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                State *
                                            </label>
                                            <EventCustomSelect
                                                value={formData.state}
                                                onChange={(val) => setFormData({ ...formData, state: val, city: "" })}
                                                options={AVAILABLE_STATES}
                                                placeholder="Select state"
                                                error={!!formErrors.state}
                                            />
                                            {formErrors.state && (
                                                <p className="text-xs text-red-500 mt-0.5">{formErrors.state}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <EventCustomSelect
                                                value={formData.city}
                                                onChange={(val) => setFormData({ ...formData, city: val })}
                                                options={cityOptions}
                                                placeholder="Select city"
                                                error={!!formErrors.city}
                                                disabled={!formData.state}
                                            />
                                            {formErrors.city && (
                                                <p className="text-xs text-red-500 mt-0.5">{formErrors.city}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Date & Time Row */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Date Input */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Event Date *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.date}
                                            onChange={(e) => handleDateChange(e.target.value, setFormData, formData)}
                                            placeholder="MM/DD/YYYY"
                                            className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-700 ${formErrors.date ? "border-red-400" : "border-gray-200"
                                                }`}
                                        />
                                    </div>
                                    {formErrors.date && (
                                        <p className="text-xs text-red-500 mt-0.5">{formErrors.date}</p>
                                    )}
                                </div>

                                {/* Time Input with Custom AM/PM Select */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Event Time *
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.time}
                                                onChange={(e) => handleTimeChange(e.target.value, setFormData, formData)}
                                                placeholder="HH:MM"
                                                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-700 ${formErrors.time ? "border-red-400" : "border-gray-200"
                                                    }`}
                                            />
                                        </div>
                                        <CustomPeriodSelect
                                            value={formData.timePeriod}
                                            onChange={(val) => setFormData({ ...formData, timePeriod: val })}
                                            options={PERIOD_OPTIONS}
                                            placeholder="AM/PM"
                                            error={!!formErrors.timePeriod}
                                        />
                                    </div>
                                    {formErrors.time && (
                                        <p className="text-xs text-red-500 mt-0.5">{formErrors.time}</p>
                                    )}
                                    {formErrors.timePeriod && (
                                        <p className="text-xs text-red-500 mt-0.5">{formErrors.timePeriod}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    placeholder="Enter event description..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-700 resize-none"
                                />
                            </div>

                            {/* Image Upload - Show in both Add and Edit mode */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Event Image (Optional)
                                </label>
                                <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-yellow-400 transition-colors">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Event preview"
                                                className="max-h-24 rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-500">Click to upload image</p>
                                            <p className="text-[10px] text-gray-400">PNG, JPG, WEBP (Max 5MB)</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Plus className="w-3.5 h-3.5" />
                                    )}
                                    {submitting ? "Saving..." : (isEditMode ? "Update Event" : "Add Event")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(modalContent, document.body);
}