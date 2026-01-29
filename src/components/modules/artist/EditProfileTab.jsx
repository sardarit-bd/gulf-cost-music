"use client";

import Select from "@/ui/Select";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import SaveButton from "./SaveButton";
import UploadSection from "./UploadSection";

const genreOptions = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "rap", label: "Rap" },
  { value: "country", label: "Country" },
  { value: "jazz", label: "Jazz" },
  { value: "reggae", label: "Reggae" },
  { value: "edm", label: "EDM" },
  { value: "classical", label: "Classical" },
  { value: "other", label: "Other" },
];

// State-wise city options based on client requirement
const STATE_OPTIONS = [
  { value: "", label: "Select State", disabled: true },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Alabama", label: "Alabama" },
  { value: "Florida", label: "Florida" },
];

const CITY_OPTIONS = {
  Louisiana: [
    { value: "new orleans", label: "New Orleans" },
    { value: "baton rouge", label: "Baton Rouge" },
    { value: "lafayette", label: "Lafayette" },
    { value: "shreveport", label: "Shreveport" },
    { value: "lake charles", label: "Lake Charles" },
    { value: "monroe", label: "Monroe" },
  ],
  Mississippi: [
    { value: "jackson", label: "Jackson" },
    { value: "biloxi", label: "Biloxi" },
    { value: "gulfport", label: "Gulfport" },
    { value: "oxford", label: "Oxford" },
    { value: "hattiesburg", label: "Hattiesburg" },
  ],
  Alabama: [
    { value: "birmingham", label: "Birmingham" },
    { value: "mobile", label: "Mobile" },
    { value: "huntsville", label: "Huntsville" },
    { value: "tuscaloosa", label: "Tuscaloosa" },
  ],
  Florida: [
    { value: "tampa", label: "Tampa" },
    { value: "st. petersburg", label: "St. Petersburg" },
    { value: "clearwater", label: "Clearwater" },
    { value: "pensacola", label: "Pensacola" },
    { value: "panama city", label: "Panama City" },
    { value: "fort myers", label: "Fort Myers" },
  ],
};

