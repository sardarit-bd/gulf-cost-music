"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ActivateModal from "@/components/modules/dashboard/artists/ActivateModal";
import ArtistDetailModal from "@/components/modules/dashboard/artists/ArtistDetailModal";
import ArtistTable from "@/components/modules/dashboard/artists/ArtistTable";
import DeactivatedUsers from "@/components/modules/dashboard/artists/DeactivatedUsers";
import DeactivateModal from "@/components/modules/dashboard/artists/DeactivateModal";
import StatCard from "@/components/modules/dashboard/artists/StatCard";
import CustomLoader from "@/components/shared/loader/Loader";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Crown,
  Loader2,
  Music,
  Pause,
  Play,
  Save,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
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

const ArtistManagement = () => {
  const { user, updateUser } = useAuth();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deactivatedSearch, setDeactivatedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
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

  // Filter deactivated artists
  const filteredDeactivatedArtists = artists
    .filter((artist) => !artist.isActive)
    .filter(
      (artist) =>
        deactivatedSearch === "" ||
        artist.name?.toLowerCase().includes(deactivatedSearch.toLowerCase()) ||
        artist.user?.email
          ?.toLowerCase()
          .includes(deactivatedSearch.toLowerCase()) ||
        artist.genre?.toLowerCase().includes(deactivatedSearch.toLowerCase()) ||
        artist.city?.toLowerCase().includes(deactivatedSearch.toLowerCase()),
    );

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

  const handleDeactivateConfirm = async (
    id,
    currentStatus,
    reason,
    notifyUser,
  ) => {
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

  const handleActivateConfirm = async (id, notifyUser) => {
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
        <div className="">
          <Toaster />

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Music className="w-5 h-5 text-white" />
                </div>
                Artist Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage artist profiles, subscription plans, activate/deactivate
                accounts
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 lg:mt-0">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Artists
                </button>
                <button
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "deactivated"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("deactivated")}
                >
                  Deactivated ({deactivatedArtists.length})
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            <StatCard
              icon={User}
              label="Total Artists"
              value={stats.total}
              color="purple"
            />
            <StatCard
              icon={Play}
              label="Active Artists"
              value={stats.active}
              color="green"
            />
            <StatCard
              icon={Pause}
              label="Inactive Artists"
              value={stats.inactive}
              color="orange"
            />
            <StatCard
              icon={Crown}
              label="Pro Plan"
              value={planStats.pro}
              color="yellow"
              plan="pro"
            />
            <StatCard
              icon={Users}
              label="Free Plan"
              value={planStats.free}
              color="blue"
              plan="free"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={stats.thisMonth}
              color="indigo"
            />
          </div>

          {activeTab === "all" ? (
            <>
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
            </>
          ) : (
            <DeactivatedUsers
              deactivatedArtists={filteredDeactivatedArtists}
              loading={loading}
              onActivateUser={openActivateModal}
              onOpenPlanChangeModal={openPlanChangeModal}
              onViewProfile={handleViewProfile}
              onEdit={handleEdit}
              onDeleteArtist={deleteArtist}
              search={deactivatedSearch}
              onSearchChange={setDeactivatedSearch}
              onRefresh={fetchArtists}
            />
          )}

          {/* Delete Confirmation Modal */}
          {deleteModal.isOpen && deleteModal.artist && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Artist
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setDeleteModal({ isOpen: false, artist: null })
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 text-sm mb-3">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                      {deleteModal.artist.name}
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-red-600">
                    This action cannot be undone. All data associated with this
                    artist will be permanently removed.
                  </p>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() =>
                      setDeleteModal({ isOpen: false, artist: null })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={modalLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {modalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                    {modalLoading ? "Deleting..." : "Delete Artist"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {editModal.isOpen && editModal.artist && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Edit Artist Profile
                    </h2>
                  </div>
                  <button
                    onClick={() =>
                      setEditModal({ isOpen: false, artist: null })
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Artist name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={editFormData.genre}
                      onChange={(e) =>
                        handleInputChange("genre", e.target.value)
                      }
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Genre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editFormData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Website URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biography
                    </label>
                    <textarea
                      value={editFormData.biography}
                      onChange={(e) =>
                        handleInputChange("biography", e.target.value)
                      }
                      rows="3"
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
                      placeholder="Artist biography"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subscription Plan
                    </label>
                    <select
                      value={editFormData.subscriptionPlan}
                      onChange={(e) =>
                        handleInputChange("subscriptionPlan", e.target.value)
                      }
                      className="text-gray-600 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    >
                      <option value="free">Free Plan</option>
                      <option value="pro">Pro Plan</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        setEditModal({ isOpen: false, artist: null })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      disabled={editLoading}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {editLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
          {planChangeModal.isOpen && planChangeModal.artist && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Crown className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Change Subscription Plan
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setPlanChangeModal({
                        isOpen: false,
                        artist: null,
                        newPlan: "",
                      })
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4">
                    Change{" "}
                    <span className="font-semibold">
                      {planChangeModal.artist.name}
                    </span>
                    's plan from{" "}
                    <span
                      className={`font-semibold ${planChangeModal.artist.user?.subscriptionPlan === "pro" ? "text-yellow-600" : "text-blue-600"}`}
                    >
                      {planChangeModal.artist.user?.subscriptionPlan?.toUpperCase() ||
                        "FREE"}
                    </span>{" "}
                    to{" "}
                    <span
                      className={`font-semibold ${planChangeModal.newPlan === "pro" ? "text-yellow-600" : "text-blue-600"}`}
                    >
                      {planChangeModal.newPlan.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() =>
                      setPlanChangeModal({
                        isOpen: false,
                        artist: null,
                        newPlan: "",
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handlePlanChangeConfirm(
                        planChangeModal.artist._id,
                        planChangeModal.newPlan,
                      )
                    }
                    disabled={modalLoading}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer transition-colors ${
                      planChangeModal.newPlan === "pro"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } ${modalLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {modalLoading
                      ? "Changing..."
                      : `Change to ${planChangeModal.newPlan.toUpperCase()}`}
                  </button>
                </div>
              </div>
            </div>
          )}

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
      </div>
    </AdminLayout>
  );
};

export default ArtistManagement;
