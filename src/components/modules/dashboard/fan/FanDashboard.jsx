// src/app/dashboard/fan/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  MapPin,
  MapPinned,
  Package,
  Phone,
  ShoppingBag,
  Store,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FanDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    upcomingEvents: 0,
    favorites: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      // Fetch orders
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const ordersData = await ordersRes.json();

      const orders = ordersData.data || [];
      const totalSpent = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );

      // Fetch market listings (if user has any)
      const marketRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const marketData = await marketRes.json();

      setStats({
        totalOrders: orders.length,
        upcomingEvents: 0, // Will be implemented later
        favorites: 0, // Will be implemented later
        totalSpent: totalSpent,
      });

      // Get recent orders (last 3)
      setRecentOrders(orders.slice(0, 3));

      // Set market listings if exists
      if (marketData.success && marketData.data) {
        setMarketListings([marketData.data]); // Wrap in array for consistency
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <FanDashboardSkeleton />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Section with User Info */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 capitalize">
              Welcome back, {user?.username || "Fan"}! 👋
            </h1>
            <p className="text-purple-100">
              Discover amazing artists, events, and merch tailored just for you.
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* User Info Badges */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {user?.email}
          </div>
          {user?.phone && (
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {user.phone}
            </div>
          )}
          {user?.location && (
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
              <MapPinned className="w-4 h-4" />
              {user.location}
            </div>
          )}
          <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            Member since {new Date(user?.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-blue-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          color="bg-purple-500"
        />
      </div>

      {marketListings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-purple-600" />
              Your Market Listing
            </h2>
            <Link
              href="/dashboard/fan/market"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Manage Listing →
            </Link>
          </div>

          {marketListings.map((listing) => (
            <div
              key={listing._id}
              className="border border-gray-300 rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                {listing.photos && listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    {listing.description.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(listing.price)}
                    </span>
                    <span
                      className={`capitalize text-xs px-2 py-1 rounded-full ${
                        listing.status === "active"
                          ? "bg-green-100 text-green-700"
                          : listing.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                    {listing.location && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {listing.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fee Info */}
              {listing.feeInfo && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                  <p className="text-gray-600">
                    Commission: {listing.feeInfo.percentage}% (
                    {formatCurrency(listing.feeInfo.amount)})
                  </p>
                  <p className="text-gray-600">
                    You receive:{" "}
                    {formatCurrency(listing.feeInfo.sellerReceives)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/dashboard/fan/orders"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet</p>
              <Link
                href="/merch"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden">
                    <img
                      src={order.merch?.image || "/placeholder.jpg"}
                      alt={order.merch?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {order.merch?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.deliveryStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

// Quick Action Button
function QuickActionButton({ href, icon: Icon, label, color }) {
  return (
    <Link
      href={href}
      className={`${color} p-4 rounded-xl flex flex-col items-center justify-center hover:scale-105 transition`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

// Loading Skeleton
function FanDashboardSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
