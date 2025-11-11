"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import DeleteConfirmationModal from "@/components/modules/dashboard/users/DeleteConfirmationModal";
import Filters from "@/components/modules/dashboard/users/Filters";
import PromoteModal from "@/components/modules/dashboard/users/PromoteModal";
import StatCard from "@/components/modules/dashboard/users/StatCard";
import UserDetailModal from "@/components/modules/dashboard/users/UserDetailModal";
import UserTable from "@/components/modules/dashboard/users/UserTable";
import axios from "axios";
import { Building2, CheckCircle, FileText, Music, RefreshCw, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
// import AdminLayout from "@/components/modules/dashboard/AdminLayout";
// import StatCard from "@/components/modules/dashboard/users/StatCard";
// import Filters from "@/components/modules/dashboard/users/Filters";
// import UserTable from "@/components/modules/dashboard/users/UserTable";
// import UserDetailModal from "@/components/modules/dashboard/users/UserDetailModal";
// import PromoteModal from "@/components/modules/dashboard/users/PromoteModal";
// import DeleteConfirmationModal from "@/components/modules/dashboard/users/DeleteConfirmationModal";

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
        const dashboardData = data.data;
        const userStats = dashboardData.userStats || [];
        const artistsCount = userStats.find((stat) => stat._id === "artist")?.count || 0;
        const venuesCount = userStats.find((stat) => stat._id === "venue")?.count || 0;
        const adminsCount = userStats.find((stat) => stat._id === "admin")?.count || 0;
        const journalistsCount = userStats.find((stat) => stat._id === "journalist")?.count || 0;

        const totalUsers = dashboardData.stats?.totalUsers || artistsCount + venuesCount + adminsCount + journalistsCount;
        const verifiedUsersCount = await fetchVerifiedUsersCount();

        setStats({
          totalUsers: totalUsers,
          verifiedUsers: verifiedUsersCount,
          artists: artistsCount,
          venues: venuesCount,
          admins: adminsCount,
          journalists: journalistsCount,
          totalAdmins: adminsCount,
          totalEvents: dashboardData.stats?.totalEvents || 0,
          totalNews: dashboardData.stats?.totalNews || 0,
          pendingContacts: dashboardData.stats?.pendingContacts || 0,
        });
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

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

  const calculateRealTimeStats = () => {
    return {
      totalUsers: users.length,
      verifiedUsers: users.filter((user) => user.isVerified).length,
      artists: users.filter((user) => user.userType === "artist").length,
      venues: users.filter((user) => user.userType === "venue").length,
      admins: users.filter((user) => user.userType === "admin").length,
      journalists: users.filter((user) => user.userType === "journalist").length,
      totalAdmins: users.filter((user) => user.userType === "admin").length,
    };
  };

  const displayStats =
    search || userType !== "all" || verified !== ""
      ? calculateRealTimeStats()
      : stats;

  const handleSearchChange = (value) => {
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setPage(1);
        fetchUsers();
      }, 500)
    );
  };

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

  const handleActionMenuToggle = (userId) => {
    setActionMenu(actionMenu === userId ? null : userId);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, userType, verified]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const hasActiveFilters = search || userType !== "all" || verified !== "";

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

          {/* Stats Cards */}
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

          {/* Filters */}
          <Filters
            search={search}
            userType={userType}
            verified={verified}
            onSearchChange={handleSearchChange}
            onUserTypeChange={setUserType}
            onVerifiedChange={setVerified}
            onApply={fetchUsers}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Users Table */}
          <UserTable
            users={users}
            loading={loading}
            page={page}
            pages={pages}
            editingUser={editingUser}
            formData={formData}
            saveLoading={saveLoading}
            actionMenu={actionMenu}
            onPageChange={handlePageChange}
            onView={handleView}
            onVerify={handleVerify}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
            onPromote={setPromoteModal}
            onDelete={setDeleteModal}
            onActionMenuToggle={handleActionMenuToggle}
            hasActiveFilters={hasActiveFilters}
            totalUsers={stats.totalUsers}
          />

          {/* Modals */}
          {viewingUser && (
            <UserDetailModal
              user={viewingUser}
              onClose={() => setViewingUser(null)}
            />
          )}

          {promoteModal && (
            <PromoteModal
              user={promoteModal}
              onClose={() => setPromoteModal(null)}
              onPromote={handlePromoteToAdmin}
            />
          )}

          {deleteModal && (
            <DeleteConfirmationModal
              user={deleteModal}
              onClose={() => setDeleteModal(null)}
              onConfirm={handleDelete}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;