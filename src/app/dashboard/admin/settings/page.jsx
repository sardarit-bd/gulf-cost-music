"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Database,
  Globe,
  Info,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Server,
  Settings,
  ShieldCheck,
  Upload,
  Users,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

const SystemSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({});

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/settings`;

  // Fetch system settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(data.data.settings);
      setFormData(data.data.settings);
    } catch (err) {
      console.error("Fetch settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Show success message or notification
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Save settings error:", err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSetting = (key) => {
    setFormData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "security", name: "Security", icon: ShieldCheck },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "uploads", name: "Uploads", icon: Upload },
    { id: "system", name: "System", icon: Server },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading system settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No settings data found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                System Settings
              </h1>
              <p className="text-gray-600 mt-2">
                Configure and manage your platform settings and preferences
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={fetchSettings}
                className="flex items-center space-x-2 px-4 py-2 text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload</span>
              </button>
              {/* <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button> */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Server}
              label="System Status"
              value={formData.maintenanceMode ? "Maintenance" : "Operational"}
              status={!formData.maintenanceMode}
            />
            <StatCard
              icon={Users}
              label="Registrations"
              value={formData.allowRegistrations ? "Open" : "Closed"}
              status={formData.allowRegistrations}
            />
            <StatCard
              icon={Mail}
              label="Email Notifications"
              value={formData.emailNotifications ? "Enabled" : "Disabled"}
              status={formData.emailNotifications}
            />
            <StatCard
              icon={Database}
              label="Last Updated"
              value="Just now"
              status={true}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Globe className="text-gray-600 w-5 h-5" />
                        Site Information
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Configure your site's basic information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={formData.siteName || ""}
                        onChange={(e) => handleInputChange("siteName", e.target.value)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={formData.siteDescription || ""}
                        onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                        rows={3}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Enter site description"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail || ""}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="thegulfcoastmusic@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Phone
                      </label>
                      <input
                        type="text"
                        value={formData.supportPhone || ""}
                        onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="2519994651"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      Security Settings
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Manage security preferences and access controls</p>
                  </div>

                  <div className="space-y-4">
                    <ToggleSetting
                      label="Maintenance Mode"
                      description="Put the site in maintenance mode - only admins can access"
                      enabled={formData.maintenanceMode}
                      onToggle={() => toggleSetting("maintenanceMode")}
                      icon={Server}
                    />
                    <ToggleSetting
                      label="User Registrations"
                      description="Allow new users to register on the platform"
                      enabled={formData.allowRegistrations}
                      onToggle={() => toggleSetting("allowRegistrations")}
                      icon={Users}
                    />
                    <ToggleSetting
                      label="Two-Factor Authentication"
                      description="Require 2FA for admin accounts"
                      enabled={formData.twoFactorAuth || false}
                      onToggle={() => toggleSetting("twoFactorAuth")}
                      icon={Lock}
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Changing these settings may affect system security and user access.
                          Please review changes carefully before saving.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-500" />
                      Notification Settings
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Configure how and when to send notifications</p>
                  </div>

                  <div className="space-y-4">
                    <ToggleSetting
                      label="Email Notifications"
                      description="Send email notifications for important events"
                      enabled={formData.emailNotifications}
                      onToggle={() => toggleSetting("emailNotifications")}
                      icon={Mail}
                    />
                    <ToggleSetting
                      label="Admin Alerts"
                      description="Notify admins of critical system events"
                      enabled={formData.adminAlerts || true}
                      onToggle={() => toggleSetting("adminAlerts")}
                      icon={AlertTriangle}
                    />
                    <ToggleSetting
                      label="User Notifications"
                      description="Send notifications to users about their activities"
                      enabled={formData.userNotifications || true}
                      onToggle={() => toggleSetting("userNotifications")}
                      icon={Bell}
                    />
                  </div>
                </div>
              )}

              {/* Upload Settings */}
              {activeTab === "uploads" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-orange-500" />
                      Upload Settings
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Configure file upload limits and restrictions</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        value={formData.maxFileSize || 10}
                        onChange={(e) => handleInputChange("maxFileSize", parseInt(e.target.value))}
                        className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum allowed file size in megabytes</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed File Types
                      </label>
                      <input
                        type="text"
                        value={(formData.allowedFileTypes || []).join(", ")}
                        onChange={(e) => handleInputChange("allowedFileTypes", e.target.value.split(", "))}
                        className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="jpg, png, pdf, doc"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate file types with commas</p>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Server className="w-5 h-5 text-gray-500" />
                      System Information
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">System configuration and performance details</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <InfoItem label="Site Name" value={formData.siteName} />
                        <InfoItem label="Maintenance Mode" value={formData.maintenanceMode ? "Enabled" : "Disabled"} />
                        <InfoItem label="Registrations" value={formData.allowRegistrations ? "Open" : "Closed"} />
                      </div>
                      <div className="space-y-3">
                        <InfoItem label="Email Notifications" value={formData.emailNotifications ? "Enabled" : "Disabled"} />
                        <InfoItem label="Max File Size" value={`${formData.maxFileSize} MB`} />
                        <InfoItem label="File Types" value={(formData.allowedFileTypes || []).join(", ")} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">System Summary</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          The system is currently running in <strong>{formData.maintenanceMode ? "maintenance" : "normal"}</strong> mode.
                          User registrations are <strong>{formData.allowRegistrations ? "enabled" : "disabled"}</strong> and
                          email notifications are <strong>{formData.emailNotifications ? "active" : "inactive"}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, status }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${status ? "text-green-600" : "text-red-600"
          }`}>
          {status ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

// Toggle Setting Component
const ToggleSetting = ({ label, description, enabled, onToggle, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-200"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
};

export default SystemSettingsPage;