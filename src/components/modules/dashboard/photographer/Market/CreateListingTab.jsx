"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import ActionButtons from "./ActionButtons";
import ListingForm from "./ListingForm";
import MediaUpload from "./MediaUpload";

export default function CreateListingTab({
    API_BASE,
    existingItem,
    onSuccess,
    onDelete,
    user
}) {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: existingItem?.title || "",
        description: existingItem?.description || "",
        price: existingItem?.price ? String(existingItem.price) : "",
        location: existingItem?.location || "",
        status: existingItem?.status || "active",
    });
    const [photoFiles, setPhotoFiles] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [photosToDelete, setPhotosToDelete] = useState([]);
    const [deleteExistingVideo, setDeleteExistingVideo] = useState(false);
    const [existingPhotos, setExistingPhotos] = useState(existingItem?.photos || []);
    const [hasExistingVideo, setHasExistingVideo] = useState(existingItem?.videos?.length > 0);
    const [existingVideo, setExistingVideo] = useState(existingItem?.videos?.[0] || null);

    const getToken = () => {
        if (typeof document !== "undefined") {
            const match = document.cookie.match(/(?:^|;)\s*token=([^;]+)/);
            return match ? match[1] : null;
        }
        return null;
    };

    const validateListingForm = () => {
        const errors = {};

        if (!formData.title?.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            errors.price = "Please enter a valid price";
        }

        if (!formData.description?.trim()) {
            errors.description = "Description is required";
        }

        if (!formData.location) {
            errors.location = "Please select a state";
        }

        const totalPhotos = existingPhotos.length + photoFiles.length;
        if (totalPhotos === 0) {
            errors.photos = "At least one photo is required";
        }

        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handlePhotoUpload = (files) => {
        const totalExistingPhotos = existingPhotos.length;
        const totalNewPhotos = photoFiles.length;
        const totalPhotos = totalExistingPhotos + totalNewPhotos;

        if (totalPhotos + files.length > 5) {
            const remainingSlots = 5 - totalPhotos;
            toast.error(`You can only upload ${remainingSlots} more photos.`);
            return;
        }

        setPhotoFiles(prev => [...prev, ...files]);
    };

    const handleVideoUpload = (file) => {
        setVideoFile(file);
        setDeleteExistingVideo(false);
    };

    const handleRemovePhoto = (index) => {
        console.log("Removing new photo at index:", index);
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
        toast.success("New photo removed");
    };

    const handleRemoveVideo = () => {
        console.log("Removing new video");
        setVideoFile(null);
        toast.success("New video removed");
    };

    const handleRemoveExistingPhoto = (photo) => {
        console.log("Removing existing photo:", photo);

        if (!photo) {
            toast.error("Invalid photo data");
            return;
        }

        // Convert photo to URL string
        const photoUrl = typeof photo === 'string' ? photo : photo.url || photo;

        // Add to deletion list
        setPhotosToDelete(prev => {
            const alreadyExists = prev.includes(photoUrl);
            if (alreadyExists) {
                return prev;
            }
            return [...prev, photoUrl];
        });

        // Remove from UI
        setExistingPhotos(prev =>
            prev.filter(p => {
                const pUrl = typeof p === 'string' ? p : p.url || p;
                return pUrl !== photoUrl;
            })
        );

        toast.success("Photo marked for deletion. Click Save to confirm.");
    };

    const handleRemoveExistingVideo = () => {
        console.log("Removing existing video:", existingVideo);

        if (existingVideo) {
            setDeleteExistingVideo(true);
            setHasExistingVideo(false);
            setExistingVideo(null);
            toast.success("Video marked for deletion. Click Save to confirm.");
        } else {
            toast.error("No existing video to delete");
        }
    };

    const handleSubmit = async () => {
        const validationErrors = validateListingForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            const token = getToken();
            if (!token) {
                throw new Error("Please sign in again");
            }

            /* =========================
               CREATE FORMDATA
            ========================= */
            const submitFormData = new FormData();

            // Basic fields
            submitFormData.append("title", formData.title.trim());
            submitFormData.append("description", formData.description.trim());
            submitFormData.append(
                "price",
                parseFloat(formData.price).toFixed(2)
            );
            submitFormData.append("location", formData.location);
            submitFormData.append("status", formData.status);

            /* =========================
               PHOTOS DELETE (🔥 FIXED)
            ========================= */
            if (photosToDelete.length > 0) {
                console.log("Sending photos to delete:", photosToDelete);
                photosToDelete.forEach((photoUrl, index) => {
                    // Send as simple object with URL
                    submitFormData.append(
                        `photosToDelete[${index}]`,
                        JSON.stringify({ url: photoUrl })
                    );
                });
            }

            /* =========================
               VIDEO DELETE (🔥 FIXED)
            ========================= */
            if (deleteExistingVideo === true) {
                console.log("Sending video delete flag");
                submitFormData.append(
                    "deleteExistingVideo",
                    JSON.stringify({ delete: true })
                );
            }

            /* =========================
               NEW PHOTOS
            ========================= */
            photoFiles.forEach((file) => {
                submitFormData.append("photos", file);
            });

            /* =========================
               NEW VIDEO
            ========================= */
            if (videoFile) {
                submitFormData.append("video", videoFile);
            }

            /* =========================
               DEBUG (REMOVE LATER)
            ========================= */
            console.log("Submitting FormData:");
            for (let [key, value] of submitFormData.entries()) {
                if (value instanceof File) {
                    console.log(key, `[File: ${value.name}]`);
                } else {
                    console.log(key, value);
                }
            }

            /* =========================
               API CALL
            ========================= */
            const endpoint = `${API_BASE}/api/market/me`;
            const method = existingItem ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitFormData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Save failed");
            }

            /* =========================
               SUCCESS - Reset states
            ========================= */
            setPhotosToDelete([]);
            setDeleteExistingVideo(false);
            setPhotoFiles([]);
            setVideoFile(null);

            // Update existing photos and video from response
            setExistingPhotos(data.data.photos || []);
            setHasExistingVideo(data.data.videos?.length > 0);
            setExistingVideo(data.data.videos?.[0] || null);

            onSuccess(data.data);

            if (!existingItem) {
                setFormData({
                    title: "",
                    description: "",
                    price: "",
                    location: "",
                    status: "active",
                });
            }

            toast.success(
                existingItem
                    ? "Listing updated successfully!"
                    : "Listing created successfully!"
            );

        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.message || "Failed to save listing");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {existingItem ? "Edit Listing" : "Create New Listing"}
                </h2>
                <p className="text-gray-600">
                    Fill in the details below to {existingItem ? "update" : "create"} your marketplace listing
                </p>
            </div>

            <ListingForm
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                onSelectChange={handleSelectChange}
                existingItem={existingItem}
            />

            <MediaUpload
                existingItem={{
                    ...existingItem,
                    photos: existingPhotos,
                    videos: hasExistingVideo ? [existingVideo] : []
                }}
                photoFiles={photoFiles}
                videoFile={videoFile}
                onPhotoUpload={handlePhotoUpload}
                onVideoUpload={handleVideoUpload}
                onRemovePhoto={handleRemovePhoto}
                onRemoveVideo={handleRemoveVideo}
                onRemoveExistingPhoto={handleRemoveExistingPhoto}
                onRemoveExistingVideo={handleRemoveExistingVideo}
                errors={errors}
            />

            <ActionButtons
                existingItem={existingItem}
                loading={loading}
                onSave={handleSubmit}
                onDelete={onDelete}
                onCancel={() => existingItem && onSuccess(existingItem)}
            />
        </div>
    );
}