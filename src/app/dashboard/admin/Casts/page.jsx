"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Video,
  Search,
  Loader2,
  Eye,
  MoreVertical,
  Tag,
} from "lucide-react";
import axios from "axios";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
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

export default function CastPage() {
  const [token, setToken] = useState(null);
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    youtubeUrl: "",
    description: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Fetch all casts
  const fetchCasts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/casts`);
      console.log(data)
      if (data.success) {
        setCasts(Array.isArray(data.data.casts) ? data.data.casts : []);
      } else {
        setCasts([]);
      }
    } catch (error) {
      toast.error(handleApiError(error, "Failed to load podcasts"));
    } finally {
      setLoading(false);
    }
  };

  // Create or update cast
  const handleSubmit = async (e) => {
    e.preventDefault();
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        if (editingItem) {
          await axios.put(
            `${API_BASE}/api/casts/${editingItem._id}`,
            formData,
            { headers }
          );
        } else {
          await axios.post(`${API_BASE}/api/casts`, formData, { headers });
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(savePromise, {
      loading: editingItem ? "Updating podcast..." : "Adding podcast...",
      success: () => {
        resetForm();
        fetchCasts();
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
      title: item.title,
      thumbnail: item.thumbnail,
      youtubeUrl: item.youtubeUrl,
      description: item.description || "",
    });
    setShowForm(true);
    toast.success(`Loaded ${item.title} for editing`);
  };

  // Delete
  const handleDelete = async (id) => {
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
        fetchCasts();
        return "Podcast deleted successfully!";
      },
      error: (error) => handleApiError(error, "Failed to delete podcast"),
    });
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      thumbnail: "",
      youtubeUrl: "",
      description: "",
    });
    setEditingItem(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchCasts();
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
                onClick={fetchCasts}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Podcast</span>
              </button>
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? "Edit Podcast" : "Add New Podcast"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="text-gray-500 bg-gray-100 w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeUrl: e.target.value })
                    }
                    className="text-gray-500 bg-gray-100 w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="text-gray-500 bg-gray-100 w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="text-gray-500 bg-gray-100 w-full border rounded-lg px-3 py-2"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingItem ? "Update Podcast" : "Add Podcast"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Casts Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">
                Podcasts ({casts.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : casts.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No podcasts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Title
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
                    {casts.map((cast) => (
                      <tr key={cast._id}>
                        <td className="px-6 py-4 text-gray-500">{cast.title}</td>
                        <td className="px-6 py-4 text-blue-600">
                          <a
                            href={cast.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            {cast.youtubeUrl.slice(0, 40)}...
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {cast.thumbnail ? (
                            <img
                              src={cast.thumbnail}
                              alt="thumbnail"
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(cast)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cast._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
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
