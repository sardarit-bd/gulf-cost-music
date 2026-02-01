"use client";

import Select from "@/ui/Select";
import { Camera, Music, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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
      const existingNewAudios = prev.filter((a) => a.isNew && a.file);

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
      const updatedImages = [...localImages];
      updatedImages[index] = {
        ...imageToRemove,
        isRemoved: true,
      };
      setLocalImages(updatedImages);

      if (imageToRemove.filename) {
        setRemovedPhotos((prev) => [...prev, imageToRemove.filename]);
      }
    } else {
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
      const updatedAudios = [...localAudios];
      updatedAudios[index] = {
        ...audioToRemove,
        isRemoved: true,
      };
      setLocalAudios(updatedAudios);

      if (audioToRemove.filename) {
        setRemovedAudios((prev) => [...prev, audioToRemove.filename]);
      }
    } else {
      const updatedAudios = [...localAudios];
      updatedAudios.splice(index, 1);
      setLocalAudios(updatedAudios);
    }

    if (onRemoveAudio) onRemoveAudio(index);
  };

  const handleSave = async () => {
    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }

    if (!artist?.city) {
      toast.error("Please select a city");
      return;
    }

    const selectedCity = artist.city.toLowerCase();
    const stateCities = (CITY_OPTIONS[selectedState] || []).map((c) => c.value);

    if (!stateCities.includes(selectedCity)) {
      toast.error(`Please select a valid city for ${selectedState}`);
      return;
    }

    const formData = new FormData();

    formData.append("name", artist.name || "");
    formData.append("city", artist.city || "");
    formData.append("state", selectedState);
    formData.append("genre", artist.genre || "");
    formData.append("biography", artist.biography || "");

    removedPhotos.forEach((filename) => {
      if (filename) {
        formData.append("removedPhotos", filename);
      }
    });

    removedAudios.forEach((filename) => {
      if (filename) {
        formData.append("removedAudios", filename);
      }
    });

    localImages
      .filter((img) => img.isNew && img.file && !img.isRemoved)
      .forEach((img) => {
        formData.append("photos", img.file);
      });

    localAudios
      .filter((audio) => audio.isNew && audio.file && !audio.isRemoved)
      .forEach((audio) => {
        formData.append("mp3Files", audio.file);
      });

    try {
      await onSave(formData);
      setRemovedPhotos([]);
      setRemovedAudios([]);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const visibleImages = localImages.filter((img) => !img.isRemoved);
  const visibleAudios = localAudios.filter((audio) => !audio.isRemoved);

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={artist?.name || ""}
              onChange={onChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border border-gray-300 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>

          {/* State */}
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

          {/* City */}
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

          {/* Genre */}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              name="biography"
              value={artist?.biography || ""}
              onChange={onChange}
              rows={4}
              placeholder="Write a short biography about yourself and your music..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border border-gray-300 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-vertical transition"
            />
          </div>
        </div>
      </div>

      {/* Upload Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Photos Upload */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Photos
            </h3>
            <div className="text-sm text-gray-600">
              {visibleImages.length}/5 uploaded
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Click to upload photos
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WebP • Max 5MB each
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload up to 5 photos
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                className="hidden"
                disabled={visibleImages.length >= 5}
              />
            </label>

            {/* Image Preview Grid */}
            {visibleImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {visibleImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src={img.url}
                        alt={`Upload ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {img.isNew && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audio Upload */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" />
              Audio Tracks
            </h3>
            <div className="text-sm text-gray-600">
              {visibleAudios.length}/5 uploaded
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/20 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Music className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Click to upload audio tracks
                </p>
                <p className="text-sm text-gray-500">
                  MP3, WAV, M4A • Max 10MB each
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload up to 5 audio tracks
                </p>
              </div>
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={(e) => handleAudioUpload(Array.from(e.target.files))}
                className="hidden"
                disabled={visibleAudios.length >= 5}
              />
            </label>

            {/* Audio Preview List */}
            {visibleAudios.length > 0 && (
              <div className="space-y-2">
                {visibleAudios.map((audio, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {audio.name || `Track ${idx + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {audio.filename}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {audio.isNew && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          New
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveAudio(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}