"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import { Edit2, ImageIcon, Loader2, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Utility function for getting cookies
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function AdminFooterPage() {
  const [footer, setFooter] = useState(null);
  const [originalFooter, setOriginalFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  // Fetch Footer Data
  const fetchFooter = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/footer`);
      const data = await res.json();
      if (data.success) {
        setFooter(data.data);
        setOriginalFooter(JSON.parse(JSON.stringify(data.data)));
        setPreviewLogo(data.data.logoUrl);
      }
    } catch (err) {
      toast.error("Failed to load footer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  // Handle logo change with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewLogo(e.target.result);
      };
      reader.readAsDataURL(file);

      toast.success("Logo selected! Click Save to upload.");
    }
  };

  // Update field
  const handleChange = (section, field, value) => {
    if (!isEditMode) return;
    setFooter((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Update array sections
  const updateArrayItem = (section, index, value) => {
    if (!isEditMode) return;
    const updatedArr = [...footer[section]];
    updatedArr[index] = value;
    setFooter((prev) => ({
      ...prev,
      [section]: updatedArr,
    }));
  };

  const addArrayItem = (section) => {
    if (!isEditMode) return;
    setFooter((prev) => ({
      ...prev,
      [section]: [...prev[section], "New Item"],
    }));
  };

  const removeArrayItem = (section, index) => {
    if (!isEditMode) return;
    if (footer[section].length <= 1) {
      toast.error(`At least one item is required in ${section}`);
      return;
    }

    const updatedArr = footer[section].filter((_, i) => i !== index);
    setFooter((prev) => ({
      ...prev,
      [section]: updatedArr,
    }));
  };

  // Save Footer
  const handleSave = async () => {
    try {
      setSaving(true);

      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const formData = new FormData();
      formData.append("getInTouch", JSON.stringify(footer.getInTouch));
      formData.append("usefulLinks", JSON.stringify(footer.usefulLinks));
      formData.append("phone", footer.contact.phone);
      formData.append("email", footer.contact.email);
      formData.append("instagram", footer.socialLinks.instagram);
      formData.append("youtube", footer.socialLinks.youtube);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch(`${API_BASE}/api/footer/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Footer updated successfully!");
        setLogoFile(null);
        setIsEditMode(false);
        fetchFooter();
      } else {
        toast.error(data.message || "Failed to save footer.");
      }
    } catch (err) {
      toast.error("Error updating footer");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setFooter(JSON.parse(JSON.stringify(originalFooter)));
    setPreviewLogo(originalFooter?.logoUrl);
    setLogoFile(null);
    setIsEditMode(false);
    toast.success("Edit cancelled");
  };

  // Reset logo to original
  const resetLogo = () => {
    if (footer?.logoUrl) {
      setPreviewLogo(footer.logoUrl);
    }
    setLogoFile(null);
    toast.success("Logo reset to original");
  };

  if (loading || !footer) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading footer data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster />

      <div className="p-6 max-w-9xl mx-auto space-y-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Footer Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your website footer content and links
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditMode ? (
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-primary hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Edit2 className="w-5 h-5" />
                Edit Footer
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Logo and Contact */}
          <div className="space-y-8">
            {/* LOGO SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Logo Settings
                  </h2>
                </div>
                {isEditMode && logoFile && (
                  <button
                    onClick={resetLogo}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Logo Preview */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {previewLogo ? (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md bg-white p-2">
                        <Image
                          src={previewLogo}
                          alt="Logo Preview"
                          width={120}
                          height={120}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isEditMode ? (
                    <>
                      <label className="cursor-pointer flex-1">
                        <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl flex items-center gap-3 transition-all duration-200 shadow-md text-center justify-center">
                          <Upload className="w-4 h-4" />
                          {logoFile ? "Change Logo" : "Choose Logo"}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>

                      {logoFile && (
                        <button
                          onClick={() => {
                            setLogoFile(null);
                            setPreviewLogo(footer.logoUrl);
                          }}
                          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 text-sm w-full">
                      Logo uploaded
                    </div>
                  )}
                </div>

                {isEditMode && logoFile && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    ✓ New logo selected: {logoFile.name}
                  </div>
                )}

                <p className="text-sm text-gray-500 text-center">
                  Recommended: 200x200px PNG or JPG, max 2MB
                </p>
              </div>
            </div>

            {/* CONTACT SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={footer.contact.phone}
                    onChange={(e) =>
                      handleChange("contact", "phone", e.target.value)
                    }
                    disabled={!isEditMode}
                    className={`w-full border border-gray-300 px-4 py-3 rounded-xl transition-all ${isEditMode
                      ? "text-gray-700 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      : "text-gray-500 bg-gray-50 cursor-not-allowed"
                      }`}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={footer.contact.email}
                    onChange={(e) =>
                      handleChange("contact", "email", e.target.value)
                    }
                    disabled={!isEditMode}
                    className={`w-full border border-gray-300 px-4 py-3 rounded-xl transition-all ${isEditMode
                      ? "text-gray-700 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      : "text-gray-500 bg-gray-50 cursor-not-allowed"
                      }`}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="space-y-8">
            {/* SOCIAL LINKS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Social Media Links
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={footer.socialLinks.instagram}
                    onChange={(e) =>
                      handleChange("socialLinks", "instagram", e.target.value)
                    }
                    disabled={!isEditMode}
                    className={`w-full border border-gray-300 px-4 py-3 rounded-xl transition-all ${isEditMode
                      ? "text-gray-700 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      : "text-gray-500 bg-gray-50 cursor-not-allowed"
                      }`}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={footer.socialLinks.youtube}
                    onChange={(e) =>
                      handleChange("socialLinks", "youtube", e.target.value)
                    }
                    disabled={!isEditMode}
                    className={`w-full border border-gray-300 px-4 py-3 rounded-xl transition-all ${isEditMode
                      ? "text-gray-700 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : "text-gray-500 bg-gray-50 cursor-not-allowed"
                      }`}
                    placeholder="https://youtube.com/channel"
                  />
                </div>
              </div>
            </div>

            {/* GET IN TOUCH SECTION */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Get In Touch
                  </h2>
                </div>
                {isEditMode && (
                  <button
                    onClick={() => addArrayItem("getInTouch")}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {footer.getInTouch.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateArrayItem("getInTouch", index, e.target.value)
                      }
                      disabled={!isEditMode}
                      className={`flex-1 border border-gray-300 px-4 py-3 rounded-xl transition-all ${isEditMode
                          ? "text-gray-700 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          : "text-gray-500 bg-gray-50 cursor-not-allowed"
                        }`}
                      placeholder="Enter item"
                    />
                    {isEditMode && (
                      <button
                        onClick={() => removeArrayItem("getInTouch", index)}
                        className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div> */}

            {/* USEFUL LINKS SECTION */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Useful Links
                  </h2>
                </div>
                {isEditMode && (
                  <button
                    onClick={() => addArrayItem("usefulLinks")}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {footer.usefulLinks.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateArrayItem("usefulLinks", index, e.target.value)
                      }
                      disabled={!isEditMode}
                      className={`flex-1 border border-gray-300 px-4 py-3 rounded-xl transition-all ${isEditMode
                        ? "text-gray-700 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        : "text-gray-500 bg-gray-50 cursor-not-allowed"
                        }`}
                      placeholder="Enter link"
                    />
                    {isEditMode && (
                      <button
                        onClick={() => removeArrayItem("usefulLinks", index)}
                        className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Missing icons
const Plus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Trash2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);