export default function EditProfileTab({
  artist,
  previewImages = [],
  audioPreview = [],
  subscriptionPlan,
  uploadLimits = { photos: 5, audios: 5 },
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
  const [selectedState, setSelectedState] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  // Initialize local state
  useEffect(() => {
    // ================= IMAGES =================
    const formattedImages = previewImages
      .map((img) => {
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
      })
      .filter((img) => img.url && img.url.trim() !== "");

    setLocalImages(formattedImages);

    // ================= AUDIO =================
    setLocalAudios((prev) => {
      // keep newly uploaded audios (file সহ)
      const existingNewAudios = prev.filter((a) => a.isNew && a.file);

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
      return [...formattedAudios, ...existingNewAudios];
    });

    setRemovedPhotos([]);
    setRemovedAudios([]);

    // Auto-detect state from current city
    if (artist?.city && artist?.state) {
      const currentCity = artist.city.toLowerCase();
      const currentState = artist.state;

      if (CITY_OPTIONS[currentState]) {
        const cityList = CITY_OPTIONS[currentState].map((c) => c.value);
        if (cityList.includes(currentCity)) {
          setSelectedState(currentState);
          setFilteredCities(CITY_OPTIONS[currentState]);
        }
      }
    }
  }, [previewImages, audioPreview, artist?.city, artist?.state]);

  // Handle state selection change
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);

    if (state && state !== "") {
      setFilteredCities(CITY_OPTIONS[state] || []);
      // Reset city when state changes
      if (artist?.city) {
        onChange({
          target: {
            name: "city",
            value: "",
          },
        });
      }
    } else {
      setFilteredCities([]);
    }
  };

  // Handle city selection change
  const handleCityChange = (e) => {
    onChange(e);
  };

  const handleImageUpload = async (files) => {
    const currentVisibleImages = localImages.filter((img) => !img.isRemoved);
    const totalPhotos = currentVisibleImages.length + files.length;

    if (totalPhotos > 5) {
      toast.error(`Maximum 5 photos allowed`);
      return;
    }

    const newImages = [...localImages];
    files.forEach((file) => {
      newImages.push({
        url: URL.createObjectURL(file),
        filename: file.name,
        file: file,
        isNew: true,
        isRemoved: false,
      });
    });

    setLocalImages(newImages);
    if (onImageUpload) onImageUpload(files);
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = localImages[index];

    if (!imageToRemove.isNew) {
      // Mark existing image as removed
      const updatedImages = [...localImages];
      updatedImages[index] = {
        ...imageToRemove,
        isRemoved: true,
      };
      setLocalImages(updatedImages);

      // Add filename to removed list
      if (imageToRemove.filename) {
        setRemovedPhotos((prev) => [...prev, imageToRemove.filename]);
      }
    } else {
      // Remove new image completely
      const updatedImages = [...localImages];
      updatedImages.splice(index, 1);
      setLocalImages(updatedImages);
    }

    if (onRemoveImage) onRemoveImage(index);
  };

  const handleAudioUpload = async (files) => {
    const currentVisibleAudios = localAudios.filter(
      (audio) => !audio.isRemoved,
    );
    const totalAudios = currentVisibleAudios.length + files.length;

    if (totalAudios > 5) {
      toast.error(`Maximum 5 audio files allowed`);
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
        isRemoved: false,
      });
    });

    setLocalAudios(newAudios);
  };

  const handleRemoveAudio = (index) => {
    const audioToRemove = localAudios[index];

    if (!audioToRemove.isNew) {
      // Mark existing audio as removed
      const updatedAudios = [...localAudios];
      updatedAudios[index] = {
        ...audioToRemove,
        isRemoved: true,
      };
      setLocalAudios(updatedAudios);

      // Add filename to removed list
      if (audioToRemove.filename) {
        setRemovedAudios((prev) => [...prev, audioToRemove.filename]);
      }
    } else {
      // Remove new audio completely
      const updatedAudios = [...localAudios];
      updatedAudios.splice(index, 1);
      setLocalAudios(updatedAudios);
    }

    if (onRemoveAudio) onRemoveAudio(index);
  };

  const handleSave = async () => {
    // Validate state and city
    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }

    if (!artist?.city) {
      toast.error("Please select a city");
      return;
    }

    // Validate if selected city belongs to selected state
    const selectedCity = artist.city.toLowerCase();
    const stateCities = (CITY_OPTIONS[selectedState] || []).map((c) => c.value);

    if (!stateCities.includes(selectedCity)) {
      toast.error(`Please select a valid city for ${selectedState}`);
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Add basic info
    formData.append("name", artist.name || "");
    formData.append("city", artist.city || "");
    formData.append("state", selectedState); // Add state to backend
    formData.append("genre", artist.genre || "");
    formData.append("biography", artist.biography || "");

    // Add removed photos
    removedPhotos.forEach((filename) => {
      if (filename) {
        formData.append("removedPhotos", filename);
      }
    });

    // Add removed audios
    removedAudios.forEach((filename) => {
      if (filename) {
        formData.append("removedAudios", filename);
      }
    });

    // Add new photos
    localImages
      .filter((img) => img.isNew && img.file && !img.isRemoved)
      .forEach((img) => {
        formData.append("photos", img.file);
      });

    // Add new audios
    localAudios
      .filter((audio) => audio.isNew && audio.file && !audio.isRemoved)
      .forEach((audio) => {
        formData.append("mp3Files", audio.file);
      });

    console.log("Saving with FormData:");
    console.log("State:", selectedState);
    console.log("City:", artist.city);
    console.log("Removed photos:", removedPhotos);
    console.log("Removed audios:", removedAudios);
    console.log(
      "New photos:",
      localImages.filter((img) => img.isNew && !img.isRemoved).length,
    );
    console.log(
      "New audios:",
      localAudios.filter((audio) => audio.isNew && !audio.isRemoved).length,
    );

    // Debug form data
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
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
  const visibleImages = localImages.filter((img) => !img.isRemoved);
  const visibleAudios = localAudios.filter((audio) => !audio.isRemoved);

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
        <Select
          label="State *"
          name="state"
          value={selectedState}
          options={STATE_OPTIONS}
          onChange={handleStateChange}
          required={true}
          placeholder="Select State"
          className="w-full"
        />

        {/* City - Custom Select ব্যবহার */}
        <Select
          label="City *"
          name="city"
          value={artist?.city?.toLowerCase() || ""}
          options={[
            {
              value: "",
              label: selectedState
                ? `Select City in ${selectedState}`
                : "First select a state",
              disabled: true,
            },
            ...(filteredCities || []),
          ]}
          onChange={handleCityChange}
          required={true}
          disabled={!selectedState}
          placeholder={
            selectedState
              ? `Select City in ${selectedState}`
              : "First select a state"
          }
          className="w-full"
        />

        {/* Genre - Custom Select ব্যবহার */}
        <Select
          label="Genre *"
          name="genre"
          value={artist?.genre?.toLowerCase() || ""}
          options={[
            { value: "", label: "Select Genre", disabled: true },
            ...genreOptions,
          ]}
          onChange={onChange}
          required={true}
          placeholder="Select Genre"
          className="w-full"
        />

        {/* Biography */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Biography
          </label>
          <textarea
            name="biography"
            value={artist?.biography || ""}
            onChange={onChange}
            rows={4}
            placeholder="Write a short biography about yourself and your music..."
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none resize-vertical transition"
          />
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
            maxFiles={5}
            currentFiles={visibleImages.map((img, idx) => ({
              url: img.url,
              id: idx,
              name: img.filename || `Photo ${idx + 1}`,
              isNew: img.isNew,
            }))}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
            subscriptionPlan={subscriptionPlan}
            disabled={false}
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
            maxFiles={5}
            currentFiles={visibleAudios.map((audio, idx) => ({
              url: audio.url,
              id: idx,
              name: audio.name || audio.filename || `Audio ${idx + 1}`,
              isNew: audio.isNew,
            }))}
            onUpload={handleAudioUpload}
            onRemove={handleRemoveAudio}
            subscriptionPlan={subscriptionPlan}
            disabled={false}
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
