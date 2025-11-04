"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth";
import {
  Upload,
  Save,
  Trash2,
  Music2,
  ImageIcon,
  LogOut,
  Home,
  Play,
  Pause,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ArtistDashboard() {
  const { user, loading, logout } = useSession();

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
  const [saving, setSaving] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  

  const audioElements = useRef({});
  const isMounted = useRef(true);

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

  // Fetch existing artist profile from backend - FIXED useEffect
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch artist:", res.status);
          return;
        }

        const data = await res.json();
        if (data.data?.artist && isMounted.current) {
          const a = data.data.artist;
          setArtist({
            name: a.name || "",
            city: a.city
              ? a.city.charAt(0).toUpperCase() + a.city.slice(1).toLowerCase()
              : "",
            genre: a.genre ? a.genre.toLowerCase() : "pop",
            biography: a.biography || "",
            photos: a.photos || [],
            audios: a.mp3Files || [],
          });
          setPreviewImages(a.photos?.map((p) => p.url) || []);
          setAudioPreview(a.mp3Files?.map((m) => ({ 
            url: m.url, 
            name: m.name || `Audio ${m._id}` 
          })) || []);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();

    // Cleanup function
    return () => {
      isMounted.current = false;
      // Clean up audio URLs
      Object.values(audioElements.current).forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
          audio.pause();
        }
      });
    };
  }, []);


  const toggleAudio = useCallback((index) => {
    if (currentlyPlaying === index) {
      // Pause current audio
      if (audioElements.current[index]) {
        audioElements.current[index].pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Pause any currently playing audio
      if (currentlyPlaying !== null && audioElements.current[currentlyPlaying]) {
        audioElements.current[currentlyPlaying].pause();
      }
      
      // Play new audio
      if (audioElements.current[index]) {
        const playPromise = audioElements.current[index].play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setCurrentlyPlaying(index);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              toast.error("Error playing audio file");
            });
        }
      }
    }
  }, [currentlyPlaying]);


  const handleAudioRef = useCallback((index, element) => {
    if (element) {
      audioElements.current[index] = element;

      // Handle audio end
      const handleEnded = () => {
        setCurrentlyPlaying(null);
      };

      // Handle audio error
      const handleError = () => {
        toast.error(`Error loading audio file: ${audioPreview[index]?.name || 'Unknown'}`);
        setCurrentlyPlaying(null);
      };

      element.addEventListener('ended', handleEnded);
      element.addEventListener('error', handleError);

      // Cleanup event listeners
      return () => {
        element.removeEventListener('ended', handleEnded);
        element.removeEventListener('error', handleError);
      };
    }
  }, [audioPreview]);

  // Handle text input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setArtist(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle image upload (max 5)
  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    
    if (files.length + previewImages.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...urls]);
    setArtist(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    toast.success(`Added ${files.length} photo(s)`);
    
    // Reset file input
    e.target.value = '';
  }, [previewImages.length]);

  const removeImage = useCallback((index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setArtist(prev => ({ 
      ...prev, 
      photos: prev.photos.filter((_, i) => i !== index) 
    }));
    toast.success("Photo removed");
  }, []);

  // Handle MP3 upload
  const handleAudioUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + audioPreview.length > 5) {
      toast.error("You can upload a maximum of 5 audio files!");
      return;
    }

    const limitedFiles = files.slice(0, 5 - audioPreview.length);
    
    const newAudioPreviews = limitedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setAudioPreview(prev => [...prev, ...newAudioPreviews]);
    setArtist(prev => ({ ...prev, audios: [...prev.audios, ...limitedFiles] }));
    toast.success(`Added ${limitedFiles.length} audio file(s)`);
    
    // Reset file input
    e.target.value = '';
  }, [audioPreview.length]);

  const removeAudio = useCallback((index) => {
    // Stop audio if it's playing
    if (currentlyPlaying === index) {
      if (audioElements.current[index]) {
        audioElements.current[index].pause();
      }
      setCurrentlyPlaying(null);
    }
    
    setAudioPreview(prev => prev.filter((_, i) => i !== index));
    setArtist(prev => ({ ...prev, audios: prev.audios.filter((_, i) => i !== index) }));
    
    // Clean up audio element reference
    delete audioElements.current[index];
    
    toast.success("Audio file removed");
  }, [currentlyPlaying]);

  // Save (POST/PUT to backend)
  const handleSave = async () => {
    if (saving) return;
    
    try {
      setSaving(true);

      // Basic validation
      if (!artist.name || !artist.city || !artist.genre) {
        toast.error("Please fill all required fields (Name, City, Genre)");
        return;
      }

      if (artist.name.length < 2) {
        toast.error("Name must be at least 2 characters long");
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("name", artist.name);
      formData.append("city", artist.city.toLowerCase());
      formData.append("genre", artist.genre.toLowerCase());
      formData.append("biography", artist.biography);

      // Attach photos (max 5)
      if (artist.photos?.length > 0) {
        artist.photos.slice(0, 5).forEach((file) => {
          // Check if file is a new file (has size property) or existing file from server
          if (file.size !== undefined) {
            formData.append("photos", file);
          }
        });
      }

      // Attach audios (max 5)
      if (artist.audios?.length > 0) {
        artist.audios.slice(0, 5).forEach((file) => {
          // Check if file is a new file (has size property) or existing file from server
          if (file.size !== undefined) {
            formData.append("mp3Files", file);
          }
        });
      }

      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Show loading toast
      const saveToast = toast.loading("Saving profile...");

      // Send to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artists/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

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
            audios: a.mp3Files || [],
          });
          setPreviewImages(a.photos?.map((p) => p.url) || []);
          setAudioPreview(a.mp3Files?.map((a) => ({ 
            url: a.url, 
            name: a.name || `Audio ${a._id}` 
          })) || []);
        }
      } else {
        toast.dismiss(saveToast);
        toast.error(data.message || "Failed to save profile.");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Server error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/signin";
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up image preview URLs
      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      // Clean up audio preview URLs
      audioPreview.forEach(audio => {
        if (audio.url.startsWith('blob:')) {
          URL.revokeObjectURL(audio.url);
        }
      });
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Unauthorized — please login.
      </div>
    );

  return (
    <div className="py-4 px-4 flex justify-center">
      <Toaster/>
      <div className="container w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-lg p-8 md:p-12 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
            Artist Dashboard
          </h1>
        </div>

        <p className="text-center text-[var(--color-muted-foreground)] mb-10">
          Manage your artist details, media, and genre preferences.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10 border-b border-[var(--color-border)] pb-2">
          {["overview", "edit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-2 text-lg font-medium transition-all ${activeTab === tab
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]"
                }`}
            >
              {tab === "overview" ? "Overview" : "Edit Profile"}
            </button>
          ))}
        </div>

        {/* === OVERVIEW === */}

{activeTab === "overview" && (
  <div className="animate-fadeIn">
    {/* Profile Header Card */}
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Image */}
        <div className="relative w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden bg-gray-700">
          {previewImages.length > 0 ? (
            <Image
              src={previewImages[0]}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {artist.name || "Unnamed Artist"}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300 capitalize">{artist.genre || "No genre"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">{artist.city || "No city"}</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{previewImages.length}</div>
            <div className="text-xs text-gray-400">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{audioPreview.length}</div>
            <div className="text-xs text-gray-400">Tracks</div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Basic Info */}
      <div className="lg:col-span-2 space-y-8">
        {/* Biography Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
            Biography
          </h3>
          <div className="text-gray-300 leading-relaxed">
            {artist.biography ? (
              <p className="whitespace-pre-line">{artist.biography}</p>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-500" />
                  </div>
                </div>
                No biography added yet.
              </div>
            )}
          </div>
        </div>

        {/* Audio Tracks Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
            Audio Tracks
            <span className="text-sm text-gray-400 ml-2">({audioPreview.length})</span>
          </h3>
          
          {audioPreview.length > 0 ? (
            <div className="space-y-3">
              {audioPreview.map((audio, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    currentlyPlaying === index 
                      ? "border-yellow-500 bg-yellow-500/10" 
                      : "border-gray-700 bg-gray-700/50 hover:bg-gray-700"
                  }`}
                >
                  <button
                    onClick={() => toggleAudio(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentlyPlaying === index 
                        ? "bg-yellow-500 text-black" 
                        : "bg-gray-600 text-white hover:bg-yellow-500 hover:text-black"
                    }`}
                  >
                    {currentlyPlaying === index ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {audio.name || `Audio Track ${index + 1}`}
                    </p>
                    <audio
                      ref={(el) => handleAudioRef(index, el)}
                      src={audio.url}
                      className="hidden"
                      preload="metadata"
                    />
                  </div>
                  
                  <div className="flex-1 max-w-xs hidden md:block">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-100"
                        style={{ 
                          width: currentlyPlaying === index 
                            ? `${(audioElements.current[index]?.currentTime / audioElements.current[index]?.duration) * 100 || 0}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <Music2 size={20} className="text-gray-500" />
                </div>
              </div>
              No audio tracks uploaded yet.
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Photos & Details */}
      <div className="space-y-8">
        {/* Quick Details Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
            Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <p className="text-white font-medium">{artist.name || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">City</label>
              <p className="text-white font-medium">{artist.city || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Genre</label>
              <p className="text-white font-medium capitalize">
                {artist.genre || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Photos Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
            Photos
            <span className="text-sm text-gray-400 ml-2">({previewImages.length}/5)</span>
          </h3>
          
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {previewImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 group"
                >
                  <Image
                    src={src}
                    alt={`Artist photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <ImageIcon size={20} className="text-gray-500" />
                </div>
              </div>
              No photos uploaded.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

        {/* === EDIT TAB === */}
        {activeTab === "edit" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input
                  name="name"
                  value={artist.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                />
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">City *</label>
                <select
                  name="city"
                  value={artist.city.toLowerCase()}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city.toLocaleLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Genre *
                </label>
                <select
                  name="genre"
                  value={artist.genre.toLowerCase()}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
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
                <label className="block text-sm text-gray-400 mb-1">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={artist.biography}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short biography about yourself and your music..."
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-vertical"
                ></textarea>
              </div>
            </div>

            {/* Uploads */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Photos */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Photos (max 5) - {previewImages.length}/5
                </label>
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition ${
                  previewImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <Upload size={16} /> 
                  {previewImages.length >= 5 ? 'Maximum Reached' : 'Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                    disabled={previewImages.length >= 5}
                  />
                </label>

                {previewImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Uploaded Photos:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {previewImages.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border border-gray-600 rounded-md overflow-hidden group"
                        >
                          <Image
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Audio */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Audio (MP3) - {audioPreview.length}/5
                </label>

                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition ${
                  audioPreview.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <Music2 size={16} /> 
                  {audioPreview.length >= 5 ? 'Maximum Reached' : 'Upload Audio'}
                  <input
                    type="file"
                    accept="audio/*"
                    multiple
                    hidden
                    onChange={handleAudioUpload}
                    disabled={audioPreview.length >= 5}
                  />
                </label>

                {audioPreview.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Uploaded Audio:</p>
                    <div className="space-y-2">
                      {audioPreview.map((audio, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border border-gray-600 rounded bg-gray-800/50">
                          <button
                            onClick={() => removeAudio(index)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-400 transition"
                          >
                            <X size={12} />
                          </button>
                          <span className="text-sm text-white truncate flex-1">
                            {audio.name || `Audio ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-10 py-3 rounded-lg font-medium shadow-md transition ${
                  saving ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}