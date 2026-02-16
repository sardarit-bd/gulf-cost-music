"use client";
import { EventRow } from "@/components/modules/admin/eventspage/EventRow";
import { StatCard } from "@/components/modules/admin/eventspage/StatCard";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  Calendar,
  Clock,
  Filter,
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
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 text-sm font-medium"
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
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 font-medium transition-colors flex items-center space-x-2"
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


export default AdminEventsPage;
