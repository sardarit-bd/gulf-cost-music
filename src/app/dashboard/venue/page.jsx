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
  Building2,
  Clock,
  ImageIcon,
} from "lucide-react";

export default function VenueDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [venue, setVenue] = useState({
    name: "",
    city: "",
    address: "",
    seating: "",
    biography: "",
    openHours: "",
    photos: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [newShow, setNewShow] = useState({
    artist: "",
    date: "",
    time: "",
  });

  const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // === Fetch Venue Profile ===
  useEffect(() => {
    const fetchVenue = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("Fetched venue data:", data);

      if (res.ok && data.data?.venue) {
        setVenue({
          name: data.data.venue.venueName,
          city: data.data.venue.city,
          address: data.data.venue.address,
          seating: data.data.venue.seatingCapacity,
          biography: data.data.venue.biography,
          openHours: data.data.venue.openHours,
          photos: [],
        });
        setPreviewImages(data.data.venue.photos?.map((p) => p.url) || []);
      }
    };

    fetchVenue();
  }, []);

  // === Handle Input Changes ===
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

  const uploadPhotos = async (token) => {
    const photoFormData = new FormData();
    venue.photos.forEach(photo => {
      photoFormData.append('photos', photo);
    });
    console.log(token, venue.photos)
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

  // === Save Venue Profile ===
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❌ You are not logged in.");

      const formData = new FormData();
      formData.append("venueName", venue.name);
      formData.append("city", venue.city);
      formData.append("address", venue.address);
      formData.append("seatingCapacity", venue.seating);
      formData.append("biography", venue.biography);
      formData.append("openHours", venue.openHours);
      formData.append("openDays", "Mon–Sat");

      if (venue.photos.length > 0) {
        venue.photos.forEach((file) => formData.append("photos", file));
      }

      uploadPhotos(localStorage.getItem('token'))
      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Venue profile saved successfully!");
      } else {
        alert("❌ " + (data.message || "Failed to save venue profile"));
      }
    } catch (error) {
      console.error("Error saving venue:", error);
      alert("❌ Server error while saving venue.");
    }
  };

  // === Add Show ===
  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/venues/add-show`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newShow),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Show added successfully!");
        setNewShow({ artist: "", date: "", time: "" });
      } else {
        alert(data.message || "❌ Failed to add show");
      }
    } catch (err) {
      console.error("Error adding show:", err);
      alert("❌ Error adding show");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
  };

  return (
    <div className="py-16 px-4 flex justify-center">
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <Building2 size={26} /> Venue Dashboard
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

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-12 border-b border-[var(--color-border)] pb-2">
          {["overview", "edit", "addshow"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-2 text-lg font-medium transition-all ${
                activeTab === tab
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]"
              }`}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "edit"
                ? "Edit Profile"
                : "Add Show"}
            </button>
          ))}
        </div>

        {/* === OVERVIEW TAB === */}
        {activeTab === "overview" && <OverviewTab venue={venue} previewImages={previewImages} />}

        {/* === EDIT PROFILE TAB === */}
        {activeTab === "edit" && (
          <EditProfileTab
            venue={venue}
            cityOptions={cityOptions}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            previewImages={previewImages}
            handleSave={handleSave}
          />
        )}

        {/* === ADD SHOW TAB === */}
        {activeTab === "addshow" && (
          <AddShowTab
            newShow={newShow}
            setNewShow={setNewShow}
            handleAddShow={handleAddShow}
          />
        )}
      </div>
    </div>
  );
}

/* ------------ Overview ------------ */
const OverviewTab = ({ venue, previewImages }) => (
  <div className="animate-fadeIn space-y-10">
    <div className="grid md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <Info label="Venue Name" value={venue.name} />
        <Info label="City" value={venue.city} />
        <Info label="Address" value={venue.address} />
        <Info label="Seating Capacity" value={venue.seating} />
        <Info label="Biography" value={venue.biography} />
        <div>
          <h4 className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
            <Clock size={14} /> Open Hours
          </h4>
          <p className="text-lg font-medium">{venue.openHours}</p>
        </div>
      </div>

      {/* Photos */}
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
                <Image src={src} alt="Venue" fill className="object-cover" />
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
);

/* ------------ Edit Profile ------------ */
const EditProfileTab = ({
  venue,
  cityOptions,
  handleChange,
  handleImageUpload,
  removeImage,
  previewImages,
  handleSave,
}) => (
  <div className="animate-fadeIn space-y-10">
    <div className="grid md:grid-cols-2 gap-8">
      <Input label="Venue Name" name="name" value={venue.name} onChange={handleChange} />
      <div>
        <label className="block text-sm mb-1 text-gray-500">City</label>
        <select
          name="city"
          value={venue.city}
          onChange={handleChange}
          className="bg-gray-800 w-full px-4 py-2 rounded-md border border-gray-300"
        >
          {cityOptions.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>
      <Input label="Address" name="address" value={venue.address} onChange={handleChange} />
      <Input
        label="Seating Capacity"
        name="seating"
        value={venue.seating}
        onChange={handleChange}
        type="number"
      />
      <div className="md:col-span-2">
        <label className="block text-sm mb-1 text-gray-500">Biography</label>
        <textarea
          name="biography"
          value={venue.biography}
          onChange={handleChange}
          rows={4}
          className="bg-gray-800 w-full px-4 py-2 rounded-md border border-gray-300"
        ></textarea>
      </div>
      <Input
        label="Open Hours"
        name="openHours"
        value={venue.openHours}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="block text-sm mb-2 text-gray-500">Upload Venue Photos</label>
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#d6b707] text-white rounded-md hover:bg-[#dfbe04b7] transition">
        Upload Images
        <input type="file" hidden multiple onChange={handleImageUpload} />
      </label>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {previewImages.map((src, idx) => (
            <div key={idx} className="relative aspect-square border rounded-md overflow-hidden group">
              <Image src={src} alt="Preview" fill className="object-cover" />
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

    <div className="flex justify-center mt-10">
      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-[#d6b707] text-white px-10 py-3 rounded-md font-medium hover:bg-[#dfbe04b7] transition"
      >
        <Save size={18} /> Save Changes
      </button>
    </div>
  </div>
);

/* ------------ Add Show ------------ */
const AddShowTab = ({ newShow, setNewShow, handleAddShow }) => (
  <div className="animate-fadeIn max-w-lg mx-auto">
    <form onSubmit={handleAddShow} className="space-y-5">
      <Input
        className="text-white placeholder:bg-gray-500"
        label="Artist / Band Name"
        name="artist"
        value={newShow.artist}
        onChange={(e) => setNewShow({ ...newShow, artist: e.target.value })}
      />
      <Input
        className="text-white"
        label="Date"
        name="date"
        type="date"
        value={newShow.date}
        onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
      />
      <Input
        className="text-white"
        label="Time"
        name="time"
        type="time"
        value={newShow.time}
        onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
      />
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="bg-[#d6b707] hover:bg-[#dfbe04b7] text-white px-8 py-3 rounded-md font-semibold transition"
        >
          Add Show
        </button>
      </div>
    </form>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <h4 className="text-sm text-gray-500">{label}</h4>
    <p className="text-lg font-medium">{value || "—"}</p>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-500">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>
);
