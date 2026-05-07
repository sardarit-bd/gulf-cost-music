"use client";

import axios from "axios";
import {
  DollarSign,
  Edit,
  Eye,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
  XCircle,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./ProductManagement/DeleteConfirmationModal";
import ProductDetailModal from "./ProductManagement/ProductDetailModal";
import ProductFormModal from "./ProductManagement/ProductFormModal";
import ProductTable from "./ProductManagement/ProductTable";
import ProductStats from "./ProductManagement/ProductStats";

export default function ProductManagement() {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // Get token from cookies
  const getTokenFromCookies = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  const fetchMerch = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.get(`${API_BASE}/api/merch`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setMerchItems(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    setActionLoading(id);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.delete(`${API_BASE}/api/merch/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product deleted successfully!");
      fetchMerch();
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const toggleProductStatus = async (item) => {
    setActionLoading(item._id);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("price", item.price);
      formData.append("description", item.description || "");
      formData.append("stock", item.stock);
      formData.append("quantity", item.quantity || "1");
      formData.append("isActive", !item.isActive);

      const response = await axios.put(
        `${API_BASE}/api/merch/${item._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(`Product ${item.isActive ? "deactivated" : "activated"} successfully!`);
        setMerchItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem._id === item._id
              ? { ...prevItem, isActive: !item.isActive }
              : prevItem
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product status");
      fetchMerch();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const filteredItems = merchItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.isActive) ||
      (statusFilter === "inactive" && !item.isActive) ||
      (statusFilter === "outOfStock" && item.stock <= 0);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: merchItems.length,
    active: merchItems.filter((item) => item.isActive).length,
    inactive: merchItems.filter((item) => !item.isActive).length,
    outOfStock: merchItems.filter((item) => item.stock <= 0).length,
    inStock: merchItems.filter((item) => item.stock > 0).length,
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header - Matching Events Page */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            Product Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, edit and manage your product inventory
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 lg:mt-0">
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Matching Events Page Style */}
      <ProductStats stats={stats} />

      {/* Product Table with Search Inside */}
      <ProductTable
        products={filteredItems}
        loading={loading}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearSearch={clearSearch}
        hasActiveFilters={searchTerm !== ""}
        activeSearchTerm={searchTerm}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onToggleStatus={toggleProductStatus}
        actionLoading={actionLoading}
      />

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          editingItem={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSuccess={fetchMerch}
          API_BASE={API_BASE}
          getTokenFromCookies={getTokenFromCookies}
        />
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setShowDetailsModal(false)}
          onEdit={handleEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmationModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={actionLoading === deleteTarget._id}
        />
      )}
    </div>
  );
}