"use client";

import { Image as ImageIcon, Link, Upload, Video, X, Youtube } from "lucide-react";

const PodcastFormFields = ({
    formData,
    formErrors,
    editingItem,
    onFormDataChange,
    onFormErrorsChange,
    onFileChange,
    onClearThumbnail,
}) => {
    const handleVideoTypeChange = (type) => {
        const updatedData = {
            ...formData,
            videoType: type,
            youtubeUrl: type === "youtube" ? formData.youtubeUrl : "",
            videoFile: type === "upload" && editingItem?.videoType === "upload" ? null : formData.videoFile,
        };
        onFormDataChange(updatedData);

        const updatedErrors = { ...formErrors };
        if (type === "youtube") {
            delete updatedErrors.videoFile;
        } else {
            delete updatedErrors.youtubeUrl;
        }
        onFormErrorsChange(updatedErrors);
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ["video/mp4", "video/mov", "video/avi", "video/webm", "video/mkv"];
            const maxSize = 200 * 1024 * 1024; // 200MB

            if (!validTypes.includes(file.type)) {
                onFormErrorsChange({
                    ...formErrors,
                    videoFile: "Invalid video format. Use MP4, MOV, AVI, MKV, or WebM"
                });
                return;
            }

            if (file.size > maxSize) {
                onFormErrorsChange({
                    ...formErrors,
                    videoFile: "File too large. Maximum size is 200MB"
                });
                return;
            }

            onFormDataChange({ ...formData, videoFile: file });
            onFormErrorsChange({ ...formErrors, videoFile: "" });
        }
    };

    const clearVideoFile = () => {
        onFormDataChange({ ...formData, videoFile: null });
        onFormErrorsChange({ ...formErrors, videoFile: "" });
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileChange(file);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Video Type Selection */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Source *
                </label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => handleVideoTypeChange("youtube")}
                        className={`flex-1 py-3 px-4 text-gray-700 border rounded-lg flex flex-col items-center gap-2 transition ${formData.videoType === "youtube"
                            ? "border-[var(--primary)] bg-primary/5 text-black"
                            : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <Youtube className="w-6 h-6" />
                        <span>YouTube Link</span>
                    </button>
                    {/* <button
                        type="button"
                        onClick={() => handleVideoTypeChange("upload")}
                        className={`flex-1 py-3 px-4 text-gray-700 border rounded-lg flex flex-col items-center gap-2 transition ${formData.videoType === "upload"
                            ? "border-[var(--primary)] bg-primary/5 text-black"
                            : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <Upload className="w-6 h-6" />
                        <span>Upload Video</span>
                    </button> */}
                </div>
            </div>

            {/* Title Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Podcast Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                        onFormDataChange({ ...formData, title: e.target.value });
                        onFormErrorsChange({ ...formErrors, title: "" });
                    }}
                    className={`w-full px-4 py-2 border text-gray-600 rounded-lg focus:border-transparent ${formErrors.title ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="Enter podcast title"
                />
                {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
            </div>

            {/* YouTube URL or Video Upload based on selection */}
            {formData.videoType === "youtube" ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL *
                    </label>
                    <input
                        type="url"
                        value={formData.youtubeUrl}
                        onChange={(e) => {
                            onFormDataChange({ ...formData, youtubeUrl: e.target.value });
                            onFormErrorsChange({ ...formErrors, youtubeUrl: "" });
                        }}
                        className={`w-full px-4 py-2 border text-gray-600 rounded-lg focus:border-transparent ${formErrors.youtubeUrl ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {formErrors.youtubeUrl && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.youtubeUrl}</p>
                    )}
                    {formData.youtubeUrl && !formErrors.youtubeUrl && (
                        <div className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                            <Link className="w-4 h-4" />
                            Valid YouTube link
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video File {!editingItem && "*"}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {formData.videoFile ? (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Video className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium truncate max-w-xs">{formData.videoFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearVideoFile}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : editingItem && editingItem.videoType === "upload" ? (
                            <div className="text-center">
                                <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600">
                                    Current uploaded video will be kept
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload new file below to replace
                                </p>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Drag & drop your video file or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Supports MP4, MOV, AVI, MKV, WebM (Max 200MB)
                                </p>
                            </>
                        )}

                        <input
                            type="file"
                            id="video-upload"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="video-upload"
                            className={`inline-block px-6 py-2 rounded-lg transition cursor-pointer ${formData.videoFile
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 mt-3"
                                : "bg-[var(--primary)] text-white hover:bg-primary/80"
                                }`}
                        >
                            {formData.videoFile ? "Change Video" : "Choose Video"}
                        </label>
                    </div>
                    {formErrors.videoFile && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.videoFile}</p>
                    )}
                </div>
            )}

            {/* Description Field */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 focus:border-transparent"
                    placeholder="Enter podcast description (optional)"
                />
            </div>

            {/* Thumbnail Upload (Optional) */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Thumbnail (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {formData.thumbnail ? (
                        <div className="flex items-center gap-4">
                            {formData.thumbnail instanceof File ? (
                                <img
                                    src={URL.createObjectURL(formData.thumbnail)}
                                    alt="Thumbnail preview"
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            ) : (
                                <img
                                    src={formData.thumbnail}
                                    alt="Thumbnail"
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                    {formData.thumbnail instanceof File
                                        ? formData.thumbnail.name
                                        : "Existing thumbnail"}
                                </p>
                                <button
                                    type="button"
                                    onClick={onClearThumbnail}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Remove thumbnail
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <input
                                type="file"
                                id="thumbnail-upload"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                className="hidden"
                            />
                            <label
                                htmlFor="thumbnail-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600">
                                    Click to upload a custom thumbnail
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Recommended: 1280x720px (16:9 ratio), Max 5MB
                                </p>
                            </label>
                        </>
                    )}
                </div>
                {formErrors.thumbnail && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.thumbnail}</p>
                )}
            </div>
        </div>
    );
};

export default PodcastFormFields;