"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  Eye,
  Filter,
  MapPin,
  Music,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  type = "danger",
}) => {
  if (!isOpen) return null;

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
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
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
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

// Event Detail Modal Component
const EventDetailModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isToday = eventDate.toDateString() === new Date().toDateString();

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
            {/* Header */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                <Music className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">
                  {event.artistBandName}
                </h4>
                <div className="flex items-center space-x-2 mt-2">
                  {isToday && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Today
                    </span>
                  )}
                  {isUpcoming && !isToday && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Upcoming
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${event.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">
                    Date & Time:
                  </label>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600 mt-1 flex items-center ml-6">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </p>
                </div>

                <div>
                  <label className="font-medium text-gray-700">Venue:</label>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    {event.venue?.venueName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Location:</label>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="capitalize">{event.city}</span>
                  </p>
                  {event.venue?.address && (
                    <p className="text-gray-600 text-sm mt-1 ml-6">
                      {event.venue.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-medium text-gray-700">Capacity:</label>
                  <p className="text-gray-600 mt-1">
                    {event.venue?.seatingCapacity || "Not specified"} seats
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <label className="font-medium text-gray-700">
                  Description:
                </label>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Created Info */}
            <div className="border-t pt-4">
              <p className="text-gray-500 text-sm">
                Created: {new Date(event.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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

// Event Row Component - UPDATED
const EventRow = ({ event, onToggleStatus, onDeleteEvent }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isEventExpired = eventDate < new Date(); // Check if event date has passed

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteEvent(event._id, event.artistBandName);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleViewClick = () => {
    setShowDetailModal(true);
  };

  const handleToggleStatus = () => {
    if (!isEventExpired) {
      onToggleStatus(event._id, event.isActive, event.artistBandName);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors group">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
              <Music className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                {event.artistBandName}
              </div>
              {event.description && (
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {event.description}
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              {event.venue?.venueName || "N/A"}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-3 h-3 mr-2 text-gray-400" />
              <span className="capitalize">{event.city}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {eventDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {isToday && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Today
                </span>
              )}
              {isUpcoming && !isToday && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Upcoming
                </span>
              )}
              {isEventExpired && !isToday && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  Past
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-3 h-3 mr-2 text-gray-400" />
              {event.time}
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <button
            onClick={handleToggleStatus}
            disabled={isEventExpired}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${event.isActive
              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
              : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
              } ${isEventExpired
                ? "opacity-50 cursor-not-allowed hover:bg-gray-100 hover:text-gray-800"
                : "cursor-pointer"
              }`}
            title={
              isEventExpired
                ? "Cannot modify status of past events"
                : event.isActive
                  ? "Deactivate event"
                  : "Activate event"
            }
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${event.isActive ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            {event.isActive ? "Active" : "Inactive"}
            {isEventExpired && (
              <span className="ml-2 text-xs text-gray-500">(Expired)</span>
            )}
          </button>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end items-center space-x-2">
            {/* View Button */}
            <button
              onClick={handleViewClick}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="View Event Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Delete Button - WITH CONFIRMATION MODAL */}
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.artistBandName}"? This action cannot be undone and all event data will be permanently lost.`}
        confirmText="Delete Event"
        type="danger"
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        event={event}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};

// Main AdminEventsPage Component
const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(city !== "all" && { city }),
        ...(status !== "all" && { status }),
      });

      const res = await axios.get(
        `${API_BASE}/api/events/admin/events?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (res.data.success) {
        setEvents(res.data.data.events);
        setPages(res.data.data.pagination.pages);
      }
    } catch (err) {
      console.error("Error fetching events", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, city, status, page]);

  const toggleStatus = async (id, currentStatus, eventName) => {
    try {
      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      await axios.put(
        `${API_BASE}/api/events/admin/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      toast.success(
        `Event ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchEvents();
    } catch (err) {
      console.error("Error toggling event status", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error("Failed to update event status");
    }
  };

  // UPDATED: Delete function without window.confirm
  const deleteEvent = async (id, eventName) => {
    try {
      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      await axios.delete(`${API_BASE}/api/events/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      toast.success(`"${eventName}" deleted successfully`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error("Failed to delete event");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCity("all");
    setStatus("all");
    setPage(1);
  };

  const hasActiveFilters = search || city !== "all" || status !== "all";

  // Stats calculation
  const stats = {
    total: events.length,
    active: events.filter((e) => e.isActive).length,
    upcoming: events.filter((e) => new Date(e.date) > new Date()).length,
    today: events.filter((e) => {
      const eventDate = new Date(e.date).toDateString();
      const today = new Date().toDateString();
      return eventDate === today;
    }).length,
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="">
          <Toaster />

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Event Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all events, activate/deactivate, and monitor event
                activities
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
              value={stats.total}
              change={8}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Active Events"
              value={stats.active}
              change={12}
              color="green"
            />
            <StatCard
              icon={Clock}
              label="Upcoming"
              value={stats.upcoming}
              change={15}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Today"
              value={stats.today}
              change={5}
              color="orange"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6">
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
                  City
                </label>
                <select
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="all">All Cities</option>
                  <option value="new orleans">New Orleans</option>
                  <option value="biloxi">Biloxi</option>
                  <option value="mobile">Mobile</option>
                  <option value="pensacola">Pensacola</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
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
                  {hasActiveFilters && (
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

          {/* Events Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Events ({events.length})
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

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
                        Event Details
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
                        <EventRow
                          key={event._id}
                          event={event}
                          onToggleStatus={toggleStatus}
                          onDeleteEvent={deleteEvent}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              No events found
                            </p>
                            <p className="text-sm">
                              Try adjusting your search filters
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === pageNumber
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
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

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    purple: "from-purple-500 to-pink-600",
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-red-600",
  };

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↗" : "↘";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {/* <div
          className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}
        >
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div> */}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

export default AdminEventsPage;
