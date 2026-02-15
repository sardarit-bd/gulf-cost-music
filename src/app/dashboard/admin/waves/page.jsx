"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ConfirmationModal from "@/components/modules/dashboard/waves/ConfirmationModal";
import Filters from "@/components/modules/dashboard/waves/Filters";
import StatCard from "@/components/modules/dashboard/waves/StatCard";
import WaveForm from "@/components/modules/dashboard/waves/WaveForm";
import WaveSectionTextEditor from "@/components/modules/dashboard/waves/WaveSectionTextEditor";
import WaveTable from "@/components/modules/dashboard/waves/WaveTable";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { Mic2, Plus, Settings } from "lucide-react";
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
    youtubeUrl: "",
    description: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [showSectionTextEditor, setShowSectionTextEditor] = useState(false);

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "warning",
    onConfirm: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(getCookie("token"));
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
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
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

  // Fetch section text
  const fetchSectionText = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/waves/section-text`);
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error("Failed to fetch section text:", error);
    }
    return null;
  };

  // Create or update wave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const currentToken = token || getCookie("token");
      if (!currentToken) {
        toast.error("Authentication token not found");
        return;
      }

      const headers = {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      };

      let response;
      if (editingItem) {
        response = await axios.put(
          `${API_BASE}/api/waves/${editingItem._id}`,
          formData,
          { headers }
        );
      } else {
        response = await axios.post(`${API_BASE}/api/waves`, formData, {
          headers,
        });
      }

      if (response.data.success) {
        toast.success(
          editingItem
            ? "Wave updated successfully!"
            : "Wave added successfully!"
        );
        resetForm();
        fetchWaves();
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(handleApiError(error, "Failed to save wave"));
    } finally {
      setSaveLoading(false);
    }
  };

  // Edit wave
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      youtubeUrl: item.youtubeUrl || "",
      description: item.description || "",
    });
    setShowForm(true);
    setActionMenu(null);
  };

  // Delete wave with confirmation
  const handleDelete = (id, title) => {
    showConfirmation(
      "Delete Wave",
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      "Delete Wave",
      "danger",
      async () => {
        try {
          const currentToken = token || getCookie("token");
          if (!currentToken) {
            toast.error("Authentication token not found");
            return;
          }

          const headers = { Authorization: `Bearer ${currentToken}` };
          await axios.delete(`${API_BASE}/api/waves/${id}`, { headers });
          fetchWaves();
          setActionMenu(null);
          toast.success("Wave deleted successfully!");
        } catch (error) {
          toast.error(handleApiError(error, "Failed to delete wave"));
        }
      }
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      youtubeUrl: "",
      description: "",
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
      // success: "Data refreshed successfully!",
      error: "Failed to refresh data",
    });
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle view YouTube video
  const handleView = (youtubeUrl) => {
    window.open(youtubeUrl, "_blank");
  };

  // Handle action menu toggle
  const handleActionMenuToggle = (waveId) => {
    setActionMenu(actionMenu === waveId ? null : waveId);
  };

  // Filtered waves based on search
  const filteredWaves = waves.filter((wave) =>
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

        <div className="">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Mic2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                Waves Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage waves, videos, and section text
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              {/* <button
                
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium transition-colors"
                title="Edit Section Text"
              >
                <Text className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Header Text</span>
                <span className="sm:hidden">Text</span>
              </button> */}

              <button
                onClick={() => setShowSectionTextEditor(true)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Page Settings
              </button>
              {/* <button
                onClick={handleRefresh}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button> */}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-6 sm:px-4 py-3 bg-[var(--primary)] text-black rounded-lg hover:bg-primary/80 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Wave</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={Mic2}
              label="Total Waves"
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

          {/* Section Text Editor Modal */}
          {showSectionTextEditor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <WaveSectionTextEditor
                  onClose={() => setShowSectionTextEditor(false)}
                  token={token || getCookie("token")}
                  API_BASE={API_BASE}
                />
              </div>
            </div>
          )}

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