"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ActionButtons from "@/components/modules/dashboard/footer/ActionButtons";
import EditModal from "@/components/modules/dashboard/footer/EditModal";
import FooterCard from "@/components/modules/dashboard/footer/FooterCard";
import FooterHeader from "@/components/modules/dashboard/footer/FooterHeader";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Utility function for getting cookies
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function FooterManagement() {
  const [footer, setFooter] = useState(null);
  const [originalFooter, setOriginalFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState({
    section: null,
    field: null,
    value: "",
    label: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  // Fetch Footer Data
  const fetchFooter = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/footer`);
      const data = await res.json();
      if (data.success) {
        setFooter(data.data);
        setOriginalFooter(JSON.parse(JSON.stringify(data.data)));
        setPreviewLogo(data.data.logoUrl);
      }
    } catch (err) {
      toast.error("Failed to load footer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  // Handle logo change with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update field
  const updateField = (section, field, value) => {
    setFooter((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Open edit modal
  const openEditModal = (section, field, currentValue, label) => {
    setEditingField({ section, field, value: currentValue, label });
    setShowEditModal(true);
  };

  // Save from modal
  const saveFromModal = (newValue) => {
    updateField(editingField.section, editingField.field, newValue);
    setShowEditModal(false);
    setEditingField({ section: null, field: null, value: "", label: "" });
    toast.success(`${editingField.label} updated successfully!`);
  };

  // Reset logo to original
  const resetLogo = () => {
    if (footer?.logoUrl) {
      setPreviewLogo(footer.logoUrl);
    }
    setLogoFile(null);
  };

  // Save all changes
  const handleSave = async () => {
    try {
      setSaving(true);

      const token = getCookie("token");

      if (!token) {
        handleUnauthorized();
        return;
      }

      const formData = new FormData();
      formData.append("phone", footer.contact.phone);
      formData.append("email", footer.contact.email);
      formData.append("instagram", footer.socialLinks.instagram);
      formData.append("youtube", footer.socialLinks.youtube);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch(`${API_BASE}/api/footer/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Footer updated successfully!");
        setLogoFile(null);
        setIsEditMode(false);
        fetchFooter();
      } else {
        toast.error(data.message || "Failed to save footer.");
      }
    } catch (err) {
      toast.error("Error updating footer");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setFooter(JSON.parse(JSON.stringify(originalFooter)));
    setPreviewLogo(originalFooter?.logoUrl);
    setLogoFile(null);
    setIsEditMode(false);
    toast.success("Edit cancelled");
  };

  if (loading || !footer) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen py-20 bg-white">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading footer data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto min-h-screen bg-gray-50 p-4">
        <Toaster position="top-right" />

        {/* Header */}
        <FooterHeader isEditMode={isEditMode} />

        {/* Action Buttons */}
        <ActionButtons
          isEditMode={isEditMode}
          saving={saving}
          onEdit={() => setIsEditMode(true)}
          onCancel={handleCancel}
          onSave={handleSave}
        />

        {/* Single Footer Card */}
        <FooterCard
          footer={footer}
          previewLogo={previewLogo}
          isEditMode={isEditMode}
          logoFile={logoFile}
          onLogoChange={handleLogoChange}
          onResetLogo={resetLogo}
          onOpenEditModal={openEditModal}
          onFieldChange={updateField}
        />

        {/* Edit Modal */}
        <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={saveFromModal}
          fieldName={editingField.label}
          currentValue={editingField.value}
          fieldType={editingField.field}
        />
      </div>
    </AdminLayout>
  );
}
