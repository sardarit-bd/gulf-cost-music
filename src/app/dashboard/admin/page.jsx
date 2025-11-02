"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Music,
  Building2,
  Newspaper,
  Mail,
  Calendar,
  TrendingUp,
  Eye,
  UserCheck,
  Download,
  RefreshCw,
  BarChart3,
  Plus,
  MoreVertical,
  Search,
  Filter,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStats(data.data.stats);
        setRecentUsers(data.data.recentUsers || []);
        setUpcomingEvents(data.data.upcomingEvents || []);
        setUserStats(data.data.userStats || []);
      } else if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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


  const quickActions = [
    {
      title: "Verify Users",
      description: "Approve pending user verifications",
      icon: UserCheck,
      count: stats?.pendingContacts || 0,
      color: "orange",
      href: "/admin/users"
    },
    {
      title: "Add Content",
      description: "Create new articles or events",
      icon: Plus,
      count: null,
      color: "blue",
      href: "/admin/content"
    },
    {
      title: "Moderate",
      description: "Review user submissions",
      icon: Filter,
      count: (stats?.totalNews || 0) + (stats?.totalArtists || 0),
      color: "purple",
      href: "/admin/content"
    },
    {
      title: "Export Data",
      description: "Download reports and analytics",
      icon: Download,
      count: null,
      color: "green",
      href: "#"
    }
  ];

  return (
    <AdminLayout>
      <div className="w-full mx-auto">
        <Toaster/>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
          {/* <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={fetchDashboardData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <RecentUsersTable users={recentUsers} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* User Distribution */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Distribution</h2>
              <UserDistributionChart userStats={userStats} />
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <UpcomingEventsList events={upcomingEvents} />
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <StatusItem label="API" status="operational" />
                <StatusItem label="Database" status="operational" />
                <StatusItem label="Storage" status="warning" />
                <StatusItem label="Email Service" status="operational" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ========== COMPONENTS ========== */

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
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
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
      <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
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
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No recent users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 text-sm font-medium text-gray-600">User</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Type</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.slice(0, 5).map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.userType === 'admin' ? 'bg-red-100 text-red-800' :
                    user.userType === 'artist' ? 'bg-purple-100 text-purple-800' :
                      user.userType === 'venue' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                  }`}>
                  {user.userType}
                </span>
              </td>
              <td className="py-3">
                {user.isVerified ? (
                  <span className="inline-flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-orange-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                )}
              </td>
              <td className="py-3">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserDistributionChart = ({ userStats }) => {
  const total = userStats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <div className="space-y-4">
      {userStats.map((stat, index) => {
        const percentage = total > 0 ? (stat.count / total) * 100 : 0;
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

        return (
          <div key={stat._id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 capitalize">
                {stat._id === 'fan' ? 'Fans' : stat._id}s
              </span>
              <span className="text-gray-500">
                {stat.count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}

      {userStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No user data available</p>
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
        <div key={event._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 line-clamp-1">
              {event.artistBandName || event.title}
            </h4>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
              {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{event.time || 'TBA'}</span>
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
    operational: { color: 'bg-green-500', text: 'Operational' },
    warning: { color: 'bg-yellow-500', text: 'Degraded' },
    critical: { color: 'bg-red-500', text: 'Outage' },
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