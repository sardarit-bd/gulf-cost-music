"use client";

import { useAuth } from "@/context/AuthContext";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SponsorForm({ sponsor, onClose, onSave }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: sponsor?.name || "",
    logo: null,
    website: sponsor?.website || "",
  });
  const [imagePreview, setImagePreview] = useState(
    sponsor?.logo?.url || sponsor?.logo || null
  );
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload validation and processing
  const processImageFile = (file) => {
    if (!file) return false;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return false;
    }

    // Check specific image formats
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WEBP image");
      return false;
    }

    return true;
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && processImageFile(file)) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && processImageFile(file)) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    setImagePreview(null);
  };

  // Get token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Sponsor name is required");
      return;
    }

    if (!sponsor && !formData.logo) {
      toast.error("Logo is required for new sponsors");
      return;
    }

    setLoading(true);

    try {
      // Get token from cookies instead of localStorage
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const API_BASE =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());

      if (formData.website) {
        submitData.append("website", formData.website.trim());
      }

      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }

      const url = sponsor
        ? `${API_BASE}/api/sponsors/${sponsor._id}`
        : `${API_BASE}/api/sponsors`;

      const method = sponsor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      if (data.success) {
        toast.success(
          sponsor
            ? "Sponsor updated successfully!"
            : "Sponsor created successfully!"
        );
        onSave(data.data || data.sponsor); // Pass the saved data back
      } else {
        throw new Error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving sponsor:", error);
      toast.error(error.message || "Error saving sponsor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {sponsor ? "Edit Sponsor" : "Add New Sponsor"}
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sponsor Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sponsor Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                placeholder="Enter sponsor name"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo {!sponsor && "*"}
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-contain border rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Area */}
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    dragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-500"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WEBP (Max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {sponsor ? "Update Sponsor" : "Create Sponsor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
