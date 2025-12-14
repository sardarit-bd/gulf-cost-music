"use client";

import EditProfileTab from "@/components/modules/artist/EditProfileTab";
import Header from "@/components/modules/artist/Header";
import LoadingState from "@/components/modules/artist/LoadingState";
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
      return data.data?.artist || data.data?.artist?.artist; // fallback if API shape differs
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
      });
    } else {
      // fallback
      setSubscriptionPlan("free");
      setUploadLimits({ photos: 0, audios: 0, biography: false });
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
        // no user, stop loader
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [authLoading, user]);

  /* ------------------------
     Handlers
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

      if (removedItem && !(removedItem instanceof File) && removedItem.filename) {
        setRemovedPhotos((prevRemoved) => [...prevRemoved, removedItem.filename]);
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

    // Create audio objects with proper structure
    const newAudios = limitedFiles.map((file) => ({
      file: file, // Store File object
      isNew: true,
      id: `new-${Date.now()}-${Math.random()}`,
      // These will be filled after save
      url: URL.createObjectURL(file),
      name: file.name,
      filename: null, // Will be set by backend
      originalName: file.name,
    }));

    // Update both states
    setAudioPreview((prev) => [
      ...prev,
      ...newAudios.map(a => ({
        url: a.url,
        name: a.name,
        id: a.id,
        isNew: true,
      }))
    ]);

    setArtist((prev) => ({
      ...prev,
      audios: [...prev.audios, ...newAudios],
    }));

    toast.success(`Added ${limitedFiles.length} audio file(s)`);
  };

  const removeAudio = (index) => {
    const audioToRemove = audioPreview[index];

    console.log("Removing audio at index:", index);
    console.log("Audio to remove:", audioToRemove);

    // Revoke object URL if it's a blob
    if (audioToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(audioToRemove.url);
    }

    setArtist((prev) => {
      const newAudios = [...prev.audios];
      const removedAudio = newAudios[index];

      console.log("Removed audio from artist.audios:", removedAudio);

      // If it's an existing file (not new), add to removed list
      if (removedAudio && !removedAudio.isNew && removedAudio.filename) {
        console.log("Adding to removedAudios:", removedAudio.filename);
        setRemovedAudios((prevRemoved) => [...prevRemoved, removedAudio.filename]);
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

      // Debug logging
      console.log("=== DEBUG: Before Save ===");
      console.log("Total audios in artist.audios:", artist.audios.length);
      console.log("Audios detail:", artist.audios.map((a, i) => ({
        index: i,
        isNew: a.isNew,
        hasFile: a.file instanceof File,
        filename: a.filename,
        name: a.name
      })));

      // Basic validation
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

      // Apply subscription rules for biography
      if (subscriptionPlan === "pro") {
        formData.append("biography", artist.biography || "");
      }

      // New photos (only for pro users)
      if (subscriptionPlan === "pro") {
        const newPhotos = artist.photos.filter(photo => photo instanceof File);
        console.log("New photos to upload:", newPhotos.length);
        newPhotos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      if (subscriptionPlan === "pro") {
        const newAudios = artist.audios.filter(audio =>
          audio.isNew && audio.file instanceof File
        );

        console.log("New audios to upload:", newAudios.length);
        console.log("New audios detail:", newAudios.map(a => ({
          name: a.name,
          fileType: a.file.type,
          fileSize: a.file.size
        })));

        newAudios.forEach((audio) => {
          formData.append("mp3Files", audio.file);
        });
      }

      // Removed photos and audios
      removedPhotos.forEach((filename) => {
        formData.append("removedPhotos", filename);
      });

      removedAudios.forEach((filename) => {
        formData.append("removedAudios", filename);
      });

      console.log("Removed Photos:", removedPhotos);
      console.log("Removed Audios:", removedAudios);

      // Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value instanceof File ?
          `File: ${value.name} (${value.size} bytes)` :
          value
        );
      }

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
      console.log("Save response:", data);

      if (res.ok) {
        toast.dismiss(saveToast);
        toast.success("Profile saved successfully!");
        setActiveTab("overview");

        // Update state with server response
        if (data.data?.artist) {
          const a = data.data.artist;
          console.log("Updated artist from server:", a);

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

  if (authLoading || loadingProfile) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 md:px-16">
      <Toaster reverseOrder={false} />

      <Header subscriptionPlan={subscriptionPlan} />
      <PlanStats
        subscriptionPlan={subscriptionPlan}
        photosCount={previewImages.length}
        audiosCount={audioPreview.length}
      />

      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="p-6 md:p-8">
          {activeTab === "overview" && (
            <OverviewTab
              artist={artist}
              previewImages={previewImages}
              audioPreview={audioPreview}
              subscriptionPlan={subscriptionPlan}
              uploadLimits={uploadLimits}
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
        </div>
      </div>
    </div>
  );
}
