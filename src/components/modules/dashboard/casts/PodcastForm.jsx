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
    handleApiError
}) => {
    const [formData, setFormData] = useState({
        title: editingItem?.title || "",
        thumbnail: editingItem?.thumbnail || null,
        youtubeUrl: editingItem?.youtubeUrl || "",
        description: editingItem?.description || "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.youtubeUrl.trim()) {
            errors.youtubeUrl = "YouTube URL is required";
        }

        if (!editingItem && !formData.thumbnail) {
            errors.thumbnail = "Thumbnail is required for new podcasts";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (file) => {
        setFormData({ ...formData, thumbnail: file });
        setFormErrors({ ...formErrors, thumbnail: "" });
    };

    const clearThumbnail = () => {
        setFormData({ ...formData, thumbnail: null });
    };

    const handleFormDataChange = (newFormData) => {
        setFormData(newFormData);
    };

    const handleFormErrorsChange = (newFormErrors) => {
        setFormErrors(newFormErrors);
    };

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
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };

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
                toast.success("Podcast updated successfully!");
            } else {
                response = await axios.post(`${API_BASE}/api/casts`, fd, { headers });
                toast.success("Podcast added successfully!");
            }

            onSubmit();
        } catch (error) {
            toast.error(handleApiError(error, "Failed to save podcast"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {editingItem ? 'Edit Podcast' : 'Add New Podcast'}
            </h2>

            <form onSubmit={handleSubmit}>
                <PodcastFormFields
                    formData={formData}
                    formErrors={formErrors}
                    editingItem={editingItem}
                    onFormDataChange={handleFormDataChange}
                    onFormErrorsChange={handleFormErrorsChange}
                    onFileChange={handleFileChange}
                    onClearThumbnail={clearThumbnail}
                />

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
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
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {editingItem ? (
                            <>
                                <Edit className="w-4 h-4" />
                                {submitting ? 'Updating...' : 'Update Podcast'}
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                {submitting ? 'Adding...' : 'Add Podcast'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PodcastForm;
