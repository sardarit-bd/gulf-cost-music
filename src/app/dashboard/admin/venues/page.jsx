"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Building2, 
  Eye, 
  Power, 
  Trash2, 
  MapPin, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  User,
  Mail,
  Calendar,
  Download,
  RefreshCw,
  Users,
  Star,
  TrendingUp,
  Phone,
  Globe,
  Save,
  X,
  XCircle,
  Clock,
  CalendarDays,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";

// Toast notification component
const Toast = ({ message, type = "success", onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-right-8 duration-300`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText = "Cancel",
  type = "warning" 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${getButtonColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
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
  const [toast, setToast] = useState(null);
  const [viewingVenue, setViewingVenue] = useState(null);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null
  });

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=venues`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(cityFilter && { city: cityFilter })
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

  // View Venue Function with Modal
  const handleViewVenue = (venue) => {
    setViewingVenue(venue);
  };

  // Toggle Active/Inactive Function with Confirmation Modal
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
          const token = localStorage.getItem("token");
          await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`,
            { isActive: !currentStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchVenues();
          setActionMenu(null);
          showToast(`Venue ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        } catch (err) {
          console.error("Toggle venue error:", err);
          showToast("Failed to update venue status", "error");
        }
      }
    );
  };

  // Edit Venue Function
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
      isActive: venue.isActive || false
    });
    setActionMenu(null);
  };

  // Save Edited Venue - Admin route ব্যবহার করে
  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
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
      if (err.response?.data?.message) {
        showToast(`Error: ${err.response.data.message}`, "error");
      } else {
        showToast('Error updating venue profile', "error");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingVenue(null);
    setFormData({});
  };

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete Venue with Confirmation Modal
  const deleteVenue = async (id, venueName) => {
    showConfirmation(
      "Delete Venue",
      `Are you sure you want to delete "${venueName}"? This action cannot be undone and all venue data will be permanently lost.`,
      "Delete Venue",
      "danger",
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/admin/${id}`, 
            {
              headers: { Authorization: `Bearer ${token}` },
            }
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

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCityFilter("");
    setPage(1);
  };

  useEffect(() => {
    fetchVenues();
  }, [page, statusFilter, cityFilter]);

  // Extract unique cities for filter
  const cities = [...new Set(venues.map(venue => venue.city).filter(Boolean))];

  const getCapacityColor = (capacity) => {
    if (capacity > 1000) return "bg-purple-100 text-purple-800 border-purple-200";
    if (capacity > 500) return "bg-blue-100 text-blue-800 border-blue-200";
    if (capacity > 200) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Venue Detail Modal Component
  const VenueDetailModal = ({ venue, onClose }) => {
    if (!venue) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Venue Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{venue.venueName}</h4>
                  <p className="text-gray-600 flex items-center mt-1">
                    <User className="w-4 h-4 mr-2" />
                    {venue.user?.username}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {venue.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Location:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {venue.city || "Not specified"}
                    </p>
                    {venue.address && (
                      <p className="text-gray-600 text-sm mt-1 ml-6">{venue.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Capacity:</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCapacityColor(venue.seatingCapacity)}`}>
                        <Users className="w-4 h-4 mr-1" />
                        {venue.seatingCapacity || "Not specified"} seats
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Status:</label>
                    <div className="mt-1">
                      {venue.isActive ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Operating Hours:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {venue.openHours || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Open Days:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      {venue.openDays || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Joined:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {venue.phone && (
                <div>
                  <label className="font-medium text-gray-700">Phone:</label>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {venue.phone}
                  </p>
                </div>
              )}

              {venue.website && (
                <div>
                  <label className="font-medium text-gray-700">Website:</label>
                  <p className="text-gray-600 mt-1">
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {venue.website}
                    </a>
                  </p>
                </div>
              )}

              {venue.biography && (
                <div>
                  <label className="font-medium text-gray-700">About:</label>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{venue.biography}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  handleEdit(venue);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit Venue
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Toast Notification */}
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}

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
                Manage venue profiles, activate/deactivate accounts, and monitor venue activities
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={Building2} 
              label="Total Venues" 
              value={venues.length} 
              change={8}
              color="blue"
            />
            <StatCard 
              icon={Users} 
              label="Active Venues" 
              value={venues.filter(v => v.isActive).length} 
              change={12}
              color="green"
            />
            <StatCard 
              icon={Power} 
              label="Inactive Venues" 
              value={venues.filter(v => !v.isActive).length} 
              change={-4}
              color="orange"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(venues.length * 0.18)} 
              change={18}
              color="purple"
            />
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Venues
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by venue name, city, or address..."
                    className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchVenues()}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 self-end">
                  <button
                    onClick={fetchVenues}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Apply</span>
                  </button>
                  {(search || statusFilter !== "all" || cityFilter) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Venues Table Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Venues ({venues.length})
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location & Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {venues.length > 0 ? (
                      venues.map((venue) => (
                        <tr 
                          key={venue._id} 
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                                <Building2 className="w-6 h-6" />
                              </div>
                              <div className="ml-4">
                                {editingVenue === venue._id ? (
                                  <input
                                    type="text"
                                    value={formData.venueName || ''}
                                    onChange={(e) => handleInputChange('venueName', e.target.value)}
                                    className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                    placeholder="Venue name"
                                  />
                                ) : (
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                                    {venue.venueName}
                                  </div>
                                )}
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {venue.user?.username}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {venue.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {editingVenue === venue._id ? (
                                <>
                                  <input
                                    type="text"
                                    value={formData.city || ''}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                    placeholder="City"
                                  />
                                  <input
                                    type="text"
                                    value={formData.address || ''}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                    placeholder="Address"
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>{venue.city || "Not specified"}</span>
                                  </div>
                                  {venue.address && (
                                    <div className="text-sm text-gray-500 ml-6">
                                      {venue.address}
                                    </div>
                                  )}
                                  {venue.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                      <span>{venue.phone}</span>
                                    </div>
                                  )}
                                  {venue.website && (
                                    <div className="flex items-center text-sm text-blue-600">
                                      <Globe className="w-3 h-3 mr-2" />
                                      <span className="truncate">Website</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {editingVenue === venue._id ? (
                                <>
                                  <input
                                    type="number"
                                    value={formData.seatingCapacity || ''}
                                    onChange={(e) => handleInputChange('seatingCapacity', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                    placeholder="Seating Capacity"
                                  />
                                  <input
                                    type="text"
                                    value={formData.openHours || ''}
                                    onChange={(e) => handleInputChange('openHours', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                    placeholder="Open Hours"
                                  />
                                </>
                              ) : (
                                <>
                                  {venue.seatingCapacity && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCapacityColor(venue.seatingCapacity)}`}>
                                      <Users className="w-3 h-3 mr-1" />
                                      {venue.seatingCapacity} capacity
                                    </span>
                                  )}
                                  {venue.openHours && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {venue.openHours}
                                    </div>
                                  )}
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : 'N/A'}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingVenue === venue._id ? (
                              <select
                                value={formData.isActive?.toString() || 'false'}
                                onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : venue.isActive ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              {editingVenue === venue._id ? (
                                <>
                                  <button
                                    onClick={() => handleSave(venue._id)}
                                    disabled={saveLoading}
                                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                                  >
                                    {saveLoading ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                    ) : (
                                      <Save className="w-3 h-3 mr-1" />
                                    )}
                                    {saveLoading ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    disabled={saveLoading}
                                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleViewVenue(venue)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="View Venue"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => toggleActive(venue._id, venue.isActive, venue.venueName)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      venue.isActive
                                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                    title={venue.isActive ? "Deactivate" : "Activate"}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>

                                  <div className="relative">
                                    <button
                                      onClick={() => setActionMenu(actionMenu === venue._id ? null : venue._id)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {actionMenu === venue._id && (
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button 
                                          onClick={() => handleEdit(venue)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Venue
                                        </button>
                                        <button
                                          onClick={() => deleteVenue(venue._id, venue.venueName)}
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete Venue
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No venues found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all" || cityFilter
                                ? "Try adjusting your search filters" 
                                : "No venues have been registered yet"
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {venues.length} venues on page {page} of {pages}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="text-gray-500 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>Previous</span>
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNumber
                              ? "bg-blue-600 text-white shadow-sm"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="text-gray-500 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>Next</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Venue Detail Modal */}
        {viewingVenue && (
          <VenueDetailModal 
            venue={viewingVenue} 
            onClose={() => setViewingVenue(null)} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    purple: "from-purple-500 to-pink-600",
  };

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↗" : "↘";

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

export default VenueManagement;