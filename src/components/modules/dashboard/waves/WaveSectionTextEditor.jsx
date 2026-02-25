"use client";
import CustomLoader from "@/components/shared/loader/Loader";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";
import { Eye, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const WaveSectionTextEditor = ({ onClose, token, API_BASE }) => {
    const [formData, setFormData] = useState({
        sectionTitle: "",
        sectionSubtitle: "",
        yourWavesTitle: ""
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
            const { data } = await axios.get(`${API_BASE}/api/wave-settings`);

            if (data.success) {
                setFormData({
                    sectionTitle: data.data.sectionTitle || "Waves",
                    sectionSubtitle: data.data.sectionSubtitle || "Explore the freshest waves and top audio experiences.",
                    yourWavesTitle: data.data.yourWavesTitle || "Your Waves"
                });
            } else {
                // If API returns success false but no data, set defaults
                setFormData({
                    sectionTitle: "Waves",
                    sectionSubtitle: "Explore the freshest waves and top audio experiences.",
                    yourWavesTitle: "Your Waves"
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            // Show error toast but don't break the UI
            toast.error("Failed to load section text. Using default values.");
            // Set default values on error
            setFormData({
                sectionTitle: "Waves",
                sectionSubtitle: "Explore the freshest waves and top audio experiences.",
                yourWavesTitle: "Your Waves"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Authentication token not found");
            return;
        }

        // Validate required fields
        if (!formData.sectionTitle.trim()) {
            toast.error("Section title is required");
            return;
        }
        if (!formData.sectionSubtitle.trim()) {
            toast.error("Section subtitle is required");
            return;
        }
        if (!formData.yourWavesTitle.trim()) {
            toast.error("Your waves title is required");
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
            if (formData.yourWavesTitle !== undefined) payload.yourWavesTitle = formData.yourWavesTitle.trim();

            const { data } = await axios.put(
                `${API_BASE}/api/wave-settings`,
                payload,
                { headers }
            );

            if (data.success) {
                toast.success("Section text updated successfully!");
                onClose();
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
            sectionTitle: "Waves",
            sectionSubtitle: "Explore the freshest waves and top audio experiences.",
            yourWavesTitle: "Your Waves"
        });
        toast.success("Reset to default values");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px] bg-white">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading section text...</p>
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
                        Edit Waves Section Text
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                        Update the text displayed on the Waves page
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                    title="Close"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Preview/Edit Toggle */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${!previewMode
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                            }`}
                    >
                        Edit Text
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${previewMode
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Reset to Default
                </button>
            </div>

            {previewMode ? (
                /* Preview Mode */
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        Live Preview
                    </h3>

                    {/* Featured Section Preview */}
                    <div className="mb-8 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Featured Section Preview:
                        </h4>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-black">
                                {formData.sectionTitle || "Waves"}
                            </h2>
                            <p className="text-gray-600">
                                {formData.sectionSubtitle || "Explore the freshest waves and top audio experiences."}
                            </p>
                        </div>
                    </div>

                    {/* Your Waves Section Preview */}
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
                            Your Waves Section Preview:
                        </h4>
                        <h2 className="text-2xl font-bold text-black">
                            {formData.yourWavesTitle || "Your Waves"}
                        </h2>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            This is how the text will appear on the Waves page
                        </p>
                    </div>
                </div>
            ) : (
                /* Edit Mode */
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Section Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.sectionTitle}
                                onChange={(e) => handleChange("sectionTitle", e.target.value)}
                                className="text-gray-600 w-full px-4 py-3 outline-none border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors text-sm"
                                placeholder="Enter section title (e.g., 'Waves')"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This appears as the main title in the featured section
                            </p>
                        </div>

                        {/* Section Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Subtitle <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.sectionSubtitle}
                                onChange={(e) => handleChange("sectionSubtitle", e.target.value)}
                                rows="3"
                                className="text-gray-600 w-full px-4 py-3 outline-none border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors text-sm resize-none"
                                placeholder="Enter section subtitle"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This appears below the main title
                            </p>
                        </div>

                        {/* Your Waves Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Waves Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.yourWavesTitle}
                                onChange={(e) => handleChange("yourWavesTitle", e.target.value)}
                                className="text-gray-600 w-full px-4 py-3 outline-none border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors text-sm"
                                placeholder="Enter 'Your Waves' title"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This appears as the title of the waves list section
                            </p>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t-2 border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-[var(--primary)] text-black rounded-lg hover:bg-primary/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm w-full sm:w-auto"
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

export default WaveSectionTextEditor;