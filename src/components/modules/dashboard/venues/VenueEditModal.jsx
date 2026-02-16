"use client";
import axios from "axios";
import {
    Building2,
    Save,
    Sparkles,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ColorPicker from "./ColorPicker";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const VenueEditModal = ({ venue, isOpen, onClose, onVenueUpdated }) => {
    const [formData, setFormData] = useState({
        venueName: "",
        city: "",
        state: "Alabama",
        address: "",
        seatingCapacity: "",
        biography: "",
        openHours: "",
        openDays: "",
        phone: "",
        website: "",
        isActive: false,
        colorCode: "",
        verifiedOrder: 0,
    });

    const [loading, setLoading] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (venue) {
            setFormData({
                venueName: venue.venueName || "",
                city: venue.city || "",
                state: venue.state || "Alabama",
                address: venue.address || "",
                seatingCapacity: venue.seatingCapacity || "",
                biography: venue.biography || "",
                openHours: venue.openHours || "",
                openDays: venue.openDays || "",
                phone: venue.phone || "",
                website: venue.website || "",
                isActive: venue.isActive || false,
                colorCode: venue.colorCode || "",
                verifiedOrder: venue.verifiedOrder || 0,
            });
        }
    }, [venue]);

    const handleUnauthorized = () => {
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        document.cookie = "user=; path=/; max-age=0";
        window.location.href = "/signin";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleColorSelect = (color) => {
        setFormData((prev) => ({ ...prev, colorCode: color }));
        setShowColorPicker(false);
        toast.success("Color selected!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = getCookie("token");

            if (!token) {
                handleUnauthorized();
                return;
            }

            const updateData = {
                ...formData,
                seatingCapacity: parseInt(formData.seatingCapacity) || 0,
                verifiedOrder: parseInt(formData.verifiedOrder) || 0,
            };

            const response = await axios.put(
                `${API_BASE}/api/venues/admin/${venue._id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Venue updated successfully!");

                // if (response.data.data.colorInfo) {
                //     console.log("Color updated from", response.data.data.colorInfo.oldColor,
                //         "to", response.data.data.colorInfo.newColor);
                // }

                onVenueUpdated();
                onClose();
            }
        } catch (err) {
            console.error("Error updating venue:", err);

            if (err.response?.status === 401) {
                handleUnauthorized();
                return;
            }
            toast.error(err.response?.data?.message || "Failed to update venue");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Building2 className="w-5 h-5 mr-2" />
                            Edit Venue: {venue.venueName}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Venue Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="venueName"
                                        value={formData.venueName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State *
                                    </label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    >
                                        <option value="Alabama">Alabama</option>
                                        <option value="Louisiana">Louisiana</option>
                                        <option value="Mississippi">Mississippi</option>
                                        <option value="Florida">Florida</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seating Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="seatingCapacity"
                                        value={formData.seatingCapacity}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Biography
                                    </label>
                                    <textarea
                                        name="biography"
                                        value={formData.biography}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Open Hours
                                    </label>
                                    <input
                                        type="text"
                                        name="openHours"
                                        value={formData.openHours}
                                        onChange={handleChange}
                                        placeholder="e.g., 9:00 AM - 5:00 PM"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Open Days
                                    </label>
                                    <input
                                        type="text"
                                        name="openDays"
                                        value={formData.openDays}
                                        onChange={handleChange}
                                        placeholder="e.g., Monday - Friday"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                {/* Color Picker Section */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Venue Color
                                    </label>

                                    {/* Current Color Display */}
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div
                                            className="w-12 h-12 rounded-lg border-2 border-gray-300"
                                            style={{ backgroundColor: formData.colorCode || "#CCCCCC" }}
                                        ></div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="colorCode"
                                                value={formData.colorCode}
                                                onChange={handleChange}
                                                placeholder="#000000"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium flex items-center"
                                        >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            {showColorPicker ? "Hide Colors" : "Pick Color"}
                                        </button>
                                    </div>

                                    {/* Color Picker */}
                                    {showColorPicker && (
                                        <div className="mt-4 border-t pt-4">
                                            <ColorPicker
                                                city={formData.city}
                                                state={formData.state}
                                                currentColor={formData.colorCode}
                                                venueId={venue._id}
                                                onColorSelect={handleColorSelect}
                                                onClose={() => setShowColorPicker(false)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Status Toggles */}
                                <div className="space-y-3 pt-4 border-t border-gray-300">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Active Venue
                                        </span>
                                    </label>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Verification Order (0 = unverified)
                                        </label>
                                        <input
                                            type="number"
                                            name="verifiedOrder"
                                            value={formData.verifiedOrder}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Setting to &gt;0 will auto-assign color if not set
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-[var(--primary)] text-black rounded-lg hover:bg-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Venue
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VenueEditModal;