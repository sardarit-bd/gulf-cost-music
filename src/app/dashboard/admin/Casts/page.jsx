"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import DeleteConfirmationModal from "@/components/modules/dashboard/casts/DeleteConfirmationModal";
import PodcastForm from "@/components/modules/dashboard/casts/PodcastForm";
import PodcastHeader from "@/components/modules/dashboard/casts/PodcastHeader";
import PodcastTable from "@/components/modules/dashboard/casts/PodcastTable";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function PodcastPage() {
  const [token, setToken] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    podcastId: null,
    podcastTitle: ""
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        toast.error("Please login first");
      }
    }
  }, []);

  // Fetch all podcasts
  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/casts`);
      if (data.success) {
        setPodcasts(Array.isArray(data.data.casts) ? data.data.casts : []);
      } else {
        setPodcasts([]);
        toast.error("Failed to load podcasts");
      }
    } catch (error) {
      toast.error(handleApiError(error, "Failed to load podcasts"));
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      podcastId: id,
      podcastTitle: title
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      podcastId: null,
      podcastTitle: ""
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { podcastId, podcastTitle } = deleteModal;

    if (!token) {
      toast.error("Authentication token not found");
      closeDeleteModal();
      return;
    }

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_BASE}/api/casts/${podcastId}`, { headers });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting podcast...",
      success: () => {
        fetchPodcasts();
        closeDeleteModal();
        return "Podcast deleted successfully!";
      },
      error: (error) => {
        closeDeleteModal();
        return handleApiError(error, "Failed to delete podcast");
      },
    });
  };

  const handleFormSubmit = () => {
    resetForm();
    fetchPodcasts();
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <Toaster />
        <div className="max-w-6xl mx-auto">
          <PodcastHeader
            loading={loading}
            showForm={showForm}
            onRefresh={fetchPodcasts}
            onToggleForm={() => setShowForm(!showForm)}
          />

          {showForm && (
            <PodcastForm
              editingItem={editingItem}
              token={token}
              onSubmit={handleFormSubmit}
              onCancel={resetForm}
              handleApiError={handleApiError}
            />
          )}

          <PodcastTable
            podcasts={podcasts}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={openDeleteModal}
            onAddNew={() => setShowForm(true)}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteConfirm}
            podcastTitle={deleteModal.podcastTitle}
          />
        </div>
      </div>
    </AdminLayout>
  );
}