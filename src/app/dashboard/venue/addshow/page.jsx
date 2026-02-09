// app/dashboard/venues/add-show/page.js
"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  ImageIcon,
  Loader2,
  MapPin,
  Music,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    description: "",
  });

  const [venue, setVenue] = useState(null);
  const [showsThisMonth, setShowsThisMonth] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [dateInput, setDateInput] = useState("");
  const [dateError, setDateError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const MAX_SHOWS_PER_MONTH = subscriptionPlan === "free" ? 1 : 50;
  const isLimitReached = showsThisMonth >= MAX_SHOWS_PER_MONTH;

  useEffect(() => {
    fetchVenueData();
  }, []);

  useEffect(() => {
    if (newShow.date) {
      const dateParts = newShow.date.split("/");
      if (dateParts.length === 3) {
        const [month, day, year] = dateParts;
        setDateInput(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        );
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
          isActive: v.isActive || false,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setNewShow({ ...newShow, image: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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

    const [year, month, day] = value.split("-").map(Number);
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

    const formattedDate = `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`;
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

    if (timeValue.includes(":")) {
      const [hours, minutes] = timeValue.split(":");
      let hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      timeValue = `${hour}:${minutes.padStart(2, "0")} ${ampm}`;
    }

    setNewShow({ ...newShow, time: timeValue });
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      const [time, period] = timeString.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }

    return timeString;
  };

  const getMinDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleAddShow = async (e) => {
    e.preventDefault();

    if (subscriptionPlan === "free" && showsThisMonth >= 1) {
      toast.error(
        "Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows.",
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
      setNewShow({
        artist: "",
        date: "",
        time: "",
        image: null,
        description: "",
      });
      setDateInput("");
      setImagePreview(null);

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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading add show page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-16">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/venues"
              className="p-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Add New Show
              </h1>
              <p className="text-gray-600 text-sm">
                Schedule a live performance at your venue
              </p>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-lg border ${isLimitReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}
          >
            <span className="font-medium">
              {showsThisMonth}/{MAX_SHOWS_PER_MONTH} shows this month
            </span>
          </div>
        </div>

        {/* Venue Location Info */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold">Venue Location</h4>
              <p className="text-gray-600 text-sm">
                Shows will be automatically listed in:{" "}
                <span className="font-medium text-gray-900 capitalize">
                  {venue?.city || "Not set"}, {venue?.state || "Not set"}
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Your venue's location from the profile will be used for all
                shows
              </p>
            </div>
          </div>
        </div>

        {isLimitReached && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <h4 className="text-yellow-800 font-semibold">
                  Monthly Show Limit Reached
                </h4>
                <p className="text-yellow-700 text-sm">
                  You've scheduled {showsThisMonth} shows this month.{" "}
                  {subscriptionPlan === "free"
                    ? "Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows."
                    : "You've reached the maximum shows for this month."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Show Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <form onSubmit={handleAddShow} className="space-y-6">
            {/* Artist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Music size={18} className="text-gray-500" />
                Artist / Band Name *
              </label>
              <input
                type="text"
                name="artist"
                value={newShow.artist}
                onChange={(e) =>
                  setNewShow({ ...newShow, artist: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter artist or band name"
                disabled={loading || isLimitReached}
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  Show Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={dateInput}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    min={getMinDate()}
                    disabled={loading || isLimitReached}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.querySelector('input[type="date"]')?.showPicker()
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                    disabled={loading || isLimitReached}
                  >
                    <Calendar size={18} />
                  </button>
                </div>
                {dateError && (
                  <p className="text-red-600 text-xs mt-2">{dateError}</p>
                )}
              </div>

              {/* Time Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock size={18} className="text-gray-500" />
                  Show Time *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="time"
                    value={formatTimeForInput(newShow.time)}
                    onChange={handleTimeChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || isLimitReached}
                    required
                    step="1800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.querySelector('input[type="time"]')?.showPicker()
                    }
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                    disabled={loading || isLimitReached}
                  >
                    <Clock size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Description
              </label>
              <textarea
                name="description"
                value={newShow.description}
                onChange={(e) =>
                  setNewShow({ ...newShow, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Describe the show, music genre, special guests, ticket info, etc."
                rows="3"
                disabled={loading || isLimitReached}
                maxLength="1000"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-500 text-xs">
                  {newShow.description?.length || 0}/1000 characters
                </p>
                {newShow.description?.length >= 1000 && (
                  <p className="text-red-600 text-xs">
                    Character limit reached
                  </p>
                )}
              </div>
            </div>

            {/* Show Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon size={18} className="text-gray-500" />
                Show Image *
              </label>

              {imagePreview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={imagePreview}
                      alt="Show preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required={!imagePreview}
                  disabled={loading || isLimitReached}
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setNewShow({ ...newShow, image: null });
                    }}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Upload a promotional image for the show (Max: 5MB, JPG/PNG/WebP)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading || isLimitReached}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition min-w-[200px] ${
                  isLimitReached
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
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
                    {isLimitReached
                      ? `Limit Reached (${MAX_SHOWS_PER_MONTH}/month)`
                      : "Schedule Show"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/dashboard/venues"
            className="flex-1 min-w-[200px] bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl border border-gray-300 text-center transition shadow-sm hover:shadow"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/dashboard/venues/overview"
            className="flex-1 min-w-[200px] bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl border border-gray-300 text-center transition shadow-sm hover:shadow"
          >
            View All Shows
          </Link>
        </div>
      </div>
    </div>
  );
}
