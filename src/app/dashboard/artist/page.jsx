"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload, Save, Trash2, Music2, ImageIcon, LogOut, Home } from "lucide-react";

export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [artist, setArtist] = useState({
    name: "John Doe",
    city: "Los Angeles",
    genre: "Pop",
    biography:
      "Dream-pop artist creating soulful and experimental soundscapes for modern listeners.",
    photos: [],
    audio: null,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);

  const genreOptions = [
    "Pop",
    "Rock",
    "Hip-Hop",
    "R&B",
    "Jazz",
    "Classical",
    "Country",
    "Electronic",
    "Folk",
    "Reggae",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtist({ ...artist, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);
    setArtist({ ...artist, photos: files });
  };

  const removeImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedFiles = artist.photos.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setArtist({ ...artist, photos: updatedFiles });
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
      setArtist({ ...artist, audio: file });
    }
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    // clear tokens or cookies here if using auth
  };

  return (
    <div className="py-2 px-4 flex justify-center">
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 md:p-12 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
            Artist Profile
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

        <p className="text-center text-[var(--color-muted-foreground)] mb-10">
          Manage your artist details, media, and genre preferences.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-12 border-b border-[var(--color-border)] pb-2">
          {["overview", "edit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-2 text-lg font-medium transition-all ${
                activeTab === tab
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]"
              }`}
            >
              {tab === "overview" ? "Overview" : "Edit Profile"}
            </button>
          ))}
        </div>

        {/* === OVERVIEW TAB === */}
        {activeTab === "overview" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    Name
                  </h4>
                  <p className="text-lg font-medium">{artist.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    City
                  </h4>
                  <p className="text-lg font-medium">{artist.city}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    Genre
                  </h4>
                  <p className="text-lg font-medium">{artist.genre}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    Biography
                  </h4>
                  <p className="text-[var(--color-foreground)]/90 leading-relaxed">
                    {artist.biography}
                  </p>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-2">
                    <ImageIcon size={16} /> Photos
                  </h4>
                  {previewImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {previewImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]"
                        >
                          <Image
                            src={src}
                            alt="Artist"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[var(--color-muted-foreground)] italic">
                      No photos uploaded yet.
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-2">
                    <Music2 size={16} /> Audio Track
                  </h4>
                  {audioPreview ? (
                    <audio
                      controls
                      src={audioPreview}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)]"
                    />
                  ) : (
                    <p className="text-[var(--color-muted-foreground)] italic">
                      No audio uploaded yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === EDIT TAB === */}
        {activeTab === "edit" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={artist.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  City
                </label>
                <input
                  name="city"
                  value={artist.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                />
              </div>

              {/* Genre Dropdown */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Genre
                </label>
                <select
                  name="genre"
                  value={artist.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                >
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Biography */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={artist.biography}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short biography..."
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* Uploads */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-2">
                  Upload Photos (max 5)
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
                        <Image
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
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

              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-2">
                  Upload Audio (MP3)
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition">
                  <Music2 size={16} /> Upload Audio
                  <input
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={handleAudioUpload}
                  />
                </label>

                {audioPreview && (
                  <audio
                    controls
                    src={audioPreview}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] mt-3"
                  />
                )}
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-10 py-3 rounded-[var(--radius-lg)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] shadow-md transition-all"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
