"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth";
import {
  Upload,
  Save,
  Trash2,
  Music2,
  ImageIcon,
  LogOut,
  Home,
} from "lucide-react";

export default function ArtistDashboard() {
  const { user, loading, logout } = useSession();

  const [activeTab, setActiveTab] = useState("overview");
  const [artist, setArtist] = useState({
    name: "",
    city: "",
    genre: "pop",
    biography: "",
    photos: [],
    audio: null,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const genreOptions = [
    "Pop",
    "Rock",
    "Rap",
    "Country",
    "Jazz",
    "Reggae",
    "EDM",
    "Classical",
    "Other",
  ];

  const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

  // Fetch existing artist profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch artist:", res.status);
          return;
        }

        const data = await res.json();
        if (data.data?.artist) {
          const a = data.data.artist;
          setArtist({
            name: a.name || "",
            city: a.city
              ? a.city.charAt(0).toUpperCase() + a.city.slice(1).toLowerCase()
              : "",
            genre: a.genre ? a.genre.toLowerCase() : "pop",
            biography: a.biography || "",
            photos: a.photos || [],
            audio: a.mp3File || null,
          });
          setPreviewImages(a.photos?.map((p) => p.url) || []);
          setAudioPreview(a.mp3File?.url || null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchProfile();
  }, []);

  //  Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setArtist({ ...artist, [name]: value });
  };

  //  Handle image upload (max 5)
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

  //  Handle MP3 upload
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
      setArtist({ ...artist, audio: file });
    }
  };

  const uploadPhotos = async (token) => {
    const photoFormData = new FormData();
    artist.photos.forEach(photo => {
      photoFormData.append('photos', photo);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload/photos`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: photoFormData,
      });

      console.log(response)
      if (!response.ok) {
        throw new Error("Photo upload failed");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  const uploadMP3 = async (token) => {
    const mp3FormData = new FormData();
    mp3FormData.append('mp3', artist.audio);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload/mp3`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: mp3FormData,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("MP3 upload failed");
      }
    } catch (error) {
      console.error("Error uploading MP3:", error);
    }
  };

  //  Save (POST/PUT to backend)
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", artist.name);
      formData.append("city", artist.city.toLowerCase());
      formData.append("genre", artist.genre.toLowerCase());
      formData.append("biography", artist.biography);

      artist.photos.forEach((file) => formData.append("photos", file));
      if (artist.audio) formData.append("mp3File", artist.audio);

      uploadMP3(localStorage.getItem('token'))
      uploadPhotos(localStorage.getItem('token'))

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log(data)

      if (res.ok) {
        setMessage(" Profile saved successfully!");
        setActiveTab("overview");

        // reload updated artist
        if (data.data?.artist) {
          const a = data.data.artist;
          setPreviewImages(a.photos?.map((p) => p.url) || []);
          setAudioPreview(a.mp3File?.url || null);
        }
      } else {
        setMessage(data.message || "❌ Failed to save profile.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("❌ Server error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/signin";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Unauthorized — please login.
      </div>
    );

  return (
    <div className="py-4 px-4 flex justify-center">
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-lg p-8 md:p-12 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
            Artist Dashboard
          </h1>

          {/* <div className="flex items-center gap-3">
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
          </div> */}
        </div>

        <p className="text-center text-[var(--color-muted-foreground)] mb-10">
          Manage your artist details, media, and genre preferences.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10 border-b border-[var(--color-border)] pb-2">
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

        {/* Message */}
        {message && (
          <div
            className={`text-center mb-6 font-medium ${
              message.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        {/* === OVERVIEW === */}
        {activeTab === "overview" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-400">Name</h4>
                  <p className="text-lg font-medium">{artist.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">City</h4>
                  <p className="text-lg font-medium">{artist.city}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">Genre</h4>
                  <p className="text-lg font-medium capitalize">
                    {artist.genre}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">Biography</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {artist.biography}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <ImageIcon size={16} /> Photos
                  </h4>
                  {previewImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {previewImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-700"
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
                    <p className="text-gray-500 italic">No photos uploaded.</p>
                  )}
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Music2 size={16} /> Audio Track
                  </h4>
                  {audioPreview ? (
                    <audio
                      controls
                      src={audioPreview}
                      className="w-full rounded-md border border-gray-700"
                    />
                  ) : (
                    <p className="text-gray-500 italic">
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
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  name="name"
                  value={artist.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600"
                />
              </div>

              {/* City Dropdown */}
              {console.log(artist)}
              <div>
                <label className="block text-sm text-gray-400 mb-1">City</label>
                <select
                  name="city"
                  value={artist.city.toLowerCase()}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600"
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city.toLocaleLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Genre
                </label>
                <select
                  name="genre"
                  value={artist.genre.toLowerCase()}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600"
                >
                  <option value="">Select Genre</option>
                  {genreOptions.map((g) => (
                    <option key={g} value={g.toLowerCase()}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Biography */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={artist.biography}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short biography..."
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600"
                ></textarea>
              </div>
            </div>

            {/* Uploads */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Photos */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Photos (max 5)
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition">
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
                        className="relative aspect-square border border-gray-600 rounded-md overflow-hidden group"
                      >
                        <Image
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Audio */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Audio (MP3)
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition">
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
                    className="w-full mt-3 rounded-md border border-gray-600"
                  />
                )}
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-10 py-3 rounded-lg font-medium shadow-md transition ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
