// app/dashboard/venues/add-show/page.js
"use client";

import AddShowForm from "@/components/modules/dashboard/venues/AddShowForm";
import ShowsList from "@/components/modules/dashboard/venues/ShowsList";
import CustomLoader from "@/components/shared/loader/Loader";
import {
  AlertCircle,
  ArrowLeft,
  MapPin,
  Plus,
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

  const [venue, setVenue] = useState(null);
  const [shows, setShows] = useState([]);
  const [showsThisMonth, setShowsThisMonth] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const MAX_SHOWS_PER_MONTH = subscriptionPlan === "free" ? 1 : 50;
  const isLimitReached = showsThisMonth >= MAX_SHOWS_PER_MONTH;

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
        setVenue({
          venueName: v.venueName || "",
          state: v.state || "",
          city: v.city || "",
          isActive: v.isActive || false,
        });

        // Fetch shows separately from the new API endpoint
        await fetchShows(token);
      }

      if (data.data?.user?.subscriptionPlan) {
        setSubscriptionPlan(data.data.user.subscriptionPlan);
      }
    } catch (error) {
      console.error("Error fetching venue:", error);
      toast.error(error.message || "Server error while loading venue.");
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch shows from the correct endpoint
  const fetchShows = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/venues/shows`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.events) {
          setShows(data.data.events);
          setShowsThisMonth(data.data.events.length);
        }
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };

  const handleAddShow = async (formData) => {
    try {
      setFormLoading(true);
      const token = getCookie("token");

      const submitData = new FormData();
      submitData.append("artist", formData.artist);
      submitData.append("date", formData.date);
      submitData.append("time", formData.time);
      if (formData.image) submitData.append("image", formData.image);
      if (formData.description) submitData.append("description", formData.description);

      const res = await fetch(`${API_BASE}/api/venues/add-show`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add show.");
      }

      toast.success("🎤 Show added successfully!");
      setShowForm(false);
      fetchVenueData(); // Refresh data
    } catch (error) {
      console.error("Add show error:", error);
      toast.error(error.message || "Error adding show.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditShow = async (formData) => {
    try {
      setFormLoading(true);
      const token = getCookie("token");

      const submitData = new FormData();
      submitData.append("artist", formData.artist);
      submitData.append("date", formData.date);
      submitData.append("time", formData.time);
      if (formData.image) submitData.append("image", formData.image);
      if (formData.description) submitData.append("description", formData.description);

      // Fixed: Use correct endpoint with showId
      const res = await fetch(
        `${API_BASE}/api/venues/shows/${editingShow._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: submitData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update show.");
      }

      toast.success("Show updated successfully!");
      setEditingShow(null);
      setShowForm(false);
      fetchVenueData();
    } catch (error) {
      console.error("Edit show error:", error);
      toast.error(error.message || "Error updating show.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteShow = async (show) => {
    if (!confirm("Are you sure you want to delete this show?")) return;

    try {
      const token = getCookie("token");

      // Fixed: Use correct endpoint with showId (not delete-show)
      const res = await fetch(
        `${API_BASE}/api/venues/shows/${show._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete show.");
      }

      toast.success("Show deleted successfully!");

      // Refresh shows after deletion
      if (token) {
        await fetchShows(token);
      }
    } catch (error) {
      console.error("Delete show error:", error);
      toast.error(error.message || "Error deleting show.");
    }
  };

  const handleEditClick = (show) => {
    setEditingShow(show);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingShow(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20 bg-white">
        <div className="text-center">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />

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
                Manage Shows
              </h1>
              <p className="text-gray-600 text-sm">
                Schedule and manage live performances at your venue
              </p>
            </div>
          </div>

          {!showForm && !isLimitReached && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
            >
              <Plus size={18} />
              Add New Show
            </button>
          )}
        </div>

        {/* Limit Reached Alert */}
        {isLimitReached && !showForm && (
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

        {/* Venue Info */}
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
            </div>
          </div>
        </div>

        {/* Shows List or Form */}
        {showForm ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingShow ? "Edit Show" : "Add New Show"}
            </h2>
            <AddShowForm
              initialData={editingShow}
              onSubmit={editingShow ? handleEditShow : handleAddShow}
              onCancel={handleCancelForm}
              loading={formLoading}
              venue={venue}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Your Shows ({shows.length}/{MAX_SHOWS_PER_MONTH})
              </h2>
              <span className="text-sm text-gray-500">
                {shows.length} show{shows.length !== 1 ? 's' : ''} scheduled
              </span>
            </div>

            <ShowsList
              shows={shows}
              onEdit={handleEditClick}
              onDelete={handleDeleteShow}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}