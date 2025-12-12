"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ActivateModal from "@/components/modules/dashboard/artists/ActivateModal";
import ArtistDetailModal from "@/components/modules/dashboard/artists/ArtistDetailModal";
import ArtistTable from "@/components/modules/dashboard/artists/ArtistTable";
import DeactivatedUsers from "@/components/modules/dashboard/artists/DeactivatedUsers";
import DeactivateModal from "@/components/modules/dashboard/artists/DeactivateModal";
import Filters from "@/components/modules/dashboard/artists/Filters";
import StatCard from "@/components/modules/dashboard/artists/StatCard";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Crown, Music, Pause, Play, TrendingUp, User, Users } from "lucide-react";
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
  const [deactivatedSearch, setDeactivatedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingArtist, setViewingArtist] = useState(null);
  const [planChangeModal, setPlanChangeModal] = useState({
    isOpen: false,
    artist: null,
    newPlan: "",
  });

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

      // Correct API endpoint
      const { data } = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      console.log("Fetched artists:", data);

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
      showToast(err.response?.data?.message || "Failed to fetch artists", "error");
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
        artist.city?.toLowerCase().includes(deactivatedSearch.toLowerCase())
    );

  const handleViewProfile = (artist) => setViewingArtist(artist);

  // Open Deactivate Modal
  const openDeactivateModal = (artist) => {
    setDeactivateModal({ isOpen: true, artist });
  };

  // Open Activate Modal
  const openActivateModal = (artist) => {
    setActivateModal({ isOpen: true, artist });
  };

  // Open Plan Change Modal
  const openPlanChangeModal = (artist, newPlan) => {
    setPlanChangeModal({
      isOpen: true,
      artist,
      newPlan,
    });
  };

  // Handle Deactivate Confirmation
  const handleDeactivateConfirm = async (
    id,
    currentStatus,
    reason,
    notifyUser
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
          notifyUser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      fetchArtists();
      setDeactivateModal({ isOpen: false, artist: null });
      setActionMenu(null);
      showToast("Artist deactivated successfully!");

      if (notifyUser) {
        showToast("Notification email sent to artist");
      }
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

  // Handle Activate Confirmation
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
          notifyUser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      fetchArtists();
      setActivateModal({ isOpen: false, artist: null });
      showToast("Artist activated successfully!");

      if (notifyUser) {
        showToast("Notification email sent to artist");
      }
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

  // Handle Plan Change Confirmation
  const handlePlanChangeConfirm = async (id, newPlan, notifyUser) => {
    setModalLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      console.log("Changing plan for artist:", { id, newPlan, notifyUser });

      // Correct API endpoint
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}/plan`,
        {
          subscriptionPlan: newPlan,
          notifyUser: notifyUser || false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      console.log("Plan change response:", response.data);

      if (response.data.success) {
        fetchArtists();
        setPlanChangeModal({ isOpen: false, artist: null, newPlan: "" });
        setActionMenu(null);
        showToast(
          response.data.message ||
          `Plan changed to ${newPlan.toUpperCase()} successfully!`
        );

        if (notifyUser) {
          showToast("Notification email sent to artist");
        }

        const updatedArtistUser = response.data?.data?.artist?.user;
        if (updatedArtistUser && updatedArtistUser._id === user?._id) {
          updateUser({
            subscriptionPlan: updatedArtistUser.subscriptionPlan,
            subscriptionStatus: updatedArtistUser.subscriptionStatus,
          });
        }
      } else {
        showToast(
          response.data.message || "Failed to change plan",
          "error"
        );
      }
    } catch (err) {
      console.error("Change plan error:", err);

      // Detailed error logging
      if (err.response) {
        console.error("Error response:", err.response.data);
        console.error("Error status:", err.response.status);
        showToast(
          err.response.data?.message ||
          `Server error: ${err.response.status}`,
          "error"
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        showToast(
          "No response from server. Please check your connection.",
          "error"
        );
      } else {
        console.error("Error setting up request:", err.message);
        showToast("Request setup error: " + err.message, "error");
      }

      if (err.response?.status === 401) {
        handleUnauthorized();
      }
    } finally {
      setModalLoading(false);
    }
  };


  // Simple toggle for table (without modal)
  const toggleActive = async (id, currentStatus) => {
    if (currentStatus) {
      // For deactivation, open modal
      const artist = artists.find((a) => a._id === id);
      openDeactivateModal(artist);
    } else {
      // For activation, do simple toggle
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
          }
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

  const handleEdit = (artist) => {
    setEditingArtist(artist._id);
    setFormData({
      name: artist.name || "",
      genre: artist.genre || "",
      city: artist.city || "",
      biography: artist.biography || "",
      website: artist.website || "",
      phone: artist.phone || "",
      isActive: artist.isActive || false,
      subscriptionPlan: artist.user?.subscriptionPlan || "free",
    });
    setActionMenu(null);
  };

  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.data.success) {
        setEditingArtist(null);
        setFormData({});
        fetchArtists();
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
        "error"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingArtist(null);
    setFormData({});
  };

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const deleteArtist = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this artist profile? This action cannot be undone."
      )
    )
      return;
    try {
      const token = getCookie("token");

      if (!token) {
        showToast("No authentication token found", "error");
        handleUnauthorized();
        return;
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      fetchArtists();
      setActionMenu(null);
      showToast("Artist profile deleted successfully!");
    } catch (err) {
      console.error("Delete artist error:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      showToast("Failed to delete artist profile", "error");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPlanFilter("all");
    setPage(1);
  };

  const handleActionMenuToggle = (artistId) =>
    setActionMenu(actionMenu === artistId ? null : artistId);

  const handlePageChange = (newPage) => setPage(newPage);

  // Plan statistics
  const planStats = {
    pro: artists.filter(a => a.user?.subscriptionPlan === "pro").length,
    free: artists.filter(a => a.user?.subscriptionPlan === "free").length,
    total: artists.length,
  };

  useEffect(() => {
    fetchArtists();
  }, [page, statusFilter, planFilter]);

  const activeArtists = artists.filter((a) => a.isActive);
  const deactivatedArtists = artists.filter((a) => !a.isActive);

  const stats = {
    total: artists.length,
    active: activeArtists.length,
    inactive: deactivatedArtists.length,
    thisMonth: Math.floor(artists.length * 0.15),
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Toaster />

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Music className="w-6 h-6 text-white" />
                </div>
                Artist Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage artist profiles, subscription plans, activate/deactivate accounts
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {/* Tabs for All Artists and Deactivated Artists */}
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Artists
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "deactivated"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <StatCard
              icon={User}
              label="Total Artists"
              value={stats.total}
              change={12}
              color="purple"
            />
            <StatCard
              icon={Play}
              label="Active Artists"
              value={stats.active}
              change={8}
              color="green"
            />
            <StatCard
              icon={Pause}
              label="Inactive Artists"
              value={stats.inactive}
              change={-4}
              color="orange"
            />
            <StatCard
              icon={Crown}
              label="Pro Plan"
              value={planStats.pro}
              change={5}
              color="yellow"
              plan="pro"
            />
            <StatCard
              icon={Users}
              label="Free Plan"
              value={planStats.free}
              change={-2}
              color="blue"
              plan="free"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={stats.thisMonth}
              change={15}
              color="indigo"
            />
          </div>

          {activeTab === "all" ? (
            <>
              <Filters
                search={search}
                statusFilter={statusFilter}
                planFilter={planFilter}
                onSearchChange={setSearch}
                onStatusFilterChange={setStatusFilter}
                onPlanFilterChange={setPlanFilter}
                onApply={fetchArtists}
                onClear={clearFilters}
              />

              <ArtistTable
                artists={artists}
                loading={loading}
                page={page}
                pages={pages}
                editingArtist={editingArtist}
                formData={formData}
                saveLoading={saveLoading}
                actionMenu={actionMenu}
                onPageChange={handlePageChange}
                onViewProfile={handleViewProfile}
                onToggleActive={toggleActive}
                onOpenDeactivateModal={openDeactivateModal}
                onOpenPlanChangeModal={openPlanChangeModal}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onInputChange={handleInputChange}
                onDeleteArtist={deleteArtist}
                onActionMenuToggle={handleActionMenuToggle}
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

          {/* Modals */}
          <DeactivateModal
            artist={deactivateModal.artist}
            isOpen={deactivateModal.isOpen}
            onClose={() => setDeactivateModal({ isOpen: false, artist: null })}
            onConfirm={handleDeactivateConfirm}
            loading={modalLoading}
          />

          <ActivateModal
            artist={activateModal.artist}
            isOpen={activateModal.isOpen}
            onClose={() => setActivateModal({ isOpen: false, artist: null })}
            onConfirm={handleActivateConfirm}
            loading={modalLoading}
          />

          {/* Plan Change Modal */}
          {planChangeModal.isOpen && planChangeModal.artist && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Subscription Plan
                </h3>
                <p className="text-gray-600 mb-4">
                  Change <span className="font-semibold">{planChangeModal.artist.name}</span>'s plan from{" "}
                  <span className={`font-semibold ${planChangeModal.artist.user?.subscriptionPlan === "pro" ? "text-yellow-600" : "text-blue-600"}`}>
                    {planChangeModal.artist.user?.subscriptionPlan?.toUpperCase() || "FREE"}
                  </span> to{" "}
                  <span className={`font-semibold ${planChangeModal.newPlan === "pro" ? "text-yellow-600" : "text-blue-600"}`}>
                    {planChangeModal.newPlan.toUpperCase()}
                  </span>
                </p>

                <div className="mb-4">
                  <label className="flex items-center mb-2">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Notify user via email</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setPlanChangeModal({ isOpen: false, artist: null, newPlan: "" })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePlanChangeConfirm(
                      planChangeModal.artist._id,
                      planChangeModal.newPlan,
                      true
                    )}
                    disabled={modalLoading}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${planChangeModal.newPlan === "pro"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    {modalLoading ? "Changing..." : `Change to ${planChangeModal.newPlan.toUpperCase()}`}
                  </button>
                </div>
              </div>
            </div>
          )}

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