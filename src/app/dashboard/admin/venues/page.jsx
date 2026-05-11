"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/venues/ConfirmationModal";
import Filters from "@/components/modules/dashboard/venues/Filters";
import StatCard from "@/components/modules/dashboard/venues/StatCard";
import VenueDetailModal from "@/components/modules/dashboard/venues/VenueDetailModal";
import VenueEditModal from "@/components/modules/dashboard/venues/VenueEditModal";
import VenueTable from "@/components/modules/dashboard/venues/VenueTable";
import CustomLoader from "@/components/shared/loader/Loader";
import axios from "axios";
import {
  Building2,
  CheckCircle,
  Crown,
  DollarSign,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X
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
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);

  // Edit Modal State
  const [editingVenue, setEditingVenue] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Original edit state for inline editing (keeping for compatibility)
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);

  const [viewingVenue, setViewingVenue] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    pro: 0,
    free: 0,
    thisMonth: 0,
  });

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

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

  // Fetch venues
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
        ...(planFilter !== "all" && { plan: planFilter }),
      });

      const { data } = await axios.get(
        `${API_BASE}/api/venues/admin/venues?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setVenues(data.data.content || []);
        setPages(data.data.pagination?.pages || 1);
        calculateStats(data.data.content || []);
      }
    } catch (err) {
      console.error("Fetch venues error:", err);
      showToast(
        err.response?.data?.message || "Failed to fetch venues",
        "error"
      );
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (venuesData) => {
    const total = venuesData.length;
    const active = venuesData.filter((v) => v.isActive).length;
    const verified = venuesData.filter((v) => v.verifiedOrder > 0).length;
    const pro = venuesData.filter((v) => v.user?.subscriptionPlan === "pro").length;
    const free = venuesData.filter((v) => !v.user?.subscriptionPlan || v.user?.subscriptionPlan === "free").length;

    const thisMonth = venuesData.filter((v) => {
      if (!v.createdAt) return false;
      const created = new Date(v.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    setStats({
      total,
      active,
      inactive: total - active,
      verified,
      pro,
      free,
      thisMonth,
    });
  };

  const handleViewVenue = (venue) => {
    setViewingVenue(venue);
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    setShowEditModal(true);
    setActionMenu(null);
  };

  // Toggle venue active status
  const toggleActive = async (id, currentStatus, venueName) => {
    const action = currentStatus ? "deactivate" : "activate";

    showConfirmation(
      `${currentStatus ? "Deactivate" : "Activate"} Venue`,
      `Are you sure you want to ${action} "${venueName}"? ${currentStatus
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
            `${API_BASE}/api/venues/admin/${id}`,
            { isActive: !currentStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          fetchVenues();
          setActionMenu(null);
          showToast(
            `Venue ${!currentStatus ? "activated" : "deactivated"} successfully!`
          );
        } catch (err) {
          console.error("Toggle venue error:", err);
          showToast(
            err.response?.data?.message || "Failed to update venue status",
            "error"
          );
        }
      }
    );
  };

  // Verify venue
  const verifyVenue = async (id, venueName) => {
    showConfirmation(
      "Verify Venue",
      `Are you sure you want to verify "${venueName}"? 
      This will:
      1. Activate the venue
      2. Assign a unique color code
      3. Make it visible in calendar
      4. Assign verification order number`,
      "Verify & Assign Color",
      "success",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            showToast("Authentication token not found", "error");
            return;
          }

          const response = await axios.put(
            `${API_BASE}/api/venues/admin/${id}`,
            { isActive: true },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            const venue = response.data.data.venue;
            fetchVenues();
            setActionMenu(null);
            showToast(
              `Venue verified successfully! Color: ${venue.colorCode || 'Auto-assigned'}`
            );
          }
        } catch (err) {
          console.error("Verify venue error:", err);
          showToast(
            err.response?.data?.message || "Failed to verify venue",
            "error"
          );
        }
      }
    );
  };

  // Change subscription plan
  const changePlan = async (id, venueName, currentPlan, newPlan) => {
    showConfirmation(
      `${newPlan === "pro" ? "Upgrade to Pro" : "Downgrade to Free"}`,
      `Are you sure you want to ${newPlan === "pro" ? "upgrade" : "downgrade"} "${venueName}" to ${newPlan} plan?`,
      newPlan === "pro" ? "Upgrade to Pro" : "Downgrade to Free",
      newPlan === "pro" ? "success" : "warning",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            showToast("Authentication token not found", "error");
            return;
          }

          const response = await axios.put(
            `${API_BASE}/api/venues/admin/${id}/plan`,
            { subscriptionPlan: newPlan, notifyUser: true },
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
            showToast(`Venue ${newPlan === "pro" ? "upgraded to Pro" : "downgraded to Free"} successfully!`);
          }
        } catch (err) {
          console.error("Change plan error:", err);
          showToast(
            err.response?.data?.message || "Failed to change plan",
            "error"
          );
        }
      }
    );
  };

  // Delete venue
  const deleteVenue = async (id, venueName) => {
    showConfirmation(
      "Delete Venue",
      `Are you sure you want to permanently delete "${venueName}"? This action cannot be undone!`,
      "Delete Permanently",
      "danger",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            showToast("Authentication token not found", "error");
            return;
          }

          await axios.delete(
            `${API_BASE}/api/venues/admin/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchVenues();
          setActionMenu(null);
          showToast("Venue deleted successfully!");
        } catch (err) {
          console.error("Delete venue error:", err);
          showToast(
            err.response?.data?.message || "Failed to delete venue",
            "error"
          );
        }
      }
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setStatusFilter("all");
    setCityFilter("");
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

  const handleActionMenuToggle = (venueId) =>
    setActionMenu(actionMenu === venueId ? null : venueId);

  const handlePageChange = (newPage) => setPage(newPage);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== searchInput) {
        fetchVenues();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, searchInput]);

  useEffect(() => {
    fetchVenues();
  }, [page, statusFilter, cityFilter, planFilter]);

  // Get unique cities for filter
  const cities = [
    ...new Set(venues.map((venue) => venue.city).filter(Boolean)),
  ].sort();

  const hasActiveFilters = search || statusFilter !== "all" || cityFilter !== "" || planFilter !== "all";

  if (loading && venues.length === 0) {
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
          <Toaster position="top-right" />

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

          {/* Header - Matching Events Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                Venue Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage venue profiles, subscription plans, verification, and color assignments
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 lg:mt-0">
              <button
                onClick={fetchVenues}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards - Matching Events Page Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <StatCard
              icon={Building2}
              label="Total Venues"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Active"
              value={stats.active}
              color="green"
            />
            <StatCard
              icon={CheckCircle}
              label="Verified"
              value={stats.verified}
              color="purple"
            />
            <StatCard
              icon={Crown}
              label="Pro Plan"
              value={stats.pro}
              color="yellow"
            />
            <StatCard
              icon={DollarSign}
              label="Free Plan"
              value={stats.free}
              color="gray"
            />
            <StatCard
              icon={Sparkles}
              label="Colors Assigned"
              value={stats.verified}
              color="pink"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={stats.thisMonth}
              color="cyan"
            />
          </div>

          {/* Venues Table with Search inside */}
          <VenueTable
            venues={venues}
            loading={loading}
            page={page}
            pages={pages}
            editingVenue={editingVenueId}
            formData={formData}
            saveLoading={saveLoading}
            actionMenu={actionMenu}
            onPageChange={handlePageChange}
            onViewVenue={handleViewVenue}
            onToggleActive={toggleActive}
            onEdit={handleEditVenue}
            onSave={() => { }}
            onCancel={() => setEditingVenueId(null)}
            onInputChange={() => { }}
            onDeleteVenue={deleteVenue}
            onActionMenuToggle={handleActionMenuToggle}
            onVerifyVenue={verifyVenue}
            onChangePlan={changePlan}
            // Search props
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            activeSearchTerm={search}
            statusFilter={statusFilter}
            planFilter={planFilter}
            cityFilter={cityFilter}
            cities={cities}
            onStatusFilterChange={setStatusFilter}
            onPlanFilterChange={setPlanFilter}
            onCityFilterChange={setCityFilter}
          />

          {/* Venue Detail Modal */}
          {viewingVenue && (
            <VenueDetailModal
              venue={viewingVenue}
              onClose={() => setViewingVenue(null)}
              onEdit={handleEditVenue}
              onChangePlan={changePlan}
              onVerifyVenue={verifyVenue}
            />
          )}

          {/* Venue Edit Modal */}
          {showEditModal && editingVenue && (
            <VenueEditModal
              venue={editingVenue}
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingVenue(null);
              }}
              onVenueUpdated={fetchVenues}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VenueManagement;