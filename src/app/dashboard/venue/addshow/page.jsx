"use client";

import AddShowForm from "@/components/modules/dashboard/venues/AddShowForm";
import ShowsList from "@/components/modules/dashboard/venues/ShowsList";
import CustomLoader from "@/components/shared/loader/Loader";
import DeleteModal from "@/ui/DeleteModal";
import {
  MapPin,
  Plus
} from "lucide-react";
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

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    show: null,
    loading: false
  });

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

      // formData is a plain JavaScript object from AddShowForm
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
      fetchVenueData();
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

      // formData is a plain JavaScript object from AddShowForm
      const submitData = new FormData();
      submitData.append("artist", formData.artist);
      submitData.append("date", formData.date);
      submitData.append("time", formData.time);
      if (formData.image) submitData.append("image", formData.image);
      if (formData.description) submitData.append("description", formData.description);

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

  // Open delete modal
  const handleDeleteClick = (show) => {
    setDeleteModal({
      isOpen: true,
      show: show,
      loading: false
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteModal.show) return;

    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));

      const token = getCookie("token");

      const res = await fetch(
        `${API_BASE}/api/venues/shows/${deleteModal.show._id}`,
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

      // Close modal and refresh
      setDeleteModal({ isOpen: false, show: null, loading: false });

      if (token) {
        await fetchShows(token);
      }
    } catch (error) {
      console.error("Delete show error:", error);
      toast.error(error.message || "Error deleting show.");
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, show: null, loading: false });
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

      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Manage Shows
              </h1>
              <p className="text-gray-600 text-sm">
                Schedule and manage live performances at your venue
              </p>
            </div>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
            >
              <Plus size={18} />
              Add New Show
            </button>
          )}
        </div>

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
                Your Shows ({shows.length})
              </h2>
              <span className="text-sm text-gray-500">
                {shows.length} show{shows.length !== 1 ? 's' : ''} scheduled
              </span>
            </div>

            <ShowsList
              shows={shows}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteModal.loading}
        title="Delete Show"
        description={`Are you sure you want to delete "${deleteModal.show?.artistBandName || deleteModal.show?.artist || "this show"}"?`}
        confirmText="Delete Show"
        cancelText="Cancel"
        type="danger"
        itemName={deleteModal.show?.artistBandName || deleteModal.show?.artist || "this show"}
      />
    </div>
  );
}