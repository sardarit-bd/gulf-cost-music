"use client";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
  Edit,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Video,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Utility function for clean error messages
const handleApiError = (error, defaultMessage = "Something went wrong") => {
  if (error.response) {
    const data = error.response.data;

    if (data?.errors?.length > 0) {
      return data.errors
        .map((err) => `• ${err.msg || err.message}`)
        .join("\n");
    }

    return data?.message || defaultMessage;
  }

  if (error.request) {
    return "No response from server. Please check your connection.";
  }

  return error.message || defaultMessage;
};

export default function PodcastPage() {
  const [token, setToken] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    youtubeUrl: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        toast.error("Please login first");
      }
    }
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.youtubeUrl.trim()) {
      errors.youtubeUrl = "YouTube URL is required";
    } else if (!isValidYouTubeUrl(formData.youtubeUrl)) {
      errors.youtubeUrl = "Please enter a valid YouTube URL";
    }

    if (!editingItem && !formData.thumbnail) {
      errors.thumbnail = "Thumbnail is required for new podcasts";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Fetch all podcasts
  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/casts`);
      console.log(data);
      if (data.success) {
        setPodcasts(Array.isArray(data.data.casts) ? data.data.casts : []);
      } else {
        setPodcasts([]);
        toast.error("Failed to load podcasts");
      }
    } catch (error) {
      toast.error(handleApiError(error, "Failed to load podcasts"));
    } finally {
      setLoading(false);
    }
  };

  // Create or update podcast
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };

        // Build FormData for file upload
        const fd = new FormData();
        fd.append("title", formData.title.trim());
        fd.append("youtubeUrl", formData.youtubeUrl.trim());
        fd.append("description", formData.description.trim());

        if (formData.thumbnail instanceof File) {
          fd.append("thumbnail", formData.thumbnail);
        }

        let response;
        if (editingItem) {
          response = await axios.put(`${API_BASE}/api/casts/${editingItem._id}`, fd, {
            headers,
          });
        } else {
          response = await axios.post(`${API_BASE}/api/casts`, fd, { headers });
        }

        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(savePromise, {
      loading: editingItem ? "Updating podcast..." : "Adding podcast...",
      success: (data) => {
        resetForm();
        fetchPodcasts();
        return editingItem
          ? "Podcast updated successfully!"
          : "Podcast added successfully!";
      },
      error: (error) => handleApiError(error, "Failed to save podcast"),
    });
  };

  // Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      thumbnail: item.thumbnail || "",
      youtubeUrl: item.youtubeUrl || "",
      description: item.description || "",
    });
    setShowForm(true);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete with confirmation
  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_BASE}/api/casts/${id}`, { headers });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting podcast...",
      success: () => {
        fetchPodcasts();
        return "Podcast deleted successfully!";
      },
      error: (error) => handleApiError(error, "Failed to delete podcast"),
    });
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      thumbnail: null,
      youtubeUrl: "",
      description: "",
    });
    setEditingItem(null);
    setShowForm(false);
    setFormErrors({});
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, thumbnail: file });
      setFormErrors({ ...formErrors, thumbnail: "" });
    }
  };

  // Clear thumbnail
  const clearThumbnail = () => {
    setFormData({ ...formData, thumbnail: null });
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <Toaster />
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Video className="w-7 h-7 text-purple-600" />
              Podcast Management
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPodcasts}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{showForm ? 'Cancel' : 'Add Podcast'}</span>
              </button>
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {editingItem ? 'Edit Podcast' : 'Add New Podcast'}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setFormErrors({ ...formErrors, title: "" });
                    }}
                    className={`text-gray-700 w-full border rounded-lg px-3 py-2 ${formErrors.title
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                      }`}
                    placeholder="Enter podcast title"
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, youtubeUrl: e.target.value });
                      setFormErrors({ ...formErrors, youtubeUrl: "" });
                    }}
                    className={`text-gray-700 w-full border rounded-lg px-3 py-2 ${formErrors.youtubeUrl
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white'
                      }`}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  {formErrors.youtubeUrl && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.youtubeUrl}</p>
                  )}
                  {formData.youtubeUrl && isValidYouTubeUrl(formData.youtubeUrl) && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ Valid YouTube URL
                    </p>
                  )}
                </div>

                {/* File Upload Input */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Thumbnail Image {!editingItem && '*'}
                  </label>

                  <div
                    className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${formErrors.thumbnail
                      ? 'border-red-400 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                      }`}
                    onClick={() => document.getElementById("thumbnailInput").click()}
                  >
                    {!formData.thumbnail ? (
                      <>
                        <input
                          id="thumbnailInput"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        <div className="flex flex-col items-center space-y-2 text-gray-500">

                          <p className="text-sm font-medium">Click to upload or drag & drop</p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, or WEBP — Max 5MB (1:1 ratio recommended)
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="relative group">
                        <img
                          src={
                            formData.thumbnail instanceof File
                              ? URL.createObjectURL(formData.thumbnail)
                              : formData.thumbnail
                          }
                          alt="Preview"
                          className="w-40 h-40 rounded-lg object-cover border border-gray-200 shadow-sm group-hover:opacity-80 transition"
                        />
                        <button
                          type="button"
                          onClick={clearThumbnail}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow"
                          title="Remove Image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {formErrors.thumbnail && (
                    <p className="text-sm text-red-600 mt-2">{formErrors.thumbnail}</p>
                  )}
                </div>


                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    placeholder="Enter podcast description (optional)"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    {editingItem ? (
                      <>
                        <Edit className="w-4 h-4" />
                        Update Podcast
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Podcast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Podcasts Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">
                Podcasts ({podcasts.length})
              </h3>
              {podcasts.length > 0 && (
                <span className="text-sm text-gray-500">
                  Click on YouTube links to view
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                <span className="text-gray-600">Loading podcasts...</span>
              </div>
            ) : podcasts.length === 0 ? (
              <div className="py-16 text-center">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No podcasts found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first podcast.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Add Your First Podcast
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Podcast
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        YouTube Link
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Thumbnail
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {podcasts.map((podcast) => (
                      <tr key={podcast._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {podcast.title}
                            </div>
                            {podcast.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {podcast.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={podcast.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <Video className="w-4 h-4" />
                            Watch on YouTube
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {podcast.thumbnail ? (
                            <img
                              src={podcast.thumbnail}
                              alt={podcast.title}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">No thumbnail</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(podcast)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="Edit podcast"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(podcast._id, podcast.title)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            title="Delete podcast"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}