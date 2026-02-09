// app/dashboard/venues/add-show/page.js
"use client";

import { Calendar, CheckCircle, Clock, ImageIcon, Loader2, MapPin, Music, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

export default function AddShowPage() {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    const [newShow, setNewShow] = useState({
        artist: "",
        date: "",
        time: "",
        image: null,
        description: ""
    });

    const [venue, setVenue] = useState(null);
    const [showsThisMonth, setShowsThisMonth] = useState(0);
    const [subscriptionPlan, setSubscriptionPlan] = useState("free");
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    const [dateInput, setDateInput] = useState("");
    const [dateError, setDateError] = useState("");

    const MAX_SHOWS_PER_MONTH = subscriptionPlan === "free" ? 1 : 50;
    const isLimitReached = showsThisMonth >= MAX_SHOWS_PER_MONTH;

    useEffect(() => {
        fetchVenueData();
    }, []);

    useEffect(() => {
        if (newShow.date) {
            const dateParts = newShow.date.split('/');
            if (dateParts.length === 3) {
                const [month, day, year] = dateParts;
                setDateInput(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
            }
        } else {
            setDateInput("");
        }
    }, [newShow.date]);

    const fetchVenueData = async () => {
        try {
            setLoadingPage(true);
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
                setVenue({
                    venueName: v.venueName || "",
                    state: v.state || "",
                    city: v.city || "",
                    isActive: v.isActive || false
                });
            }

            await fetchShowsCount(token);
        } catch (error) {
            console.error("Error fetching venue:", error);
            toast.error(error.message || "Server error while loading venue.");
        } finally {
            setLoadingPage(false);
        }
    };

    const fetchShowsCount = async (token) => {
        try {
            const res = await fetch(`${API_BASE}/api/venues/shows/count`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setShowsThisMonth(data.data?.count || 0);
            }
        } catch (error) {
            console.error("Error fetching shows count:", error);
        }
    };

    const validateAndSetDate = (value) => {
        setDateInput(value);
        setDateError("");

        if (!value) {
            setNewShow({ ...newShow, date: "" });
            return;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
            setDateError("Please use YYYY-MM-DD format");
            return;
        }

        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
        ) {
            setDateError("Invalid date");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date < today) {
            setDateError("Date cannot be in the past");
            return;
        }

        const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
        setNewShow({ ...newShow, date: formattedDate });
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        validateAndSetDate(value);
    };

    const handleTimeChange = (e) => {
        let timeValue = e.target.value;

        if (!timeValue) {
            setNewShow({ ...newShow, time: "" });
            return;
        }

        if (timeValue.includes(':')) {
            const [hours, minutes] = timeValue.split(':');
            let hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12;
            timeValue = `${hour}:${minutes.padStart(2, '0')} ${ampm}`;
        }

        setNewShow({ ...newShow, time: timeValue });
    };

    const formatTimeForInput = (timeString) => {
        if (!timeString) return '';

        if (timeString.includes('AM') || timeString.includes('PM')) {
            const [time, period] = timeString.split(' ');
            let [hours, minutes] = time.split(':');

            hours = parseInt(hours);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            return `${String(hours).padStart(2, '0')}:${minutes}`;
        }

        return timeString;
    };

    const getMinDate = () => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleAddShow = async (e) => {
        e.preventDefault();

        if (subscriptionPlan === "free" && showsThisMonth >= 1) {
            toast.error(
                "Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows."
            );
            return;
        }

        if (!newShow.artist || !newShow.date || !newShow.time || !newShow.image) {
            toast.error("Please fill all fields including the show image.");
            return;
        }

        try {
            const token = getCookie("token");
            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            const formData = new FormData();
            formData.append("artist", newShow.artist);
            formData.append("date", newShow.date);
            formData.append("time", newShow.time);
            formData.append("image", newShow.image);
            if (newShow.description) {
                formData.append("description", newShow.description);
            }

            setLoading(true);
            const addToast = toast.loading("Adding show...");

            const res = await fetch(`${API_BASE}/api/venues/add-show`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            toast.dismiss(addToast);

            if (!res.ok) {
                if (data.message?.includes("Free plan")) {
                    toast.error(data.message);
                } else {
                    throw new Error(data.message || "Failed to add show.");
                }
                return;
            }

            toast.success("🎤 Show added successfully!");
            setNewShow({ artist: "", date: "", time: "", image: null, description: "" });
            setDateInput("");

            if (subscriptionPlan === "free") {
                setShowsThisMonth((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Add show error:", error);
            toast.error(error.message || "Error adding show.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingPage) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading add show page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-16">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="max-w-4xl mx-auto">
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
                            <h1 className="text-3xl font-bold text-white">Add New Show</h1>
                            <p className="text-gray-400">Schedule a live performance at your venue</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
                        <span className="font-medium">
                            {showsThisMonth}/{MAX_SHOWS_PER_MONTH} shows this month
                        </span>
                    </div>
                </div>

                {/* Venue Location Info */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <MapPin className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold">Venue Location</h4>
                            <p className="text-gray-400 text-sm">
                                Shows will be automatically listed in: <span className="font-medium text-white capitalize">{venue?.city || "Not set"}, {venue?.state || "Not set"}</span>
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Your venue's location from the profile will be used for all shows
                            </p>
                        </div>
                    </div>
                </div>

                {isLimitReached && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-yellow-400" size={20} />
                            <div>
                                <h4 className="text-yellow-400 font-semibold">Monthly Show Limit</h4>
                                <p className="text-yellow-300/80 text-sm">
                                    You've scheduled {showsThisMonth} shows this month. {subscriptionPlan === "free"
                                        ? "Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows."
                                        : "You've reached the maximum shows for this month."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Show Form */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <form onSubmit={handleAddShow} className="space-y-6">
                        {/* Artist */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Music size={18} />
                                Artist / Band Name *
                            </label>
                            <input
                                type="text"
                                name="artist"
                                value={newShow.artist}
                                onChange={(e) => setNewShow({ ...newShow, artist: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter artist or band name"
                                disabled={loading || isLimitReached}
                                required
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Date Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Calendar size={18} />
                                    Show Date *
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="date"
                                        value={dateInput}
                                        onChange={handleDateChange}
                                        className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        min={getMinDate()}
                                        disabled={loading || isLimitReached}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.querySelector('input[type="date"]')?.showPicker()}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition"
                                        disabled={loading || isLimitReached}
                                    >
                                        <Calendar size={18} />
                                    </button>
                                </div>
                                {dateError && (
                                    <p className="text-red-400 text-xs mt-2">{dateError}</p>
                                )}
                            </div>

                            {/* Time Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Clock size={18} />
                                    Show Time *
                                </label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="time"
                                        value={formatTimeForInput(newShow.time)}
                                        onChange={handleTimeChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading || isLimitReached}
                                        required
                                        step="1800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.querySelector('input[type="time"]')?.showPicker()}
                                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition"
                                        disabled={loading || isLimitReached}
                                    >
                                        <Clock size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Show Description
                            </label>
                            <textarea
                                name="description"
                                value={newShow.description}
                                onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Describe the show, music genre, special guests, ticket info, etc."
                                rows="3"
                                disabled={loading || isLimitReached}
                                maxLength="1000"
                            />
                            <p className="text-gray-500 text-xs mt-2">
                                {newShow.description?.length || 0}/1000 characters
                            </p>
                        </div>

                        {/* Show Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <ImageIcon size={18} />
                                Show Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setNewShow({ ...newShow, image: e.target.files[0] })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isLimitReached}
                            />
                            <p className="text-gray-500 text-xs mt-2">
                                Upload a promotional image for the show (Max: 5MB, JPG/PNG)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={loading || isLimitReached}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition ${isLimitReached
                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-105"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Scheduling Show...
                                    </>
                                ) : (
                                    <>
                                        <Music size={18} />
                                        {isLimitReached ? `Limit Reached (${MAX_SHOWS_PER_MONTH}/month)` : "Schedule Show"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/dashboard/venues"
                        className="flex-1 min-w-[200px] bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl border border-gray-700 text-center transition"
                    >
                        Back to Dashboard
                    </Link>
                    <Link
                        href="/dashboard/venues/overview"
                        className="flex-1 min-w-[200px] bg-gray-900 hover:bg-gray-800 text-gray-300 px-6 py-3 rounded-xl border border-gray-700 text-center transition"
                    >
                        View Overview
                    </Link>
                </div>
            </div>
        </div>
    );
}