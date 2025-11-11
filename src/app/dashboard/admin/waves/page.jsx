"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/waves/ConfirmationModal";
import Filters from "@/components/modules/dashboard/waves/Filters";
import StatCard from "@/components/modules/dashboard/waves/StatCard";
import WaveForm from "@/components/modules/dashboard/waves/WaveForm";
import WaveTable from "@/components/modules/dashboard/waves/WaveTable";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { Mic2, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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

  // Create or update wave
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

  // Edit wave
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

  // Handle view YouTube video
  const handleView = (youtubeUrl) => {
    window.open(youtubeUrl, '_blank');
  };

  // Handle action menu toggle
  const handleActionMenuToggle = (waveId) => {
    setActionMenu(actionMenu === waveId ? null : waveId);
  };

  // Filtered waves based on search
  const filteredWaves = waves.filter(wave =>
    wave.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchWaves();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <Toaster />

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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={Mic2}
              label="Total Sessions"
              value={waves.length}
              change={18}
              color="indigo"
            />
            <StatCard
              icon={Mic2}
              label="Videos"
              value={waves.length}
              change={12}
              color="blue"
            />
            <StatCard
              icon={Mic2}
              label="This Month"
              value={Math.floor(waves.length * 0.25)}
              change={25}
              color="green"
            />
            <StatCard
              icon={Mic2}
              label="Growth"
              value={`${Math.floor(waves.length * 2)}%`}
              change={20}
              color="purple"
            />
          </div>

          {/* Search and Filters */}
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onApply={fetchWaves}
          />

          {/* Wave Form */}
          <WaveForm
            showForm={showForm}
            editingItem={editingItem}
            formData={formData}
            saveLoading={saveLoading}
            onClose={resetForm}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
          />

          {/* Wave Table */}
          <WaveTable
            waves={filteredWaves}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            actionMenu={actionMenu}
            onActionMenuToggle={handleActionMenuToggle}
          />
        </div>
      </div>
    </AdminLayout>
  );
}