"use client";

import EditProfileTab from "@/components/modules/artist/EditProfileTab";
import Header from "@/components/modules/artist/Header";
import LoadingState from "@/components/modules/artist/LoadingState";
import ArtistMarketplaceTab from "@/components/modules/artist/MarketplaceTab";
import OverviewTab from "@/components/modules/artist/OverviewTab";
import PlanStats from "@/components/modules/artist/PlanStats";
import Tabs from "@/components/modules/artist/Tabs";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const fetchProfile = async () => {
  const token = getCookie("token");
  if (!token) throw new Error("No authentication token found");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data?.data?.artist;
  } catch (err) {
    console.error("Profile load failed:", err);
    toast.error("Failed to load profile");
    throw err;
  }
};

export const saveProfile = async (formData) => {
  const token = getCookie("token");
  if (!token) throw new Error("No authentication token found");

  const saveToast = toast.loading("Saving profile...");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.dismiss(saveToast);
      toast.success("Profile saved successfully!");
      return data.data?.artist || data.data?.artist?.artist;
    } else {
      toast.dismiss(saveToast);
      toast.error(data.message || "Failed to save profile");
      throw new Error(data.message || "Save failed");
    }
  } catch (error) {
    toast.dismiss(saveToast);
    toast.error("Network error while saving profile.");
    throw error;
  }
};

/* ------------------------
   Marketplace Functions
------------------------ */

export const fetchListings = async () => {
  const token = getCookie("token");
  if (!token) throw new Error("No authentication token found");

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data?.data ? [res.data.data] : [];
};

export const createListing = async (listingData) => {
  const token = getCookie("token");
  if (!token) throw new Error("No authentication token found");

  const toastId = toast.loading("Creating listing...");

  try {
    const formData = new FormData();

    // basic fields
    formData.append("title", listingData.title);
    formData.append("description", listingData.description);
    formData.append("price", listingData.price);
    formData.append("location", listingData.location || "");
    formData.append("status", listingData.status || "active");

    // photos (max 5)
    if (Array.isArray(listingData.photos)) {
      listingData.photos.forEach((file) => {
        if (file instanceof File) {
          formData.append("photos", file);
        }
      });
    }

    // SINGLE video (backend supports only one)
    if (
      Array.isArray(listingData.videos) &&
      listingData.videos[0] instanceof File
    ) {
      formData.append("video", listingData.videos[0]);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Create failed");

    toast.dismiss(toastId);
    toast.success("Listing created successfully!");
    return data.data;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.message || "Failed to create listing");
    throw err;
  }
};

export const updateListing = async (listingData) => {
  const token = getCookie("token");
  if (!token) throw new Error("No authentication token found");

  const toastId = toast.loading("Updating listing...");

  try {
    const formData = new FormData();

    formData.append("title", listingData.title);
    formData.append("description", listingData.description);
    formData.append("price", listingData.price);
    formData.append("location", listingData.location || "");
    formData.append("status", listingData.status || "active");

    if (Array.isArray(listingData.photos)) {
      listingData.photos.forEach((file) => {
        if (file instanceof File) {
          formData.append("photos", file);
        }
      });
    }

    if (
      Array.isArray(listingData.videos) &&
      listingData.videos[0] instanceof File
    ) {
      formData.append("video", listingData.videos[0]);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    toast.dismiss(toastId);
    toast.success("Listing updated successfully!");
    return data.data;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.message || "Failed to update listing");
    throw err;
  }
};

