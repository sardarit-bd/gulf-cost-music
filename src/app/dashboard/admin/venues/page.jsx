"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/venues/ConfirmationModal";
import Filters from "@/components/modules/dashboard/venues/Filters";
import StatCard from "@/components/modules/dashboard/venues/StatCard";
import VenueDetailModal from "@/components/modules/dashboard/venues/VenueDetailModal";
import VenueTable from "@/components/modules/dashboard/venues/VenueTable";
import axios from "axios";
import {
  Building2,
  CheckCircle,
  Power,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Function to get cookie value by name
const getCookie = (name) => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingVenue, setViewingVenue] = useState(null);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null,
  });

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=venues`;

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  const showConfirmation = (title, message, confirmText, type, onConfirm) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");
      if (!token) {
        showToast("Authentication token not found", "error");
        return;
      }

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(cityFilter && { city: cityFilter }),
      });

      const { data } = await axios.get(`${API_URL}&${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVenues(data.data.content);
      setPages(data.data.pagination.pages);
    } catch (err) {
      console.error("Fetch venues error:", err);
      showToast("Failed to fetch venues", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVenue = (venue) => {
    setViewingVenue(venue);
  };

  const toggleActive = async (id, currentStatus, venueName) => {
    const action = currentStatus ? "deactivate" : "activate";

    showConfirmation(
      `${currentStatus ? "Deactivate" : "Activate"} Venue`,
      `Are you sure you want to ${action} "${venueName}"? ${
        currentStatus
          ? "This venue will no longer be visible to users."
          : "This venue will become visible to users."
      }`,
      currentStatus ? "Deactivate" : "Activate",
      currentStatus ? "warning" : "success",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            showToast("Authentication token not found", "error");
            return;
          }

          await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`,
            { isActive: !currentStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchVenues();
          setActionMenu(null);
          showToast(
            `Venue ${
              !currentStatus ? "activated" : "deactivated"
            } successfully!`
          );
        } catch (err) {
          console.error("Toggle venue error:", err);
          showToast("Failed to update venue status", "error");
        }
      }
    );
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue._id);
    setFormData({
      venueName: venue.venueName || "",
      city: venue.city || "",
      address: venue.address || "",
      seatingCapacity: venue.seatingCapacity || "",
      biography: venue.biography || "",
      openHours: venue.openHours || "",
      openDays: venue.openDays || "",
      phone: venue.phone || "",
      website: venue.website || "",
      isActive: venue.isActive || false,
    });
    setActionMenu(null);
  };

  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        showToast("Authentication token not found", "error");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setEditingVenue(null);
        setFormData({});
        fetchVenues();
        showToast("Venue profile updated successfully!");
      }
    } catch (err) {
      console.error("Update venue error:", err);
      showToast(
        err.response?.data?.message || "Error updating venue profile",
        "error"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingVenue(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const verifyVenue = async (id, venueName) => {
    showConfirmation(
      "Verify Venue",
      `Are you sure you want to verify "${venueName}"? This will assign a unique color to the venue and make it visible in the calendar with proper color coding.`,
      "Verify Venue",
      "success",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            showToast("Authentication token not found", "error");
            return;
          }

          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`,
            {
              isActive: true,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            fetchVenues();
            setActionMenu(null);
            showToast(
              `Venue "${venueName}" verified successfully with color ${response.data.data.venue.colorCode}!`
            );
          }
        } catch (err) {
          console.error("Verify venue error:", err);
          showToast("Failed to verify venue", "error");
        }
      }
    );
  };

  const deleteVenue = async (id, venueName) => {
    showConfirmation(
      "Delete Venue",
      `Are you sure you want to delete "${venueName}"? This action cannot be undone and all venue data will be permanently lost.`,
      "Delete Venue",
      "danger",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            showToast("Authentication token not found", "error");
            return;
          }

          await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchVenues();
          setActionMenu(null);
          showToast("Venue profile deleted successfully!");
        } catch (err) {
          console.error("Delete venue error:", err);
          showToast("Failed to delete venue profile", "error");
        }
      }
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCityFilter("");
    setPage(1);
  };

  const handleActionMenuToggle = (venueId) =>
    setActionMenu(actionMenu === venueId ? null : venueId);

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    fetchVenues();
  }, [page, statusFilter, cityFilter]);

  const cities = [
    ...new Set(venues.map((venue) => venue.city).filter(Boolean)),
  ];

  const stats = {
    total: venues.length,
    active: venues.filter((v) => v.isActive).length,
    inactive: venues.filter((v) => !v.isActive).length,
    verified: venues.filter((v) => v.verifiedOrder > 0).length,
    thisMonth: Math.floor(venues.length * 0.18),
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Toaster />

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={confirmationModal.isOpen}
            onClose={closeConfirmation}
            onConfirm={confirmationModal.onConfirm}
            title={confirmationModal.title}
            message={confirmationModal.message}
            confirmText={confirmationModal.confirmText}
            type={confirmationModal.type}
          />

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                Venue Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage venue profiles, activate/deactivate accounts, and monitor
                venue activities
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={fetchVenues}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              icon={Building2}
              label="Total Venues"
              value={stats.total}
              change={8}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Active Venues"
              value={stats.active}
              change={12}
              color="green"
            />
            <StatCard
              icon={CheckCircle}
              label="Verified Venues"
              value={stats.verified}
              change={15}
              color="purple"
            />
            <StatCard
              icon={Power}
              label="Inactive Venues"
              value={stats.inactive}
              change={-4}
              color="orange"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={stats.thisMonth}
              change={18}
              color="cyan"
            />
          </div>

          {/* Filters */}
          <Filters
            search={search}
            statusFilter={statusFilter}
            cityFilter={cityFilter}
            cities={cities}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onCityFilterChange={setCityFilter}
            onApply={fetchVenues}
            onClear={clearFilters}
          />

          {/* Venues Table */}
          <VenueTable
            venues={venues}
            loading={loading}
            page={page}
            pages={pages}
            editingVenue={editingVenue}
            formData={formData}
            saveLoading={saveLoading}
            actionMenu={actionMenu}
            onPageChange={handlePageChange}
            onViewVenue={handleViewVenue}
            onToggleActive={toggleActive}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
            onDeleteVenue={deleteVenue}
            onActionMenuToggle={handleActionMenuToggle}
            onVerifyVenue={verifyVenue}
          />

          {/* Venue Detail Modal */}
          {viewingVenue && (
            <VenueDetailModal
              venue={viewingVenue}
              onClose={() => setViewingVenue(null)}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VenueManagement;
