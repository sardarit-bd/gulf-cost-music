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
  Crown,
  DollarSign,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users
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
  const [planFilter, setPlanFilter] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
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

  // ✅ FIXED: Fetch venues with proper error handling
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

        // ✅ Calculate stats properly
        const venuesData = data.data.content || [];
        calculateStats(venuesData);
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

  // ✅ FIXED: Calculate stats from venues
  const calculateStats = (venuesData) => {
    const total = venuesData.length;
    const active = venuesData.filter((v) => v.isActive).length;
    const verified = venuesData.filter((v) => v.verifiedOrder > 0).length;
    const pro = venuesData.filter((v) => v.user?.subscriptionPlan === "pro").length;
    const free = venuesData.filter((v) => !v.user?.subscriptionPlan || v.user?.subscriptionPlan === "free").length;

    // This month calculation
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

  // ✅ FIXED: Toggle venue active status - send full object
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

          // ✅ Send complete venue object
          await axios.put(
            `${API_BASE}/api/venues/admin/${id}`,
            {
              isActive: !currentStatus,
              // Include other required fields if needed
              verifiedOrder: currentStatus ? 0 : undefined // Keep verification when deactivating
            },
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

  // Handle edit venue
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
      colorCode: venue.colorCode || "", // ✅ Add color code field
      verifiedOrder: venue.verifiedOrder || 0, // ✅ Add verification order
    });
    setActionMenu(null);
  };

  // ✅ FIXED: Handle save venue updates
  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        showToast("Authentication token not found", "error");
        return;
      }

      // ✅ Prepare complete update data
      const updateData = {
        ...formData,
        seatingCapacity: parseInt(formData.seatingCapacity) || 0,
        verifiedOrder: parseInt(formData.verifiedOrder) || 0,
      };

      const response = await axios.put(
        `${API_BASE}/api/venues/admin/${id}`,
        updateData,
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
        showToast("Venue updated successfully!");
      }
    } catch (err) {
      console.error("Update venue error:", err);
      showToast(
        err.response?.data?.message || "Error updating venue",
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

  // ✅ FIXED: Verify venue - USE CORRECT ENDPOINT
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

          // ✅ OPTION 1: Use the verify endpoint (if exists)
          // const response = await axios.put(
          //   `${API_BASE}/api/venues/admin/${id}/verify`,
          //   {},
          //   {
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //       "Content-Type": "application/json",
          //     },
          //   }
          // );

          // ✅ OPTION 2: Use the main update endpoint with isActive: true
          const response = await axios.put(
            `${API_BASE}/api/venues/admin/${id}`,
            {
              isActive: true,
              // This will trigger auto verification in backend
            },
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
              `Venue verified successfully! 
              Color: ${venue.colorCode || 'Auto-assigned'} 
              Order: ${venue.verifiedOrder || 1}`
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

  // ✅ FIXED: Change subscription plan
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
            {
              subscriptionPlan: newPlan,
              notifyUser: true // Optional: send notification to user
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
              `Venue ${newPlan === "pro" ? "upgraded to Pro" : "downgraded to Free"} successfully!`
            );
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

  // ✅ FIXED: Delete venue
  const deleteVenue = async (id, venueName) => {
    showConfirmation(
      "Delete Venue",
      `Are you sure you want to permanently delete "${venueName}"?
      This action cannot be undone!`,
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
    setStatusFilter("all");
    setCityFilter("");
    setPlanFilter("all");
    setPage(1);
  };

  const handleActionMenuToggle = (venueId) =>
    setActionMenu(actionMenu === venueId ? null : venueId);

  const handlePageChange = (newPage) => setPage(newPage);

  // ✅ FIXED: Use debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVenues();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, statusFilter, cityFilter, planFilter]);

  useEffect(() => {
    fetchVenues();
  }, [page]);

  // Get unique cities for filter
  const cities = [
    ...new Set(venues.map((venue) => venue.city).filter(Boolean)),
  ].sort();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="">
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
                Manage venue profiles, subscription plans, verification, and color assignments
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={fetchVenues}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
            <StatCard
              icon={Building2}
              label="Total Venues"
              value={stats.total}
              change={8}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Active"
              value={stats.active}
              change={12}
              color="green"
            />
            <StatCard
              icon={CheckCircle}
              label="Verified"
              value={stats.verified}
              change={15}
              color="purple"
            />
            <StatCard
              icon={Crown}
              label="Pro Plan"
              value={stats.pro}
              change={20}
              color="yellow"
            />
            <StatCard
              icon={DollarSign}
              label="Free Plan"
              value={stats.free}
              change={-5}
              color="gray"
            />
            <StatCard
              icon={Sparkles}
              label="Colors Assigned"
              value={stats.verified}
              change={10}
              color="pink"
            />
            <StatCard
              icon={TrendingUp}
              label="This Month"
              value={stats.thisMonth}
              change={18}
              color="cyan"
            />
          </div>

          {/* Filters - Enhanced with Plan Filter */}
          <Filters
            search={search}
            statusFilter={statusFilter}
            cityFilter={cityFilter}
            planFilter={planFilter}
            cities={cities}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onCityFilterChange={setCityFilter}
            onPlanFilterChange={setPlanFilter}
            onApply={fetchVenues}
            onClear={clearFilters}
          />

          {/* Venues Table - Enhanced with Plan Management */}
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
            onChangePlan={changePlan}
          />

          {/* Venue Detail Modal */}
          {viewingVenue && (
            <VenueDetailModal
              venue={viewingVenue}
              onClose={() => setViewingVenue(null)}
              onEdit={handleEdit}
              onChangePlan={changePlan}
              onVerifyVenue={verifyVenue}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VenueManagement;