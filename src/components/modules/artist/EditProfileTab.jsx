"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import SaveButton from "./SaveButton";
import UpgradePrompt from "./UpgradePrompt";
import UploadSection from "./UploadSection";

const genreOptions = [
  "Pop",
  "Rock",
  "Rap",
  "Country",
  "Jazz",
  "Reggae",
  "EDM",
  "Classical",
  "Other",
];

const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];

export default function EditProfileTab({
  artist,
  previewImages = [],
  audioPreview = [],
  subscriptionPlan,
  uploadLimits = { photos: 0, audios: 0 },
  onChange,
  onImageUpload,
  onRemoveImage,
  onAudioUpload,
  onRemoveAudio,
  onSave,
  saving = false,
}) {
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [removedAudios, setRemovedAudios] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const [localAudios, setLocalAudios] = useState([]);

  // Initialize local state
  useEffect(() => {
    // ================= IMAGES (UNCHANGED) =================
    const formattedImages = previewImages.map((img) => {
      if (typeof img === "string") {
        const filename = img.split("/").pop();
        return {
          url: img,
          filename,
          isNew: false,
          isRemoved: false,
        };
      }

      return {
        url: img.url || "",
        filename: img.filename || img.url?.split("/").pop() || "",
        file: img.file,
        isNew: img.isNew || false,
        isRemoved: false,
      };
    }).filter(img => img.url && img.url.trim() !== "");

    setLocalImages(formattedImages);

    // ================= AUDIO (FIXED PART) =================
    setLocalAudios(prev => {
      // 🔥 keep newly uploaded audios (file সহ)
      const existingNewAudios = prev.filter(a => a.isNew && a.file);

      // backend / preview audios normalize
      const formattedAudios = audioPreview
        .map((audio) => {
          if (typeof audio === "string") {
            const filename = audio.split("/").pop();
            return {
              url: audio,
              filename,
              name: filename,
              isNew: false,
              isRemoved: false,
            };
          }

          if (audio?.url) {
            return {
              url: audio.url,
              filename: audio.filename || audio.url.split("/").pop(),
              name: audio.name || audio.filename || "",
              isNew: false,
              isRemoved: false,
            };
          }

          return null;
        })
        .filter(Boolean);

      // ✅ merge: backend audios + new uploads
      return [...formattedAudios, ...existingNewAudios];
    });

    setRemovedPhotos([]);
    setRemovedAudios([]);
  }, [previewImages, audioPreview]);


  const handleImageUpload = async (files) => {
    if (subscriptionPlan !== "pro") {
      toast.error("Upgrade to Pro to upload photos");
      return;
    }

    const currentVisibleImages = localImages.filter(img => !img.isRemoved);
    const totalPhotos = currentVisibleImages.length + files.length;

    if (totalPhotos > uploadLimits.photos) {
      toast.error(
        `Maximum ${uploadLimits.photos} photos allowed for ${subscriptionPlan} plan`
      );
      return;
    }

    const newImages = [...localImages];
    files.forEach((file) => {
      newImages.push({
        url: URL.createObjectURL(file),
        filename: file.name,
        file: file,
        isNew: true,
        isRemoved: false
      });
    });

    setLocalImages(newImages);
    onImageUpload(files);
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = localImages[index];

    if (!imageToRemove.isNew) {
      // Mark existing image as removed
      const updatedImages = [...localImages];
      updatedImages[index] = {
        ...imageToRemove,
        isRemoved: true
      };
      setLocalImages(updatedImages);

      // Add filename to removed list
      if (imageToRemove.filename) {
        setRemovedPhotos(prev => [...prev, imageToRemove.filename]);
      }
    } else {
      // Remove new image completely
      const updatedImages = [...localImages];
      updatedImages.splice(index, 1);
      setLocalImages(updatedImages);
    }

    // onRemoveImage(index);
  };

  const handleAudioUpload = async (files) => {
    if (subscriptionPlan !== "pro") {
      toast.error("Upgrade to Pro to upload audio");
      return;
    }

    const currentVisibleAudios = localAudios.filter(audio => !audio.isRemoved);
    const totalAudios = currentVisibleAudios.length + files.length;

    if (totalAudios > uploadLimits.audios) {
      toast.error(
        `Maximum ${uploadLimits.audios} audio files allowed for ${subscriptionPlan} plan`
      );
      return;
    }

    const newAudios = [...localAudios];
    files.forEach((file) => {
      newAudios.push({
        url: URL.createObjectURL(file),
        filename: file.name,
        name: file.name,
        file: file,
        isNew: true,
        isRemoved: false
      });
    });

    setLocalAudios(newAudios);
    // onAudioUpload(files);
  };

  const handleRemoveAudio = (index) => {
    const audioToRemove = localAudios[index];

    if (!audioToRemove.isNew) {
      // Mark existing audio as removed
      const updatedAudios = [...localAudios];
      updatedAudios[index] = {
        ...audioToRemove,
        isRemoved: true
      };
      setLocalAudios(updatedAudios);

      // Add filename to removed list
      if (audioToRemove.filename) {
        setRemovedAudios(prev => [...prev, audioToRemove.filename]);
      }
    } else {
      // Remove new audio completely
      const updatedAudios = [...localAudios];
      updatedAudios.splice(index, 1);
      setLocalAudios(updatedAudios);
    }

    // onRemoveAudio(index);
  };

  const handleSave = async () => {
    // Create FormData object
    const formData = new FormData();

    // Add basic info
    formData.append("name", artist.name || "");
    formData.append("city", artist.city || "");
    formData.append("genre", artist.genre || "");

    if (subscriptionPlan === "pro") {
      formData.append("biography", artist.biography || "");
    }

    // Add removed photos
    removedPhotos.forEach(filename => {
      if (filename) {
        formData.append("removedPhotos", filename);
      }
    });

    // Add removed audios
    removedAudios.forEach(filename => {
      if (filename) {
        formData.append("removedAudios", filename);
      }
    });

    // Add new photos
    localImages
      .filter(img => img.isNew && img.file && !img.isRemoved)
      .forEach(img => {
        formData.append("photos", img.file);
      });

    // Add new audios
    localAudios
      .filter(audio => audio.isNew && audio.file && !audio.isRemoved)
      .forEach(audio => {
        formData.append("mp3Files", audio.file);
      });

    console.log("Saving with FormData:");
    console.log("Removed photos:", removedPhotos);
    console.log("Removed audios:", removedAudios);
    console.log("New photos:", localImages.filter(img => img.isNew && !img.isRemoved).length);
    console.log("New audios:", localAudios.filter(audio => audio.isNew && !audio.isRemoved).length);

    // Debug form data
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
      await onSave(formData);
      // Clear removed lists after successful save
      setRemovedPhotos([]);
      setRemovedAudios([]);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // Get visible images and audios for display
  const visibleImages = localImages.filter(img => !img.isRemoved);
  const visibleAudios = localAudios.filter(audio => !audio.isRemoved);

  return (
    <div className="animate-fadeIn space-y-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name *
          </label>
          <input
            name="name"
            value={artist?.name || ""}
            onChange={onChange}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City *
          </label>
          <select
            name="city"
            value={artist?.city?.toLowerCase() || ""}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
          >
            <option value="">Select City</option>
            {cityOptions.map((city) => (
              <option key={city} value={city.toLowerCase()}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genre *
          </label>
          <select
            name="genre"
            value={artist?.genre?.toLowerCase() || ""}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
          >
            <option value="">Select Genre</option>
            {genreOptions.map((g) => (
              <option key={g} value={g.toLowerCase()}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Biography */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Biography
            {subscriptionPlan === "free" && (
              <span className="text-yellow-500 text-xs ml-2">
                (Pro feature)
              </span>
            )}
          </label>
          <textarea
            name="biography"
            value={artist?.biography || ""}
            onChange={onChange}
            rows={4}
            placeholder={
              subscriptionPlan === "free"
                ? "Upgrade to Pro to add biography..."
                : "Write a short biography about yourself and your music..."
            }
            className={`w-full px-4 py-3 rounded-lg text-white border placeholder-gray-400 outline-none resize-vertical transition ${subscriptionPlan === "free"
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
              }`}
            disabled={subscriptionPlan === "free"}
          />
          {subscriptionPlan === "free" && <UpgradePrompt feature="Biography" />}
        </div>
      </div>

      {/* Upload Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Photos Upload */}
        <div>
          <UploadSection
            type="image"
            label="Upload Photos"
            accept="image/*"
            maxFiles={uploadLimits.photos || 0}
            currentFiles={visibleImages.map((img, idx) => ({
              url: img.url,
              id: idx,
              name: img.filename || `Photo ${idx + 1}`,
              isNew: img.isNew,
            }))}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
            subscriptionPlan={subscriptionPlan}
            disabled={subscriptionPlan !== "pro"}
            showLimits={true}
            currentCount={visibleImages.length}
          />
        </div>

        {/* Audio Upload */}
        <div>
          <UploadSection
            type="audio"
            label="Upload Audio"
            accept="audio/*"
            maxFiles={uploadLimits.audios || 0}
            currentFiles={visibleAudios.map((audio, idx) => ({
              url: audio.url,
              id: idx,
              name: audio.name || audio.filename || `Audio ${idx + 1}`,
              isNew: audio.isNew,
            }))}
            onUpload={handleAudioUpload}
            onRemove={handleRemoveAudio}
            subscriptionPlan={subscriptionPlan}
            disabled={subscriptionPlan !== "pro"}
            showLimits={true}
            currentCount={visibleAudios.length}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <SaveButton onClick={handleSave} saving={saving} disabled={saving} />
      </div>
    </div>
  );
}