"use client";

import axios from "axios";
import {
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Eye,
    Filter,
    Loader2,
    MapPin,
    MoreVertical,
    Package,
    Phone,
    RefreshCw,
    Search,
    ShoppingCart,
    Truck,
    User,
    Wallet,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setOrders(data.data || []);
            }
        } catch (error) {
            console.error("Order fetch error:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDelivered = async (orderId) => {
        if (!confirm("Are you sure you want to mark this order as delivered?")) return;

        setActionLoading(orderId);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put(
                `${API_BASE}/api/orders/${orderId}/deliver`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success) {
                toast.success("🎉 Order marked as delivered!");
                fetchOrders();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to update order status";
            toast.error(errorMsg);
        } finally {
            setActionLoading(null);
            setDropdownOpen(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

        setActionLoading(orderId);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("🗑️ Order deleted successfully!");
            fetchOrders();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to delete order";
            toast.error(errorMsg);
        } finally {
            setActionLoading(null);
            setDropdownOpen(null);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
        setDropdownOpen(null);
    };

    const toggleDropdown = (orderId) => {
        setDropdownOpen(dropdownOpen === orderId ? null : orderId);
    };

    const getStatusBadge = (order) => {
        const status = order.deliveryStatus;
        const paymentStatus = order.paymentStatus;

        const statusConfig = {
            pending: {
                color: "bg-amber-50 text-amber-700 border border-amber-200",
                icon: Clock,
                text: "Pending"
            },
            delivered: {
                color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                icon: CheckCircle,
                text: "Delivered"
            },
            cancelled: {
                color: "bg-rose-50 text-rose-700 border border-rose-200",
                icon: XCircle,
                text: "Cancelled"
            },
            shipped: {
                color: "bg-blue-50 text-blue-700 border border-blue-200",
                icon: Truck,
                text: "Shipped"
            }
        };

        const paymentConfig = {
            pending: {
                color: "bg-orange-50 text-orange-700 border border-orange-200",
                text: "Pending",
                icon: Clock
            },
            paid: {
                color: "bg-green-50 text-green-700 border border-green-200",
                text: "Paid",
                icon: CheckCircle
            },
            failed: {
                color: "bg-red-50 text-red-700 border border-red-200",
                text: "Failed",
                icon: XCircle
            },
            refunded: {
                color: "bg-purple-50 text-purple-700 border border-purple-200",
                text: "Refunded",
                icon: RefreshCw
            }
        };

        const StatusIcon = statusConfig[status]?.icon || Clock;
        const PaymentStatus = paymentConfig[paymentStatus] || paymentConfig.pending;

        return (
            <div className="flex flex-col gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig[status]?.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig[status]?.text || status}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${PaymentStatus.color}`}>
                    <PaymentStatus.icon className="w-3 h-3" />
                    {PaymentStatus.text}
                </span>
            </div>
        );
    };

    const getPaymentMethodBadge = (method) => {
        const config = {
            stripe: {
                color: "bg-indigo-50 text-indigo-700 border border-indigo-200",
                text: "Stripe",
                icon: CreditCard
            },
            cod: {
                color: "bg-violet-50 text-violet-700 border border-violet-200",
                text: "Cash on Delivery",
                icon: Wallet
            },
            card: {
                color: "bg-teal-50 text-teal-700 border border-teal-200",
                text: "Credit Card",
                icon: CreditCard
            }
        };
        const methodConfig = config[method] || config.cod;
        const Icon = methodConfig.icon;

        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${methodConfig.color}`}>
                <Icon className="w-4 h-4" />
                {methodConfig.text}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.buyer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.merch?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter;
        const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Statistics with better data
    const stats = {
        total: orders.length,
        pending: orders.filter(order => order.deliveryStatus === "pending").length,
        delivered: orders.filter(order => order.deliveryStatus === "delivered").length,
        paid: orders.filter(order => order.paymentStatus === "paid").length,
        pendingPayment: orders.filter(order => order.paymentStatus === "pending").length,
        cancelled: orders.filter(order => order.deliveryStatus === "cancelled").length,
        revenue: orders
            .filter(order => order.paymentStatus === "paid")
            .reduce((sum, order) => sum + order.totalPrice, 0)
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setPaymentFilter("all");
        setShowFilters(false);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (searchTerm) count++;
        if (statusFilter !== "all") count++;
        if (paymentFilter !== "all") count++;
        return count;
    };

    // Format price to 2 decimal places
    const formatPrice = (price) => {
        if (typeof price !== 'number') return '0.00';
        return price.toFixed(2);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
                <div className="max-w-12xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Order Management
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">Manage and track all customer orders efficiently</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchOrders}
                            disabled={loading}
                            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                            )}
                            Refresh Orders
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-12xl mx-auto px-6 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Delivery</p>
                                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">${formatPrice(stats.revenue)}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/60 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-900">Order Filters</h3>
                            {getActiveFilterCount() > 0 && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {getActiveFilterCount()} active
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search orders by customer, product, email, or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500 transition-all duration-200"
                        />
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/60 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                                >
                                    <option value="all">All Delivery Status</option>
                                    <option value="pending">🟡 Pending</option>
                                    <option value="shipped">🚚 Shipped</option>
                                    <option value="delivered">✅ Delivered</option>
                                    <option value="cancelled">❌ Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Status
                                </label>
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                                >
                                    <option value="all">All Payment Status</option>
                                    <option value="pending">⏳ Payment Pending</option>
                                    <option value="paid">💰 Paid</option>
                                    <option value="failed">❌ Failed</option>
                                    <option value="refunded">↩️ Refunded</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders Table Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    All Orders
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Showing {filteredOrders.length} of {orders.length} orders
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : 'opacity-0'}`} />
                                {loading ? 'Loading...' : 'Updated just now'}
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-20"></div>
                            </div>
                            <p className="text-gray-600 mt-4 text-lg">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                {orders.length === 0
                                    ? "No orders have been placed yet. Orders will appear here when customers make purchases."
                                    : "No orders match your current filters. Try adjusting your search or filters."
                                }
                            </p>
                            {orders.length === 0 && (
                                <button
                                    onClick={fetchOrders}
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                                >
                                    Check for New Orders
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        {[
                                            "Order ID",
                                            "Customer",
                                            "Product",
                                            "Qty",
                                            "Total",
                                            "Payment",
                                            "Status",
                                            "Order Date",
                                            "Actions"
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/60">
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/30 transition-all duration-200 group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <div className="font-mono text-sm font-semibold text-gray-900">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {order.buyer?.username || "N/A"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.buyer?.email || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={order.merch?.image}
                                                        alt={order.merch?.name}
                                                        className="w-12 h-12 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                                                    />
                                                    <div className="max-w-xs">
                                                        <div className="font-medium text-gray-900 truncate">
                                                            {order.merch?.name || "Product Deleted"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ${formatPrice(order.merch?.price || 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                    {order.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                                    <span className="font-bold text-emerald-700 text-lg">
                                                        ${formatPrice(order.totalPrice)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getPaymentMethodBadge(order.paymentMethod)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatTime(order.createdAt)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end">
                                                    <div className="relative dropdown-container">
                                                        <button
                                                            onClick={() => toggleDropdown(order._id)}
                                                            className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-110"
                                                            title="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {dropdownOpen === order._id && (
                                                            <div className="absolute right-0 top-10 z-50 w-48 bg-white rounded-xl shadow-2xl border border-gray-200/60 backdrop-blur-sm">
                                                                <div className="p-2 space-y-1">
                                                                    {/* View Details Button */}
                                                                    <button
                                                                        onClick={() => handleViewDetails(order)}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                                                                    >
                                                                        <Eye className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                                                        <span className="font-medium">View Details</span>
                                                                    </button>

                                                                    {/* Mark as Delivered Button */}
                                                                    {order.deliveryStatus === "pending" && (
                                                                        <button
                                                                            onClick={() => handleMarkDelivered(order._id)}
                                                                            disabled={actionLoading === order._id}
                                                                            className="w-full flex items-center gap-3 px-4 py-3 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                                                                        >
                                                                            {actionLoading === order._id ? (
                                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                            ) : (
                                                                                <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                                            )}
                                                                            <span className="font-medium">Mark Delivered</span>
                                                                        </button>
                                                                    )}

                                                                    {/* Delete Order Button */}
                                                                    {order.deliveryStatus !== "delivered" && (
                                                                        <button
                                                                            onClick={() => handleDeleteOrder(order._id)}
                                                                            disabled={actionLoading === order._id}
                                                                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                                                                        >
                                                                            {actionLoading === order._id ? (
                                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                            ) : (
                                                                                <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                                            )}
                                                                            <span className="font-medium">Delete Order</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal - Keep this part the same as before */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setShowDetailsModal(false)}
                    ></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto z-10">
                        <div className="p-8">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                                        <Truck className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">Order Details</h2>
                                        <p className="text-gray-500 font-mono mt-1">
                                            ID: #{selectedOrder._id}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Order Summary Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/60">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                                            </div>
                                            Order Summary
                                        </h3>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Order Date</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {formatDate(selectedOrder.createdAt)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatTime(selectedOrder.createdAt)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Payment Method</p>
                                                    <div className="mt-2">
                                                        {getPaymentMethodBadge(selectedOrder.paymentMethod)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Amount</p>
                                                    <p className="text-3xl font-bold text-emerald-600">
                                                        ${formatPrice(selectedOrder.totalPrice)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Payment Status</p>
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mt-2 ${selectedOrder.paymentStatus === "paid"
                                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                        : selectedOrder.paymentStatus === "pending"
                                                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                            : "bg-rose-100 text-rose-700 border border-rose-200"
                                                        }`}>
                                                        {selectedOrder.paymentStatus === "paid" && <CheckCircle className="w-4 h-4" />}
                                                        {selectedOrder.paymentStatus === "pending" && <Clock className="w-4 h-4" />}
                                                        {selectedOrder.paymentStatus === "failed" && <XCircle className="w-4 h-4" />}
                                                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery Status */}
                                        <div className="mt-6 pt-6 border-t border-blue-200/60">
                                            <p className="text-sm text-gray-600 mb-3">Delivery Status</p>
                                            <span className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${selectedOrder.deliveryStatus === "delivered"
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                : selectedOrder.deliveryStatus === "pending"
                                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                    : selectedOrder.deliveryStatus === "shipped"
                                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                                        : "bg-rose-100 text-rose-700 border border-rose-200"
                                                }`}>
                                                {selectedOrder.deliveryStatus === "delivered" && <CheckCircle className="w-5 h-5" />}
                                                {selectedOrder.deliveryStatus === "pending" && <Clock className="w-5 h-5" />}
                                                {selectedOrder.deliveryStatus === "shipped" && <Truck className="w-5 h-5" />}
                                                {selectedOrder.deliveryStatus === "cancelled" && <XCircle className="w-5 h-5" />}
                                                {selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <User className="w-5 h-5 text-purple-600" />
                                            </div>
                                            Customer Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-lg">
                                                        {selectedOrder.buyer?.username || "N/A"}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {selectedOrder.buyer?.email || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Information */}
                                    {selectedOrder.shippingInfo && (
                                        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-green-600" />
                                                </div>
                                                Shipping Information
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-50/50 rounded-xl">
                                                    <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {selectedOrder.shippingInfo.address}
                                                    </p>
                                                </div>
                                                {selectedOrder.shippingInfo.city && (
                                                    <div className="flex items-center gap-4 text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{selectedOrder.shippingInfo.city}</span>
                                                    </div>
                                                )}
                                                {selectedOrder.shippingInfo.phone && (
                                                    <div className="flex items-center gap-4 text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{selectedOrder.shippingInfo.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Product Information */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <Package className="w-5 h-5 text-orange-600" />
                                            </div>
                                            Product Information
                                        </h3>
                                        {selectedOrder.merch ? (
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-6">
                                                    <img
                                                        src={selectedOrder.merch.image}
                                                        alt={selectedOrder.merch.name}
                                                        className="w-28 h-28 object-cover rounded-2xl border-2 border-gray-200 shadow-sm"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 text-2xl mb-2">
                                                            {selectedOrder.merch.name}
                                                        </h4>
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {selectedOrder.merch.description || "No description available"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/60">
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-600 mb-2">Unit Price</p>
                                                        <p className="text-2xl font-bold text-emerald-600">
                                                            ${formatPrice(selectedOrder.merch.price)}
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-600 mb-2">Quantity</p>
                                                        <p className="text-2xl font-bold text-blue-600">
                                                            {selectedOrder.quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/60">
                                                    <p className="text-sm text-emerald-600 mb-2">Order Total</p>
                                                    <p className="text-3xl font-bold text-emerald-700">
                                                        ${formatPrice(selectedOrder.totalPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                    <Package className="w-10 h-10 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium text-lg">Product Not Available</p>
                                                <p className="text-gray-400 mt-2">
                                                    This product may have been removed from the catalog
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Actions</h3>
                                        <div className="space-y-4">
                                            {selectedOrder.deliveryStatus === "pending" && (
                                                <button
                                                    onClick={() => {
                                                        handleMarkDelivered(selectedOrder._id);
                                                        setShowDetailsModal(false);
                                                    }}
                                                    disabled={actionLoading === selectedOrder._id}
                                                    className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                                                >
                                                    {actionLoading === selectedOrder._id ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-6 h-6" />
                                                    )}
                                                    <span className="text-lg font-semibold">Mark as Delivered</span>
                                                </button>
                                            )}

                                            {selectedOrder.deliveryStatus !== "delivered" && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
                                                            handleDeleteOrder(selectedOrder._id);
                                                            setShowDetailsModal(false);
                                                        }
                                                    }}
                                                    disabled={actionLoading === selectedOrder._id}
                                                    className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                                                >
                                                    {actionLoading === selectedOrder._id ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-6 h-6" />
                                                    )}
                                                    <span className="text-lg font-semibold">Delete Order</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setShowDetailsModal(false)}
                                                className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                                            >
                                                Close Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}