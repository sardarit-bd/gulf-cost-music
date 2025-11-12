"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/news/ConfirmationModal";
import Filters from "@/components/modules/dashboard/news/Filters";
import NewsDetailModal from "@/components/modules/dashboard/news/NewsDetailModal";
import NewsTable from "@/components/modules/dashboard/news/NewsTable";
import StatCard from "@/components/modules/dashboard/news/StatCard";
import axios from "axios";
import { FileText, Newspaper, Power, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
      // toast.success('News loaded successfully');
    } catch (err) {
      console.error("Fetch news error:", err);
      toast.error('Failed to load news');
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
      `Are you sure you want to ${action} "${title}"? ${isActive
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

  const handleCancel = () => {
    setEditingNews(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setLocationFilter("");
    setPage(1);
  };

  const handleActionMenuToggle = (newsId) => {
    setActionMenu(actionMenu === newsId ? null : newsId);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, locationFilter]);

  const locations = [...new Set(newsList.map(item => item.location).filter(Boolean))];

  const stats = {
    total: newsList.length,
    active: newsList.filter(n => n.isActive).length,
    inactive: newsList.filter(n => !n.isActive).length,
    thisMonth: Math.floor(newsList.length * 0.25),
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          />

          {viewingNews && (
            <NewsDetailModal
              newsItem={viewingNews}
              onClose={() => setViewingNews(null)}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsManagement;