"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  Building2,
  Calendar,
  CheckCircle,
  X as CloseIcon,
  Crown,
  Edit,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreVertical,
  Music,
  RefreshCw,
  Save,
  Search,
  Shield,
  Trash2,
  User,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("all");
  const [verified, setVerified] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    artists: 0,
    venues: 0,
    admins: 0,
    journalists: 0,
    totalAdmins: 0,
  });
  const [promoteModal, setPromoteModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin`;
  const USERS_URL = `${API_URL}/users`;
  const STATS_URL = `${API_URL}/dashboard`;

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(STATS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {

        // Transform API response to match our stats structure
        const dashboardData = data.data;

        // Extract counts from userStats array
        const userStats = dashboardData.userStats || [];
        const artistsCount =
          userStats.find((stat) => stat._id === "artist")?.count || 0;
        const venuesCount =
          userStats.find((stat) => stat._id === "venue")?.count || 0;
        const adminsCount =
          userStats.find((stat) => stat._id === "admin")?.count || 0;
        const journalistsCount =
          userStats.find((stat) => stat._id === "journalist")?.count || 0;

        // Use stats from dashboard or calculate from userStats
        const totalUsers =
          dashboardData.stats?.totalUsers ||
          artistsCount + venuesCount + adminsCount + journalistsCount;

        // For verified users, we'll calculate from the current users list
        // This is an approximation since we don't have verified count in dashboard
        const verifiedUsersCount = await fetchVerifiedUsersCount();

        setStats({
          totalUsers: totalUsers,
          verifiedUsers: verifiedUsersCount,
          artists: artistsCount,
          venues: venuesCount,
          admins: adminsCount,
          journalists: journalistsCount,
          totalAdmins: adminsCount,
          // Additional stats from dashboard
          totalEvents: dashboardData.stats?.totalEvents || 0,
          totalNews: dashboardData.stats?.totalNews || 0,
          pendingContacts: dashboardData.stats?.pendingContacts || 0,
        });
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  // Helper function to get verified users count
  const fetchVerifiedUsersCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${USERS_URL}?verified=true&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.data?.pagination?.total || 0;
    } catch (err) {
      console.error("Fetch verified users count error:", err);
      return 0;
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append("search", search);
      if (userType !== "all") params.append("userType", userType);
      if (verified !== "") params.append("verified", verified);

      const { data } = await axios.get(`${USERS_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(data.data.users);
      setPages(data.data.pagination.pages);

      // Update verified count when we fetch verified users
      if (verified === "true") {
        setStats((prev) => ({
          ...prev,
          verifiedUsers: data.data.pagination?.total || prev.verifiedUsers,
        }));
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real-time stats from current filtered users
  const calculateRealTimeStats = () => {
    return {
      totalUsers: users.length,
      verifiedUsers: users.filter((user) => user.isVerified).length,
      artists: users.filter((user) => user.userType === "artist").length,
      venues: users.filter((user) => user.userType === "venue").length,
      admins: users.filter((user) => user.userType === "admin").length,
      journalists: users.filter((user) => user.userType === "journalist")
        .length,
      totalAdmins: users.filter((user) => user.userType === "admin").length,
    };
  };

  // Use real-time stats when filters are active, otherwise use server stats
  const displayStats =
    search || userType !== "all" || verified !== ""
      ? calculateRealTimeStats()
      : stats;

  // Debounced search function
  const handleSearchChange = (value) => {
    setSearch(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search
    setSearchTimeout(
      setTimeout(() => {
        setPage(1); // Reset to first page when searching
        fetchUsers();
      }, 500) // 500ms delay
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setUserType("all");
    setVerified("");
    setPage(1);
  };

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${USERS_URL}/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      fetchStats();
      setActionMenu(null);
    } catch (err) {
      console.error("Verify error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${USERS_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      fetchStats();
      setDeleteModal(null);
      setActionMenu(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePromoteToAdmin = async (userId, role = "content_admin") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${USERS_URL}/${userId}/promote`,
        { role, permissions: ["manage_users", "manage_content"] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("User promoted to admin successfully!");
        fetchUsers();
        fetchStats();
        setPromoteModal(null);
      }
    } catch (err) {
      console.error("Promote error:", err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Failed to promote user to admin");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified,
    });
    setActionMenu(null);
  };

  const handleView = (user) => {
    setViewingUser(user);
    setActionMenu(null);
  };

  const handleSave = async (id) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${USERS_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const updatedUser = response.data.data?.user;
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        if (
          loggedInUser?.id === updatedUser?._id &&
          loggedInUser?.userType === "admin"
        ) {
          alert("Email updated successfully. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/signin";
          return;
        }

        setEditingUser(null);
        setFormData({});
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Error updating user. Please try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, userType, verified]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const getUserTypeIcon = (type) => {
    switch (type) {
      case "artist":
        return <Music className="w-4 h-4" />;
      case "venue":
        return <Building2 className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "journalist":
        return <FileText className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case "artist":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "venue":
        return "bg-green-100 text-green-800 border-green-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "journalist":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Check if any filter is active
  const hasActiveFilters = search || userType !== "all" || verified !== "";

  // Rest of the component (PromoteModal, DeleteConfirmationModal) remains the same...
  // Promote to Admin Modal
  const PromoteModal = ({ user, onClose, onPromote }) => {
    const [role, setRole] = useState("content_admin");
    const [promoting, setPromoting] = useState(false);

    const handlePromote = async () => {
      setPromoting(true);
      await onPromote(user._id, role);
      setPromoting(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Promote to Admin
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Promoting <strong>{user?.username}</strong> to admin role
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="content_admin">Content Admin</option>
                  <option value="user_admin">User Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Content Admin: Manage content only | User Admin: Manage users
                  only | Super Admin: Full access
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Permissions:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ Manage users and content</li>
                  <li>✓ Access admin dashboard</li>
                  <li>✓ Moderate platform content</li>
                  {role === "super_admin" && (
                    <li>✓ Promote other users to admin</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePromote}
                disabled={promoting}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {promoting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Promoting...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Promote to Admin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = ({ user, onClose, onConfirm }) => {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
      setDeleting(true);
      await onConfirm(user._id);
      setDeleting(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {user?.username}
                    </h4>
                    <p className="text-gray-600 text-xs flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Warning:</strong> This will permanently delete the
                  user account and all associated data.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={onClose}
                disabled={deleting}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all users, verify accounts, and promote to admin roles
                {hasActiveFilters && " (Showing filtered results)"}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => {
                  fetchUsers();
                  fetchStats();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards - Now with proper data mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={User}
              label="Total Users"
              value={displayStats.totalUsers}
              color="blue"
              description="All registered users"
            />
            <StatCard
              icon={CheckCircle}
              label="Verified Users"
              value={displayStats.verifiedUsers}
              color="green"
              description="Email verified accounts"
            />
            <StatCard
              icon={Music}
              label="Artists"
              value={displayStats.artists}
              color="purple"
              description="Music artists"
            />
            <StatCard
              icon={Shield}
              label="Admins"
              value={displayStats.totalAdmins}
              color="red"
              description="Administrative users"
            />
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={Building2}
              label="Venues"
              value={displayStats.venues}
              color="green"
              description="Event venues"
            />
            <StatCard
              icon={FileText}
              label="Journalists"
              value={displayStats.journalists}
              color="blue"
              description="Content creators"
            />
            <StatCard
              icon={User}
              label="Filtered Users"
              value={users.length}
              color="orange"
              description="Currently showing"
            />
          </div>

          {/* Improved Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Active Filters
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <select
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="artist">Artist</option>
                  <option value="venue">Venue</option>
                  <option value="admin">Admin</option>
                  <option value="journalist">Journalist</option>
                  <option value="user">Regular User</option>
                </select>
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <select
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={verified}
                  onChange={(e) => setVerified(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
              </div>

              <button
                onClick={fetchUsers}
                className="w-full lg:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: "{search}"
                    <button
                      onClick={() => setSearch("")}
                      className="ml-1 hover:text-blue-600"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {userType !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Type: {userType}
                    <button
                      onClick={() => setUserType("all")}
                      className="ml-1 hover:text-green-600"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {verified !== "" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Status: {verified === "true" ? "Verified" : "Unverified"}
                    <button
                      onClick={() => setVerified("")}
                      className="ml-1 hover:text-purple-600"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rest of the component remains the same */}
          {/* Users Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Users ({stats?.totalUsers})
                {hasActiveFilters && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Filtered from {stats.totalUsers} total users)
                  </span>
                )}
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user.username?.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                {editingUser === user._id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={formData.username || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "username",
                                          e.target.value
                                        )
                                      }
                                      className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                      placeholder="Username"
                                    />
                                    <input
                                      type="email"
                                      value={formData.email || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
                                      placeholder="Email"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.username}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                      <Mail className="text-gray-500 w-3 h-3 mr-1" />
                                      {user.email}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUser === user._id ? (
                              <select
                                value={formData.userType || ""}
                                onChange={(e) =>
                                  handleInputChange("userType", e.target.value)
                                }
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="user">User</option>
                                <option value="artist">Artist</option>
                                <option value="venue">Venue</option>
                                <option value="admin">Admin</option>
                                <option value="journalist">Journalist</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUserTypeColor(
                                  user.userType
                                )}`}
                              >
                                {getUserTypeIcon(user.userType)}
                                <span className="ml-1 capitalize">
                                  {user.userType}
                                </span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUser === user._id ? (
                              <select
                                value={
                                  formData.isVerified?.toString() || "false"
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "isVerified",
                                    e.target.value === "true"
                                  )
                                }
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">Verified</option>
                                <option value="false">Pending</option>
                              </select>
                            ) : user.isVerified ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              {editingUser === user._id ? (
                                <>
                                  <button
                                    onClick={() => handleSave(user._id)}
                                    disabled={saveLoading}
                                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                                  >
                                    {saveLoading ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                    ) : (
                                      <Save className="w-3 h-3 mr-1" />
                                    )}
                                    {saveLoading ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    disabled={saveLoading}
                                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  {user.userType !== "admin" && (
                                    <button
                                      onClick={() => setPromoteModal(user)}
                                      className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                                      title="Promote to Admin"
                                    >
                                      <Crown className="w-3 h-3 mr-1" />
                                      Promote
                                    </button>
                                  )}
                                  {!user.isVerified && (
                                    <button
                                      onClick={() => handleVerify(user._id)}
                                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verify
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleView(user)}
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </button>
                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setActionMenu(
                                          actionMenu === user._id
                                            ? null
                                            : user._id
                                        )
                                      }
                                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {actionMenu === user._id && (
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button
                                          onClick={() => handleEdit(user)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit User
                                        </button>
                                        {user.userType !== "admin" && (
                                          <button
                                            onClick={() =>
                                              setPromoteModal(user)
                                            }
                                            className="flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 w-full text-left"
                                          >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Promote to Admin
                                          </button>
                                        )}
                                        <button
                                          onClick={() => setDeleteModal(user)}
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete User
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">
                              No users found
                            </p>
                            <p className="text-sm mt-1">
                              {hasActiveFilters
                                ? "Try adjusting your search filters"
                                : "No users in the system"}
                            </p>
                            {hasActiveFilters && (
                              <button
                                onClick={clearFilters}
                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                              >
                                Clear Filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{pages}</span>
                  </p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="text-gray-500 px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${page === pageNumber
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="text-gray-500 px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Detail Modal */}
        {viewingUser && (
          <UserDetailModal
            user={viewingUser}
            onClose={() => setViewingUser(null)}
          />
        )}

        {/* Promote to Admin Modal */}
        {promoteModal && (
          <PromoteModal
            user={promoteModal}
            onClose={() => setPromoteModal(null)}
            onPromote={handlePromoteToAdmin}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <DeleteConfirmationModal
            user={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// Updated Stat Card Component with description
const StatCard = ({ icon: Icon, label, value, color, description }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
      <p className="text-gray-900 font-medium text-sm">{label}</p>
      {description && (
        <p className="text-gray-500 text-xs mt-1">{description}</p>
      )}
    </div>
  );
};

// UserDetailModal Component (unchanged)
const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const getUserTypeColor = (type) => {
    switch (type) {
      case "artist":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "venue":
        return "bg-green-100 text-green-800 border-green-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "journalist":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case "artist":
        return <Music className="w-4 h-4" />;
      case "venue":
        return <Building2 className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "journalist":
        return <FileText className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {user.username}
                </h4>
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">User Type:</label>
                <span
                  className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(
                    user.userType
                  )}`}
                >
                  {getUserTypeIcon(user.userType)}
                  <span className="ml-1 capitalize">{user.userType}</span>
                </span>
              </div>
              <div>
                <label className="font-medium text-gray-700">Status:</label>
                <span
                  className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                    }`}
                >
                  {user.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div>
                <label className="font-medium text-gray-700">Joined:</label>
                <p className="text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  Last Updated:
                </label>
                <p className="text-gray-600">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {user.bio && (
              <div>
                <label className="font-medium text-gray-700">Bio:</label>
                <p className="text-gray-600 mt-1 text-sm">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
