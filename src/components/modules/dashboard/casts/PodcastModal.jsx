"use client";

import axios from "axios";
import { Edit, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import PodcastFormFields from "./PodcastFormFields";

export default function PodcastModal({ isOpen, onClose, editingItem, token, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        videoType: "youtube",
        youtubeUrl: "",
        thumbnail: "",
        videoUrl: "",
        videoPublicId: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Add class to body to help with sidebar overlay
            document.body.classList.add("modal-open");
        } else {
            document.body.style.overflow = "unset";
            document.body.classList.remove("modal-open");
        }
        return () => {
            document.body.style.overflow = "unset";
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                title: editingItem.title || "",
                description: editingItem.description || "",
                videoType: editingItem.videoType || "youtube",
                youtubeUrl: editingItem.youtubeUrl || "",
                thumbnail: editingItem.thumbnail || "",
                videoUrl: editingItem.video || editingItem.videoUrl || "",
                videoPublicId: editingItem.videoPublicId || "",
            });
        } else {
            setFormData({
                title: "",
                description: "",
                videoType: "youtube",
                youtubeUrl: "",
                thumbnail: "",
                videoUrl: "",
                videoPublicId: "",
            });
        }
        setFormErrors({});
    }, [editingItem, isOpen]);

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
                payload.video = formData.videoUrl;
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
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save podcast");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !mounted) return null;

    // Modal content
    const modalContent = (
        <>
            {/* Backdrop - Extremely high z-index to cover everything including sidebar */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                style={{ zIndex: 99999 }}
                onClick={onClose}
            />

            {/* Modal Container - Even higher z-index */}
            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto" style={{ zIndex: 100000 }}>
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-popup">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingItem ? "Edit Podcast" : "Add New Podcast"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {editingItem ? "Update podcast information" : "Fill in the details to add a new podcast"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
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

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : editingItem ? (
                                        <Edit className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    {submitting ? "Saving..." : editingItem ? "Update Podcast" : "Add Podcast"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes modal-popup {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-modal-popup {
                    animation: modal-popup 0.2s ease-out;
                }
                
                /* When modal is open, make sure body has proper styling */
                body.modal-open {
                    overflow: hidden;
                }
                
                /* Ensure sidebar doesn't receive pointer events when modal is open */
                body.modal-open .sidebar,
                body.modal-open [class*="sidebar"],
                body.modal-open [class*="Sidebar"] {
                    pointer-events: none !important;
                    filter: blur(2px);
                    opacity: 0.8;
                }
            `}</style>
        </>
    );

    // Use React Portal to render modal directly to document.body
    return createPortal(modalContent, document.body);
}