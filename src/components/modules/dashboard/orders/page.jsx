"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Calendar,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Utility to get cookie safely
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function UniversalOrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userRole, setUserRole] = useState("");
  const { user } = useAuth();

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const { data } = await axios.get(`${API_BASE}/api/orders/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.data);
        setFilteredOrders(data.data);
        setUserRole(data.userRole || user?.role || user?.userType || "user");
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      toast.error("Failed to load order data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.merch?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.buyer?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.deliveryStatus === statusFilter
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const statuses = [
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      value: "processing",
      label: "Processing",
      icon: RefreshCw,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      value: "ready-for-pickup",
      label: "Ready for Pickup",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      value: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
  ];

  const getIndex = (status) => statuses.findIndex((s) => s.value === status);

  const getRoleDisplayName = (role) => {
    const roleNames = {
      artist: "Artist",
      venue: "Venue",
      journalist: "Journalist",
      admin: "Administrator",
      user: "Customer",
    };
    return roleNames[role] || role;
  };

  const getStatusInfo = (status) => {
    return statuses.find((s) => s.value === status) || statuses[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6 mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {userRole === "admin" ? "📦 Order Management" : "📦 My Orders"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {userRole === "admin"
              ? "Manage and track all customer orders in one place"
              : "Track your merchandise orders and delivery status"}
          </p>
        </div>

        {/* Stats and Role Badge */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      orders.filter((o) => o.deliveryStatus === "delivered")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-500">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {userRole === "admin" && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                <Users className="w-4 h-4" />
                Admin Dashboard
              </div>
            )}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium capitalize shadow-lg">
              {getRoleDisplayName(userRole)} View
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-lg text-gray-600">Loading your orders...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait a moment</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl font-semibold text-gray-500 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No orders found"
                : "No orders yet"}
            </p>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search terms or filters"
                : userRole === "admin"
                ? "Orders will appear here once customers start placing orders"
                : "Start shopping to see your orders here"}
            </p>
            {searchTerm || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            ) : (
              userRole !== "admin" && (
                <button
                  onClick={() => (window.location.href = "/merch")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Browse Merchandise
                </button>
              )
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-600 text-lg">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {orders.length}
                </span>{" "}
                orders
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset filters
                </button>
              )}
            </div>

            {/* Orders Grid */}
            <div className="grid gap-6">
              {filteredOrders.map((order) => {
                const currentStatus = getStatusInfo(order.deliveryStatus);
                const currentIndex = getIndex(order.deliveryStatus);
                const progressPercentage = (currentIndex / 5) * 100;

                return (
                  <div
                    key={order._id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${currentStatus.bgColor} border ${currentStatus.borderColor}`}
                        >
                          <currentStatus.icon
                            className={`w-6 h-6 ${currentStatus.color}`}
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h2>
                          {userRole === "admin" && order.buyer && (
                            <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                              Customer:{" "}
                              <span className="font-medium">
                                {order.buyer.username}
                              </span>
                              {order.buyer.userType && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                  {getRoleDisplayName(order.buyer.userType)}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : order.paymentStatus === "pending"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          Payment:{" "}
                          {order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </span>
                        <span className="flex items-center text-gray-600 gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex gap-6 items-start mb-6 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={order.merch?.image}
                        alt={order.merch?.name}
                        className="w-24 h-24 rounded-xl border-2 border-white shadow-sm object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg mb-2">
                          {order.merch?.name}
                        </p>
                        <p className="text-gray-600 mb-3">
                          {order.quantity} × ${order.merch?.price}
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {order.merch?.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <p className="font-bold text-emerald-600 text-xl">
                            Total: ${order.totalPrice}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.color}`}
                          >
                            {currentStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="relative mt-8">
                      <div className="flex justify-between mb-4">
                        {statuses.slice(0, 6).map((item, index) => {
                          const Icon = item.icon;
                          const isActive = index <= currentIndex;
                          const isCurrent = index === currentIndex;

                          return (
                            <div
                              key={item.value}
                              className="flex flex-col items-center w-full text-center relative z-10"
                            >
                              <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                  isActive
                                    ? isCurrent
                                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                      : "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-400 border-gray-300"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <p
                                className={`text-xs mt-3 font-medium transition-colors ${
                                  isActive ? "text-gray-900" : "text-gray-400"
                                }`}
                              >
                                {item.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded-full -z-10"></div>
                      <div
                        className="absolute top-5 left-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out -z-10 shadow-md"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    {/* Cancelled Order Notice */}
                    {order.deliveryStatus === "cancelled" && (
                      <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex gap-3 items-center animate-pulse">
                        <XCircle className="text-rose-600 w-6 h-6 flex-shrink-0" />
                        <div>
                          <p className="text-rose-800 font-semibold">
                            Order Cancelled
                          </p>
                          <p className="text-rose-600 text-sm mt-1">
                            This order has been cancelled and is no longer
                            active.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
