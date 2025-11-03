"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar, 
  Eye, 
  Power, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  User,
  MapPin,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  Music,
  Building2,
  Save,
  X,
  Users,
  Star
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import toast, { Toaster } from 'react-hot-toast';

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
        return <Power className="w-6 h-6 text-orange-500" />;
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-500" />;
      case "success":
        return <Power className="w-6 h-6 text-green-500" />;
      default:
        return <Power className="w-6 h-6 text-orange-500" />;
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

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "green":
        return "bg-green-50 text-green-600 border-green-200";
      case "orange":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "purple":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null
  });

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=events`;

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

  const fetchEvents = async () => {
    setLoading(true);
    try {
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

      setEvents(data.data.content);
      setPages(data.data.pagination.pages);
      toast.success('Events loaded successfully');
    } catch (err) {
      console.error("Fetch events error:", err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // View Event Function with Modal
  const handleViewEvent = (event) => {
    setViewingEvent(event);
  };

  // Toggle Active/Inactive Function with Confirmation
  const toggleActive = async (id, isActive, eventName) => {
    const action = isActive ? "deactivate" : "activate";
    
    showConfirmation(
      `${isActive ? "Deactivate" : "Activate"} Event`,
      `Are you sure you want to ${action} "${eventName}"? ${
        isActive 
          ? "This event will no longer be visible to users." 
          : "This event will become visible to users."
      }`,
      isActive ? "Deactivate" : "Activate",
      isActive ? "warning" : "success",
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/admin/${id}/toggle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchEvents();
          setActionMenu(null);
          toast.success(`Event ${!isActive ? 'activated' : 'deactivated'} successfully!`);
        } catch (err) {
          console.error("Toggle event error:", err);
          toast.error("Failed to update event status");
        }
      }
    );
  };

  // Edit Event Function
  const handleEdit = (event) => {
    setEditingEvent(event._id);
    setFormData({
      artistBandName: event.artistBandName || "",
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
      time: event.time || "",
      description: event.description || "",
      city: event.city || "",
      isActive: event.isActive || false
    });
    setActionMenu(null);
  };

  // Save Edited Event - Admin route ব্যবহার করে
  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/admin/${id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setEditingEvent(null);
        setFormData({});
        fetchEvents();
        toast.success("Event updated successfully!");
      }
    } catch (err) {
      console.error("Update event error:", err);
      if (err.response?.data?.message) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error('Error updating event');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingEvent(null);
    setFormData({});
  };

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete Event with Confirmation Modal
  const deleteEvent = async (id, eventName) => {
    showConfirmation(
      "Delete Event",
      `Are you sure you want to delete "${eventName}"? This action cannot be undone and all event data will be permanently lost.`,
      "Delete Event",
      "danger",
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/admin/${id}`, 
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchEvents();
          setActionMenu(null);
          toast.success("Event deleted successfully!");
        } catch (err) {
          console.error("Delete event error:", err);
          toast.error("Failed to delete event");
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
    fetchEvents();
  }, [page, statusFilter, cityFilter]);

  // Extract unique cities for filter
  const cities = [...new Set(events.map(event => event.city).filter(Boolean))];

  const getStatusColor = (date, isActive) => {
    if (!isActive) {
      return "bg-gray-100 text-gray-800 border-gray-200"; // Inactive
    }
    
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return "bg-red-100 text-red-800 border-red-200"; // Past event
    } else if (eventDate.getTime() === today.getTime()) {
      return "bg-orange-100 text-orange-800 border-orange-200"; // Today
    } else {
      return "bg-green-100 text-green-800 border-green-200"; // Upcoming
    }
  };

  const getStatusText = (date, isActive) => {
    if (!isActive) return "Inactive";
    
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return "Completed";
    } else if (eventDate.getTime() === today.getTime()) {
      return "Today";
    } else {
      return "Upcoming";
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Event Detail Modal Component
  const EventDetailModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <Music className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{event.artistBandName}</h4>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Building2 className="w-4 h-4 mr-2" />
                    {event.venue?.venueName || "Venue not specified"}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.city ? event.city.charAt(0).toUpperCase() + event.city.slice(1) : "Location not specified"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Date & Time:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date ? new Date(event.date).toLocaleDateString() : 'Not specified'}
                    </p>
                    <p className="text-gray-600 mt-1 flex items-center ml-6">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time || "Time not specified"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Status:</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.date, event.isActive)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          !event.isActive ? "bg-gray-500" :
                          new Date(event.date) < new Date() ? "bg-red-500" :
                          new Date(event.date).toDateString() === new Date().toDateString() ? "bg-orange-500" : "bg-green-500"
                        }`}></div>
                        {getStatusText(event.date, event.isActive)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Venue Details:</label>
                    <p className="text-gray-600 mt-1">{event.venue?.venueName || "Not specified"}</p>
                    {event.venue?.address && (
                      <p className="text-gray-500 text-sm mt-1">{event.venue.address}</p>
                    )}
                    {event.venue?.seatingCapacity && (
                      <p className="text-gray-500 text-sm mt-1 flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        Capacity: {event.venue.seatingCapacity}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Created:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {event.description && (
                <div>
                  <label className="font-medium text-gray-700">Description:</label>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}

              {event.venue?.openHours && (
                <div>
                  <label className="font-medium text-gray-700">Venue Hours:</label>
                  <p className="text-gray-600 mt-1">{event.venue.openHours}</p>
                </div>
              )}

              {event.venue?.openDays && (
                <div>
                  <label className="font-medium text-gray-700">Open Days:</label>
                  <p className="text-gray-600 mt-1">{event.venue.openDays}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  handleEdit(event);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit Event
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
          {/* React Hot Toast */}
          <Toaster/>

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

          {/* Event Detail Modal */}
          {viewingEvent && (
            <EventDetailModal 
              event={viewingEvent} 
              onClose={() => setViewingEvent(null)} 
            />
          )}

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Event Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage events, activate/deactivate listings, and monitor event activities
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button 
                onClick={fetchEvents}
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
              icon={Calendar} 
              label="Total Events" 
              value={events.length} 
              change={12}
              color="blue"
            />
            <StatCard 
              icon={Music} 
              label="Active Events" 
              value={events.filter(e => e.isActive).length} 
              change={8}
              color="green"
            />
            <StatCard 
              icon={Power} 
              label="Inactive Events" 
              value={events.filter(e => !e.isActive).length} 
              change={-4}
              color="orange"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(events.length * 0.20)} 
              change={20}
              color="purple"
            />
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Events
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by artist, venue, or description..."
                    className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchEvents()}
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
                      <option key={city} value={city}>
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 self-end">
                  <button
                    onClick={fetchEvents}
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

          {/* Events Table Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Events ({events.length})
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
                        Event
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue & Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
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
                    {events.length > 0 ? (
                      events.map((event) => (
                        <tr 
                          key={event._id} 
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                <Music className="w-6 h-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                {editingEvent === event._id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={formData.artistBandName || ''}
                                      onChange={(e) => handleInputChange('artistBandName', e.target.value)}
                                      className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                      placeholder="Artist/Band Name"
                                    />
                                    <textarea
                                      value={formData.description || ''}
                                      onChange={(e) => handleInputChange('description', e.target.value)}
                                      className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                      placeholder="Event description"
                                      rows="2"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 line-clamp-2">
                                      {event.artistBandName || "Untitled Event"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {truncateText(event.description, 80)}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{event.venue?.venueName || "Venue not specified"}</span>
                              </div>
                              {editingEvent === event._id ? (
                                <input
                                  type="text"
                                  value={formData.city || ''}
                                  onChange={(e) => handleInputChange('city', e.target.value)}
                                  className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                  placeholder="City"
                                />
                              ) : event.city && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {event.city}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {editingEvent === event._id ? (
                                <div className="space-y-2">
                                  <input
                                    type="date"
                                    value={formData.date || ''}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                  />
                                  <input
                                    type="time"
                                    value={formData.time || ''}
                                    onChange={(e) => handleInputChange('time', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                  />
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    {event.date ? new Date(event.date).toLocaleDateString() : 'Not set'}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-400">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {event.time || "Time not set"}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingEvent === event._id ? (
                              <select
                                value={formData.isActive?.toString() || 'false'}
                                onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.date, event.isActive)}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  !event.isActive ? "bg-gray-500" :
                                  new Date(event.date) < new Date() ? "bg-red-500" :
                                  new Date(event.date).toDateString() === new Date().toDateString() ? "bg-orange-500" : "bg-green-500"
                                }`}></div>
                                {getStatusText(event.date, event.isActive)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              {editingEvent === event._id ? (
                                <>
                                  <button
                                    onClick={() => handleSave(event._id)}
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
                                    onClick={() => handleViewEvent(event)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="View Event"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => toggleActive(event._id, event.isActive, event.artistBandName)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      event.isActive
                                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                    title={event.isActive ? "Deactivate" : "Activate"}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>

                                  <div className="relative">
                                    <button
                                      onClick={() => setActionMenu(actionMenu === event._id ? null : event._id)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {actionMenu === event._id && (
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button 
                                          onClick={() => handleEdit(event)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Event
                                        </button>
                                        <button
                                          onClick={() => deleteEvent(event._id, event.artistBandName)}
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete Event
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
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No events found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all" || cityFilter
                                ? "Try adjusting your search filters" 
                                : "No events have been created yet"
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
                    Showing {events.length} events on page {page} of {pages}
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
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            page === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 border border-gray-300 hover:bg-gray-50'
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
      </div>
    </AdminLayout>
  );
};

export default EventManagement;