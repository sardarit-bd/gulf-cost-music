"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar, 
  Eye, 
  Power, 
  Trash2, 
  MapPin, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Download,
  RefreshCw,
  Users,
  Clock,
  TrendingUp,
  Music,
  Building2,
  Plus,
  Ticket,
  Star
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=events`;

  // 🔹 Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(dateFilter && { date: dateFilter })
      });

      const { data } = await axios.get(`${API_URL}&${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(data.data.content);
      setPages(data.data.pagination.pages);
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle event status (Active/Inactive)
  const toggleEventStatus = async (id, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? "deactivate" : "activate"} this event?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content/event/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
      setActionMenu(null);
    } catch (err) {
      console.error("Toggle event error:", err);
    }
  };

  // 🔹 Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
      setActionMenu(null);
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, statusFilter, dateFilter]);

  const getEventTypeColor = (type) => {
    const colors = {
      'concert': 'bg-purple-100 text-purple-800 border-purple-200',
      'festival': 'bg-orange-100 text-orange-800 border-orange-200',
      'club': 'bg-blue-100 text-blue-800 border-blue-200',
      'theater': 'bg-red-100 text-red-800 border-red-200',
      'comedy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'sports': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDateStatus = (eventDate) => {
    if (!eventDate) return 'upcoming';
    const now = new Date();
    const event = new Date(eventDate);
    
    if (event < now) return 'past';
    if (event > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'upcoming';
    return 'soon';
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Event Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage events, schedules, and venue bookings efficiently
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
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
              change={22}
              color="green"
            />
            <StatCard 
              icon={Ticket} 
              label="Active Events" 
              value={events.filter(e => e.isActive).length} 
              change={15}
              color="blue"
            />
            <StatCard 
              icon={Clock} 
              label="Upcoming" 
              value={events.filter(e => getDateStatus(e.date) === 'upcoming').length} 
              change={8}
              color="purple"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(events.length * 0.3)} 
              change={30}
              color="orange"
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
                    placeholder="Search by event title, venue, or artist..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchEvents()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    Date
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="">All Dates</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="past">Past Events</option>
                  </select>
                </div>
                <button
                  onClick={fetchEvents}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center space-x-2 self-end"
                >
                  <Filter className="w-4 h-4" />
                </button>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                        Venue & Artist
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
                      events.map((event) => {
                        const dateStatus = getDateStatus(event.date);
                        return (
                          <tr 
                            key={event._id} 
                            className="hover:bg-gray-50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                  <Calendar className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 line-clamp-2">
                                    {event.title || "Untitled Event"}
                                  </h3>
                                  {event.eventType && (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getEventTypeColor(event.eventType)}`}>
                                      <Ticket className="w-3 h-3 mr-1" />
                                      {event.eventType}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                  <span className="line-clamp-1">{event.venueName || "Venue TBA"}</span>
                                </div>
                                {event.artistBandName && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Music className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="line-clamp-1">{event.artistBandName}</span>
                                  </div>
                                )}
                                {event.city && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {event.city}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm font-medium text-gray-900">
                                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                                  {formatEventDate(event.date)}
                                </div>
                                {event.time && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                    {formatEventTime(event.time)}
                                  </div>
                                )}
                                <div className={`text-xs font-medium ${
                                  dateStatus === 'past' ? 'text-red-600' :
                                  dateStatus === 'soon' ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {dateStatus === 'past' ? 'Event Ended' :
                                   dateStatus === 'soon' ? 'Coming Soon' : 'Upcoming'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-2">
                                {event.isActive ? (
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
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end items-center space-x-2">
                                <button
                                  onClick={() => window.open(`/events/${event._id}`, "_blank")}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="View Event"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => toggleEventStatus(event._id, event.isActive)}
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
                                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Event
                                      </button>
                                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        <Star className="w-4 h-4 mr-2" />
                                        Feature Event
                                      </button>
                                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        <Users className="w-4 h-4 mr-2" />
                                        View Attendees
                                      </button>
                                      <button
                                        onClick={() => deleteEvent(event._id)}
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Event
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No events found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all" || dateFilter
                                ? "Try adjusting your search filters" 
                                : "Get started by creating your first event"
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
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNumber
                              ? "bg-green-600 text-white shadow-sm"
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
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-pink-600",
    orange: "from-orange-500 to-red-600",
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

export default EventManagement;