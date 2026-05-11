"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import CustomLoader from "@/components/shared/loader/Loader";
import { useSession } from "@/lib/auth";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Music,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useSession();

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      };

      const token = getCookie("token");

      if (!token) {
        toast.error("No authentication token found");
        window.location.href = "/signin";
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStats(data.data.stats);
        setRecentUsers(data.data.recentUsers || []);
        setUpcomingEvents(data.data.upcomingEvents || []);
        setUserStats(data.data.userStats || []);
      } else if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Clear cookies and redirect
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        document.cookie = "user=; path=/; max-age=0";
        window.location.href = "/signin";
      } else {
        toast.error(data.message || "Failed to load dashboard data.");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Server error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20 bg-white">
        <div className="text-center">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full mx-auto p-6">
        <Toaster />
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
        </div>

        {/* Stats Grid - Resized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers}
            change={12}
            color="blue"
          />
          <StatCard
            icon={Music}
            label="Artists"
            value={stats?.totalArtists}
            change={8}
            color="green"
          />
          <StatCard
            icon={Building2}
            label="Venues"
            value={stats?.totalVenues}
            change={5}
            color="purple"
          />
          <StatCard
            icon={Mail}
            label="Pending"
            value={stats?.pendingContacts}
            change={-2}
            color="orange"
          />
        </div>

        {/* Main Content Grid - Resized gap */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Recent Users - Upgraded & Resized */}
            <div className="bg-white rounded-lg shadow-sm border-gray-200 border overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  Recent Users
                </h2>
                <Link
                  href="/dashboard/admin/users"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <RecentUsersTable users={recentUsers} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* User Distribution - Upgraded & Resized */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  User Distribution
                </h2>
              </div>
              <div className="p-5">
                <UserDistributionChart userStats={userStats} />
              </div>
            </div>

            {/* Upcoming Events */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <UpcomingEventsList events={upcomingEvents} />
            </div> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ========== COMPONENTS ========== */

// StatCard - Resized (smaller)
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↗" : "↘";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        {/* <div
          className={`flex items-center space-x-1 text-xs font-medium ${changeColor}`}
        >
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div> */}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-0.5">{value || 0}</h3>
      <p className="text-gray-600 text-xs">{label}</p>
    </div>
  );
};

const QuickActionCard = ({ action }) => {
  const { title, description, icon: Icon, count, color, href } = action;

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <button className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group w-full text-left">
      <div
        className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      {count !== null && (
        <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {count}
        </span>
      )}
    </button>
  );
};

const RecentUsersTable = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No recent users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-2.5 px-5 text-xs font-medium text-gray-500">
              User
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">
              Type
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">
              Status
            </th>
            <th className="text-left py-2.5 px-5 text-xs font-medium text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, 5).map((user, idx) => (
            <tr
              key={user._id}
              className={`hover:bg-gray-50 transition-colors ${idx !== users.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''
                }`}
            >
              <td className="py-2.5 px-5">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-2.5 px-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${user.userType === "admin"
                    ? "bg-red-50 text-red-700"
                    : user.userType === "artist"
                      ? "bg-purple-50 text-purple-700"
                      : user.userType === "venue"
                        ? "bg-green-50 text-green-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                >
                  {user.userType}
                </span>
              </td>
              <td className="py-2.5 px-3">
                {user.isVerified ? (
                  <span className="inline-flex items-center text-green-600 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-orange-500 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Pending
                  </span>
                )}
              </td>
              <td className="py-2.5 px-5">
                <Link
                  href="/dashboard/admin/users"
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-yellow-600 hover:text-yellow-700 hover:bg-gray-200 text-xs font-medium transition-colors"
                >
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// UserDistributionChart - Upgraded & Resized
const UserDistributionChart = ({ userStats }) => {
  const total = userStats.reduce((sum, stat) => sum + stat.count, 0);

  const getColor = (type, index) => {
    const colorMap = {
      fan: "bg-blue-500",
      artist: "bg-purple-500",
      venue: "bg-green-500",
      admin: "bg-red-500"
    };
    return colorMap[type] || ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"][index % 5];
  };

  const getLabel = (type) => {
    if (type === "fan") return "Fans";
    if (type === "artist") return "Artists";
    if (type === "venue") return "Venues";
    if (type === "admin") return "Admins";
    return type;
  };

  return (
    <div className="space-y-3.5">
      {userStats.map((stat, index) => {
        const percentage = total > 0 ? (stat.count / total) * 100 : 0;
        const barColor = getColor(stat._id, index);

        return (
          <div key={stat._id} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-gray-700 capitalize">
                {getLabel(stat._id)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold text-sm">
                  {stat.count}
                </span>
                <span className="text-gray-400 text-xs">
                  ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}

      {userStats.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No user data available</p>
        </div>
      )}
    </div>
  );
};

const UpcomingEventsList = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.slice(0, 4).map((event) => (
        <div
          key={event._id}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 line-clamp-1">
              {event.artistBandName || event.title}
            </h4>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
              {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{event.time || "TBA"}</span>
            </div>
            {event.venue && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{event.venue.city}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const StatusItem = ({ label, status }) => {
  const statusConfig = {
    operational: { color: "bg-green-500", text: "Operational" },
    warning: { color: "bg-yellow-500", text: "Degraded" },
    critical: { color: "bg-red-500", text: "Outage" },
  };

  const config = statusConfig[status] || statusConfig.operational;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <span className="text-sm text-gray-500">{config.text}</span>
      </div>
    </div>
  );
};