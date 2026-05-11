"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/news/ConfirmationModal";
import NewsDetailModal from "@/components/modules/dashboard/news/NewsDetailModal";
import NewsTable from "@/components/modules/dashboard/news/NewsTable";
import StatCard from "@/components/modules/dashboard/news/StatCard";
import axios from "axios";
import {
  FileText,
  Newspaper,
  Power,
  RefreshCw,
  Search,
  TrendingUp,
  X
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
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [viewingNews, setViewingNews] = useState(null);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null,
  });

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/news`;

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
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
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
      toast.error(err.response?.data?.message || "Error updating news");
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
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleActionMenuToggle = (newsId) => {
    setActionMenu(actionMenu === newsId ? null : newsId);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, search]);

  const stats = {
    total: newsList.length,
    active: newsList.filter((n) => n.isActive).length,
    inactive: newsList.filter((n) => !n.isActive).length,
    thisMonth: Math.floor(newsList.length * 0.25),
  };

  const hasActiveFilters = search !== "" || statusFilter !== "all";

  if (loading && newsList.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen py-20 bg-white">
          <div className="text-center">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500 mx-auto mb-4"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <Toaster position="top-right" />

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

        {/* Header - Matching Events Page */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              News Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage news articles, publish/unpublish, and monitor content
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 lg:mt-0">
            <button
              onClick={fetchNews}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Matching Events Page Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={Newspaper}
            label="Total News"
            value={stats.total}
            color="orange"
          />
          <StatCard
            icon={FileText}
            label="Active News"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={Power}
            label="Inactive News"
            value={stats.inactive}
            color="red"
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={stats.thisMonth}
            color="blue"
          />
        </div>

        {/* News Table with Search Inside */}
        <NewsTable
          newsList={newsList}
          loading={loading}
          page={page}
          pages={pages}
          editingNews={editingNews}
          formData={formData}
          saveLoading={saveLoading}
          actionMenu={actionMenu}
          onPageChange={handlePageChange}
          onViewNews={handleViewNews}
          onToggleStatus={toggleNewsStatus}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          onDeleteNews={deleteNews}
          onActionMenuToggle={handleActionMenuToggle}
          // Search props only
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          activeSearchTerm={search}
        />
      </div>
    </AdminLayout>
  );
};

export default NewsManagement;