"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ActivateModal from "@/components/modules/dashboard/artists/ActivateModal";
import ArtistDetailModal from "@/components/modules/dashboard/artists/ArtistDetailModal";
import ArtistTable from "@/components/modules/dashboard/artists/ArtistTable";
import DeactivateModal from "@/components/modules/dashboard/artists/DeactivateModal";
import CustomLoader from "@/components/shared/loader/Loader";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Music } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import ArtistDeleteConfirmModal from "@/components/modules/dashboard/artists/ArtistDeleteConfirmModal";
import ArtistHeader from "@/components/modules/dashboard/artists/ArtistHeader";
import ArtistStats from "@/components/modules/dashboard/artists/ArtistStats";
import EditArtistModal from "@/components/modules/dashboard/artists/EditArtistModal";
import PlanChangeModal from "@/components/modules/admin/photographers/PlanChangeModal";

// Utility function for getting cookies
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ArtistManagement = () => {
  const { user, updateUser } = useAuth();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);
  const [viewingArtist, setViewingArtist] = useState(null);
  const [planChangeModal, setPlanChangeModal] = useState({
    isOpen: false,
    artist: null,
    newPlan: "",
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    artist: null,
  });

  // Edit Modal State
  const [editModal, setEditModal] = useState({
    isOpen: false,
    artist: null,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    genre: "",
    city: "",
    biography: "",
    website: "",
    phone: "",
    subscriptionPlan: "free",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Modal states
  const [deactivateModal, setDeactivateModal] = useState({
    isOpen: false,
    artist: null,
  });
  const [activateModal, setActivateModal] = useState({
    isOpen: false,
    artist: null,
  });
  const [modalLoading, setModalLoading] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/artists`;

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(planFilter !== "all" && { plan: planFilter }),
      });

      const { data } = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (data.success) {
        setArtists(data.data.content);
        setPages(data.data.pagination.pages);
      } else {
        showToast(data.message || "Failed to fetch artists", "error");
      }
    } catch (err) {
      console.error("Fetch artists error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast(
        err.response?.data?.message || "Failed to fetch artists",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (artist) => setViewingArtist(artist);

  const openDeactivateModal = (artist) => {
    setDeactivateModal({ isOpen: true, artist });
  };

  const openActivateModal = (artist) => {
    setActivateModal({ isOpen: true, artist });
  };

  const openPlanChangeModal = (artist, newPlan) => {
    setPlanChangeModal({
      isOpen: true,
      artist,
      newPlan,
    });
  };

  // Open Delete Modal
  const openDeleteModal = (artist) => {
    setDeleteModal({ isOpen: true, artist });
  };

  // Open Edit Modal
  const openEditModal = (artist) => {
    setEditFormData({
      name: artist.name || "",
      genre: artist.genre || "",
      city: artist.city || "",
      biography: artist.biography || "",
      website: artist.website || "",
      phone: artist.phone || "",
      subscriptionPlan: artist.user?.subscriptionPlan || "free",
    });
    setEditModal({ isOpen: true, artist });
    setActionMenu(null);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteModal.artist) return;

    setModalLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${deleteModal.artist._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      fetchArtists();
      setDeleteModal({ isOpen: false, artist: null });
      showToast("Artist profile deleted successfully!");
    } catch (err) {
      console.error("Delete artist error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast("Failed to delete artist profile", "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Edit Save
  const handleEditSave = async () => {
    if (!editModal.artist) return;

    setEditLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${editModal.artist._id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.data.success) {
        fetchArtists();
        setEditModal({ isOpen: false, artist: null });
        showToast("Artist profile updated successfully!");
      }
    } catch (err) {
      console.error("Update artist error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast(
        err.response?.data?.message || "Error updating artist profile",
        "error",
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeactivateConfirm = async (id, currentStatus, reason) => {
    setModalLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        {
          isActive: false,
          deactivationReason: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );

      fetchArtists();
      setDeactivateModal({ isOpen: false, artist: null });
      setActionMenu(null);
      showToast("Artist deactivated successfully!");
    } catch (err) {
      console.error("Deactivate artist error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast("Failed to deactivate artist", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleActivateConfirm = async (id) => {
    setModalLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        {
          isActive: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );

      fetchArtists();
      setActivateModal({ isOpen: false, artist: null });
      showToast("Artist activated successfully!");
    } catch (err) {
      console.error("Activate artist error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast("Failed to activate artist", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handlePlanChangeConfirm = async (id, newPlan) => {
    setModalLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}/plan`,
        {
          subscriptionPlan: newPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.data.success) {
        fetchArtists();
        setPlanChangeModal({ isOpen: false, artist: null, newPlan: "" });
        setActionMenu(null);
        showToast(
          response.data.message ||
            `Plan changed to ${newPlan.toUpperCase()} successfully!`,
        );

        const updatedArtistUser = response.data?.data?.artist?.user;
        if (updatedArtistUser && updatedArtistUser._id === user?._id) {
          updateUser({
            subscriptionPlan: updatedArtistUser.subscriptionPlan,
            subscriptionStatus: updatedArtistUser.subscriptionStatus,
          });
        }
      } else {
        showToast(response.data.message || "Failed to change plan", "error");
      }
    } catch (err) {
      console.error("Change plan error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
      showToast(
        err.response?.data?.message || "Failed to change plan",
        "error",
      );
    } finally {
      setModalLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    if (currentStatus) {
      const artist = artists.find((a) => a._id === id);
      openDeactivateModal(artist);
    } else {
      try {
        const token = getCookie("token");

        if (!token) {
          showToast("No authentication token found", "error");
          handleUnauthorized();
          return;
        }

        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
          { isActive: true },
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          },
        );
        fetchArtists();
        setActionMenu(null);
        showToast("Artist activated successfully!");
      } catch (err) {
        console.error("Toggle artist error:", err);
        if (err.response?.status === 401) {
          handleUnauthorized();
          return;
        }
        showToast("Failed to update artist status", "error");
      }
    }
  };

  const deleteArtist = async (id) => {
    const artist = artists.find((a) => a._id === id);
    if (artist) {
      openDeleteModal(artist);
    }
  };

  const handleEdit = (artist) => {
    openEditModal(artist);
  };

  const handleInputChange = (field, value) =>
    setEditFormData((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setStatusFilter("all");
    setPlanFilter("all");
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleActionMenuToggle = (artistId) =>
    setActionMenu(actionMenu === artistId ? null : artistId);

  const handlePageChange = (newPage) => setPage(newPage);

  const planStats = {
    pro: artists.filter((a) => a.user?.subscriptionPlan === "pro").length,
    free: artists.filter((a) => a.user?.subscriptionPlan === "free").length,
    total: artists.length,
  };

  useEffect(() => {
    fetchArtists();
  }, [page, statusFilter, planFilter, search]);

  const activeArtists = artists.filter((a) => a.isActive);
  const deactivatedArtists = artists.filter((a) => !a.isActive);

  const stats = {
    total: artists.length,
    active: activeArtists.length,
    inactive: deactivatedArtists.length,
    thisMonth: Math.floor(artists.length * 0.15),
  };

  const hasActiveFilters =
    search || statusFilter !== "all" || planFilter !== "all";

  if (loading && artists.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen py-20 bg-white">
          <div className="text-center">
            <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <Toaster />

        {/* Header */}
        <ArtistHeader />

        {/* Stats Cards */}
        <ArtistStats stats={stats} planStats={planStats} />

        {/* Artist Table */}
        <ArtistTable
          artists={artists}
          loading={loading}
          page={page}
          pages={pages}
          editingArtist={null}
          formData={{}}
          saveLoading={false}
          actionMenu={actionMenu}
          onPageChange={handlePageChange}
          onViewProfile={handleViewProfile}
          onToggleActive={toggleActive}
          onOpenDeactivateModal={openDeactivateModal}
          onOpenPlanChangeModal={openPlanChangeModal}
          onEdit={handleEdit}
          onSave={() => {}}
          onCancel={() => {}}
          onInputChange={() => {}}
          onDeleteArtist={deleteArtist}
          onActionMenuToggle={handleActionMenuToggle}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          activeSearchTerm={search}
          statusFilter={statusFilter}
          planFilter={planFilter}
        />

        {/* Delete Confirmation Modal */}
        <ArtistDeleteConfirmModal
          isOpen={deleteModal.isOpen}
          artist={deleteModal.artist}
          onClose={() => setDeleteModal({ isOpen: false, artist: null })}
          onConfirm={handleDeleteConfirm}
          loading={modalLoading}
        />

        {/* Edit Profile Modal */}
        <EditArtistModal
          isOpen={editModal.isOpen}
          artist={editModal.artist}
          formData={editFormData}
          loading={editLoading}
          onClose={() => setEditModal({ isOpen: false, artist: null })}
          onSave={handleEditSave}
          onInputChange={handleInputChange}
        />

        {/* Deactivate Modal */}
        <DeactivateModal
          artist={deactivateModal.artist}
          isOpen={deactivateModal.isOpen}
          onClose={() => setDeactivateModal({ isOpen: false, artist: null })}
          onConfirm={handleDeactivateConfirm}
          loading={modalLoading}
        />

        {/* Activate Modal */}
        <ActivateModal
          artist={activateModal.artist}
          isOpen={activateModal.isOpen}
          onClose={() => setActivateModal({ isOpen: false, artist: null })}
          onConfirm={handleActivateConfirm}
          loading={modalLoading}
        />

        {/* Plan Change Modal */}
        <PlanChangeModal
          isOpen={planChangeModal.isOpen}
          artist={planChangeModal.artist}
          newPlan={planChangeModal.newPlan}
          loading={modalLoading}
          onClose={() =>
            setPlanChangeModal({ isOpen: false, artist: null, newPlan: "" })
          }
          onConfirm={handlePlanChangeConfirm}
        />

        {/* Artist Detail Modal */}
        {viewingArtist && (
          <ArtistDetailModal
            artist={viewingArtist}
            onClose={() => setViewingArtist(null)}
            onEdit={handleEdit}
            onPlanChange={openPlanChangeModal}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ArtistManagement;
