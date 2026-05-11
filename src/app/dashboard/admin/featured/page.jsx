"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import ContentCard from "@/components/modules/Featured/ContentCard";
import EditModal from "@/components/modules/Featured/EditModal";
import FeaturedHeader from "@/components/modules/Featured/FeaturedHeader";
import ImageCard from "@/components/modules/Featured/ImageCard";
import ListItemsCard from "@/components/modules/Featured/ListItemsCard";
import CustomLoader from "@/components/shared/loader/Loader";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const handleUnauthorized = () => {
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";
  document.cookie = "user=; path=/; max-age=0";
  window.location.href = "/signin";
};

export default function FeaturedSectionManagement() {
  const [featuredData, setFeaturedData] = useState({
    title: "",
    subtitle: "",
    description: "",
    listItems: [],
    imageUrl: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState({
    field: "",
    value: "",
    label: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");
      if (!token) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(`${API_BASE}/api/featured-section`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (data.success && data.data) {
        const newData = {
          title: data.data.title || "",
          subtitle: data.data.subtitle || "",
          description: data.data.description || "",
          listItems: data.data.listItems || [],
          imageUrl: data.data.imageUrl || "",
        };
        setFeaturedData(newData);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setImagePreview(data.data.imageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching featured data:", error);
      toast.error("Failed to load featured section data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getCookie("token");
      if (!token) {
        handleUnauthorized();
        return;
      }

      const formData = new FormData();
      formData.append("title", featuredData.title);
      formData.append("subtitle", featuredData.subtitle);
      formData.append("description", featuredData.description);
      formData.append("listItems", JSON.stringify(featuredData.listItems));

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await fetch(`${API_BASE}/api/featured-section/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: formData,
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Featured section updated successfully!");
        setSelectedImage(null);
        setIsEditMode(false);
        await fetchFeaturedData();
      } else {
        toast.error(data.message || "Failed to update featured section");
      }
    } catch (error) {
      console.error("Error saving featured section:", error);
      toast.error("Error saving featured section");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFeaturedData(JSON.parse(JSON.stringify(originalData)));
      setImagePreview(originalData.imageUrl);
    }
    setSelectedImage(null);
    setIsEditMode(false);
    toast.success("Edit cancelled");
  };

  const openEditModal = (field, currentValue, label) => {
    setEditField({ field, value: currentValue, label });
    setShowEditModal(true);
  };

  const saveFromModal = (newValue) => {
    setFeaturedData((prev) => ({ ...prev, [editField.field]: newValue }));
    setShowEditModal(false);
    toast.success(`${editField.label} updated!`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen py-20">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <Toaster position="top-right" />

        <FeaturedHeader
          isEditMode={isEditMode}
          onEdit={() => setIsEditMode(true)}
          onCancel={handleCancel}
          onSave={handleSave}
          saving={saving}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-5">
            <ContentCard
              featuredData={featuredData}
              isEditMode={isEditMode}
              onOpenEditModal={openEditModal}
            />
            <ListItemsCard
              featuredData={featuredData}
              setFeaturedData={setFeaturedData}
              isEditMode={isEditMode}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <ImageCard
              imagePreview={imagePreview}
              isEditMode={isEditMode}
              selectedImage={selectedImage}
              onImageChange={(file) => {
                setSelectedImage(file);
                const reader = new FileReader();
                reader.onload = (e) => setImagePreview(e.target.result);
                reader.readAsDataURL(file);
              }}
              onRemoveImage={() => {
                setSelectedImage(null);
                setImagePreview(featuredData.imageUrl);
              }}
            />
          </div>
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={saveFromModal}
          fieldName={editField.label}
          currentValue={editField.value}
          isTextarea={editField.field === "description"}
        />
      </div>
    </AdminLayout>
  );
}