export const deleteListing = async () => {
  const token = getCookie("token");
  if (!token) throw new Error("No authentication token found");

  const toastId = toast.loading("Deleting listing...");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/market/me`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Delete failed");

    toast.dismiss(toastId);
    toast.success("Listing deleted");
    return true;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.message || "Failed to delete listing");
    throw err;
  }
};

/* ------------------------
   Component
------------------------ */
export default function ArtistDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [artist, setArtist] = useState({
    name: "",
    city: "",
    genre: "pop",
    biography: "",
    photos: [],
    audios: [],
  });

  // Marketplace State
  const [listings, setListings] = useState([]);
  const [currentListing, setCurrentListing] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    status: "active",
    photos: [],
    videos: [],
    category: "equipment",
  });
  const [listingPhotos, setListingPhotos] = useState([]);
  const [listingVideos, setListingVideos] = useState([]);
  const [isEditingListing, setIsEditingListing] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [loadingListings, setLoadingListings] = useState(false);

  const [previewImages, setPreviewImages] = useState([]);
  const [audioPreview, setAudioPreview] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [removedAudios, setRemovedAudios] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [uploadLimits, setUploadLimits] = useState({
    photos: 0,
    audios: 0,
    biography: false,
    marketplace: false,
  });

  const [saving, setSaving] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Plan -> limits
  useEffect(() => {
    if (user?.subscriptionPlan) {
      const plan = user.subscriptionPlan;
      setSubscriptionPlan(plan);

      setUploadLimits({
        photos: plan === "pro" ? 5 : 0,
        audios: plan === "pro" ? 5 : 0,
        biography: plan === "pro",
        marketplace: plan === "pro", // Pro users only can access marketplace
      });
    } else {
      setSubscriptionPlan("free");
      setUploadLimits({
        photos: 0,
        audios: 0,
        biography: false,
        marketplace: false,
      });
    }
  }, [user]);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!authLoading && user) {
        try {
          setLoadingProfile(true);
          const data = await fetchProfile();

          if (isMounted.current) {
            setArtist({
              name: data?.name || "",
              city: data?.city || "",
              genre: data?.genre || "pop",
              biography: data?.biography || "",
              photos: data?.photos || [],
              audios: (data?.mp3Files || []).map((a) => ({
                ...a,
                isNew: false,
              })),
            });

            setPreviewImages(data?.photos?.map((p) => p.url) || []);
            setAudioPreview(
              data?.mp3Files?.map((m) => ({
                url: m.url,
                name: m.originalName || m.filename,
                id: m._id || m.filename,
              })) || []
            );
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        } finally {
          if (isMounted.current) setLoadingProfile(false);
        }
      } else if (!authLoading && !user) {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [authLoading, user]);

  // Load listings when marketplace tab is active
  useEffect(() => {
    const loadListings = async () => {
      if (activeTab === "marketplace" && uploadLimits.marketplace) {
        try {
          setLoadingListings(true);
          const data = await fetchListings();
          if (isMounted.current) {
            setListings(data);
          }
        } catch (error) {
          console.error("Failed to load listings:", error);
        } finally {
          if (isMounted.current) setLoadingListings(false);
        }
      }
    };

    loadListings();
  }, [activeTab, uploadLimits.marketplace]);

  /* ------------------------
     Profile Handlers
  ------------------------ */
  const handleImageUpload = (files) => {
    if (subscriptionPlan !== "pro") return;

    const availableSlots = uploadLimits.photos - previewImages.length;
    const limitedFiles = files.slice(0, Math.max(0, availableSlots));

    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...urls]);
    setArtist((prev) => ({
      ...prev,
      photos: [...prev.photos, ...limitedFiles],
    }));
  };

  const removeImage = (index) => {
    if (previewImages[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImages[index]);
    }

    setArtist((prev) => {
      const newPhotos = [...prev.photos];
      const removedItem = newPhotos[index];

      if (
        removedItem &&
        !(removedItem instanceof File) &&
        removedItem.filename
      ) {
        setRemovedPhotos((prevRemoved) => [
          ...prevRemoved,
          removedItem.filename,
        ]);
      }

      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAudioUpload = (files) => {
    if (subscriptionPlan !== "pro") return;

    const availableSlots = uploadLimits.audios - audioPreview.length;
    const limitedFiles = files.slice(0, Math.max(0, availableSlots));

    if (limitedFiles.length === 0) {
      toast.error(`Maximum ${uploadLimits.audios} audio files allowed`);
      return;
    }

    const newAudios = limitedFiles.map((file) => ({
      file: file,
      isNew: true,
      id: `new-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
      filename: null,
      originalName: file.name,
    }));

    setAudioPreview((prev) => [
      ...prev,
      ...newAudios.map((a) => ({
        url: a.url,
        name: a.name,
        id: a.id,
        isNew: true,
      })),
    ]);

    setArtist((prev) => ({
      ...prev,
      audios: [...prev.audios, ...newAudios],
    }));

    toast.success(`Added ${limitedFiles.length} audio file(s)`);
  };

  const removeAudio = (index) => {
    const audioToRemove = audioPreview[index];

    if (audioToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(audioToRemove.url);
    }

    setArtist((prev) => {
      const newAudios = [...prev.audios];
      const removedAudio = newAudios[index];

      if (removedAudio && !removedAudio.isNew && removedAudio.filename) {
        setRemovedAudios((prevRemoved) => [
          ...prevRemoved,
          removedAudio.filename,
        ]);
      }

      newAudios.splice(index, 1);
      return { ...prev, audios: newAudios };
    });

    setAudioPreview((prev) => prev.filter((_, i) => i !== index));
    toast.success("Audio file removed");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (subscriptionPlan === "free" && name === "biography") return;
    setArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      if (!artist.name || !artist.city || !artist.genre) {
        toast.error("Please fill all required fields (Name, City, Genre)");
        setSaving(false);
        return;
      }

      if (artist.name.length < 2) {
        toast.error("Name must be at least 2 characters long");
        setSaving(false);
        return;
      }

      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token not found");
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", artist.name);
      formData.append("city", artist.city.toLowerCase());
      formData.append("genre", artist.genre.toLowerCase());

      if (subscriptionPlan === "pro") {
        formData.append("biography", artist.biography || "");
      }

      if (subscriptionPlan === "pro") {
        const newPhotos = artist.photos.filter(
          (photo) => photo instanceof File
        );
        newPhotos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      if (subscriptionPlan === "pro") {
        const newAudios = artist.audios.filter(
          (audio) => audio.isNew && audio.file instanceof File
        );

        newAudios.forEach((audio) => {
          formData.append("mp3Files", audio.file);
        });
      }

      removedPhotos.forEach((filename) => {
        formData.append("removedPhotos", filename);
      });

      removedAudios.forEach((filename) => {
        formData.append("removedAudios", filename);
      });

      const saveToast = toast.loading("Saving profile...");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(saveToast);
        toast.success("Profile saved successfully!");
        setActiveTab("overview");

        if (data.data?.artist) {
          const a = data.data.artist;

          setArtist({
            name: a.name || "",
            city: a.city || "",
            genre: a.genre || "",
            biography: a.biography || "",
            photos: a.photos || [],
            audios: (a.mp3Files || []).map((audio) => ({
              ...audio,
              isNew: false,
            })),
          });

          setPreviewImages(a.photos?.map((p) => p.url) || []);
          setAudioPreview(
            (a.mp3Files || []).map((audio) => ({
              url: audio.url,
              name: audio.originalName || audio.filename,
              id: audio._id || audio.filename,
              isNew: false,
            })) || []
          );
        }

        setRemovedPhotos([]);
        setRemovedAudios([]);
      } else {
        toast.dismiss(saveToast);
        console.error("Save failed:", data);
        toast.error(data.message || `Failed to save profile: ${res.status}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Network error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------
     Marketplace Handlers
  ------------------------ */
  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setCurrentListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleListingPhotoUpload = (files) => {
    const availableSlots = 5 - listingPhotos.length;
    const limitedFiles = files.slice(0, Math.max(0, availableSlots));

    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setListingPhotos((prev) => [...prev, ...urls]);
    setCurrentListing((prev) => ({
      ...prev,
      photos: [...prev.photos, ...limitedFiles],
    }));
  };

  const handleListingVideoUpload = (files) => {
    const availableSlots = 5 - listingVideos.length;
    const limitedFiles = files.slice(0, Math.max(0, availableSlots));

    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setListingVideos((prev) => [...prev, ...urls]);
    setCurrentListing((prev) => ({
      ...prev,
      videos: [...prev.videos, ...limitedFiles],
    }));
  };

  const removeListingPhoto = (index) => {
    if (listingPhotos[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(listingPhotos[index]);
    }

    setCurrentListing((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });

    setListingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeListingVideo = (index) => {
    if (listingVideos[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(listingVideos[index]);
    }

    setCurrentListing((prev) => {
      const newVideos = [...prev.videos];
      newVideos.splice(index, 1);
      return { ...prev, videos: newVideos };
    });

    setListingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateListing = async () => {
    if (
      !currentListing.title ||
      !currentListing.price ||
      !currentListing.description
    ) {
      toast.error(
        "Please fill all required fields (Title, Price, Description)"
      );
      return;
    }

    if (currentListing.photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    try {
      const listingData = {
        ...currentListing,
        price: parseFloat(currentListing.price),
        userId: user._id,
        artistName: artist.name,
      };

      const newListing = await createListing(listingData);

      setListings((prev) => [...prev, newListing]);
      setCurrentListing({
        title: "",
        price: "",
        location: "",
        description: "",
        status: "active",
        photos: [],
        videos: [],
        category: "equipment",
      });
      setListingPhotos([]);
      setListingVideos([]);

      toast.success("Listing created successfully!");
    } catch (error) {
      console.error("Failed to create listing:", error);
    }
  };

  const handleEditListing = (listing) => {
    setIsEditingListing(true);
    setEditingListingId(listing._id);
    setCurrentListing({
      title: listing.title,
      price: listing.price.toString(),
      location: listing.location || "",
      description: listing.description,
      status: listing.status,
      photos: listing.photos || [],
      videos: listing.videos || [],
      category: listing.category || "equipment",
    });
    setListingPhotos(listing.photos?.map((p) => p.url) || []);
    setListingVideos(listing.videos?.map((v) => v.url) || []);
  };

  const handleUpdateListing = async () => {
    if (
      !currentListing.title ||
      !currentListing.price ||
      !currentListing.description
    ) {
      toast.error(
        "Please fill all required fields (Title, Price, Description)"
      );
      return;
    }

    try {
      const listingData = {
        ...currentListing,
        price: parseFloat(currentListing.price),
      };

      const updatedListing = await updateListing(editingListingId, listingData);

      setListings((prev) =>
        prev.map((listing) =>
          listing._id === editingListingId ? updatedListing : listing
        )
      );

      setIsEditingListing(false);
      setEditingListingId(null);
      setCurrentListing({
        title: "",
        price: "",
        location: "",
        description: "",
        status: "active",
        photos: [],
        videos: [],
        category: "equipment",
      });
      setListingPhotos([]);
      setListingVideos([]);

      toast.success("Listing updated successfully!");
    } catch (error) {
      console.error("Failed to update listing:", error);
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        setListings((prev) => prev.filter((listing) => listing._id !== id));
      } catch (error) {
        console.error("Failed to delete listing:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditingListing(false);
    setEditingListingId(null);
    setCurrentListing({
      title: "",
      price: "",
      location: "",
      description: "",
      status: "active",
      photos: [],
      videos: [],
      category: "equipment",
    });
    setListingPhotos([]);
    setListingVideos([]);
  };

  if (authLoading || loadingProfile) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 md:px-16">
      <Toaster reverseOrder={false} />

      <Header subscriptionPlan={subscriptionPlan} />
      <PlanStats
        subscriptionPlan={subscriptionPlan}
        photosCount={previewImages.length}
        audiosCount={audioPreview.length}
        listingsCount={listings.length}
        hasMarketplaceAccess={uploadLimits.marketplace}
      />

      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasMarketplaceAccess={uploadLimits.marketplace}
        />

        <div className="p-6 md:p-8">
          {activeTab === "overview" && (
            <OverviewTab
              artist={artist}
              previewImages={previewImages}
              audioPreview={audioPreview}
              subscriptionPlan={subscriptionPlan}
              uploadLimits={uploadLimits}
              listings={listings}
              loadingListings={loadingListings}
            />
          )}

          {activeTab === "edit" && (
            <EditProfileTab
              artist={artist}
              previewImages={previewImages}
              audioPreview={audioPreview}
              subscriptionPlan={subscriptionPlan}
              uploadLimits={uploadLimits}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              onAudioUpload={handleAudioUpload}
              onRemoveAudio={removeAudio}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "marketplace" && (
            <ArtistMarketplaceTab
              subscriptionPlan={subscriptionPlan}
              hasMarketplaceAccess={uploadLimits.marketplace}
              listings={listings}
              loadingListings={loadingListings}
              currentListing={currentListing}
              listingPhotos={listingPhotos}
              listingVideos={listingVideos}
              isEditingListing={isEditingListing}
              onListingChange={handleListingChange}
              onPhotoUpload={handleListingPhotoUpload}
              onVideoUpload={handleListingVideoUpload}
              onRemovePhoto={removeListingPhoto}
              onRemoveVideo={removeListingVideo}
              onCreateListing={handleCreateListing}
              onUpdateListing={handleUpdateListing}
              onEditListing={handleEditListing}
              onDeleteListing={handleDeleteListing}
              onCancelEdit={handleCancelEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
