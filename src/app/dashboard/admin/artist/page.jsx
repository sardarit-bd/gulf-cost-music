"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ActivateModal from "@/components/modules/dashboard/artists/ActivateModal";
import ArtistDetailModal from "@/components/modules/dashboard/artists/ArtistDetailModal";
import ArtistTable from "@/components/modules/dashboard/artists/ArtistTable";
import DeactivatedUsers from "@/components/modules/dashboard/artists/DeactivatedUsers";
import DeactivateModal from "@/components/modules/dashboard/artists/DeactivateModal";
import Filters from "@/components/modules/dashboard/artists/Filters";
import StatCard from "@/components/modules/dashboard/artists/StatCard";
import axios from "axios";
import {
  Music,
  Pause,
  Play,
  TrendingUp,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [deactivatedSearch, setDeactivatedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingArtist, setViewingArtist] = useState(null);

  // Modal states
  const [deactivateModal, setDeactivateModal] = useState({ isOpen: false, artist: null });
  const [activateModal, setActivateModal] = useState({ isOpen: false, artist: null });
  const [modalLoading, setModalLoading] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=artists`;

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const { data } = await axios.get(`${API_URL}&${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtists(data.data.content);
      setPages(data.data.pagination.pages);
    } catch (err) {
      console.error("Fetch artists error:", err);
      showToast("Failed to fetch artists", "error");
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

  // Handle Deactivate Confirmation
  const handleDeactivateConfirm = async (id, currentStatus, reason, notifyUser) => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        {
          isActive: false,
          deactivationReason: reason,
          notifyUser
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      showToast("Failed to deactivate artist", "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Activate Confirmation
  const handleActivateConfirm = async (id, notifyUser) => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        {
          isActive: true,
          notifyUser
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchArtists();
      setActivateModal({ isOpen: false, artist: null });
      showToast("Artist activated successfully!");

      if (notifyUser) {
        showToast("Notification email sent to artist");
      }
    } catch (err) {
      console.error("Activate artist error:", err);
      showToast("Failed to activate artist", "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Simple toggle for table (without modal)
  const toggleActive = async (id, currentStatus) => {
    if (currentStatus) {
      // For deactivation, open modal
      const artist = artists.find(a => a._id === id);
      openDeactivateModal(artist);
    } else {
      // For activation, do simple toggle
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
          { isActive: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchArtists();
        setActionMenu(null);
        showToast("Artist activated successfully!");
      } catch (err) {
        console.error("Toggle artist error:", err);
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
      bio: artist.bio || "",
      website: artist.website || "",
      phone: artist.phone || "",
      isActive: artist.isActive || false,
    });
    setActionMenu(null);
  };

  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchArtists();
      setActionMenu(null);
      showToast("Artist profile deleted successfully!");
    } catch (err) {
      console.error("Delete artist error:", err);
      showToast("Failed to delete artist profile", "error");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleActionMenuToggle = (artistId) =>
    setActionMenu(actionMenu === artistId ? null : artistId);

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    fetchArtists();
  }, [page, statusFilter]);

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
                Manage artist profiles, activate/deactivate accounts, and monitor artist activities
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={User} label="Total Artists" value={stats.total} change={12} color="purple" />
            <StatCard icon={Play} label="Active Artists" value={stats.active} change={8} color="green" />
            <StatCard icon={Pause} label="Inactive Artists" value={stats.inactive} change={-4} color="orange" />
            <StatCard icon={TrendingUp} label="This Month" value={stats.thisMonth} change={15} color="blue" />
          </div>

          {activeTab === "all" ? (
            <>
              <Filters
                search={search}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onStatusFilterChange={setStatusFilter}
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

          {viewingArtist && (
            <ArtistDetailModal
              artist={viewingArtist}
              onClose={() => setViewingArtist(null)}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArtistManagement;