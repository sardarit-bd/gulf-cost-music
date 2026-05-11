"use client";
import axios from "axios";
import { Building2, Save, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ColorPicker from "./ColorPicker";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const VenueEditModal = ({ venue, isOpen, onClose, onVenueUpdated }) => {
  const [formData, setFormData] = useState({
    venueName: "",
    city: "",
    state: "Alabama",
    address: "",
    seatingCapacity: "",
    biography: "",
    openHours: "",
    openDays: "",
    isActive: false,
    colorCode: "",
    verifiedOrder: 0,
  });

  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (venue) {
      setFormData({
        venueName: venue.venueName || "",
        city: venue.city || "",
        state: venue.state || "Alabama",
        address: venue.address || "",
        seatingCapacity: venue.seatingCapacity || "",
        biography: venue.biography || "",
        openHours: venue.openHours || "",
        openDays: venue.openDays || "",
        isActive: venue.isActive || false,
        colorCode: venue.colorCode || "",
        verifiedOrder: venue.verifiedOrder || 0,
      });
    }
  }, [venue]);

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, colorCode: color }));
    setShowColorPicker(false);
    toast.success("Color selected!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const updateData = {
        ...formData,
        seatingCapacity: parseInt(formData.seatingCapacity) || 0,
        verifiedOrder: parseInt(formData.verifiedOrder) || 0,
      };

      const response = await axios.put(
        `${API_BASE}/api/venues/admin/${venue._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        toast.success("Venue updated successfully!");
        onVenueUpdated();
        onClose();
      }
    } catch (err) {
      console.error("Error updating venue:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error(err.response?.data?.message || "Failed to update venue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Venue: {venue.venueName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  required
                  className="text-gray-500 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                >
                  <option value="Alabama">Alabama</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Florida">Florida</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Hours
                </label>
                <input
                  type="text"
                  name="openHours"
                  value={formData.openHours}
                  onChange={handleChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Days
                </label>
                <input
                  type="text"
                  name="openDays"
                  value={formData.openDays}
                  onChange={handleChange}
                  placeholder="e.g., Monday - Friday"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                />
              </div>

              {/* Color Picker Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Color
                </label>

                {/* Current Color Display */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: formData.colorCode || "#CCCCCC" }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  ></div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="colorCode"
                      value={formData.colorCode}
                      onChange={handleChange}
                      placeholder="#000000"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-gray-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {showColorPicker ? "Hide" : "Pick Color"}
                  </button>
                </div>

                {/* Color Picker */}
                {showColorPicker && (
                  <div className="mt-3 border-t pt-3">
                    <ColorPicker
                      city={formData.city}
                      state={formData.state}
                      currentColor={formData.colorCode}
                      venueId={venue._id}
                      onColorSelect={handleColorSelect}
                      onClose={() => setShowColorPicker(false)}
                    />
                  </div>
                )}
              </div>

              {/* Status Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 cursor-pointer">
                    Active Venue
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Order (0 = unverified)
                  </label>
                  <input
                    type="number"
                    name="verifiedOrder"
                    value={formData.verifiedOrder}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Setting to &gt;0 will auto-assign color if not set
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Venue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueEditModal;
