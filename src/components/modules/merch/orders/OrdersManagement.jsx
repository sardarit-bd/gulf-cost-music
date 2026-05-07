"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { RefreshCw, Truck, Plus } from "lucide-react";
import DeleteConfirmationModal from "../../admin/photographers/DeleteConfirmationModal";
import OrderDetailModal from "./OrderManagement/OrderDetailModal";
import OrderTable from "./OrderManagement/OrderTable";
import OrderStats from "./OrderManagement/OrderStats";


export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const getTokenFromCookies = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, statusFilter, paymentFilter]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
      });

      const { data } = await axios.get(`${API_BASE}/api/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalOrders(data.total || 0);
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentFilter("all");
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    setStatusUpdateLoading(orderId);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.put(
        `${API_BASE}/api/orders/${orderId}/status`,
        { deliveryStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(currentPage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setStatusUpdateLoading(null);
      setDropdownOpen(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    setStatusUpdateLoading(orderId);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.put(
        `${API_BASE}/api/orders/${orderId}/payment-status`,
        { paymentStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(`Payment status updated to ${newStatus}`);
        fetchOrders(currentPage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update payment status");
    } finally {
      setStatusUpdateLoading(null);
      setDropdownOpen(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    setActionLoading(orderToDelete);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.delete(`${API_BASE}/api/orders/${orderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order deleted successfully!");
      fetchOrders(currentPage);
      setShowDetailsModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    } finally {
      setActionLoading(null);
      setOrderToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
    setDropdownOpen(null);
  };

  const openDeleteModal = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  };

  const toggleDropdown = (orderId) => {
    setDropdownOpen(dropdownOpen === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.buyer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.merch?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: totalOrders,
    pending: orders.filter((order) => order.deliveryStatus === "pending").length,
    delivered: orders.filter((order) => order.deliveryStatus === "delivered").length,
    paid: orders.filter((order) => order.paymentStatus === "paid").length,
    pendingPayment: orders.filter((order) => order.paymentStatus === "pending").length,
    cancelled: orders.filter((order) => order.deliveryStatus === "cancelled").length,
    revenue: orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.totalPrice, 0),
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || paymentFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            Order Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all customer orders efficiently
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 lg:mt-0">
          <button
            onClick={() => fetchOrders(currentPage)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStats stats={stats} />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        loading={loading}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearSearch={clearSearch}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        activeSearchTerm={searchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        totalOrders={totalOrders}
        onPageChange={setCurrentPage}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={toggleDropdown}
        onViewDetails={handleViewDetails}
        onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onDeleteOrder={openDeleteModal}
        statusUpdateLoading={statusUpdateLoading}
        actionLoading={actionLoading}
      />

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailsModal(false)}
          onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onDeleteOrder={openDeleteModal}
          statusUpdateLoading={statusUpdateLoading}
          actionLoading={actionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setOrderToDelete(null);
        }}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete Order"
        cancelText="Cancel"
        loading={actionLoading === orderToDelete}
        type="danger"
      />
    </div>
  );
}