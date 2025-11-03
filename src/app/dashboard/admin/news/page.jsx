"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Newspaper, 
  Eye, 
  Power, 
  Trash2, 
  Calendar, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  User,
  Download,
  RefreshCw,
  TrendingUp,
  FileText,
  Clock,
  Tag,
  Plus,
  BarChart3,
  Save,
  X,
  MapPin,
  PenTool,
  Image
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

const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingNews, setViewingNews] = useState(null);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null
  });

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=news`;

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

  // 🔹 Fetch All News
  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(locationFilter && { location: locationFilter })
      });

      const { data } = await axios.get(`${API_URL}&${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewsList(data.data.content);
      setPages(data.data.pagination.pages);
      toast.success('News loaded successfully');
    } catch (err) {
      console.error("Fetch news error:", err);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  // View News Function with Modal
  const handleViewNews = (newsItem) => {
    setViewingNews(newsItem);
  };

  // Toggle News Status (Active/Inactive) with Confirmation
  const toggleNewsStatus = async (id, isActive, title) => {
    const action = isActive ? "deactivate" : "activate";
    
    showConfirmation(
      `${isActive ? "Deactivate" : "Activate"} News`,
      `Are you sure you want to ${action} "${title}"? ${
        isActive 
          ? "This news will no longer be visible to users." 
          : "This news will become visible to users."
      }`,
      isActive ? "Deactivate" : "Activate",
      isActive ? "warning" : "success",
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/admin/${id}/toggle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchNews();
          setActionMenu(null);
          toast.success(`News ${!isActive ? 'activated' : 'deactivated'} successfully!`);
        } catch (err) {
          console.error("Toggle news error:", err);
          toast.error("Failed to update news status");
        }
      }
    );
  };

  // Edit News Function
  const handleEdit = (newsItem) => {
    setEditingNews(newsItem._id);
    setFormData({
      title: newsItem.title || "",
      description: newsItem.description || "",
      location: newsItem.location || "",
      credit: newsItem.credit || "",
      isActive: newsItem.isActive || false
    });
    setActionMenu(null);
  };

  // Save Edited News - Admin route
  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/admin/${id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setEditingNews(null);
        setFormData({});
        fetchNews();
        toast.success("News updated successfully!");
      }
    } catch (err) {
      console.error("Update news error:", err);
      if (err.response?.data?.message) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error('Error updating news');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingNews(null);
    setFormData({});
  };

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete News with Confirmation
  const deleteNews = async (id, title) => {
    showConfirmation(
      "Delete News",
      `Are you sure you want to delete "${title}"? This action cannot be undone and all news data including images will be permanently lost.`,
      "Delete News",
      "danger",
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/admin/${id}`, 
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchNews();
          setActionMenu(null);
          toast.success("News deleted successfully!");
        } catch (err) {
          console.error("Delete news error:", err);
          toast.error("Failed to delete news");
        }
      }
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setLocationFilter("");
    setPage(1);
  };

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, locationFilter]);

  // Extract unique locations for filter
  const locations = [...new Set(newsList.map(item => item.location).filter(Boolean))];

  const getLocationColor = (location) => {
    const colors = {
      'dubai': 'bg-blue-100 text-blue-800 border-blue-200',
      'abu dhabi': 'bg-green-100 text-green-800 border-green-200',
      'sharjah': 'bg-purple-100 text-purple-800 border-purple-200',
      'ajman': 'bg-orange-100 text-orange-800 border-orange-200',
      'ras al khaimah': 'bg-red-100 text-red-800 border-red-200',
      'fujairah': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'umm al quwain': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[location?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // News Detail Modal Component
  const NewsDetailModal = ({ newsItem, onClose }) => {
    if (!newsItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">News Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
                  <Newspaper className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{newsItem.title}</h4>
                  <p className="text-gray-600 flex items-center mt-1">
                    <PenTool className="w-4 h-4 mr-2" />
                    By {newsItem.journalist?.fullName || newsItem.journalist?.username}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {newsItem.createdAt ? new Date(newsItem.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Location:</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLocationColor(newsItem.location)}`}>
                        <MapPin className="w-4 h-4 mr-1" />
                        {newsItem.location ? newsItem.location.charAt(0).toUpperCase() + newsItem.location.slice(1) : "Not specified"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-700">Status:</label>
                    <div className="mt-1">
                      {newsItem.isActive ? (
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
                  {newsItem.credit && (
                    <div>
                      <label className="font-medium text-gray-700">Credit:</label>
                      <p className="text-gray-600 mt-1">{newsItem.credit}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="font-medium text-gray-700">Journalist:</label>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {newsItem.journalist?.fullName || newsItem.journalist?.username}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 ml-6">
                      {newsItem.journalist?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Description:</label>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed whitespace-pre-line">
                  {newsItem.description}
                </p>
              </div>

              {newsItem.photos && newsItem.photos.length > 0 && (
                <div>
                  <label className="font-medium text-gray-700">Photos:</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {newsItem.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo.url}
                        alt={`News ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  handleEdit(newsItem);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit News
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

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                News Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage news articles, publish content, and engage with your audience
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button 
                onClick={fetchNews}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={Newspaper} 
              label="Total News" 
              value={newsList.length} 
              change={15}
              color="orange"
            />
            <StatCard 
              icon={FileText} 
              label="Active News" 
              value={newsList.filter(n => n.isActive).length} 
              change={8}
              color="green"
            />
            <StatCard 
              icon={Power} 
              label="Inactive News" 
              value={newsList.filter(n => !n.isActive).length} 
              change={-3}
              color="red"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(newsList.length * 0.25)} 
              change={25}
              color="blue"
            />
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search News
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or location..."
                    className="text-gray-500 w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchNews()}
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
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    Location
                  </label>
                  <select
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location.charAt(0).toUpperCase() + location.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 self-end">
                  <button
                    onClick={fetchNews}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Apply</span>
                  </button>
                  {(search || statusFilter !== "all" || locationFilter) && (
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

          {/* News Table Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                News Articles ({newsList.length})
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author & Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                    {newsList.length > 0 ? (
                      newsList.map((news) => (
                        <tr 
                          key={news._id} 
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              {news.photos && news.photos.length > 0 ? (
                                <img
                                  src={news.photos[0].url}
                                  alt={news.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                  <Newspaper className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                {editingNews === news._id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={formData.title || ''}
                                      onChange={(e) => handleInputChange('title', e.target.value)}
                                      className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                                      placeholder="News title"
                                    />
                                    <textarea
                                      value={formData.description || ''}
                                      onChange={(e) => handleInputChange('description', e.target.value)}
                                      className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                                      placeholder="News description"
                                      rows="2"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 line-clamp-2">
                                      {news.title || "Untitled"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {truncateText(news.description, 80)}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{news.journalist?.fullName || news.journalist?.username || "Unknown"}</span>
                              </div>
                              {editingNews === news._id ? (
                                <input
                                  type="text"
                                  value={formData.location || ''}
                                  onChange={(e) => handleInputChange('location', e.target.value)}
                                  className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                                  placeholder="Location"
                                />
                              ) : news.location && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLocationColor(news.location)}`}>
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {news.location}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(news.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-xs text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(news.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingNews === news._id ? (
                              <select
                                value={formData.isActive?.toString() || 'false'}
                                onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : news.isActive ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              {editingNews === news._id ? (
                                <>
                                  <button
                                    onClick={() => handleSave(news._id)}
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
                                    onClick={() => handleViewNews(news)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="View Article"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => toggleNewsStatus(news._id, news.isActive, news.title)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      news.isActive
                                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                    title={news.isActive ? "Unpublish" : "Publish"}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>

                                  <div className="relative">
                                    <button
                                      onClick={() => setActionMenu(actionMenu === news._id ? null : news._id)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    
                                    {actionMenu === news._id && (
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button 
                                          onClick={() => handleEdit(news)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Article
                                        </button>
                                        <button
                                          onClick={() => deleteNews(news._id, news.title)}
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete Article
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
                            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No news articles found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all" || locationFilter
                                ? "Try adjusting your search filters" 
                                : "Get started by creating your first news article"
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
                    Showing {newsList.length} articles on page {page} of {pages}
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
                              ? "bg-orange-600 text-white shadow-sm"
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

        {/* News Detail Modal */}
        {viewingNews && (
          <NewsDetailModal 
            newsItem={viewingNews} 
            onClose={() => setViewingNews(null)} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    orange: "from-orange-500 to-red-600",
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-pink-600",
    blue: "from-blue-500 to-cyan-600",
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
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

export default NewsManagement;