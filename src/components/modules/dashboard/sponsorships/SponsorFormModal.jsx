"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createSponsor, updateSponsor } from "./sponsors.api";

const SponsorFormModal = ({ sponsor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: sponsor?.name || "",
    description: sponsor?.description || "",
    logo: null,
    isActive: sponsor?.isActive !== false,
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(sponsor?.logo || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Sponsor name is required");
      return;
    }

    if (!formData.logo && !sponsor) {
      toast.error("Sponsor logo is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      sponsor ? "Updating sponsor..." : "Creating sponsor...",
    );

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description || "");
      submitData.append("isActive", formData.isActive);

      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }

      if (sponsor) {
        await updateSponsor(sponsor._id, submitData);
        toast.success("Sponsor updated successfully!", { id: toastId });
      } else {
        await createSponsor(submitData);
        toast.success("Sponsor created successfully!", { id: toastId });
      }

      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save sponsor", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {sponsor ? "Edit Sponsor" : "Add New Sponsor"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {sponsor
                ? "Update sponsor information"
                : "Fill in the details to add a new sponsor"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sponsor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                placeholder="Enter sponsor name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none transition-all"
                placeholder="Brief description of the sponsor..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional - A short description about the sponsor
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sponsor Logo{" "}
                {!sponsor && <span className="text-red-500">*</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-400 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="logoUpload"
                />
                <label htmlFor="logoUpload" className="cursor-pointer block">
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="w-24 h-24 object-contain rounded-lg"
                      />
                      <span className="text-sm text-blue-600 group-hover:text-blue-700 transition">
                        Change logo
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <div className="p-3 bg-gray-100 rounded-full group-hover:bg-yellow-50 transition">
                        <Upload className="w-6 h-6 group-hover:text-yellow-500 transition" />
                      </div>
                      <span className="text-sm">Click to upload logo</span>
                      <span className="text-xs">PNG, JPG, WEBP up to 2MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${formData.isActive ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${formData.isActive ? "text-green-600" : "text-gray-600"}`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-gray-400">
                  {formData.isActive
                    ? "Sponsor will be visible on the website"
                    : "Sponsor will be hidden from the website"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
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
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading
                ? sponsor
                  ? "Updating..."
                  : "Creating..."
                : sponsor
                  ? "Update Sponsor"
                  : "Create Sponsor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorFormModal;
