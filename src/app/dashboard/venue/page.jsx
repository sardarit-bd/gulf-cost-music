"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Save, Trash2, Building2, Clock, ImageIcon } from "lucide-react";

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
  const [newShow, setNewShow] = useState({ artist: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);

  const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // === Fetch Venue Profile ===
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return toast.error("You must be logged in.");

        const res = await fetch(`${API_BASE}/api/venues/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch venue.");

        if (data.data?.venue) {
          const v = data.data.venue;
          setVenue({
            name: v.venueName,
            city: v.city,
            address: v.address,
            seating: v.seatingCapacity,
            biography: v.biography,
            openHours: v.openHours,
            photos: [],
          });
          setPreviewImages(v.photos?.map((p) => p.url) || []);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        toast.error(error.message || "Server error while loading venue.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, []);

  // === Handle Input ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue({ ...venue, [name]: value });
  };

  // === Image Upload ===
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);
    setVenue({ ...venue, photos: files });
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setVenue((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // === Save Venue ===
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("You are not logged in.");

      const formData = new FormData();
      formData.append("venueName", venue.name);
      formData.append("city", venue.city);
      formData.append("address", venue.address);
      formData.append("seatingCapacity", venue.seating);
      formData.append("biography", venue.biography);
      formData.append("openHours", venue.openHours);
      formData.append("openDays", "Mon–Sat");

      if (venue.photos?.length > 0) {
        venue.photos.forEach((file) => formData.append("photos", file));
      }

      setLoading(true);
      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save venue.");

      toast.success("Venue profile saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Server error while saving venue.");
    } finally {
      setLoading(false);
    }
  };

  // === Add Show ===
  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("You are not logged in.");

      setLoading(true);
      const res = await fetch(`${API_BASE}/api/venues/add-show`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newShow),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add show.");

      toast.success("🎤 Show added successfully!");
      setNewShow({ artist: "", date: "", time: "" });
    } catch (err) {
      console.error("Add show error:", err);
      toast.error(err.message || "Error adding show.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 flex justify-center">
      <Toaster />
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-lg p-8 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)] flex items-center gap-2">
            <Building2 size={26} /> Venue Dashboard
          </h1>
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

        {loading && (
          <p className="text-gray-400 italic animate-pulse text-center mb-6">
            Processing request...
          </p>
        )}

        {activeTab === "overview" && (
          <OverviewTab venue={venue} previewImages={previewImages} />
        )}
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

/* ============== Overview ============== */
const OverviewTab = ({ venue, previewImages }) => (
  <div className="animate-fadeIn space-y-10">
    <div className="grid md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <Info label="Venue Name" value={venue.name} />
        <Info label="City" value={venue.city} />
        <Info label="Address" value={venue.address} />
        <Info label="Seating Capacity" value={venue.seating} />
        <Info label="Biography" value={venue.biography} />
        <Info label="Open Hours" value={venue.openHours} icon={<Clock size={14} />} />
      </div>

      <div>
        <h4 className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <ImageIcon size={16} /> Photos
        </h4>
        {previewImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewImages.map((src, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={src} alt="Venue" fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No photos uploaded yet.</p>
        )}
      </div>
    </div>
  </div>
);

/* ============== Edit Profile ============== */
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
      <Select
        label="City"
        name="city"
        value={venue.city}
        options={cityOptions}
        onChange={handleChange}
      />
      <Input label="Address" name="address" value={venue.address} onChange={handleChange} />
      <Input
        label="Seating Capacity"
        name="seating"
        type="number"
        value={venue.seating}
        onChange={handleChange}
      />
      <Textarea
        label="Biography"
        name="biography"
        value={venue.biography}
        onChange={handleChange}
      />
      <Input
        label="Open Hours"
        name="openHours"
        value={venue.openHours}
        onChange={handleChange}
      />
    </div>

    {/* Upload Section */}
    <div>
      <label className="block text-sm mb-2 text-gray-500">Upload Venue Photos</label>
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
        Upload Images
        <input type="file" hidden multiple onChange={handleImageUpload} />
      </label>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {previewImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-square border rounded-md overflow-hidden group"
            >
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
        className="flex items-center gap-2 bg-yellow-500 text-white px-10 py-3 rounded-md font-medium hover:bg-yellow-600 transition"
      >
        <Save size={18} /> Save Changes
      </button>
    </div>
  </div>
);

/* ============== Add Show ============== */
const AddShowTab = ({ newShow, setNewShow, handleAddShow }) => (
  <div className="animate-fadeIn max-w-lg mx-auto">
    <form onSubmit={handleAddShow} className="space-y-5">
      <Input
        label="Artist / Band Name"
        name="artist"
        value={newShow.artist}
        onChange={(e) => setNewShow({ ...newShow, artist: e.target.value })}
      />
      <Input
        label="Date"
        name="date"
        type="date"
        value={newShow.date}
        onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
      />
      <Input
        label="Time"
        name="time"
        type="time"
        value={newShow.time}
        onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
      />
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-md font-semibold transition"
        >
          Add Show
        </button>
      </div>
    </form>
  </div>
);

/* ============== Reusable Components ============== */
const Info = ({ label, value, icon }) => (
  <div>
    <h4 className="flex items-center gap-1 text-sm text-gray-500">
      {icon} {label}
    </h4>
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
      className="bg-gray-500 w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
      required
    />
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div className="md:col-span-2">
    <label className="block text-sm mb-1 text-gray-500">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="bg-gray-500 w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
    />
  </div>
);

const Select = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-500">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-500 focus:ring-2 focus:ring-yellow-400 outline-none"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
