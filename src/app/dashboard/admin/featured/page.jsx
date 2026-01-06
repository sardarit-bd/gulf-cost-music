"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import {
  Calendar,
  Edit3,
  Eye,
  Image as ImageIcon,
  List,
  Loader2,
  MapPin,
  Plus,
  Save,
  Ticket,
  Trash2,
  Type,
  Upload,
  Users,
} from "lucide-react";
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

// Icon mapping for list items
const iconMap = {
  calendar: Calendar,
  users: Users,
  location: MapPin,
  ticket: Ticket,
};

export default function AdminFeaturedSection() {
  const [featuredData, setFeaturedData] = useState({
    title: "",
    subtitle: "",
    description: "",
    listItems: [],
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingListItem, setEditingListItem] = useState(null);
  const [newListItem, setNewListItem] = useState({
    icon: "calendar",
    title: "",
    text: "",
  });

  const handleUnauthorized = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/signin";
  };

  // Fetch current featured section data
  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      const API_BASE =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const token = getCookie("token"); // ✅ cookies থেকে token নিন

      if (!token) {
        handleUnauthorized();
        return;
      }

      const res = await fetch(`${API_BASE}/api/featured-section`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // ✅ credentials include করুন
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (data.success && data.data) {
        setFeaturedData({
          title: data.data.title || "",
          subtitle: data.data.subtitle || "",
          description: data.data.description || "",
          listItems: data.data.listItems || [],
          imageUrl: data.data.imageUrl || "",
        });
        setImagePreview(data.data.imageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching featured data:", error);
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error("Failed to load featured section data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeaturedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFeaturedData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(featuredData.imageUrl);
  };

  // Handle list item input changes
  const handleListItemChange = (e) => {
    const { name, value } = e.target;
    setNewListItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new list item
  const handleAddListItem = () => {
    if (!newListItem.title.trim() || !newListItem.text.trim()) {
      toast.error("Please fill in both title and text for the list item");
      return;
    }

    setFeaturedData((prev) => ({
      ...prev,
      listItems: [...prev.listItems, { ...newListItem }],
    }));

    setNewListItem({
      icon: "calendar",
      title: "",
      text: "",
    });
  };

  // Edit list item
  const handleEditListItem = (index) => {
    setEditingListItem(index);
    setNewListItem(featuredData.listItems[index]);
  };

  // Update list item
  const handleUpdateListItem = () => {
    if (!newListItem.title.trim() || !newListItem.text.trim()) {
      toast.error("Please fill in both title and text for the list item");
      return;
    }

    const updatedListItems = [...featuredData.listItems];
    updatedListItems[editingListItem] = { ...newListItem };

    setFeaturedData((prev) => ({
      ...prev,
      listItems: updatedListItems,
    }));

    setEditingListItem(null);
    setNewListItem({
      icon: "calendar",
      title: "",
      text: "",
    });
  };

  // Remove list item
  const handleRemoveListItem = (index) => {
    const updatedListItems = featuredData.listItems.filter(
      (_, i) => i !== index
    );
    setFeaturedData((prev) => ({
      ...prev,
      listItems: updatedListItems,
    }));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingListItem(null);
    setNewListItem({
      icon: "calendar",
      title: "",
      text: "",
    });
  };

  // Save featured section data
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const token = getCookie("token"); // ✅ cookies থেকে token নিন

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // ✅ credentials include করুন
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
        fetchFeaturedData(); // Refresh data
      } else {
        toast.error(data.message || "Failed to update featured section");
      }
    } catch (error) {
      console.error("Error saving featured section:", error);
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      toast.error("Error saving featured section");
    } finally {
      setSaving(false);
    }
  };

  // Preview in new tab
  const handlePreview = () => {
    window.open("/", "_blank");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Loading featured section data...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <Toaster />
        {/* Header */}
        <div className="">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Featured Section Management
              </h1>
              <p className="text-gray-600 mt-2">
                Customize the featured section of your website
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-primary/80disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Content & List Items */}
            <div className="space-y-6">
              {/* Content Settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Type className="w-5 h-5 text-[var(--primary)]" />
                  Content Settings
                </h2>

                <form onSubmit={handleSave} className="space-y-6">
                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle *
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={featuredData.subtitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-gray-900"
                      placeholder="Enter subtitle"
                      maxLength={100}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={featuredData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-gray-900"
                      placeholder="Enter main title"
                      maxLength={150}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={featuredData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-gray-900 resize-none"
                      placeholder="Enter description"
                      maxLength={500}
                    />
                  </div>
                </form>
              </div>

              {/* List Items Management */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <List className="w-5 h-5 text-[var(--primary)]" />
                  Feature List Items
                </h2>

                {/* Add/Edit List Item Form */}
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">
                    {editingListItem !== null
                      ? "Edit List Item"
                      : "Add New List Item"}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <select
                      name="icon"
                      value={newListItem.icon}
                      onChange={handleListItemChange}
                      className="text-gray-500 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    >
                      <option value="calendar">Calendar Icon</option>
                      <option value="users">Users Icon</option>
                      <option value="location">Location Icon</option>
                      <option value="ticket">Ticket Icon</option>
                    </select>

                    <input
                      type="text"
                      name="title"
                      value={newListItem.title}
                      onChange={handleListItemChange}
                      placeholder="Item title"
                      className="text-gray-500 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    />

                    <textarea
                      name="text"
                      value={newListItem.text}
                      onChange={handleListItemChange}
                      placeholder="Item description"
                      rows={2}
                      className="text-gray-500 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] resize-none"
                    />

                    <div className="flex gap-2">
                      {editingListItem !== null ? (
                        <>
                          <button
                            onClick={handleUpdateListItem}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleAddListItem}
                          className="flex items-center gap-2 bg-[var(--primary)] text-white px-3 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Item
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* List Items Display */}
                <div className="space-y-3">
                  {featuredData.listItems.map((item, index) => {
                    const IconComponent = iconMap[item.icon] || Calendar;
                    return (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <IconComponent className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">{item.text}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEditListItem(index)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveListItem(index)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {featuredData.listItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <List className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No list items added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[var(--primary)]" />
                Featured Image
              </h2>

              {/* Current Image Preview */}
              {imagePreview && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Image Preview
                  </label>
                  <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Featured section preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("imageUpload").click()
                        }
                        className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Change Image
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {imagePreview ? "Upload New Image" : "Upload Featured Image"}
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[var(--primary)] transition-colors">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                  {selectedImage ? (
                    <div className="text-center">
                      <p className="text-green-600 font-medium mb-2">
                        Image Selected: {selectedImage.name}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {imagePreview
                          ? "Replace Featured Image"
                          : "Upload Featured Image"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG, WEBP (Max 5MB)
                      </p>

                      <label className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Choose Image File
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* Image Tips */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Image Tips:
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Use portrait images for best layout</li>
                    <li>• Optimal aspect ratio: 4:5</li>
                    <li>• High-quality, vibrant images work best</li>
                    <li>• Avoid text-heavy images</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button for Mobile */}
          <div className="lg:hidden fixed bottom-6 left-6 right-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[var(--primary)] text-white py-4 rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
