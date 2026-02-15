"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import CastSectionTextEditor from "@/components/modules/dashboard/casts/CastSectionTextEditor";
import DeleteConfirmationModal from "@/components/modules/dashboard/casts/DeleteConfirmationModal";
import PodcastForm from "@/components/modules/dashboard/casts/PodcastForm";
import PodcastHeader from "@/components/modules/dashboard/casts/PodcastHeader";
import PodcastTable from "@/components/modules/dashboard/casts/PodcastTable";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Utility function for getting cookies
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function PodcastPage() {
  const [token, setToken] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showSectionTextEditor, setShowSectionTextEditor] = useState(false);
  const [sectionText, setSectionText] = useState({
    sectionTitle: "Cast",
    sectionSubtitle: "Tune into engaging podcast episodes featuring your favorite personalities",
    yourCastsTitle: "Your Favorites"
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    podcastId: null,
    podcastTitle: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = getCookie("token");
      setToken(storedToken);
      if (!storedToken) {
        toast.error("Please login first");
        handleUnauthorized();
      }
    }
  }, []);

  // Fetch all podcasts
  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");

      if (!token) {
        toast.error("Please login first");
        handleUnauthorized();
        return;
      }

      const { data } = await axios.get(`${API_BASE}/api/casts`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (data.success) {
        setPodcasts(Array.isArray(data.data.casts) ? data.data.casts : []);
      } else {
        setPodcasts([]);
        toast.error("Failed to load podcasts");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error(handleApiError(error, "Failed to load podcasts"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch section text
  const fetchSectionText = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

      const { data } = await axios.get(`${API_BASE}/api/casts/section/text`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setSectionText({
          sectionTitle: data.data.sectionTitle || "Cast",
          sectionSubtitle: data.data.sectionSubtitle || "Tune into engaging podcast episodes featuring your favorite personalities",
          yourCastsTitle: data.data.yourCastsTitle || "Your Favorites"
        });
      }
    } catch (error) {
      console.error("Failed to fetch section text:", error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      podcastId: id,
      podcastTitle: title,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      podcastId: null,
      podcastTitle: "",
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { podcastId, podcastTitle } = deleteModal;

    const token = getCookie("token");

    if (!token) {
      toast.error("Authentication token not found");
      handleUnauthorized();
      closeDeleteModal();
      return;
    }

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(`${API_BASE}/api/casts/${podcastId}`, {
          headers,
          credentials: "include",
        });
        resolve();
      } catch (error) {
        if (error.response?.status === 401) {
          handleUnauthorized();
          return;
        }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle section text update
  const handleSectionTextUpdate = () => {
    fetchSectionText();
    toast.success("Section text updated successfully!");
    setShowSectionTextEditor(false);
  };

  useEffect(() => {
    fetchPodcasts();
    fetchSectionText();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <Toaster />
        <div className="">
          {/* Section Text Editor Modal */}
          {showSectionTextEditor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CastSectionTextEditor
                  onClose={() => setShowSectionTextEditor(false)}
                  onUpdate={handleSectionTextUpdate}
                  token={token}
                  API_BASE={API_BASE}
                />
              </div>
            </div>
          )}

          <PodcastHeader
            loading={loading}
            showForm={showForm}
            onRefresh={() => {
              fetchPodcasts();
              fetchSectionText();
            }}
            onToggleForm={() => setShowForm(!showForm)}
            onEditSectionText={() => setShowSectionTextEditor(true)}
            setShowSectionTextEditor={setShowSectionTextEditor}
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