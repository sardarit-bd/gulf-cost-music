"use client";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { Eye, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CastSectionTextEditor = ({ onClose, onUpdate, token, API_BASE }) => {
    const [formData, setFormData] = useState({
        sectionTitle: "",
        sectionSubtitle: "",
        yourCastsTitle: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // Fetch current section text
    useEffect(() => {
        fetchSectionText();
    }, []);

    const fetchSectionText = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE}/api/casts/section/text`);

            if (data.success) {
                setFormData({
                    sectionTitle: data.data.sectionTitle || "Cast",
                    sectionSubtitle: data.data.sectionSubtitle || "Tune into engaging podcast episodes featuring your favorite personalities",
                    yourCastsTitle: data.data.yourCastsTitle || "Your Favorites"
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load section text");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Authentication token not found");
            return;
        }

        setSaving(true);

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            // Send only non-empty fields
            const payload = {};
            if (formData.sectionTitle !== undefined) payload.sectionTitle = formData.sectionTitle.trim();
            if (formData.sectionSubtitle !== undefined) payload.sectionSubtitle = formData.sectionSubtitle.trim();
            if (formData.yourCastsTitle !== undefined) payload.yourCastsTitle = formData.yourCastsTitle.trim();

            const { data } = await axios.put(
                `${API_BASE}/api/casts/section/text/update`,
                payload,
                { headers }
            );

            if (data.success) {
                onUpdate();
            } else {
                throw new Error(data.message || "Update failed");
            }
        } catch (error) {
            toast.error(handleApiError(error, "Failed to update section text"));
            console.error("Update error:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setFormData({
            sectionTitle: "Cast",
            sectionSubtitle: "Tune into engaging podcast episodes featuring your favorite personalities",
            yourCastsTitle: "Your Favorites"
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                        <p className="text-gray-600">Loading section text...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Edit Casts Section Text
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                        Update the text displayed on the Casts page
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Preview/Edit Toggle */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${!previewMode
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Edit Text
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${previewMode
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Eye className="w-4 h-4 inline mr-2" />
                        Preview
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                    Reset to Default
                </button>
            </div>

            {previewMode ? (
                /* Preview Mode */
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>

                    {/* Featured Section Preview */}
                    <div className="mb-8">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Featured Section:</h4>
                        <div className="bg-white p-4 rounded-lg border">
                            <h2 className="text-2xl font-bold text-black mb-2">
                                {formData.sectionTitle || "Cast"}
                            </h2>
                            <p className="text-gray-600">
                                {formData.sectionSubtitle || "Tune into engaging podcast episodes featuring your favorite personalities"}
                            </p>
                        </div>
                    </div>

                    {/* Your Favorites Section Preview */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Favorites Section:</h4>
                        <div className="bg-white p-4 rounded-lg border">
                            <h2 className="text-2xl font-bold text-black">
                                {formData.yourCastsTitle || "Your Favorites"}
                            </h2>
                        </div>
                    </div>
                </div>
            ) : (
                /* Edit Mode */
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Section Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Title (Main Title)
                            </label>
                            <input
                                type="text"
                                name="sectionTitle"
                                value={formData.sectionTitle}
                                onChange={handleChange}
                                className="text-gray-600 w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors text-sm"
                                placeholder="Enter section title (e.g., 'Cast')"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This appears as the main title in the featured section
                            </p>
                        </div>

                        {/* Section Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Subtitle
                            </label>
                            <textarea
                                name="sectionSubtitle"
                                value={formData.sectionSubtitle}
                                onChange={handleChange}
                                rows="3"
                                className="text-gray-600 w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors text-sm resize-none"
                                placeholder="Enter section subtitle"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This appears below the main title
                            </p>
                        </div>

                        {/* Your Casts Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Favorites Title
                            </label>
                            <input
                                type="text"
                                name="yourCastsTitle"
                                value={formData.yourCastsTitle}
                                onChange={handleChange}
                                className="text-gray-600 w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors text-sm"
                                placeholder="Enter 'Your Favorites' title"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This appears as the title of the favorites list section
                            </p>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-[var(--primary)] text-black rounded-lg hover:bg-primary/80 font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm w-full sm:w-auto"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CastSectionTextEditor;