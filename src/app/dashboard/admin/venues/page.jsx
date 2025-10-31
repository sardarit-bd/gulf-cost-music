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
  Globe
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=venues`;

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
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this venue?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/content/venue/${id}/toggle`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchVenues();
      setActionMenu(null);
    } catch (err) {
      console.error("Toggle venue error:", err);
    }
  };

  const deleteVenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/venues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVenues();
      setActionMenu(null);
    } catch (err) {
      console.error("Delete venue error:", err);
    }
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
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
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
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
                    placeholder="Search by venue name, owner, or city..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchVenues()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={fetchVenues}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2 self-end"
                >
                  <Filter className="w-4 h-4" />
                </button>
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
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                                  {venue.venueName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <User className="w-3 h-3 mr-1" />
                                  {venue.user?.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{venue.city || "Not specified"}</span>
                              </div>
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
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {venue.capacity && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCapacityColor(venue.capacity)}`}>
                                  <Users className="w-3 h-3 mr-1" />
                                  {venue.capacity} capacity
                                </span>
                              )}
                              {venue.venueType && (
                                <div className="text-xs text-gray-500 capitalize">
                                  {venue.venueType}
                                </div>
                              )}
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {venue.isActive ? (
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
                              <button
                                onClick={() => window.open(`/venue/${venue._id}`, "_blank")}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Venue"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => toggleActive(venue._id, venue.isActive)}
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
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Venue
                                    </button>
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <Star className="w-4 h-4 mr-2" />
                                      Feature Venue
                                    </button>
                                    <button
                                      onClick={() => deleteVenue(venue._id)}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Venue
                                    </button>
                                  </div>
                                )}
                              </div>
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