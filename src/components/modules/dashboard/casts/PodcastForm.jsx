import axios from "axios";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PodcastFormFields from "./PodcastFormFields";

const PodcastForm = ({
    editingItem,
    token,
    onSubmit,
    onCancel,
    handleApiError,
}) => {
    const [formData, setFormData] = useState({
        title: editingItem?.title || "",
        description: editingItem?.description || "",
        videoType: editingItem?.videoType || "youtube",
        youtubeUrl: editingItem?.youtubeUrl || "",
        thumbnail: editingItem?.thumbnail || "",
        videoUrl: editingItem?.video || editingItem?.videoUrl || "",
        videoPublicId: editingItem?.videoPublicId || "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    // =====================
    // VALIDATION
    // =====================
    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (formData.videoType === "youtube") {
            if (!formData.youtubeUrl.trim()) {
                errors.youtubeUrl = "YouTube URL is required";
            }
        }

        if (formData.videoType === "upload") {
            if (!editingItem && (!formData.videoUrl || !formData.videoPublicId)) {
                errors.videoUrl = "Please upload a video first";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // =====================
    // FORM HELPERS
    // =====================
    const handleFormDataChange = (newData) => {
        setFormData(newData);
    };

    const handleFormErrorsChange = (newErrors) => {
        setFormErrors(newErrors);
    };

    const clearThumbnail = () => {
        setFormData((prev) => ({
            ...prev,
            thumbnail: "",
        }));
    };

    const handleThumbnailChange = (file) => {
        setFormData((prev) => ({
            ...prev,
            thumbnail: file,
        }));
    };



    // =====================
    // SUBMIT
    // =====================
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

        setSubmitting(true);

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                videoType: formData.videoType,
            };

            if (formData.videoType === "youtube") {
                payload.youtubeUrl = formData.youtubeUrl.trim();
            }

            if (formData.videoType === "upload") {
                payload.videoUrl = formData.videoUrl;
                payload.videoPublicId = formData.videoPublicId;
            }

            if (formData.thumbnail) {
                payload.thumbnail = formData.thumbnail;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (editingItem) {
                await axios.put(
                    `${API_BASE}/api/casts/${editingItem._id}`,
                    payload,
                    { headers }
                );
                toast.success("Podcast updated successfully!");
            } else {
                await axios.post(`${API_BASE}/api/casts`, payload, { headers });
                toast.success("Podcast added successfully!");
            }

            onSubmit();
        } catch (error) {
            console.error(error);
            toast.error(handleApiError(error, "Failed to save podcast"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {editingItem ? "Edit Podcast" : "Add New Podcast"}
            </h2>

            <form onSubmit={handleSubmit}>
                <PodcastFormFields
                    formData={formData}
                    formErrors={formErrors}
                    editingItem={editingItem}
                    onFormDataChange={handleFormDataChange}
                    onFormErrorsChange={handleFormErrorsChange}
                    onFileChange={handleThumbnailChange}
                    onClearThumbnail={clearThumbnail}
                />



                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-300">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {editingItem ? (
                            <>
                                <Edit className="w-4 h-4" />
                                {submitting ? "Updating..." : "Update Podcast"}
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                {submitting ? "Adding..." : "Add Podcast"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PodcastForm;
