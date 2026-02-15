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
  // Track which existing files are marked for deletion
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [audiosToDelete, setAudiosToDelete] = useState([]);

  // Local state for UI display
  const [displayImages, setDisplayImages] = useState([]);
  const [displayAudios, setDisplayAudios] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  // Initialize display state from props
  useEffect(() => {
    console.log("📸 Preview Images from parent:", previewImages);

    // Format images for display
    const formattedImages = previewImages.map((img, index) => ({
      id: img.id || `img-${Date.now()}-${index}`,
      url: img.url,
      filename: img.filename || img.url?.split("/").pop(),
      publicId: img.publicId,
      isExisting: img.isExisting || false,
      file: img.file, // Make sure file is preserved
    }));
    setDisplayImages(formattedImages);

    // Format audios for display
    const formattedAudios = audioPreview.map((audio, index) => ({
      id: audio.id || `audio-${Date.now()}-${index}`,
      url: audio.url,
      filename: audio.filename || audio.url?.split("/").pop(),
      name: audio.name || audio.filename || `Track ${index + 1}`,
      publicId: audio.publicId,
      isExisting: audio.isExisting || false,
      file: audio.file, // Make sure file is preserved
    }));
    setDisplayAudios(formattedAudios);

    // Auto-detect state from current city
    if (artist?.city && artist?.state) {
      const currentState = artist.state;
      setSelectedState(currentState);
      setFilteredCities(CITY_OPTIONS[currentState] || []);
    } else if (artist?.city) {
      // Try to detect state from city
      for (const [state, cities] of Object.entries(CITY_OPTIONS)) {
        const cityValues = cities.map(c => c.value);
        if (cityValues.includes(artist.city.toLowerCase())) {
          setSelectedState(state);
          setFilteredCities(CITY_OPTIONS[state] || []);
          break;
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
      onChange({
        target: {
          name: "state",
          value: state,
        },
      });
    } else {
      setFilteredCities([]);
      onChange({
        target: {
          name: "city",
          value: "",
        },
      });
    }
  };

  // Handle city selection change
  const handleCityChange = (e) => {
    onChange(e);
  };

  // Handle new image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log("📸 Uploading files:", files.map(f => f.name));
    onImageUpload(files);
    e.target.value = ''; // Reset input
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const imageToRemove = displayImages[index];

    // If it's an existing image, mark it for deletion
    if (imageToRemove.isExisting && imageToRemove.url) {
      setPhotosToDelete(prev => [...prev, imageToRemove.url]);
    }

    // Remove from display
    const newImages = [...displayImages];
    newImages.splice(index, 1);
    setDisplayImages(newImages);

    // Call parent handler
    if (onRemoveImage) onRemoveImage(index);
  };

  // Handle new audio uploads
  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log("🎵 Uploading audio files:", files.map(f => f.name));
    onAudioUpload(files);
    e.target.value = ''; // Reset input
  };

  // Handle audio removal
  const handleRemoveAudio = (index) => {
    const audioToRemove = displayAudios[index];

    // If it's an existing audio, mark it for deletion
    if (audioToRemove.isExisting && audioToRemove.url) {
      setAudiosToDelete(prev => [...prev, audioToRemove.url]);
    }

    // Remove from display
    const newAudios = [...displayAudios];
    newAudios.splice(index, 1);
    setDisplayAudios(newAudios);

    // Call parent handler
    if (onRemoveAudio) onRemoveAudio(index);
  };

  // Handle save
  const handleSave = async () => {
    // Validation
    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }

    if (!artist?.city) {
      toast.error("Please select a city");
      return;
    }

    if (!artist?.name?.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!artist?.genre) {
      toast.error("Please select a genre");
      return;
    }

    const selectedCity = artist.city.toLowerCase();
    const stateCities = (CITY_OPTIONS[selectedState] || []).map((c) => c.value);

    if (!stateCities.includes(selectedCity)) {
      toast.error(`Please select a valid city for ${selectedState}`);
      return;
    }

    const formData = new FormData();

    // Add basic fields
    formData.append("name", artist.name || "");
    formData.append("city", artist.city || "");
    formData.append("genre", artist.genre || "");
    formData.append("biography", artist.biography || "");

    // Add photos to delete as JSON string
    if (photosToDelete.length > 0) {
      formData.append("photosToDelete", JSON.stringify(photosToDelete));
      console.log("📸 Photos to delete:", photosToDelete);
    }

    // Add audios to delete as JSON string
    if (audiosToDelete.length > 0) {
      formData.append("audiosToDelete", JSON.stringify(audiosToDelete));
      console.log("🎵 Audios to delete:", audiosToDelete);
    }

    // Add new photos - FIX: Use correct field name 'photos'
    const newPhotos = displayImages.filter(img => !img.isExisting && img.file);
    console.log("📸 New photos to upload:", newPhotos.length);

    newPhotos.forEach(img => {
      formData.append("photos", img.file); // Make sure field name is 'photos'
      console.log("  - Adding photo:", img.file.name);
    });

    // Add new audios - FIX: Use correct field name 'mp3Files'
    const newAudios = displayAudios.filter(audio => !audio.isExisting && audio.file);
    console.log("🎵 New audios to upload:", newAudios.length);

    newAudios.forEach(audio => {
      formData.append("mp3Files", audio.file); // Make sure field name is 'mp3Files'
      console.log("  - Adding audio:", audio.file.name);
    });

    // Log FormData contents for debugging
    console.log("📦 Final FormData contents:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: ${pair[1].name} (${(pair[1].size / 1024).toFixed(2)} KB)`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }

    try {
      await onSave(formData);
      // Reset deletion tracking after successful save
      setPhotosToDelete([]);
      setAudiosToDelete([]);
    } catch (error) {
      console.error("Save failed:", error);
      throw error;
    }
  };

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
              {displayImages.length}/{uploadLimits.photos} uploaded
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-300 ${displayImages.length >= uploadLimits.photos ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                  Upload up to {uploadLimits.photos} photos
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={displayImages.length >= uploadLimits.photos}
              />
            </label>

            {/* Image Preview Grid */}
            {displayImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {displayImages.map((img, idx) => (
                  <div key={img.id || idx} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {img.url ? (
                        <Image
                          src={img.url}
                          alt={`Upload ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100px, 150px"
                          unoptimized={img.url?.startsWith("blob:")}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          Invalid Image
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {!img.isExisting && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </div>
                    )}
                    {img.isExisting && photosToDelete.includes(img.url) && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                        Will Delete
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
              {displayAudios.length}/{uploadLimits.audios} uploaded
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/20 transition-all duration-300 ${displayAudios.length >= uploadLimits.audios ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                  Upload up to {uploadLimits.audios} audio tracks
                </p>
              </div>
              <input
                type="file"
                accept="audio/mpeg,audio/wav,audio/mp3,audio/m4a"
                multiple
                onChange={handleAudioUpload}
                className="hidden"
                disabled={displayAudios.length >= uploadLimits.audios}
              />
            </label>

            {/* Audio Preview List */}
            {displayAudios.length > 0 && (
              <div className="space-y-2">
                {displayAudios.map((audio, idx) => (
                  <div key={audio.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {audio.name || `Track ${idx + 1}`}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {audio.filename}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!audio.isExisting && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          New
                        </span>
                      )}
                      {audio.isExisting && audiosToDelete.includes(audio.url) && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          Will Delete
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveAudio(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        type="button"
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
          type="button"
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