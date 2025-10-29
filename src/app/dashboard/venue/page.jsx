"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Save,
  Trash2,
  MapPin,
  Home,
  LogOut,
  Building2,
  Clock,
  ImageIcon,
} from "lucide-react";

export default function VenueDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [venue, setVenue] = useState({
    name: "Jazz Haven",
    city: "New Orleans",
    address: "123 Bourbon Street",
    seating: "250",
    biography:
      "A historic jazz venue located in the heart of New Orleans, offering nightly live performances and an authentic southern atmosphere.",
    openHours: "Mon–Sat, 6PM–2AM",
    photos: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue({ ...venue, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);
    setVenue({ ...venue, photos: files });
  };

  const removeImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedFiles = venue.photos.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setVenue({ ...venue, photos: updatedFiles });
  };

  const handleSave = () => {
    alert("Venue profile saved successfully!");
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    // Clear tokens or redirect if needed
  };

  return (
    <div className=" py-16 px-4 flex justify-center">
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <Building2 size={26} /> Venue Profile
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
          Manage your venue information, schedule, and media.
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
                    Venue Name
                  </h4>
                  <p className="text-lg font-medium">{venue.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    City
                  </h4>
                  <p className="text-lg font-medium">{venue.city}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    Address
                  </h4>
                  <p className="text-lg font-medium">{venue.address}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    Seating Capacity
                  </h4>
                  <p className="text-lg font-medium">{venue.seating}</p>
                </div>
                <div>
                  <h4 className="text-sm text-[var(--color-muted-foreground)]">
                    Biography
                  </h4>
                  <p className="text-[var(--color-foreground)]/90 leading-relaxed">
                    {venue.biography}
                  </p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                    <Clock size={14} /> Open Hours
                  </h4>
                  <p className="text-lg font-medium">{venue.openHours}</p>
                </div>
              </div>

              {/* Photo Gallery */}
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
                          alt="Venue"
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
            </div>
          </div>
        )}

        {/* === EDIT TAB === */}
        {activeTab === "edit" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Venue Name */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Venue Name
                </label>
                <input
                  name="name"
                  value={venue.name}
                  onChange={handleChange}
                  placeholder="Enter venue name"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                />
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  City
                </label>
                <select
                  name="city"
                  value={venue.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={venue.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                />
              </div>

              {/* Seating Capacity */}
              <div>
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Seating Capacity
                </label>
                <input
                  name="seating"
                  value={venue.seating}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  type="number"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                />
              </div>

              {/* Biography */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={venue.biography}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your venue..."
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                ></textarea>
              </div>

              {/* Open Hours */}
              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--color-muted-foreground)] mb-1">
                  Open Hours and Days
                </label>
                <input
                  name="openHours"
                  value={venue.openHours}
                  onChange={handleChange}
                  placeholder="e.g. Mon–Sat, 6PM–2AM"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-white text-black placeholder-gray-500 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-ring)] focus:outline-none"
                />
              </div>
            </div>

            {/* Upload Photos */}
            <div>
              <label className="block text-sm text-[var(--color-muted-foreground)] mb-2">
                Upload Venue Photos (max 5)
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

            {/* Save Button */}
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
