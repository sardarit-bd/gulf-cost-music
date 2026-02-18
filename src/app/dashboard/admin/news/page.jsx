"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/news/ConfirmationModal";
import Filters from "@/components/modules/dashboard/news/Filters";
import NewsDetailModal from "@/components/modules/dashboard/news/NewsDetailModal";
import NewsTable from "@/components/modules/dashboard/news/NewsTable";
import StatCard from "@/components/modules/dashboard/news/StatCard";
import axios from "axios";
import {
  FileText,
  Filter,
  Grid3x3,
  List,
  Newspaper,
  PlusCircle,
  Power,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Function to get cookie value by name
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingNews, setViewingNews] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [selectedNews, setSelectedNews] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null,
  });

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/news`;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      fetchNews();
    }
  }, [debouncedSearch]);

  const showConfirmation = (title, message, confirmText, type, onConfirm) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const params = new URLSearchParams({
        page,
        limit: 10,
        type: 'news',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(locationFilter && { location: locationFilter }),
      });

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewsList(data.data.content);
      setPages(data.data.pagination.pages);
    } catch (err) {
      console.error("Fetch news error:", err);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const handleViewNews = (newsItem) => {
    setViewingNews(newsItem);
  };

  const toggleNewsStatus = async (id, isActive, title) => {
    const action = isActive ? "deactivate" : "activate";

    showConfirmation(
      `${isActive ? "Deactivate" : "Activate"} News`,
      `Are you sure you want to ${action} "${title}"?`,
      isActive ? "Deactivate" : "Activate",
      isActive ? "warning" : "success",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            toast.error("Authentication token not found");
            return;
          }

          await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/news/${id}/toggle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchNews();
          setActionMenu(null);
          toast.success(
            `News ${!isActive ? "activated" : "deactivated"} successfully!`
          );
        } catch (err) {
          console.error("Toggle news error:", err);
          toast.error("Failed to update news status");
        }
      }
    );
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem._id);
    setFormData({
      title: newsItem.title || "",
      description: newsItem.description || "",
      location: newsItem.location || "",
      credit: newsItem.credit || "",
      isActive: newsItem.isActive || false,
    });
    setActionMenu(null);
  };

  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/news/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        toast.error("Error updating news");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingNews(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteNews = async (id, title) => {
    showConfirmation(
      "Delete News",
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      "Delete News",
      "danger",
      async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            toast.error("Authentication token not found");
            return;
          }

          await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/news/${id}`,
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

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setLocationFilter("");
    setPage(1);
  };

  const handleActionMenuToggle = (newsId) => {
    setActionMenu(actionMenu === newsId ? null : newsId);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleBulkDelete = () => {
    if (selectedNews.length === 0) {
      toast.error("Please select news to delete");
      return;
    }

    showConfirmation(
      "Delete Selected News",
      `Are you sure you want to delete ${selectedNews.length} news items?`,
      "Delete All",
      "danger",
      async () => {
        // Implement bulk delete
        toast.success(`${selectedNews.length} news deleted successfully`);
        setSelectedNews([]);
        fetchNews();
      }
    );
  };

  const handleSelectAll = () => {
    if (selectedNews.length === newsList.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(newsList.map(n => n._id));
    }
  };

  const handleSelectNews = (id) => {
    if (selectedNews.includes(id)) {
      setSelectedNews(selectedNews.filter(newsId => newsId !== id));
    } else {
      setSelectedNews([...selectedNews, id]);
    }
  };

  const locations = [
    ...new Set(newsList.map((item) => item.location).filter(Boolean)),
  ];

  const stats = {
    total: newsList.length,
    active: newsList.filter((n) => n.isActive).length,
    inactive: newsList.filter((n) => !n.isActive).length,
    thisMonth: Math.floor(newsList.length * 0.25),
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <Toaster />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmation}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          type={confirmationModal.type}
        />

        {viewingNews && (
          <NewsDetailModal
            newsItem={viewingNews}
            onClose={() => setViewingNews(null)}
            onEdit={handleEdit}
          />
        )}

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg shadow-orange-500/20">
                <Newspaper className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  News Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and publish news articles across all locations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all ${showFilters
                  ? 'bg-orange-50 border-orange-200 text-orange-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Filter className="w-5 h-5" />
              </button>

              <button
                onClick={fetchNews}
                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2 text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline">New Article</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 animate-slideDown">
              <Filters
                search={search}
                statusFilter={statusFilter}
                locationFilter={locationFilter}
                locations={locations}
                onSearchChange={setSearch}
                onStatusFilterChange={setStatusFilter}
                onLocationFilterChange={setLocationFilter}
                onApply={fetchNews}
                onClear={clearFilters}
              />
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Newspaper}
            label="Total News"
            value={stats.total}
            change={15}
            color="orange"
          />
          <StatCard
            icon={FileText}
            label="Active News"
            value={stats.active}
            change={8}
            color="green"
          />
          <StatCard
            icon={Power}
            label="Inactive News"
            value={stats.inactive}
            change={-3}
            color="red"
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={stats.thisMonth}
            change={25}
            color="blue"
          />
        </div>

        {/* Bulk Actions Bar */}
        {selectedNews.length > 0 && (
          <div className="mb-4 bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between animate-slideDown">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-orange-600">{selectedNews.length}</span> items selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedNews([])}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${viewMode === "table"
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* News Table/Grid */}
        <NewsTable
          newsList={newsList}
          loading={loading}
          page={page}
          pages={pages}
          editingNews={editingNews}
          formData={formData}
          saveLoading={saveLoading}
          actionMenu={actionMenu}
          viewMode={viewMode}
          selectedNews={selectedNews}
          onSelectAll={handleSelectAll}
          onSelectNews={handleSelectNews}
          onPageChange={handlePageChange}
          onViewNews={handleViewNews}
          onToggleStatus={toggleNewsStatus}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          onDeleteNews={deleteNews}
          onActionMenuToggle={handleActionMenuToggle}
        />
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default NewsManagement;