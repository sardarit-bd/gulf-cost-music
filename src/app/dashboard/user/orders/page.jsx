"use client";

import axios from "axios";
import {
  Calendar,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Truck,
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

export default function UserOrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

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
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load order data.");
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      value: "processing",
      label: "Processing",
      icon: RefreshCw,
      color: "text-indigo-600",
    },
    {
      value: "ready-for-pickup",
      label: "Ready for Pickup",
      icon: Package,
      color: "text-purple-600",
    },
    { value: "shipped", label: "Shipped", icon: Truck, color: "text-cyan-600" },
    {
      value: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-600",
    },
  ];

  const getIndex = (status) => statuses.findIndex((s) => s.value === status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">📦 My Orders</h1>

        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="w-10 h-10 animate-spin mx-auto text-blue-600" />
            <p className="mt-3 text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-400 mx-auto" />
            <p className="text-xl text-gray-500 mt-4">No orders found.</p>
            <p className="text-gray-400">Your orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const current = getIndex(order.deliveryStatus);

              return (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <span className="flex items-center text-gray-600 gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-4 items-center mb-6">
                    <img
                      src={order.merch?.image}
                      className="w-20 h-20 rounded-xl border object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {order.merch?.name}
                      </p>
                      <p className="text-gray-500">
                        {order.quantity} × ${order.merch?.price}
                      </p>
                      <p className="font-bold text-emerald-600 text-lg mt-1">
                        Total: ${order.totalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative mt-6">
                    <div className="flex justify-between mb-3">
                      {statuses.slice(0, 6).map((item, i) => {
                        const Icon = item.icon;
                        const active = i <= current;

                        return (
                          <div
                            key={item.value}
                            className="flex flex-col items-center w-full text-center"
                          >
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full border
                                                                ${active
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-gray-100 text-gray-400 border-gray-300"
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <p
                              className={`text-xs mt-2 ${active ? "text-gray-900" : "text-gray-400"
                                }`}
                            >
                              {item.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                    <div
                      className="absolute top-4 left-0 h-1 bg-blue-600 transition-all -z-10"
                      style={{ width: `${(current / 5) * 100}%` }}
                    ></div>
                  </div>

                  {order.deliveryStatus === "cancelled" && (
                    <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex gap-3 items-center">
                      <XCircle className="text-rose-600 w-6 h-6" />
                      <p className="text-rose-700 font-medium">
                        This order has been cancelled.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
