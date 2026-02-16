"use client";
import axios from "axios";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const ColorPicker = ({
    city,
    state,
    currentColor,
    venueId,
    onColorSelect,
    onClose
}) => {
    const [colorData, setColorData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(currentColor);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (city) {
            fetchAvailableColors();
        }
    }, [city, venueId]);

    const fetchAvailableColors = async () => {
        if (!city) return;

        setLoading(true);
        try {
            const token = getCookie("token");
            if (!token) return;

            const params = new URLSearchParams({
                city: city.toLowerCase(),
                ...(state && { state }),
                ...(venueId && { excludeVenueId: venueId })
            });

            const response = await axios.get(
                `${API_BASE}/api/venues/admin/colors/available?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setColorData(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching colors:", err);
            toast.error(err.response?.data?.message || "Failed to load colors");
        } finally {
            setLoading(false);
        }
    };

    const handleColorClick = (color) => {
        setSelectedColor(color);
        onColorSelect(color);
    };

    const getContrastColor = (hexColor) => {
        if (!hexColor || hexColor.length < 7) return "#000000";

        const r = parseInt(hexColor.substring(1, 3), 16);
        const g = parseInt(hexColor.substring(3, 5), 16);
        const b = parseInt(hexColor.substring(5, 7), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!colorData) return null;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700">
                    Color Palette for {city}
                </h4>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Color Stats */}
            <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-600">
                    Total: <span className="font-bold">{colorData.totalColors}</span>
                </span>
                <span className="text-gray-600">
                    Used: <span className="font-bold text-orange-600">{colorData.usedColors}</span>
                </span>
                <span className="text-gray-600">
                    Available: <span className="font-bold text-green-600">{colorData.availableColors}</span>
                </span>
            </div>

            {/* Current Color */}
            {currentColor && (
                <div className="border rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Current Color
                    </label>
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-8 h-8 rounded-lg border-2 border-gray-300"
                            style={{ backgroundColor: currentColor }}
                        ></div>
                        <span className="text-sm font-mono">{currentColor}</span>
                    </div>
                </div>
            )}

            {/* Available Colors */}
            {colorData.grouped.available.length > 0 ? (
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">
                        Available Colors ({colorData.grouped.available.length})
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {colorData.grouped.available.map((item, index) => (
                            <button
                                key={`available-${item.color}-${index}`}
                                onClick={() => handleColorClick(item.color)}
                                className={`
                                    relative group aspect-square rounded-lg border-2 transition-all
                                    ${selectedColor === item.color
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }
                                `}
                                style={{ backgroundColor: item.color }}
                                title={`${item.color}${item.usedByVenue ? ` (Used by ${item.usedByVenue})` : ''}`}
                            >
                                {selectedColor === item.color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white drop-shadow-lg" />
                                    </div>
                                )}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap z-10">
                                    {item.color}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">No colors available</p>
                    <p className="text-xs text-yellow-600 mt-1">All colors are taken</p>
                </div>
            )}

            {/* Used Colors */}
            {colorData.grouped.used.length > 0 && (
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">
                        Used Colors ({colorData.grouped.used.length})
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {colorData.grouped.used.map((item, index) => (
                            <div
                                key={`used-${item.color}-${index}`}
                                className="relative group aspect-square rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed"
                                style={{ backgroundColor: item.color }}
                                title={`${item.color} - Used by ${item.usedByVenue || 'another venue'}`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <X className="w-3 h-3 text-white drop-shadow-lg" />
                                </div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap z-10">
                                    {item.color}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;