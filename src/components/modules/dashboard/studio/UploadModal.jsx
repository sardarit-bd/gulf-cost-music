"use client";

import { api } from "@/app/dashboard/studio/lib/api";
import {
    AlertCircle,
    Camera,
    File,
    Headphones,
    Image as ImageIcon,
    Loader2,
    Music,
    Upload,
    X
} from "lucide-react";
import { useRef, useState } from "react";

export default function UploadModal({
    isOpen,
    onClose,
    onSuccess,
    currentPhotoCount,
    maxPhotos,
    hasAudio
}) {
    const [activeTab, setActiveTab] = useState("photos");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (files) => {
        const fileList = Array.from(files);

        if (activeTab === "photos") {
            // Check if adding these files would exceed limit
            if (currentPhotoCount + fileList.length > maxPhotos) {
                setError(`You can only upload ${maxPhotos - currentPhotoCount} more photos`);
                return;
            }

            // Validate each file
            const validFiles = fileList.filter(file => {
                const isImage = file.type.startsWith("image/");
                const maxSize = 10 * 1024 * 1024; // 10MB
                return isImage && file.size <= maxSize;
            });

            if (validFiles.length === 0) {
                setError("Please select valid image files (max 10MB each)");
                return;
            }

            setSelectedFiles(prev => [...prev, ...validFiles]);

        } else {
            // Audio tab
            if (hasAudio) {
                setError("You already have an audio sample. Delete it first to upload a new one.");
                return;
            }

            if (fileList.length > 1) {
                setError("You can only upload one audio file at a time");
                return;
            }

            const file = fileList[0];
            const isAudio = file.type.startsWith("audio/");
            const maxSize = 50 * 1024 * 1024; // 50MB

            if (!isAudio || file.size > maxSize) {
                setError("Please select a valid audio file (max 50MB)");
                return;
            }

            setSelectedFiles([file]);
        }

        setError("");
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError("Please select files to upload");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setError("");

        try {
            const formData = new FormData();

            if (activeTab === "photos") {
                selectedFiles.forEach(file => {
                    formData.append("photos", file);
                });

                // Simulate progress for demo
                const interval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(interval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 300);

                await api.upload("/api/studios/photos", formData);
                clearInterval(interval);
                setUploadProgress(100);

                setTimeout(() => {
                    onSuccess();
                    resetModal();
                }, 1000);

            } else {
                // Audio upload
                formData.append("audio", selectedFiles[0]);

                const interval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(interval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 300);

                await api.upload("/api/studios/audio", formData);
                clearInterval(interval);
                setUploadProgress(100);

                setTimeout(() => {
                    onSuccess();
                    resetModal();
                }, 1000);
            }

        } catch (error) {
            setError(error.message || "Upload failed. Please try again.");
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const resetModal = () => {
        setSelectedFiles([]);
        setUploadProgress(0);
        setError("");
        setUploading(false);
    };

    const handleClose = () => {
        if (!uploading) {
            resetModal();
            onClose();
        }
    };

    const getFileSize = (size) => {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        }
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Upload Media</h2>
                        <p className="text-gray-600 mt-1">
                            Add photos or audio to showcase your studio
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={uploading}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setActiveTab("photos");
                                setSelectedFiles([]);
                                setError("");
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === "photos"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Camera className="w-4 h-4" />
                            Photos ({currentPhotoCount}/{maxPhotos})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("audio");
                                setSelectedFiles([]);
                                setError("");
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${activeTab === "audio"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Headphones className="w-4 h-4" />
                            Audio {hasAudio && "(Already added)"}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    {/* Upload Zone */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${uploading
                            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                            : activeTab === "photos" && currentPhotoCount >= maxPhotos
                                ? "border-red-300 bg-red-50 cursor-not-allowed"
                                : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple={activeTab === "photos"}
                            accept={activeTab === "photos" ? "image/*" : "audio/*"}
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                            disabled={uploading || (activeTab === "photos" && currentPhotoCount >= maxPhotos)}
                        />

                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            ) : activeTab === "photos" ? (
                                <ImageIcon className="w-8 h-8 text-blue-600" />
                            ) : (
                                <Music className="w-8 h-8 text-blue-600" />
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {uploading ? "Uploading..." :
                                activeTab === "photos" ? "Upload Studio Photos" : "Upload Audio Sample"}
                        </h3>

                        <p className="text-gray-600 mb-4">
                            {uploading
                                ? "Please wait while files are uploading..."
                                : activeTab === "photos"
                                    ? `Drag & drop or click to upload (${maxPhotos - currentPhotoCount} slots available)`
                                    : hasAudio
                                        ? "You already have an audio sample. Delete it first to upload a new one."
                                        : "Drag & drop or click to upload audio sample"
                            }
                        </p>

                        {!uploading && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                                <Upload className="w-4 h-4" />
                                Choose Files
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-4">
                            {activeTab === "photos"
                                ? "Supports JPG, PNG, WebP • Max 10MB each"
                                : "Supports MP3, WAV, FLAC • Max 50MB"
                            }
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Selected Files ({selectedFiles.length})
                            </h4>
                            <div className="space-y-3">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                                <File className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 truncate max-w-xs">
                                                    {file.name}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-600">
                                                        {getFileSize(file.size)}
                                                    </span>
                                                    <span className="text-xs text-gray-600">•</span>
                                                    <span className="text-xs text-green-600 font-medium">
                                                        Ready to upload
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {!uploading && (
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">Uploading...</span>
                                <span className="font-bold text-blue-600">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleClose}
                            disabled={uploading}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={
                                uploading ||
                                selectedFiles.length === 0 ||
                                (activeTab === "photos" && currentPhotoCount >= maxPhotos) ||
                                (activeTab === "audio" && hasAudio)
                            }
                            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${uploading || selectedFiles.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    {activeTab === "photos"
                                        ? `Upload ${selectedFiles.length} Photos`
                                        : "Upload Audio Sample"
                                    }
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}