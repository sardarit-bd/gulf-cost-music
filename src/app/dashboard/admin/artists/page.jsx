"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Music, 
  Eye, 
  Power, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  User,
  MapPin,
  Mail,
  Calendar,
  Download,
  RefreshCw,
  Play,
  Pause,
  TrendingUp,
  Save,
  X,
  XCircle
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

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewingArtist, setViewingArtist] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=artists`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter })
      });

      const { data } = await axios.get(`${API_URL}&${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtists(data.data.content);
      setPages(data.data.pagination.pages);
    } catch (err) {
      console.error("Fetch artists error:", err);
      showToast("Failed to fetch artists", "error");
    } finally {
      setLoading(false);
    }
  };

  // View Profile Function with Modal
  const handleViewProfile = (artist) => {
    setViewingArtist(artist);
  };

  // Toggle Active/Inactive Function
  const toggleActive = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this artist?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchArtists();
      setActionMenu(null);
      showToast(`Artist ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      console.error("Toggle artist error:", err);
      showToast("Failed to update artist status", "error");
    }
  };

  // Edit Profile Function
  const handleEdit = (artist) => {
    setEditingArtist(artist._id);
    setFormData({
      name: artist.name || "",
      genre: artist.genre || "",
      city: artist.city || "",
      bio: artist.bio || "",
      website: artist.website || "",
      phone: artist.phone || "",
      isActive: artist.isActive || false
    });
    setActionMenu(null);
  };

  // Save Edited Profile
  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setEditingArtist(null);
        setFormData({});
        fetchArtists();
        showToast("Artist profile updated successfully!");
      }
    } catch (err) {
      console.error("Update artist error:", err);
      if (err.response?.data?.message) {
        showToast(`Error: ${err.response.data.message}`, "error");
      } else {
        showToast('Error updating artist profile', "error");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingArtist(null);
    setFormData({});
  };

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete Artist
  const deleteArtist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artist profile? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/admin/${id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchArtists();
      setActionMenu(null);
      showToast("Artist profile deleted successfully!");
    } catch (err) {
      console.error("Delete artist error:", err);
      showToast("Failed to delete artist profile", "error");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  useEffect(() => {
    fetchArtists();
  }, [page, statusFilter]);

  const getGenreColor = (genre) => {
    const colors = {
      'rock': 'bg-red-100 text-red-800 border-red-200',
      'pop': 'bg-blue-100 text-blue-800 border-blue-200',
      'jazz': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'hiphop': 'bg-purple-100 text-purple-800 border-purple-200',
      'electronic': 'bg-green-100 text-green-800 border-green-200',
      'classical': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'rnb': 'bg-pink-100 text-pink-800 border-pink-200',
      'country': 'bg-orange-100 text-orange-800 border-orange-200',
      'metal': 'bg-gray-100 text-gray-800 border-gray-200',
      'folk': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return colors[genre?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Available genres for dropdown
  const availableGenres = [
    'Rock', 'Pop', 'Jazz', 'Hip Hop', 'Electronic', 'Classical', 
    'R&B', 'Country', 'Metal', 'Folk', 'Blues', 'Reggae'
  ];

  // Artist Detail Modal Component
  const ArtistDetailModal = ({ artist, onClose }) => {
    if (!artist) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Artist Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                  {artist.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{artist.name}</h4>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {artist.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Genre:</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGenreColor(artist.genre)}`}>
                        <Music className="w-4 h-4 mr-1" />
                        {artist.genre || "Not specified"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Location:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {artist.city || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Status:</label>
                    <div className="mt-1">
                      {artist.isActive ? (
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
                    <label className="font-medium text-gray-700">Joined:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  {artist.phone && (
                    <div>
                      <label className="font-medium text-gray-700">Phone:</label>
                      <p className="text-gray-600 mt-1">{artist.phone}</p>
                    </div>
                  )}

                  {artist.website && (
                    <div>
                      <label className="font-medium text-gray-700">Website:</label>
                      <p className="text-gray-600 mt-1 truncate">
                        <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {artist.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {artist.bio && (
                <div>
                  <label className="font-medium text-gray-700">Bio:</label>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{artist.bio}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  handleEdit(artist);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit Profile
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

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Music className="w-6 h-6 text-white" />
                </div>
                Artist Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage artist profiles, activate/deactivate accounts, and monitor artist activities
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button 
                onClick={fetchArtists}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={User} 
              label="Total Artists" 
              value={artists.length} 
              change={12}
              color="purple"
            />
            <StatCard 
              icon={Play} 
              label="Active Artists" 
              value={artists.filter(a => a.isActive).length} 
              change={8}
              color="green"
            />
            <StatCard 
              icon={Pause} 
              label="Inactive Artists" 
              value={artists.filter(a => !a.isActive).length} 
              change={-4}
              color="orange"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(artists.length * 0.15)} 
              change={15}
              color="blue"
            />
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Artists
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by artist name, genre, or city..."
                    className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchArtists()}
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

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={fetchArtists}
                  className="w-full lg:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Apply</span>
                </button>
                {(search || statusFilter !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="w-full lg:w-auto px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Artists Table Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Artists ({artists.length})
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artist
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {artists.length > 0 ? (
                      artists.map((artist) => (
                        <tr 
                          key={artist._id} 
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {artist.name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                {editingArtist === artist._id ? (
                                  <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-32"
                                    placeholder="Artist name"
                                  />
                                ) : (
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                                    {artist.name}
                                  </div>
                                )}
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {artist.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {editingArtist === artist._id ? (
                                <>
                                  <select
                                    value={formData.genre || ''}
                                    onChange={(e) => handleInputChange('genre', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                                  >
                                    <option value="">Select Genre</option>
                                    {availableGenres.map(genre => (
                                      <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    value={formData.city || ''}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                                    placeholder="City"
                                  />
                                </>
                              ) : (
                                <>
                                  {artist.genre && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGenreColor(artist.genre)}`}>
                                      <Music className="w-3 h-3 mr-1" />
                                      {artist.genre}
                                    </span>
                                  )}
                                  {artist.city && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {artist.city}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingArtist === artist._id ? (
                              <select
                                value={formData.isActive?.toString() || 'false'}
                                onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : artist.isActive ? (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              {editingArtist === artist._id ? (
                                <>
                                  <button
                                    onClick={() => handleSave(artist._id)}
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
                                    onClick={() => handleViewProfile(artist)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="View Profile"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => toggleActive(artist._id, artist.isActive)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      artist.isActive
                                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                    title={artist.isActive ? "Deactivate" : "Activate"}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>

                                  <div className="relative">
                                    <button
                                      onClick={() => setActionMenu(actionMenu === artist._id ? null : artist._id)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {actionMenu === artist._id && (
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button 
                                          onClick={() => handleEdit(artist)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Profile
                                        </button>
                                        <button
                                          onClick={() => deleteArtist(artist._id)}
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete Artist
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
                            <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No artists found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all" 
                                ? "Try adjusting your search filters" 
                                : "No artists have been registered yet"
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
                    Showing {artists.length} artists on page {page} of {pages}
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
                              ? "bg-purple-600 text-white shadow-sm"
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

        {/* Artist Detail Modal */}
        {viewingArtist && (
          <ArtistDetailModal 
            artist={viewingArtist} 
            onClose={() => setViewingArtist(null)} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    purple: "from-purple-500 to-pink-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    blue: "from-blue-500 to-cyan-600",
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

export default ArtistManagement;