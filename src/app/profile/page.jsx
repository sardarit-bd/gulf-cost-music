"use client";

import { useState, useEffect } from "react";
import Footer from "../footer/page";

export default function ProfilePage() {
  const [role, setRole] = useState("artist");
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    genre: "",
    biography: "",
    photos: [],
    mp3: "",
    address: "",
    capacity: "",
    openHours: "",
    title: "",
    description: "",
    date: "",
    location: "",
    credit: "",
  });

  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await fetch("https://golf-music-backend-1.onrender.com/api/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data.user);
        setRole(userData.data.user.userType);
        
        // Load existing profile data
        await loadProfileData(userData.data.user);
      } else {
        console.error("Failed to fetch user data");
        window.location.href = "/signin";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      let profileData = {};

      // Fetch profile data based on user type
      switch (userData.userType) {
        case "artist":
          const artistResponse = await fetch(`https://golf-music-backend-1.onrender.com/api/artists/${userData._id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (artistResponse.ok) {
            profileData = await artistResponse.json();
          }
          break;

        case "venue":
          const venueResponse = await fetch(`https://golf-music-backend-1.onrender.com/api/venues/${userData._id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (venueResponse.ok) {
            profileData = await venueResponse.json();
          }
          break;

        case "journalist":
          // Handle journalist profile fetch
          break;
      }

      // Populate form with existing data
      if (profileData.data) {
        setFormData(prev => ({
          ...prev,
          name: profileData.data.name || userData.username || "",
          city: profileData.data.city || "",
          genre: profileData.data.genre || "",
          biography: profileData.data.biography || "",
          address: profileData.data.address || "",
          capacity: profileData.data.capacity || "",
          openHours: profileData.data.openHours || "",
          // Add other fields as needed
        }));

        // Load existing photos if available
        if (profileData.data.photos && profileData.data.photos.length > 0) {
          setExistingPhotos(profileData.data.photos);
        }
      } else {
        // If no profile exists, set basic user info
        setFormData(prev => ({
          ...prev,
          name: userData.username || "",
          genre: userData.genre || "",
          location: userData.location || "",
        }));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - existingPhotos.length);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewPhotos(prev => [...prev, ...newPreviews]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }, 100);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let payload = {};

      // Prepare payload based on user type
      switch (role) {
        case "artist":
          endpoint = "https://golf-music-backend-1.onrender.com/api/artists/profile";
          payload = {
            name: formData.name,
            city: formData.city,
            genre: formData.genre,
            biography: formData.biography,
            // Handle file uploads separately
          };
          break;

        case "venue":
          endpoint = "https://golf-music-backend-1.onrender.com/api/venues/profile";
          payload = {
            venueName: formData.name,
            city: formData.city,
            address: formData.address,
            seatingCapacity: formData.capacity,
            openHours: formData.openHours,
            biography: formData.biography,
          };
          break;

        case "journalist":
          endpoint = "https://golf-music-backend-1.onrender.com/api/news";
          payload = {
            title: formData.name,
            description: formData.biography,
            location: formData.location,
            date: formData.date,
            credit: formData.credit,
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Handle file uploads if there are new photos
        if (formData.photos.length > 0) {
          await uploadPhotos(token);
        }

        // Handle MP3 upload for artists
        if (role === "artist" && formData.mp3) {
          await uploadMP3(token);
        }

        alert(`🎉 Profile updated successfully!`);
        
        // Refresh data
        await fetchUserData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadPhotos = async (token) => {
    const photoFormData = new FormData();
    formData.photos.forEach(photo => {
      photoFormData.append('photos', photo);
    });

    try {
      const response = await fetch("https://golf-music-backend-1.onrender.com/api/upload/photos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: photoFormData,
      });

      if (!response.ok) {
        throw new Error("Photo upload failed");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  const uploadMP3 = async (token) => {
    const mp3FormData = new FormData();
    mp3FormData.append('mp3', formData.mp3);

    try {
      const response = await fetch("https://golf-music-backend-1.onrender.com/api/upload/mp3", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: mp3FormData,
      });

      if (!response.ok) {
        throw new Error("MP3 upload failed");
      }
    } catch (error) {
      console.error("Error uploading MP3:", error);
    }
  };

  const removePhoto = (index, isExisting = false) => {
    if (isExisting) {
      // Handle deletion of existing photo from server
      const newExistingPhotos = [...existingPhotos];
      newExistingPhotos.splice(index, 1);
      setExistingPhotos(newExisting);
      // You might want to call an API to delete from server
    } else {
      // Handle removal of new photo before upload
      const newPhotos = [...formData.photos];
      const newPreviews = [...previewPhotos];
      newPhotos.splice(index, 1);
      newPreviews.splice(index, 1);
      setFormData({ ...formData, photos: newPhotos });
      setPreviewPhotos(newPreviews);
    }
  };

  const roleConfig = {
    artist: {
      tabs: ["basic", "music", "media"],
      icon: "🎤",
      color: "from-purple-500 to-pink-500"
    },
    venue: {
      tabs: ["basic", "details", "media"],
      icon: "🏟️",
      color: "from-blue-500 to-cyan-500"
    },
    journalist: {
      tabs: ["basic", "content", "media"],
      icon: "📰",
      color: "from-green-500 to-emerald-500"
    }
  };

  const renderBasicFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {role === "journalist" ? "News Title" : `${role.charAt(0).toUpperCase() + role.slice(1)} Name`} *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={role === "journalist" ? "Enter news title..." : `Enter ${role} name...`}
            className="text-gray-400 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city..."
            className="text-gray-400 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      {role === "artist" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Genre *
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="text-gray-400 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
            required
          >
            <option value="">Select your genre</option>
            {["Rap", "Country", "Pop", "Rock", "Jazz", "Reggae", "EDM", "Classical", "Other"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {role === "journalist" ? "Description" : "Biography"} *
        </label>
        <textarea
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          placeholder={role === "journalist" ? "Write your news description..." : `Tell us about this ${role}...`}
          rows="4"
          className="text-gray-400 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none placeholder:text-gray-400"
          required
        />
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (role) {
      case "artist":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Music Sample
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  accept=".mp3"
                  onChange={(e) => setFormData({...formData, mp3: e.target.files[0]})}
                  className="hidden"
                  id="mp3-upload"
                />
                <label htmlFor="mp3-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">🎵</div>
                  <p className="text-gray-600 mb-2">Upload MP3 file</p>
                  <p className="text-sm text-gray-400">Max 10MB • MP3 format only</p>
                </label>
                {formData.mp3 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 font-medium">✓ File selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "venue":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seating Capacity
                </label>
                <input
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Operating Hours
              </label>
              <input
                name="openHours"
                value={formData.openHours}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri: 6PM-2AM, Sat-Sun: 4PM-3AM"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
        );

      case "journalist":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publication Date *
                </label>
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select location</option>
                  {["New Orleans", "Biloxi", "Mobile", "Pensacola"].map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Credit/Author
              </label>
              <input
                name="credit"
                value={formData.credit}
                onChange={handleChange}
                placeholder="Your name or publication..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMediaFields = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Upload Photos (Max 5) - {existingPhotos.length + previewPhotos.length}/5 used
        </label>
        
        {/* Show existing photos */}
        {existingPhotos.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Photos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingPhotos.map((photo, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={photo} // This should be the URL from your server
                    alt={`Existing ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index, true)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area for new photos */}
        {(existingPhotos.length + previewPhotos.length) < 5 && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 mb-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="text-4xl mb-3">📸</div>
              <p className="text-gray-600 mb-2 font-medium">Click to upload photos</p>
              <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB each</p>
            </label>
            
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
        )}

        {/* New Photo Previews */}
        {previewPhotos.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">New Photos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewPhotos.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index, false)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicFields();
      case "music":
      case "details":
      case "content":
        return renderRoleSpecificFields();
      case "media":
        return renderMediaFields();
      default:
        return renderBasicFields();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#F9FAFB]">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-40 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Profile Management
            </h1>
            <p className="text-gray-600 text-lg">
              {user ? `Welcome back, ${user.username}!` : "Create and manage your profile"}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Role Selection - Only show if user has multiple roles */}
            <div className="border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center p-6">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${roleConfig[role].color} flex items-center justify-center text-white text-xl`}>
                    {roleConfig[role].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {role.charAt(0).toUpperCase() + role.slice(1)} Profile
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {user?.isVerified ? "✓ Verified Profile" : "Complete your profile to get featured"}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Member since: {user ? new Date(user.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {roleConfig[role].tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab
                        ? `border-b-2 ${role === 'artist' ? 'border-purple-500 text-purple-600' : role === 'venue' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}`
                        : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderTabContent()}

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => window.location.href = `/artists/${user?._id}`}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    View Public Profile
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r ${roleConfig[role].color} text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Auto-save enabled</span>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </section>
  );
}