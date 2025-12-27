"use client";

import { useBilling } from "@/components/modules/dashboard/billing/useBilling";
import PhotographerDashboard from "@/components/modules/dashboard/photographer/PhotographerDashboard";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Function to get cookie value by name
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function PhotographerPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading: authLoading } = useAuth();
  const [photographer, setPhotographer] = useState({
    name: "",
    city: "",
    biography: "",
    services: [],
    photos: [],
    videos: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [newService, setNewService] = useState({ service: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");

  const cityOptions = [
    { value: "new orleans", label: "New Orleans" },
    { value: "biloxi", label: "Biloxi" },
    { value: "mobile", label: "Mobile" },
    { value: "pensacola", label: "Pensacola" },
  ];

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const {
    billingData,
    loading: billingLoading,
    fetchBilling,
    upgrade,
    openPortal,
    cancel,
    resume,
  } = useBilling(API_BASE);


  useEffect(() => {
    if (activeTab === "billing") {
      fetchBilling();
    }
  }, [activeTab]);



  // Set subscription plan
  useEffect(() => {
    if (user?.subscriptionPlan) {
      setSubscriptionPlan(user.subscriptionPlan);
    }
  }, [user]);

  // === Fetch Photographer Profile ===
  useEffect(() => {
    const fetchPhotographer = async () => {
      if (authLoading) return;

      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          // toast.error("You must be logged in.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/photographers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch profile.");
        }

        const data = await res.json();

        if (data.data?.photographer) {
          const p = data.data.photographer;
          console.log("Fetched photographer:", p);

          setPhotographer({
            name: p.name || "",
            city: p.city || "",
            biography: p.biography || "",
            services: p.services || [],
            photos: p.photos || [],
            videos: p.videos || [],
          });

          setPreviewImages(p.photos?.map((p) => p.url) || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Server error while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPhotographer();
    }
  }, [authLoading, API_BASE]);

  // === Handle Input ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check subscription restrictions
    if (subscriptionPlan === "free" && name === "biography") {
      toast.error("Biography feature requires Pro plan. Upgrade to Pro.");
      return;
    }

    setPhotographer(prev => ({ ...prev, [name]: value }));
  };

  // === Image Upload ===
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (subscriptionPlan === "free") {
      toast.error("Photo uploads require Pro plan. Upgrade to Pro.");
      e.target.value = "";
      return;
    }

    if (files.length === 0) return;

    setUploadingPhotos(true);

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await fetch(`${API_BASE}/api/photographers/photos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Update photographer state with new photos from backend
      if (data.data?.photos) {
        setPhotographer(prev => ({
          ...prev,
          photos: data.data.photos,
        }));

        // Update preview images with actual URLs from backend
        setPreviewImages(data.data.photos.map((p) => p.url));
      }

      toast.success(`${files.length} photo(s) uploaded successfully!`);
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error(error.message || "Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
      e.target.value = "";
    }
  };

  // === Remove Image ===
  const removeImage = async (index) => {
    if (subscriptionPlan === "free") {
      toast.error("Photo management requires Pro plan. Upgrade to Pro.");
      return;
    }

    const photoToDelete = photographer.photos[index];
    if (!photoToDelete) {
      // If it's just a preview (not saved to backend yet)
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      toast.success("Photo removed from preview");
      return;
    }

    try {
      const token = getCookie("token");
      const response = await fetch(
        `${API_BASE}/api/photographers/photos/${photoToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Delete failed");

      // Update both preview and photographer state
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      setPhotographer((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index),
      }));

      toast.success("Photo deleted successfully!");
    } catch (error) {
      console.error("Delete photo error:", error);
      toast.error(error.message || "Failed to delete photo");
    }
  };

  // === Save Profile ===
  const handleSave = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      // Check subscription restrictions
      if (subscriptionPlan === "free" && photographer.biography) {
        toast.error("Biography feature requires Pro plan. Upgrade to Pro.");
        return;
      }

      setSaving(true);
      const saveToast = toast.loading("Saving profile...");

      const res = await fetch(`${API_BASE}/api/photographers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: photographer.name,
          city: photographer.city?.toLowerCase(),
          biography: subscriptionPlan === "pro" ? photographer.biography : "",
        }),
      });

      const data = await res.json();
      toast.dismiss(saveToast);

      if (!res.ok) throw new Error(data.message || "Failed to save profile.");

      toast.success("Profile updated successfully!");

      // Update local state with response if available
      if (data.data?.photographer) {
        const p = data.data.photographer;
        setPhotographer(prev => ({
          ...prev,
          name: p.name || "",
          city: p.city || "",
          biography: p.biography || "",
        }));
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Server error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  // === Add Service ===
  const handleAddService = async (e) => {
    e.preventDefault();

    if (subscriptionPlan === "free") {
      toast.error("Adding services requires Pro plan. Upgrade to Pro.");
      return;
    }

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      setLoading(true);
      const res = await fetch(`${API_BASE}/api/photographers/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add service.");

      setPhotographer((prev) => ({
        ...prev,
        services: data.data.services,
      }));

      setNewService({ service: "", price: "" });
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Add service error:", error);
      toast.error(error.message || "Error adding service.");
    } finally {
      setLoading(false);
    }
  };

  // === Delete Service ===
  const handleDeleteService = async (serviceId) => {
    if (subscriptionPlan === "free") {
      toast.error("Managing services requires Pro plan. Upgrade to Pro.");
      return;
    }

    // if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = getCookie("token");
      const res = await fetch(
        `${API_BASE}/api/photographers/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete service.");

      setPhotographer((prev) => ({
        ...prev,
        services: data.data.services,
      }));
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Delete service error:", error);
      toast.error(error.message || "Error deleting service.");
    }
  };

  // === Video Management Callbacks ===
  const handleAddVideo = (updatedVideos) => {
    if (subscriptionPlan === "free") {
      toast.error("Video uploads require Pro plan. Upgrade to Pro.");
      return;
    }

    setPhotographer((prev) => ({
      ...prev,
      videos: updatedVideos,
    }));
  };

  const handleDeleteVideo = (updatedVideos) => {
    setPhotographer((prev) => ({
      ...prev,
      videos: updatedVideos,
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading photographer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 md:px-16">
      <PhotographerDashboard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        photographer={photographer}
        previewImages={previewImages}
        newService={newService}
        setNewService={setNewService}
        loading={loading}
        saving={saving}
        uploadingPhotos={uploadingPhotos}
        subscriptionPlan={subscriptionPlan}
        cityOptions={cityOptions}
        MAX_PHOTOS={subscriptionPlan === "pro" ? 5 : 0}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        handleSave={handleSave}
        handleAddService={handleAddService}
        handleDeleteService={handleDeleteService}
        handleAddVideo={handleAddVideo}
        handleDeleteVideo={handleDeleteVideo}
        API_BASE={API_BASE}
        user={user}
        billingData={billingData}
        billingLoading={billingLoading}
        onUpgrade={upgrade}
        onOpenPortal={openPortal}
        onCancel={cancel}
        onResume={resume}
        onRefresh={fetchBilling}
      />
    </div>
  );
}