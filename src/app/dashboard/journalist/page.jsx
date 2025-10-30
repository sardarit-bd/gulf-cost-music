"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Upload,
  Save,
  Trash2,
  Home,
  LogOut,
  Newspaper,
  Plus,
  Pencil,
  User2,
} from "lucide-react";
import { useSession } from "@/lib/auth";

const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

export default function JournalistDashboard() {
  const { user, loading, logout } = useSession();

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
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const blankNews = {
    title: "",
    date: "",
    location: "New Orleans",
    credit: "",
    description: "",
    photos: [],
  };

  const [form, setForm] = useState(blankNews);
  const [previewImages, setPreviewImages] = useState([]);


  //  Load journalist profile + news on mount
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        // Load Profile
        const profRes = await fetch("http://localhost:5000/api/journalists/profile", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const profData = await profRes.json();
        if (profRes.ok && profData.data?.journalist) {
          const j = profData.data.journalist;
          setJournalist({
            fullName: j.fullName,
            email: j.user?.email || "",
            bio: j.bio || "",
            avatar: j.profilePhoto?.url || null,
          });
          setPreviewAvatar(j.profilePhoto?.url || null);
        }

        // Load My News
        const newsRes = await fetch("http://localhost:5000/api/news/my", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const newsData = await newsRes.json();
        if (newsRes.ok && newsData.data?.news) {
          setNewsList(newsData.data.news);
        }
      } catch (err) {
        console.error("Error loading journalist data:", err);
      }
    };
    fetchData();
  }, [user]);

  //  Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewAvatar(URL.createObjectURL(file));

    try {
      const token = getCookie("token");
      const formData = new FormData();
      formData.append("fullName", journalist.fullName);
      formData.append("bio", journalist.bio);
      formData.append("profilePhoto", file);

      const res = await fetch("http://localhost:5000/api/journalists/profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Profile photo updated!");
      } else {
        setMessage("❌ Failed to upload profile photo");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setMessage("❌ Error uploading avatar");
    }
  };

  //  News Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewImages(urls);
    setForm({ ...form, photos: files });
  };

  const removeImage = (i) => {
    setPreviewImages((p) => p.filter((_, idx) => idx !== i));
    setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });
  };

  //  Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Save News (Create or Update)
  const handleSaveNews = async () => {
    if (!form.title || !form.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      const token = getCookie("token");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("credit", form.credit);
      formData.append("location", form.location.toLowerCase());
      formData.append("date", form.date);
      form.photos.forEach((p) => formData.append("photos", p));

      const url = editingNews
        ? `http://localhost:5000/api/news/${editingNews._id}`
        : "http://localhost:5000/api/news";
      const method = editingNews ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(editingNews ? "✅ News updated!" : "✅ News added!");
        // Refresh list
        const listRes = await fetch("http://localhost:5000/api/news/my", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const listData = await listRes.json();
        setNewsList(listData.data?.news || []);
        setActiveTab("news");
        setEditingNews(null);
        setForm(blankNews);
        setPreviewImages([]);
      } else {
        setMessage(data.message || "❌ Failed to save news");
      }
    } catch (err) {
      console.error("Save news error:", err);
      setMessage("❌ Server error");
    } finally {
      setSaving(false);
    }
  };

  //  Edit News
  const editNews = (n) => {
    setForm({
      title: n.title,
      date: n.date?.split("T")[0] || "",
      location: n.location || "New Orleans",
      credit: n.credit || "",
      description: n.description || "",
      photos: [],
    });
    setPreviewImages(n.photos?.map((p) => p.url) || []);
    setEditingNews(n);
    setActiveTab("edit");
  };

  //  Delete News
  const deleteNews = async (id) => {
    if (!confirm("Delete this news item?")) return;
    try {
      const token = getCookie("token");
      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (res.ok) {
        setNewsList((prev) => prev.filter((n) => n._id !== id));
        setMessage(" News deleted!");
      }
    } catch (err) {
      console.error("Delete news error:", err);
    }
  };

  //  Logout
  const handleLogout = async () => {
    await logout();
    window.location.href = "/signin";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-yellow-400">
        Loading...
      </div>
    );

  return (
    <div className="px-4 flex justify-center">
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <Newspaper size={26} /> Journalist Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"
            >
              <Home size={16} /> Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-destructive)] text-white hover:opacity-90 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6 border-b border-[var(--color-border)] pb-2">
          {["profile", "news", "edit"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-2 px-2 text-lg font-medium ${
                activeTab === t
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]"
              }`}
            >
              {t === "profile"
                ? "Profile"
                : t === "news"
                ? "My News"
                : editingNews
                ? "Edit News"
                : "Add News"}
            </button>
          ))}
        </div>

        {message && (
          <div
            className={`text-center mb-4 font-medium ${
              message.includes("✅") ? "text-green-500" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="animate-fadeIn max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-yellow-400 mb-4">
                {previewAvatar ? (
                  <Image src={previewAvatar} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User2 className="w-full h-full text-gray-400 p-8" />
                )}
              </div>
              <label className="cursor-pointer bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition">
                <Upload size={16} className="inline mr-2" /> Upload Avatar
                <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                <input
                  name="fullName"
                  value={journalist.fullName}
                  onChange={(e) =>
                    setJournalist({ ...journalist, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={journalist.bio}
                  onChange={(e) => setJournalist({ ...journalist, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* NEWS LIST TAB */}
        {activeTab === "news" && (
          <div className="animate-fadeIn">
            {newsList.length === 0 ? (
              <p className="text-center text-gray-400 italic">
                No news articles yet. Create your first one!
              </p>
            ) : (
              <div className="grid gap-6">
                {newsList
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editNews(item)}
                            className="p-1.5 rounded bg-yellow-500 text-black hover:opacity-80"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteNews(item._id)}
                            className="p-1.5 rounded bg-red-600 text-white hover:opacity-80"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        {item.date?.split("T")[0]} · {item.location} · {item.credit}
                      </p>
                      <p className="text-gray-300 mb-3">{item.description.slice(0, 100)}...</p>
                      {item.photos?.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                          {item.photos.slice(0, 3).map((p, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-md overflow-hidden border border-gray-700"
                            >
                              <Image
                                src={p.url}
                                alt={`photo-${i}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setForm(blankNews);
                  setEditingNews(null);
                  setPreviewImages([]);
                  setActiveTab("edit");
                }}
                className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
              >
                <Plus size={18} /> Add News
              </button>
            </div>
          </div>
        )}

        {/* ADD / EDIT NEWS */}
        {activeTab === "edit" && (
          <div className="animate-fadeIn space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Location</label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-700"
                >
                  {cityOptions.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">Credit</label>
                <input
                  name="credit"
                  value={form.credit}
                  onChange={handleChange}
                  placeholder="Byline or Source"
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write detailed news content..."
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-700"
                ></textarea>
              </div>
            </div>

            {/* Uploads */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Upload Photos (max 5)
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition">
                <Upload size={16} /> Upload
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative aspect-square border border-gray-700 rounded-md overflow-hidden group">
                      <Image src={src} alt="preview" fill className="object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                disabled={saving}
                onClick={handleSaveNews}
                className="flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
              >
                <Save size={18} />
                {saving
                  ? "Saving..."
                  : editingNews
                  ? "Update News"
                  : "Save News"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
