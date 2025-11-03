"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Music,
  Search,
  Loader2,
  Eye,
  MoreVertical,
  Calendar,
  Play,
  ExternalLink,
  TrendingUp,
  Users,
  Filter,
  Mic2,
  X,
  Save
} from "lucide-react";
import axios from "axios";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import toast, { Toaster } from "react-hot-toast";

// Utility function for clean error messages
const handleApiError = (error, defaultMessage = "Something went wrong") => {
  if (error.response) {
    const data = error.response.data;
    if (data?.errors?.length > 0) {
      return data.errors.map((err) => `• ${err.msg || err.message}`).join("\n");
    }
    return data?.message || defaultMessage;
  }
  if (error.request) {
    return "No response from server. Please check your connection.";
  }
  return error.message || defaultMessage;
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
        return <Edit className="w-6 h-6 text-orange-500" />;
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-500" />;
      default:
        return <Edit className="w-6 h-6 text-orange-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
      case "danger":
        return "bg-red-600 hover:bg-red-700";
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

export default function WaveManagementPage() {
  const [token, setToken] = useState(null);
  const [waves, setWaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMenu, setActionMenu] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    youtubeUrl: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

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

  // Fetch all waves
  const fetchWaves = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/waves`);
      if (data.success) {
        setWaves(Array.isArray(data.data.waves) ? data.data.waves : []);
      } else {
        setWaves([]);
      }
    } catch (error) {
      toast.error(handleApiError(error, "Failed to load open mic sessions"));
    } finally {
      setLoading(false);
    }
  };

  // Create or update wave - FIXED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let response;
      if (editingItem) {
        response = await axios.put(
          `${API_BASE}/api/waves/${editingItem._id}`,
          formData,
          { headers }
        );
      } else {
        response = await axios.post(`${API_BASE}/api/waves`, formData, { headers });
      }

      if (response.data.success) {
        toast.success(
          editingItem 
            ? "Open mic updated successfully!" 
            : "Open mic added successfully!"
        );
        resetForm();
        fetchWaves();
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(handleApiError(error, "Failed to save open mic"));
    } finally {
      setSaveLoading(false);
    }
  };

  // Edit wave - FIXED VERSION
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      thumbnail: item.thumbnail || "",
      youtubeUrl: item.youtubeUrl || "",
    });
    setShowForm(true);
    setActionMenu(null);
  };

  // Delete wave with confirmation
  const handleDelete = (id, title) => {
    showConfirmation(
      "Delete Open Mic Session",
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      "Delete Session",
      "danger",
      async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          await axios.delete(`${API_BASE}/api/waves/${id}`, { headers });
          fetchWaves();
          setActionMenu(null);
          toast.success("Open mic deleted successfully!");
        } catch (error) {
          toast.error(handleApiError(error, "Failed to delete open mic"));
        }
      }
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      thumbnail: "",
      youtubeUrl: "",
    });
    setEditingItem(null);
    setShowForm(false);
    setSaveLoading(false);
  };

  // Refresh data
  const handleRefresh = async () => {
    const refreshPromise = fetchWaves();
    toast.promise(refreshPromise, {
      loading: "Refreshing data...",
      success: "Data refreshed successfully!",
      error: "Failed to refresh data",
    });
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filtered waves based on search
  const filteredWaves = waves.filter(wave =>
    wave.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetchWaves();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
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

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Mic2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                Open Mic Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage open mic sessions, performances, and YouTube videos
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full lg:w-auto">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex-1 lg:flex-none justify-center"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors flex-1 lg:flex-none justify-center"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Session</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard 
              icon={Mic2} 
              label="Total Sessions" 
              value={waves.length} 
              change={18}
              color="indigo"
            />
            <StatCard 
              icon={Play} 
              label="Videos" 
              value={waves.length} 
              change={12}
              color="blue"
            />
            <StatCard 
              icon={Users} 
              label="This Month" 
              value={Math.floor(waves.length * 0.25)} 
              change={25}
              color="green"
            />
            <StatCard 
              icon={TrendingUp} 
              label="Growth" 
              value={`${Math.floor(waves.length * 2)}%`} 
              change={20}
              color="purple"
            />
          </div>

          {/* Search and Filters - Responsive */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Sessions
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by session title..."
                    className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2 justify-center text-sm sm:text-base">
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Form Section - Responsive */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingItem ? "Edit Open Mic Session" : "Add New Session"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                      placeholder="Enter open mic session title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to use YouTube thumbnail
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base order-1 sm:order-2"
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{editingItem ? "Updating..." : "Adding..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingItem ? "Update Session" : "Add Session"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Waves Table - Responsive */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Open Mic Sessions ({filteredWaves.length})
              </h3>
              <div className="text-sm text-gray-500">
                {filteredWaves.length} sessions found
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading open mic sessions...</p>
                </div>
              </div>
            ) : filteredWaves.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Mic2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No sessions found</p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {searchTerm ? "Try adjusting your search" : "Get started by adding your first open mic session"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    Add Your First Session
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        YouTube Video
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Thumbnail
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWaves.map((wave) => {
                      const youtubeId = getYouTubeId(wave.youtubeUrl);
                      return (
                        <tr key={wave._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                                  {wave.title}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {wave.createdAt ? new Date(wave.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                                {/* Mobile only YouTube link */}
                                <div className="sm:hidden mt-2">
                                  <a
                                    href={wave.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                                  >
                                    <span>Watch on YouTube</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                            <a
                              href={wave.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                            >
                              <span>Watch on YouTube</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                              {wave.youtubeUrl}
                            </p>
                          </td>
                          <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center space-x-2">
                              {wave.thumbnail ? (
                                <img
                                  src={wave.thumbnail}
                                  alt={wave.title}
                                  className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded border"
                                />
                              ) : youtubeId ? (
                                <img
                                  src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                  alt="YouTube thumbnail"
                                  className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gray-100 rounded border flex items-center justify-center">
                                  <Music className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <span className="text-xs text-gray-500 hidden lg:inline">
                                {wave.thumbnail ? 'Custom' : 'YouTube'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-1 sm:space-x-2">
                              <button
                                onClick={() => handleEdit(wave)}
                                className="p-1 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Edit Session"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => window.open(wave.youtubeUrl, '_blank')}
                                className="p-1 sm:p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Watch on YouTube"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <div className="relative">
                                <button
                                  onClick={() => setActionMenu(actionMenu === wave._id ? null : wave._id)}
                                  className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                
                                {actionMenu === wave._id && (
                                  <div className="absolute right-0 mt-1 w-36 sm:w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                    <button 
                                      onClick={() => {
                                        setActionMenu(null);
                                        handleEdit(wave);
                                      }}
                                      className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                      Edit Session
                                    </button>
                                    <button
                                      onClick={() => handleDelete(wave._id, wave.title)}
                                      className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                      Delete Session
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-pink-600",
  };

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↗" : "↘";

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{label}</p>
    </div>
  );
};