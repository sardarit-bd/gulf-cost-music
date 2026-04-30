"use client";

import { ConfirmationModal } from "@/components/modules/admin/eventspage/ConfirmationModal";
import { EventDetailModal } from "@/components/modules/admin/eventspage/EventDetailModal";
import EventModal from "@/components/modules/admin/eventspage/EventModal";
import { EventRow } from "@/components/modules/admin/eventspage/EventRow";
import { StatCard } from "@/components/modules/admin/eventspage/StatCard";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X
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

// Main AdminEventsPage Component
const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  const fetchVenues = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE}/api/venues/admin/venues`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        setVenues(res.data.data.content || []);
      }
    } catch (err) {
      console.error("Error fetching venues", err);
    }
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
        ...(searchTerm && { search: searchTerm }),
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

  // Handle search on button click
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  useEffect(() => {
    fetchVenues();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, page]);

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

  const deleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      await axios.delete(`${API_BASE}/api/events/admin/${selectedEvent._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      toast.success(`"${selectedEvent.artistBandName}" deleted successfully`);
      setShowDeleteModal(false);
      setSelectedEvent(null);
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

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const openDetailModal = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const openEditModal = (event) => {
    const eventDate = new Date(event.date);
    const formattedDate = `${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/${eventDate.getDate().toString().padStart(2, '0')}/${eventDate.getFullYear()}`;

    const eventTime = event.eventTime || event.time || "12:00 PM";
    const timeParts = eventTime.split(" ");
    const timeHourMin = timeParts[0] || "12:00";
    const timePeriod = timeParts[1] || "PM";

    const hasExistingVenue = event.venue && event.venue._id;

    const editData = {
      _id: event._id,
      artistBandName: event.artistBandName,
      date: formattedDate,
      time: timeHourMin,
      timePeriod: timePeriod,
      description: event.description || "",
      state: hasExistingVenue ? event.venue?.state : event.state,
      city: hasExistingVenue ? event.venue?.city : event.city,
      venueId: event.venue?._id || null,
      customVenueName: hasExistingVenue ? "" : (event.customVenueName || event.venue?.venueName || ""),
      imageUrl: event.image?.url || null,
    };

    setEditingEvent(editData);
    setIsEditModalOpen(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEvent(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEvent(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const hasActiveFilters = searchTerm;

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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="">
          <Toaster position="top-right" />

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Event Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage all events, activate/deactivate, and monitor event activities
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 lg:mt-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
              <button
                onClick={fetchEvents}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={Calendar}
              label="Total Events"
              value={stats.total}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Active Events"
              value={stats.active}
              color="green"
            />
            <StatCard
              icon={Clock}
              label="Upcoming"
              value={stats.upcoming}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Today"
              value={stats.today}
              color="orange"
            />
          </div>

          {/* Events Table with Search in Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header with Search */}
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Events ({events.length})
                </h3>

                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {searchTerm && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Searching for:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    <Search className="w-3 h-3" />
                    {searchTerm}
                  </span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Details
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue & Location
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <EventRow
                          key={event._id}
                          event={event}
                          onToggleStatus={toggleStatus}
                          onDeleteEvent={openDeleteModal}
                          onViewEvent={openDetailModal}
                          onEditEvent={openEditModal}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center">
                          <div className="text-gray-400">
                            <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              No events found
                            </p>
                            <p className="text-xs">
                              {searchTerm ? `No results found for "${searchTerm}"` : "No events available"}
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
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Page {page} of {pages}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-2 py-1 text-xs border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setPage(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="px-2 py-1 text-xs border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
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

      {/* Add Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchEvents();
          setIsModalOpen(false);
        }}
        venues={venues}
        editingEvent={null}
      />

      {/* Edit Event Modal */}
      <EventModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={() => {
          fetchEvents();
          closeEditModal();
        }}
        venues={venues}
        editingEvent={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={deleteEvent}
          title="Delete Event"
          message={`Are you sure you want to delete "${selectedEvent.artistBandName}"? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
        />
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={showDetailModal}
          onClose={closeDetailModal}
        />
      )}
    </AdminLayout>
  );
};
export default AdminEventsPage;