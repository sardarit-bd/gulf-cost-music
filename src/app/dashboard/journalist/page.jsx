"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Camera,
  Eye,
  FileText,
  Image as ImageIcon,
  MapPin,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  User2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Utility to get cookie safely
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

// News Detail Modal Component
function NewsDetailModal({ news, isOpen, onClose }) {
  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper size={24} />
            News Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Images Gallery */}
          {news.photos?.length > 0 && (
            <div className="p-6 border-b border-gray-700">
              <div
                className={`grid gap-4 ${
                  news.photos.length === 1
                    ? "grid-cols-1"
                    : news.photos.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {news.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-900"
                  >
                    <Image
                      src={photo.url}
                      alt={`${news.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  {new Date(news.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
                  <MapPin size={14} />
                  {news.location}
                </div>
                {news.credit && (
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
                    <User size={14} />
                    {news.credit}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Story</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {news.description}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Status
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    news.published
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {news.published ? "Published" : "Draft"}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Last Updated
                </h4>
                <p className="text-gray-300 text-sm">
                  {new Date(news.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JournalistDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("news");
  const [journalist, setJournalist] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatar: null,
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "New Orleans",
    credit: "",
    description: "",
    photos: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Fetch Journalist Profile & News ===
  useEffect(() => {
    if (!user) return;
    const token = getCookie("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [profileRes, newsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/my-news`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [profileData, newsData] = await Promise.all([
          profileRes.json(),
          newsRes.json(),
        ]);

        if (profileRes.ok && profileData.data?.journalist) {
          const j = profileData.data.journalist;
          setJournalist({
            fullName: j.fullName || "",
            email: j.user?.email || "",
            bio: j.bio || "",
            avatar: j.profilePhoto?.url || null,
          });
          setPreviewAvatar(j.profilePhoto?.url || null);
        } else if (profileData.message) {
          toast.error(profileData.message);
        }

        if (newsRes.ok && newsData.data?.news) {
          setNewsList(newsData.data.news);
        } else if (newsData.message) {
          toast.error(newsData.message);
        }
      } catch (err) {
        console.error("Error fetching journalist data:", err);
        toast.error("Server error while loading dashboard data");
      }
    };

    fetchData();
  }, [user]);

  // === Save Profile ===
  const handleSaveProfile = async () => {
    const token = getCookie("token");
    if (!token) return toast.error("You are not logged in!");

    const toastId = toast.loading("Saving profile...");
    try {
      const formData = new FormData();
      formData.append("bio", journalist.bio);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to save profile", { id: toastId });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Server error while saving profile", { id: toastId });
    }
  };

  // === Avatar Upload ===
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setPreviewAvatar(URL.createObjectURL(file));

    try {
      const token = getCookie("token");
      if (!token) return toast.error("You are not logged in!");

      const formData = new FormData();
      formData.append("bio", journalist.bio || "");
      formData.append("profilePhoto", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) toast.success("Profile photo updated!");
      else toast.error(data.message || "Failed to upload profile photo");
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Error uploading avatar");
    }
  };

  // === News Image Upload ===
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length + previewImages.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const urls = validFiles.map((f) => URL.createObjectURL(f));
    setPreviewImages((prev) => [...prev, ...urls]);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...validFiles] }));

    if (validFiles.length > 0) {
      toast.success(`Added ${validFiles.length} photo(s)`);
    }
  };

  const removeImage = (i) => {
    setPreviewImages((p) => p.filter((_, idx) => idx !== i));
    setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });
    toast.success("Photo removed");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === Save / Update News ===
  const handleSaveNews = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const toastId = toast.loading(
      editingNews ? "Updating news..." : "Publishing news..."
    );

    try {
      setSaving(true);
      const token = getCookie("token");
      if (!token) return toast.error("You are not logged in!");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("credit", form.credit);
      formData.append("location", form.location.toLowerCase());
      form.photos.forEach((p) => formData.append("photos", p));

      const url = editingNews
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${editingNews._id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`;

      const method = editingNews ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save news");

      toast.success(editingNews ? "News updated!" : "News published!", {
        id: toastId,
      });

      // Refresh list
      const listRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/my-news`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const listData = await listRes.json();
      setNewsList(listData.data?.news || []);

      // Reset form
      setActiveTab("news");
      setEditingNews(null);
      setForm({
        title: "",
        location: "New Orleans",
        credit: "",
        description: "",
        photos: [],
      });
      setPreviewImages([]);
    } catch (err) {
      console.error("Save news error:", err);
      toast.error(err.message || "Server error while saving news", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const editNews = (n) => {
    setForm({
      title: n.title,
      location: n.location || "New Orleans",
      credit: n.credit || "",
      description: n.description || "",
      photos: [],
    });
    setPreviewImages(n.photos?.map((p) => p.url) || []);
    setEditingNews(n);
    setActiveTab("edit");
  };

  const viewNewsDetails = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const deleteNews = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this news item? This action cannot be undone."
      )
    )
      return;
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete news");

      setNewsList((prev) => prev.filter((n) => n._id !== id));
      toast.success("News deleted successfully!");
    } catch (err) {
      console.error("Delete news error:", err);
      toast.error(err.message || "Server error while deleting news");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      <Toaster />

      {/* News Detail Modal */}
      <NewsDetailModal
        news={selectedNews}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Newspaper size={32} className="text-black" />
            </div>
            Journalist Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your profile and publish news stories
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Enhanced Tabs */}
          <div className="border-b border-gray-700 bg-gray-900">
            <div className="flex overflow-x-auto">
              {[
                { id: "news", label: "My News", icon: Newspaper },
                { id: "profile", label: "Profile", icon: User },
                {
                  id: "edit",
                  label: editingNews ? "Edit News" : "Create News",
                  icon: FileText,
                },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === id
                      ? "text-yellow-400 border-b-2 border-yellow-400 bg-gray-800"
                      : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* PROFILE TAB - Unchanged from original */}
            {activeTab === "profile" && (
              <div className="">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 mx-auto mb-4">
                            {previewAvatar ? (
                              <Image
                                src={previewAvatar}
                                alt="Profile"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <User2 size={48} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-2 right-2 bg-yellow-500 text-black p-2 rounded-full cursor-pointer hover:bg-yellow-400 transition shadow-lg">
                            <Camera size={16} />
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={handleAvatarUpload}
                            />
                          </label>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">
                          {journalist.fullName || "Your Name"}
                        </h2>
                        <p className="text-gray-400 text-sm mb-4">
                          {journalist.email || "Journalist"}
                        </p>

                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition font-medium">
                          <Upload size={16} /> Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User size={20} />
                        Profile Information
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            value={journalist.fullName}
                            onChange={(e) =>
                              setJournalist({
                                ...journalist,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            value={journalist.email}
                            disabled
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Biography
                          </label>
                          <textarea
                            rows={4}
                            value={journalist.bio}
                            onChange={(e) =>
                              setJournalist({
                                ...journalist,
                                bio: e.target.value,
                              })
                            }
                            placeholder="Tell us about yourself, your experience, and your focus areas..."
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition resize-vertical"
                          />
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-400 transition font-semibold shadow-lg"
                          >
                            <Save size={18} /> Save Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NEWS LIST */}
            {activeTab === "news" && (
              <div className="animate-fadeIn">
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Newspaper size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {newsList.length}
                        </p>
                        <p className="text-gray-400">Total News</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Calendar size={24} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-gray-400">Today</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <Plus size={24} className="text-yellow-400" />
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setForm({
                              title: "",
                              location: "New Orleans",
                              credit: "",
                              description: "",
                              photos: [],
                            });
                            setEditingNews(null);
                            setPreviewImages([]);
                            setActiveTab("edit");
                          }}
                          className="text-yellow-400 hover:text-yellow-300 font-semibold text-lg"
                        >
                          Create News
                        </button>
                        <p className="text-gray-400">New Story</p>
                      </div>
                    </div>
                  </div>
                </div>

                {newsList.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                      <Newspaper size={40} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      No news articles yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by creating your first news story
                    </p>
                    <button
                      onClick={() => setActiveTab("edit")}
                      className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition font-semibold"
                    >
                      <Plus size={20} /> Create First News
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {newsList
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((item) => (
                        <div
                          key={item._id}
                          className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/30 transition group"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                            {/* Thumbnail */}
                            {item.photos?.length > 0 && (
                              <div
                                className="lg:w-48 lg:h-32 w-full h-48 relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                                onClick={() => viewNewsDetails(item)}
                              >
                                <Image
                                  src={item.photos[0].url}
                                  alt={item.title}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                                  <Eye
                                    size={24}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-3">
                                <h3
                                  className="text-xl font-bold text-white group-hover:text-yellow-400 transition line-clamp-2 cursor-pointer"
                                  onClick={() => viewNewsDetails(item)}
                                >
                                  {item.title}
                                </h3>
                                <div className="flex gap-2 ml-4 flex-shrink-0">
                                  <button
                                    onClick={() => viewNewsDetails(item)}
                                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                                    title="View Details"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => editNews(item)}
                                    className="p-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition"
                                    title="Edit"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteNews(item._id)}
                                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {item.location}
                                </div>
                                {item.credit && (
                                  <div className="flex items-center gap-1">
                                    <User size={14} />
                                    {item.credit}
                                  </div>
                                )}
                              </div>

                              <p
                                className="text-gray-300 leading-relaxed line-clamp-3 cursor-pointer"
                                onClick={() => viewNewsDetails(item)}
                              >
                                {item.description}
                              </p>

                              {item.photos?.length > 1 && (
                                <div className="flex gap-2 mt-3">
                                  {item.photos.slice(1, 4).map((p, i) => (
                                    <div
                                      key={i}
                                      className="relative w-12 h-12 rounded border border-gray-600 overflow-hidden cursor-pointer"
                                      onClick={() => viewNewsDetails(item)}
                                    >
                                      <Image
                                        src={p.url}
                                        alt={`${i + 1}`}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform"
                                      />
                                    </div>
                                  ))}
                                  {item.photos.length > 4 && (
                                    <div
                                      className="w-12 h-12 rounded border border-gray-600 bg-gray-800 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:bg-gray-700 transition"
                                      onClick={() => viewNewsDetails(item)}
                                    >
                                      +{item.photos.length - 4}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ADD / EDIT NEWS - Unchanged from original */}
            {activeTab === "edit" && (
              <div className="">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <FileText size={24} />
                    {editingNews ? "Edit News Story" : "Create New News Story"}
                  </h2>
                  <p className="text-gray-400">
                    {editingNews
                      ? "Update your news story details"
                      : "Fill in the details below to publish a new story"}
                  </p>
                  <p className="text-yellow-400 text-sm mt-2">
                    📅 Date will be automatically set when published
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <div className="space-y-6">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                          </label>
                          <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter compelling headline..."
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location *
                          </label>
                          <select
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                          >
                            {cityOptions.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Credit */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Credit / Byline
                          </label>
                          <input
                            name="credit"
                            value={form.credit}
                            onChange={handleChange}
                            placeholder="Your name or source credit..."
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description *
                          </label>
                          <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Write your news story here. Be descriptive and engaging..."
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition resize-vertical"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - Photos & Actions */}
                  <div className="space-y-6">
                    {/* Photo Upload */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ImageIcon size={20} />
                        Photos ({previewImages.length}/5)
                      </h3>

                      <label
                        className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition ${
                          previewImages.length >= 5
                            ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                            : "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
                        }`}
                      >
                        <Upload size={24} />
                        <span className="text-sm font-medium">
                          {previewImages.length >= 5
                            ? "Maximum Reached"
                            : "Upload Photos"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleImageUpload}
                          disabled={previewImages.length >= 5}
                        />
                      </label>

                      {previewImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-400 mb-3">Preview:</p>
                          <div className="grid grid-cols-2 gap-3">
                            {previewImages.map((src, i) => (
                              <div
                                key={i}
                                className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 group"
                              >
                                <Image
                                  src={src}
                                  alt={`Preview ${i + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  onClick={() => removeImage(i)}
                                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          disabled={saving}
                          onClick={handleSaveNews}
                          className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={18} />
                          {saving
                            ? "Saving..."
                            : editingNews
                            ? "Update News"
                            : "Publish News"}
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("news");
                            setEditingNews(null);
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
