"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Loader2,
  Mic2,
  MoreVertical,
  Music,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
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

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

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

  // Create or update wave
  const handleSubmit = async (e) => {
    e.preventDefault();

    const savePromise = new Promise(async (resolve, reject) => {
      try {

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };


        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("youtubeUrl", formData.youtubeUrl);

        if (formData.thumbnail instanceof File) {
          fd.append("thumbnail", formData.thumbnail);
        }

        if (editingItem) {
          await axios.put(`${API_BASE}/api/waves/${editingItem._id}`, fd, { headers });
        } else {
          await axios.post(`${API_BASE}/api/waves`, fd, { headers });
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(savePromise, {
      loading: editingItem ? "Updating open mic..." : "Adding open mic...",
      success: () => {
        resetForm();
        fetchWaves();
        return editingItem
          ? "Open mic updated successfully!"
          : "Open mic added successfully!";
      },
      error: (error) => handleApiError(error, "Failed to save open mic"),
    });
  };


  // Edit wave
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      thumbnail: item.thumbnail,
      youtubeUrl: item.youtubeUrl,
    });
    setShowForm(true);
    toast.success(`Loaded "${item.title}" for editing`);
  };

  // Delete wave
  const handleDelete = async (id) => {
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_BASE}/api/waves/${id}`, { headers });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting open mic...",
      success: () => {
        fetchWaves();
        setActionMenu(null);
        return "Open mic deleted successfully!";
      },
      error: (error) => handleApiError(error, "Failed to delete open mic"),
    });
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
      <div className="min-h-screen bg-gray-50 p-6">
        <Toaster />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Mic2 className="w-6 h-6 text-white" />
                </div>
                Open Mic Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage open mic sessions, performances, and YouTube videos
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Session</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Sessions
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by session title..."
                    className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              <button className="w-full lg:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItem ? "Edit Open Mic Session" : "Add New Session"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter open mic session title"
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Thumbnail Image
                    </label>

                    {/* Upload Box */}
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${formData.thumbnail
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                        }`}
                      onClick={() => document.getElementById("thumbnailInput").click()}
                    >
                      {formData.thumbnail ? (
                        <>
                          <img
                            src={
                              formData.thumbnail instanceof File
                                ? URL.createObjectURL(formData.thumbnail)
                                : formData.thumbnail
                            }
                            alt="Thumbnail Preview"
                            className="w-40 h-28 object-cover rounded-lg shadow-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, thumbnail: null });
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h1.1a5 5 0 010 10H7z"
                            />
                          </svg>
                          <p className="text-gray-700 text-sm font-medium">
                            Click or drag & drop to upload
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, or WEBP — Max size 5MB
                          </p>
                        </>
                      )}

                      <input
                        id="thumbnailInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData({ ...formData, thumbnail: e.target.files[0] });
                          }
                        }}
                        className="hidden"
                      />
                    </div>

                    {/* Help text */}
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a custom thumbnail, or leave empty to use YouTube’s default.
                    </p>
                  </div>


                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                  >
                    {editingItem ? "Update Session" : "Add Session"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Waves Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
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
              <div className="text-center py-12">
                <Mic2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No sessions found</p>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search" : "Get started by adding your first open mic session"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        YouTube Video
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thumbnail
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWaves.map((wave) => {
                      const youtubeId = getYouTubeId(wave.youtubeUrl);
                      return (
                        <tr key={wave._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                <Music className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                                  {wave.title}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {wave.createdAt ? new Date(wave.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
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
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {wave.thumbnail ? (
                                <img
                                  src={wave.thumbnail}
                                  alt={wave.title}
                                  className="w-16 h-12 object-cover rounded border"
                                />
                              ) : youtubeId ? (
                                <img
                                  src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                  alt="YouTube thumbnail"
                                  className="w-16 h-12 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-16 h-12 bg-gray-100 rounded border flex items-center justify-center">
                                  <Music className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <span className="text-xs text-gray-500">
                                {wave.thumbnail ? 'Custom' : 'YouTube'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <button
                                onClick={() => handleEdit(wave)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Edit Session"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => window.open(wave.youtubeUrl, '_blank')}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Watch on YouTube"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <div className="relative">
                                <button
                                  onClick={() => setActionMenu(actionMenu === wave._id ? null : wave._id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === wave._id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                    <button
                                      onClick={() => {
                                        setActionMenu(null);
                                        toast.success(`Viewing details for ${wave.title}`);
                                      }}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => handleDelete(wave._id)}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};