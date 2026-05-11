"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import CustomLoader from "@/components/shared/loader/Loader";
import {
  Award,
  Briefcase,
  Calendar,
  Camera,
  CheckCircle,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Key,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [editPhotoFile, setEditPhotoFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    bio: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#3b82f6",
    "#22c55e",
  ];

  useEffect(() => {
    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 6 characters",
      }));
    } else if (
      passwordForm.newPassword &&
      passwordForm.newPassword.length > 0
    ) {
      setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
    }

    if (
      passwordForm.confirmPassword &&
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getCookie("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (!data.success) throw new Error();

        setForm({
          fullName: data.data.fullName || "",
          email: data.data.user?.email || "",
          bio: data.data.bio || "",
          phone: data.data.phone || "",
        });

        setPreview(data.data.profilePhoto?.url || null);
      } catch {
        toast.error("Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setEditPhotoFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getCookie("token");
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value),
      );

      const isUploadingPhoto = !!photoFile;

      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (!data.success) throw new Error();

      if (isUploadingPhoto) {
        toast.success("Profile photo uploaded successfully!");
        setPhotoFile(null);
      } else {
        toast.success("Profile updated successfully! ✨");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async () => {
    setSaving(true);

    try {
      const token = getCookie("token");
      const formData = new FormData();

      formData.append("fullName", editForm.fullName);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      formData.append("bio", editForm.bio);

      if (editPhotoFile) {
        formData.append("profilePhoto", editPhotoFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (!data.success) throw new Error();

      setForm({
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        bio: editForm.bio,
      });

      if (editPhotoFile) {
        setPreview(editPreview);
        setPhotoFile(null);
        setEditPhotoFile(null);
      }

      toast.success("Profile updated successfully!");
      setShowEditModal(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
    });
    setEditPreview(preview);
    setEditPhotoFile(null);
    setShowEditModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setChangingPassword(true);

    try {
      const token = getCookie("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/profile/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
            confirmPassword: passwordForm.confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully! 🔒");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen py-20">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto min-h-screen  p-4 md:p-6">
        <Toaster position="top-right" />

        {/* Header Section */}
        <div className="mb-8">
          <div className="rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Admin Profile
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Manage your account settings and profile information
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all text-sm font-medium shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium border border-gray-300 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-semibold text-gray-900">
                  Administrator
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-semibold text-gray-900">2024</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Shield className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Security</p>
                <p className="text-sm font-semibold text-gray-900">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Profile Information
            </h2>
            <p className="text-blue-100 text-sm">Your personal details</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg bg-gray-100">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover bg-gray-400"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 bg-yellow-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-yellow-600 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {photoFile && (
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition cursor-pointer"
                  >
                    {saving ? "Uploading..." : "Save Photo"}
                  </button>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {form.fullName || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {form.email || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {form.phone || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Bio
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FileText className="w-4 h-4 text-gray-400 inline mr-2" />
                      <span className="text-sm text-gray-700">
                        {form.bio || "No bio added yet"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Edit3 className="w-4 h-4 text-yellow-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Profile
                </h2>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Photo in Modal */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md bg-gray-100">
                    {editPreview ? (
                      <Image
                        src={editPreview}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover bg-gray-400"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="edit-photo"
                    className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1.5 rounded-full shadow-lg hover:bg-yellow-600 transition cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <input
                      id="edit-photo"
                      type="file"
                      accept="image/*"
                      onChange={handleEditPhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleEditChange}
                      className="text-gray-600 w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="text-gray-600 w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="text-gray-600 w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditChange}
                      rows="3"
                      className="text-gray-600 w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal - Modern Design */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowChangePassword(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">
                    Change Password
                  </h2>
                </div>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-white/80 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-yellow-100 text-xs mt-1">
                Secure your account with a strong password
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="text-gray-600 w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="text-gray-600 w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    placeholder="Enter new password (min 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {passwordForm.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span className="font-medium">
                        {strengthLabels[passwordStrength]}
                      </span>
                      {passwordStrength === 4 && (
                        <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />
                      )}
                    </p>
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="text-gray-600 w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    changingPassword ||
                    !!passwordErrors.newPassword ||
                    !!passwordErrors.confirmPassword
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-amber-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {changingPassword && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
