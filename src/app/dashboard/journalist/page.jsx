"use client";

import { useState } from "react";
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
  MapPin,
  CalendarDays,
} from "lucide-react";

// 🗺️ Location dropdown options
const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

export default function JournalistDashboard() {
  const [activeTab, setActiveTab] = useState("news");
  const [journalist, setJournalist] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    bio: "Award-winning journalist covering southern culture, music, and lifestyle.",
    avatar: null,
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  // Template for new news
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

  // 🖼️ Avatar Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJournalist({ ...journalist, avatar: file });
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  // 📰 News Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);
    setForm({ ...form, photos: files });
  };

  const removeImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedFiles = form.photos.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setForm({ ...form, photos: updatedFiles });
  };

  // ✏️ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 💾 Save or Update News
  const handleSaveNews = () => {
    if (!form.title || !form.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingNews !== null) {
      const updated = [...newsList];
      updated[editingNews] = form;
      setNewsList(updated);
      setEditingNews(null);
    } else {
      setNewsList([...newsList, { ...form }]);
    }

    // Reset form
    setForm(blankNews);
    setPreviewImages([]);
  };

  // 🗑️ Delete News
  const deleteNews = (index) => {
    if (confirm("Delete this news item?")) {
      const updated = newsList.filter((_, i) => i !== index);
      setNewsList(updated);
    }
  };

  // ✏️ Edit News
  const editNews = (index) => {
    setForm(newsList[index]);
    setEditingNews(index);
    setPreviewImages(
      newsList[index].photos.map((file) =>
        typeof file === "string" ? file : URL.createObjectURL(file)
      )
    );
    setActiveTab("edit");
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
  };

  return (
    <div className=" px-4 flex justify-center">
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
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
        <div className="flex justify-center gap-6 mb-12 border-b border-[var(--color-border)] pb-2">
          {[
            { id: "profile", label: "Profile" },
            { id: "news", label: "My News" },
            { id: "edit", label: editingNews !== null ? "Edit News" : "Add News" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-2 text-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* === PROFILE TAB === */}
        {activeTab === "profile" && (
          <div className="animate-fadeIn space-y-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--color-primary)] mb-4">
                {previewAvatar ? (
                  <Image src={previewAvatar} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User2 className="w-full h-full text-[var(--color-muted-foreground)] p-8" />
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition">
                <Upload size={16} className="inline mr-2" /> Upload Avatar
                <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="grid gap-6 mt-8">
              <div>
                <label className="text-sm text-[var(--color-muted-foreground)] mb-1 block">
                  Name
                </label>
                <input
                  name="name"
                  value={journalist.name}
                  onChange={(e) => setJournalist({ ...journalist, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted-foreground)] mb-1 block">
                  Email
                </label>
                <input
                  name="email"
                  value={journalist.email}
                  onChange={(e) => setJournalist({ ...journalist, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-muted-foreground)] mb-1 block">
                  Biography
                </label>
                <textarea
                  name="bio"
                  value={journalist.bio}
                  onChange={(e) => setJournalist({ ...journalist, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* === MY NEWS TAB === */}
        {activeTab === "news" && (
          <div className="animate-fadeIn">
            {newsList.length === 0 ? (
              <p className="text-center text-[var(--color-muted-foreground)] italic">
                No news articles yet. Create your first one!
              </p>
            ) : (
              <div className="grid gap-6">
                {newsList
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                          {item.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editNews(idx)}
                            className="p-1.5 rounded bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteNews(idx)}
                            className="p-1.5 rounded bg-[var(--color-destructive)] text-white hover:opacity-90"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-1">
                        {item.date} · {item.location} · {item.credit}
                      </p>
                      <p className="text-[var(--color-foreground)]/90 mb-3">
                        {item.description.slice(0, 120)}...
                      </p>
                      {item.photos.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                          {item.photos.slice(0, 3).map((src, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--color-border)]"
                            >
                              <Image
                                src={
                                  typeof src === "string"
                                    ? src
                                    : URL.createObjectURL(src)
                                }
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
                className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-6 py-3 rounded-[var(--radius-lg)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition"
              >
                <Plus size={18} /> Add New News
              </button>
            </div>
          </div>
        )}

        {/* === ADD / EDIT NEWS TAB === */}
        {activeTab === "edit" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter news title"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                >
                  {cityOptions.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Credit
                </label>
                <input
                  name="credit"
                  value={form.credit}
                  onChange={handleChange}
                  placeholder="Byline or Source"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write detailed news content..."
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)]"
                ></textarea>
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm text-[var(--color-muted-foreground)] mb-2">
                Upload News Photos (max 5)
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition">
                <Upload size={16} /> Upload Images
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
                  {previewImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden group"
                    >
                      <Image src={src} alt="preview" fill className="object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-[var(--color-destructive)] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleSaveNews}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-10 py-3 rounded-[var(--radius-lg)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] shadow-md transition-all"
              >
                <Save size={18} /> {editingNews !== null ? "Update News" : "Save News"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
