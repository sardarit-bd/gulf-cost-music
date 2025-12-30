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
  const [localPreviewImages, setLocalPreviewImages] = useState([]);
  const [localAudioPreview, setLocalAudioPreview] = useState([]);

  // Initialize local state
  useEffect(() => {
    setLocalPreviewImages(
      previewImages.filter(
        (img) =>
          img &&
          (typeof img === "string"
            ? img.trim() !== ""
            : img.url && img.url.trim() !== "")
      )
    );
    setLocalAudioPreview(
      audioPreview.filter(
        (audio) =>
          audio &&
          (typeof audio === "string"
            ? audio.trim() !== ""
            : audio.url && audio.url.trim() !== "")
      )
    );
  }, [previewImages, audioPreview]);

  const handleImageUpload = async (files) => {
    if (subscriptionPlan !== "pro") {
      toast.error("Upgrade to Pro to upload photos");
      return;
    }

    const totalPhotos = localPreviewImages.length + files.length;
    if (totalPhotos > uploadLimits.photos) {
      toast.error(
        `Maximum ${uploadLimits.photos} photos allowed for ${subscriptionPlan} plan`
      );
      return;
    }

    const newImages = [...localPreviewImages];
    files.forEach((file) => {
      newImages.push({
        url: URL.createObjectURL(file),
        filename: file.name,
        file: file,
        isNew: true,
        isRemoved: false,
      });
    });

    setLocalPreviewImages(newImages);
    onImageUpload(files); // Pass to parent
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = localPreviewImages[index];

    // If it's an existing image (not newly uploaded), add to removed list
    if (!imageToRemove.isNew && imageToRemove.filename) {
      setRemovedPhotos((prev) => [...prev, imageToRemove.filename]);
    }

    // Remove from local state
    const newImages = [...localPreviewImages];
    newImages.splice(index, 1);
    setLocalPreviewImages(newImages);

    // Call parent's remove function
    onRemoveImage(index);
  };

  const handleAudioUpload = async (files) => {
    if (subscriptionPlan !== "pro") {
      toast.error("Upgrade to Pro to upload audio");
      return;
    }

    const totalAudios = localAudioPreview.length + files.length;
    if (totalAudios > uploadLimits.audios) {
      toast.error(
        `Maximum ${uploadLimits.audios} audio files allowed for ${subscriptionPlan} plan`
      );
      return;
    }

    const newAudios = [...localAudioPreview];
    files.forEach((file) => {
      newAudios.push({
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
        isNew: true,
        isRemoved: false,
      });
    });

    setLocalAudioPreview(newAudios);
    onAudioUpload(files);
  };

  const handleRemoveAudio = (index) => {
    const audioToRemove = localAudioPreview[index];

    // If it's an existing audio (not newly uploaded), add to removed list
    if (!audioToRemove.isNew && audioToRemove.filename) {
      setRemovedAudios((prev) => [...prev, audioToRemove.filename]);
    }

    const newAudios = [...localAudioPreview];
    newAudios.splice(index, 1);
    setLocalAudioPreview(newAudios);

    onRemoveAudio(index);
  };

  const handleSave = async () => {
    // Create form data with removed files info
    const formData = new FormData();
    formData.append("name", artist.name || "");
    formData.append("city", artist.city || "");
    formData.append("genre", artist.genre || "");

    if (subscriptionPlan === "pro") {
      formData.append("biography", artist.biography || "");
    }

    // Add removed photos
    removedPhotos.forEach((filename) => {
      formData.append("removedPhotos", filename);
    });

    // Add removed audios
    removedAudios.forEach((filename) => {
      formData.append("removedAudios", filename);
    });

    // Add new photos
    const newPhotoFiles = localPreviewImages
      .filter((img) => img.isNew && img.file)
      .map((img) => img.file);

    newPhotoFiles.forEach((file) => {
      formData.append("photos", file);
    });

    // Add new audios
    const newAudioFiles = localAudioPreview
      .filter((audio) => audio.isNew && audio.file)
      .map((audio) => audio.file);

    newAudioFiles.forEach((file) => {
      formData.append("mp3Files", file);
    });

    // Call parent save with formData
    try {
      await onSave(formData);
      // Clear removed lists after successful save
      setRemovedPhotos([]);
      setRemovedAudios([]);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

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
            className={`w-full px-4 py-3 rounded-lg text-white border placeholder-gray-400 outline-none resize-vertical transition ${
              subscriptionPlan === "free"
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
            currentFiles={localPreviewImages.map((img, idx) => {
              const url = typeof img === "string" ? img : img.url;
              return {
                url: url,
                id: idx,
                name: img.filename || `Photo ${idx + 1}`,
                isNew: img.isNew,
              };
            })}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
            subscriptionPlan={subscriptionPlan}
            disabled={subscriptionPlan !== "pro"}
            showLimits={true}
            currentCount={localPreviewImages.length}
          />
        </div>

        {/* Audio Upload */}
        <div>
          <UploadSection
            type="audio"
            label="Upload Audio"
            accept="audio/*"
            maxFiles={uploadLimits.audios || 0}
            currentFiles={localAudioPreview.map((audio, idx) => ({
              url: typeof audio === "string" ? audio : audio.url,
              id: idx,
              name: audio.name || `Audio ${idx + 1}`,
              isNew: audio.isNew,
            }))}
            onUpload={handleAudioUpload}
            onRemove={handleRemoveAudio}
            subscriptionPlan={subscriptionPlan}
            disabled={subscriptionPlan !== "pro"}
            showLimits={true}
            currentCount={localAudioPreview.length}
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
