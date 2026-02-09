// app/dashboard/venues/edit-profile/page.js
"use client";

import EditVenueDetails from "@/components/modules/venues/edit/EditVenueDetails";
import SaveProfileSection from "@/components/modules/venues/edit/SaveProfileSection";
import VenueLocationInfo from "@/components/modules/venues/edit/VenueLocationInfo";
import VenuePhotosUpload from "@/components/modules/venues/edit/VenuePhotosUpload";
import { getCookie } from "@/utils/cookies";
// import EditVenueDetails from "@/components/EditVenueDetails";
// import SaveProfileSection from "@/components/SaveProfileSection";
// import VenueLocationInfo from "@/components/VenueLocationInfo";
// import VenuePhotosUpload from "@/components/VenuePhotosUpload";
// import { getCookie } from "@/utils/cookies";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfilePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const [venueData, setVenueData] = useState({
    venueName: "",
    state: "",
    city: "",
    address: "",
    seatingCapacity: 0,
    biography: "",
    openHours: "",
    openDays: "",
    phone: "",
    website: "",
    isActive: false,
    colorCode: null,
    verifiedOrder: 0,
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchVenueData();
  }, []);

  const fetchVenueData = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");
      if (!token) {
        toast.error("You must be logged in.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch venue.");
      }

      if (data.data?.venue) {
        const v = data.data.venue;
        setVenueData({
          venueName: v.venueName || "",
          state: v.state || "",
          city: v.city || "",
          address: v.address || "",
          seatingCapacity: v.seatingCapacity || 0,
          biography: v.biography || "",
          openHours: v.openHours || "",
          openDays: v.openDays || "",
          phone: v.phone || "",
          website: v.website || "",
          isActive: v.isActive || false,
          colorCode: v.colorCode || null,
          verifiedOrder: v.verifiedOrder || 0,
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

  const handleSave = async () => {
    // Validate form
    const errors = {};
    if (!venueData.venueName?.trim())
      errors.venueName = "Venue name is required";
    if (!venueData.state) errors.state = "State is required";
    if (!venueData.city) errors.city = "City is required";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("venueName", venueData.venueName.trim());
      formData.append("state", venueData.state);
      formData.append("city", venueData.city.toLowerCase());
      if (venueData.address)
        formData.append("address", venueData.address.trim());
      if (venueData.seatingCapacity)
        formData.append("seatingCapacity", venueData.seatingCapacity);
      if (venueData.biography)
        formData.append("biography", venueData.biography.trim());
      if (venueData.openHours)
        formData.append("openHours", venueData.openHours.trim());
      if (venueData.openDays)
        formData.append("openDays", venueData.openDays.trim());
      if (venueData.phone) formData.append("phone", venueData.phone.trim());
      if (venueData.website)
        formData.append("website", venueData.website.trim());

      photoFiles.forEach((file) => formData.append("photos", file));
      removedPhotos.forEach((filename) =>
        formData.append("removedPhotos", filename),
      );

      setSaving(true);
      const saveToast = toast.loading("Saving venue...");

      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(saveToast);

      if (!res.ok) {
        throw new Error(data.message || "Failed to save venue");
      }

      toast.success("Venue profile saved successfully!");
      setRemovedPhotos([]);
      setPhotoFiles([]);

      if (data.data?.venue) {
        const v = data.data.venue;
        setVenueData((prev) => ({
          ...prev,
          venueName: v.venueName || "",
          state: v.state || "",
          city: v.city || "",
          address: v.address || "",
          seatingCapacity: v.seatingCapacity || 0,
          biography: v.biography || "",
          openHours: v.openHours || "",
          openDays: v.openDays || "",
          phone: v.phone || "",
          website: v.website || "",
          isActive: v.isActive || false,
          colorCode: v.colorCode || null,
        }));
        setPreviewImages(v.photos?.map((p) => p.url) || []);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (files) => {
    if (previewImages.length + files.length > 10) {
      toast.error("Maximum 10 photos allowed.");
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...urls]);
    setPhotoFiles([...photoFiles, ...files]);
  };

  const removeImage = (index) => {
    const urlToRemove = previewImages[index];

    if (!urlToRemove.startsWith("blob:")) {
      const filename = urlToRemove.split("/").pop();
      setRemovedPhotos((prev) => [...prev, filename]);
    } else {
      URL.revokeObjectURL(urlToRemove);
      const fileIndex = index - (previewImages.length - photoFiles.length);
      if (fileIndex >= 0) {
        setPhotoFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }
    }

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (name, value) => {
    setVenueData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/venues"
              className="p-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Edit Venue Profile
              </h1>
              <p className="text-gray-600">
                Update your venue information and photos
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/venues/overview"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm"
          >
            View Overview
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <EditVenueDetails
              venueData={venueData}
              onInputChange={handleInputChange}
              formErrors={formErrors}
              disabled={saving}
            />
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            <VenuePhotosUpload
              previewImages={previewImages}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              disabled={saving}
            />

            <VenueLocationInfo state={venueData.state} city={venueData.city} />

            <SaveProfileSection
              onSave={handleSave}
              saving={saving}
              venueName={venueData.venueName}
              state={venueData.state}
              city={venueData.city}
              isActive={venueData.isActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
