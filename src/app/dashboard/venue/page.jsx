"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  Calendar,
  Clock,
  Edit3,
  ImageIcon,
  Loader2,
  MapPin,
  Music,
  Save,
  Star,
  Trash2,
  Users,
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

export default function VenueDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
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
  const [saving, setSaving] = useState(false);

  const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // === Fetch Venue Profile ===
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");
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
      const token = getCookie("token");
      if (!token) return toast.error("You are not logged in.");

      const formData = new FormData();
      formData.append("venueName", venue.name);
      formData.append("city", venue.city.toLowerCase());
      formData.append("address", venue.address);
      formData.append("seatingCapacity", venue.seating);
      formData.append("biography", venue.biography || "");
      formData.append("openHours", venue.openHours);
      formData.append("openDays", "Mon-Sat");

      if (venue.photos && venue.photos.length > 0) {
        venue.photos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      setSaving(true);
      const saveToast = toast.loading("Saving venue...");

      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(saveToast);
      if (!res.ok) throw new Error(data.message || "Failed to save venue.");

      toast.success("Venue profile saved successfully!");

      // Update local state with new photos
      if (data.data?.venue?.photos) {
        setPreviewImages(data.data.venue.photos.map((p) => p.url));
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Server error while saving venue.");
    } finally {
      setSaving(false);
    }
  };

  // === Add Show ===
  const handleAddShow = async (e) => {
    e.preventDefault();

    try {
      const token = getCookie("token");
      if (!token) return toast.error("You are not logged in.");

      const formData = new FormData();
      formData.append("artist", newShow.artist);
      formData.append("date", newShow.date);
      formData.append("time", newShow.time);
      if (newShow.image) formData.append("image", newShow.image);

      setLoading(true);

      const res = await fetch(`${API_BASE}/api/venues/add-show`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add show.");

      toast.success("🎤 Show added successfully!");
      setNewShow({ artist: "", date: "", time: "", image: null });
    } catch (err) {
      console.error("Add show error:", err);
      toast.error(err.message || "Error adding show.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Building2 size={32} className="text-black" />
            </div>
            Venue Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your venue profile and upcoming shows
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Enhanced Tabs */}
          <div className="border-b border-gray-700 bg-gray-900">
            <div className="flex overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: Building2 },
                { id: "edit", label: "Edit Profile", icon: Edit3 },
                { id: "addshow", label: "Add Show", icon: Music },
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
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <span className="ml-3 text-gray-400">Loading...</span>
              </div>
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
                saving={saving}
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
      </div>
    </div>
  );
}

/* ============== Enhanced Overview Tab ============== */
const OverviewTab = ({ venue, previewImages }) => (
  <div className="animate-fadeIn space-y-8">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Users size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {venue.seating || "0"}
            </p>
            <p className="text-gray-400">Seating Capacity</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <MapPin size={24} className="text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white capitalize">
              {venue.city || "—"}
            </p>
            <p className="text-gray-400">Location</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <Clock size={24} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white truncate">
              {venue.openHours || "—"}
            </p>
            <p className="text-gray-400">Open Hours</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      {/* Venue Details Card */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Building2 size={24} />
          Venue Information
        </h3>

        <div className="space-y-6">
          <InfoCard
            icon={<Star className="text-yellow-400" size={20} />}
            label="Venue Name"
            value={venue.name}
          />
          <InfoCard
            icon={<MapPin className="text-red-400" size={20} />}
            label="Address"
            value={venue.address}
          />
          <InfoCard
            icon={<Users className="text-blue-400" size={20} />}
            label="Seating Capacity"
            value={venue.seating ? `${venue.seating} people` : "—"}
          />
          <InfoCard
            icon={<Clock className="text-green-400" size={20} />}
            label="Open Hours"
            value={venue.openHours}
          />
        </div>

        {/* Biography Section */}
        {venue.biography && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Edit3 size={18} />
              About Venue
            </h4>
            <p className="text-gray-300 leading-relaxed bg-gray-800/50 rounded-lg p-4">
              {venue.biography}
            </p>
          </div>
        )}
      </div>

      {/* Photos Gallery Card */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon size={24} />
          Venue Photos
          {previewImages.length > 0 && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium ml-2">
              {previewImages.length}
            </span>
          )}
        </h3>

        {previewImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {previewImages.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden group border border-gray-600"
              >
                <Image
                  src={src}
                  alt={`Venue photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-2">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Photo {idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600">
            <ImageIcon size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No photos uploaded yet</p>
            <p className="text-gray-500 text-sm">
              Add photos in the Edit Profile section
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ============== Enhanced Edit Profile Tab ============== */
const EditProfileTab = ({
  venue,
  cityOptions,
  handleChange,
  handleImageUpload,
  removeImage,
  previewImages,
  handleSave,
  saving,
}) => (
  <div className="">
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Edit3 size={20} />
            Venue Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Venue Name *"
              name="name"
              value={venue.name}
              onChange={handleChange}
              icon={<Building2 size={18} />}
            />
            <Select
              label="City *"
              name="city"
              value={venue.city}
              options={cityOptions}
              onChange={handleChange}
              icon={<MapPin size={18} />}
            />
            <div className="md:col-span-2">
              <Input
                label="Address *"
                name="address"
                value={venue.address}
                onChange={handleChange}
                icon={<MapPin size={18} />}
              />
            </div>
            <Input
              label="Seating Capacity"
              name="seating"
              type="number"
              value={venue.seating}
              onChange={handleChange}
              icon={<Users size={18} />}
            />
            <Input
              label="Open Hours"
              name="openHours"
              value={venue.openHours}
              onChange={handleChange}
              icon={<Clock size={18} />}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Biography"
                name="biography"
                value={venue.biography}
                onChange={handleChange}
                icon={<Edit3 size={18} />}
                placeholder="Tell us about your venue, its history, and what makes it special..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Photos & Actions */}
      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon size={20} />
            Photos ({previewImages.length}/5)
          </h3>

          <label
            className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl transition ${
              previewImages.length >= 5
                ? "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                : "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
            }`}
          >
            <ImageIcon size={32} />
            <span className="text-sm font-medium text-center">
              {previewImages.length >= 5
                ? "Maximum Reached"
                : "Upload Venue Photos"}
            </span>
            <span className="text-xs text-gray-400 text-center">
              Max 5 photos • JPG, PNG
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
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
          <div className="space-y-3">
            <button
              disabled={saving}
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ============== Enhanced Add Show Tab ============== */
const AddShowTab = ({ newShow, setNewShow, handleAddShow }) => (
  <div className="">
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Music size={32} className="text-black" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Add New Show</h2>
        <p className="text-gray-400">
          Schedule a live performance at your venue
        </p>
      </div>

      <form onSubmit={handleAddShow} className="space-y-6">
        {/* ARTIST */}
        <Input
          label="Artist / Band Name *"
          name="artist"
          value={newShow.artist}
          onChange={(e) => setNewShow({ ...newShow, artist: e.target.value })}
          icon={<Music size={18} />}
          placeholder="Enter artist or band name"
        />

        {/* DATE & TIME */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Show Date *"
            name="date"
            type="date"
            value={newShow.date}
            onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
            icon={<Calendar size={18} />}
          />
          <Input
            label="Show Time *"
            name="time"
            type="time"
            value={newShow.time}
            onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
            icon={<Clock size={18} />}
          />
        </div>

        {/* SHOW IMAGE UPLOAD — ADD HERE */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <ImageIcon size={18} />
            Show Image *
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewShow({ ...newShow, image: e.target.files[0] })
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            <Music size={18} />
            Add Show
          </button>
        </div>
      </form>
    </div>
  </div>
);

/* ============== Enhanced Reusable Components ============== */
const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-400 mb-1">{label}</h4>
      <p className="text-white font-semibold">{value || "Not specified"}</p>
    </div>
  </div>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
      required
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, icon, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition resize-vertical"
    />
  </div>
);

const Select = ({ label, name, value, options, onChange, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
    >
      <option value="">Select a city</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
