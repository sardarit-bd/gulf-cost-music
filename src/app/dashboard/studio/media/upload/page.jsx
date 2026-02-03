"use client";

import AudioPreview from "@/components/modules/dashboard/studio/AudioPreview";
import FileUploader from "@/components/modules/dashboard/studio/FileUploader";
import ImagePreview from "@/components/modules/dashboard/studio/ImagePreview";
import UploadProgress from "@/components/modules/dashboard/studio/UploadProgress";
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle,
    Headphones,
    Image,
    Loader2,
    Music,
    Upload
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function UploadMediaPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("photos");
    const [studioData, setStudioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchStudioData();
    }, []);

    const fetchStudioData = async () => {
        try {
            const response = await api.get("/api/studios/profile");
            setStudioData(response.data);
        } catch (error) {
            console.error("Error fetching studio data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (files) => {
        const validFiles = Array.from(files).filter(file => {
            if (activeTab === "photos") {
                const isImage = file.type.startsWith("image/");
                const maxSize = 10 * 1024 * 1024; // 10MB
                return isImage && file.size <= maxSize;
            } else {
                const isAudio = file.type.startsWith("audio/");
                const maxSize = 50 * 1024 * 1024; // 50MB
                return isAudio && file.size <= maxSize;
            }
        });

        if (activeTab === "photos") {
            const currentCount = studioData?.photos?.length || 0;
            if (currentCount + validFiles.length > 5) {
                setError(`You can only upload ${5 - currentCount} more photos`);
                return;
            }
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
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
        setSuccess("");

        try {
            const formData = new FormData();

            if (activeTab === "photos") {
                selectedFiles.forEach(file => {
                    formData.append("photos", file);
                });

                // Simulate progress
                const interval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(interval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 300);

                const response = await api.upload("/api/studios/photos", formData);
                clearInterval(interval);
                setUploadProgress(100);

                setSuccess(`${selectedFiles.length} photos uploaded successfully!`);
                setSelectedFiles([]);
                fetchStudioData();

                setTimeout(() => {
                    router.push("/dashboard/studio/media");
                }, 1500);

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

                const response = await api.upload("/api/studios/audio", formData);
                clearInterval(interval);
                setUploadProgress(100);

                setSuccess("Audio file uploaded successfully!");
                setSelectedFiles([]);
                fetchStudioData();

                setTimeout(() => {
                    router.push("/dashboard/studio/media");
                }, 1500);
            }
        } catch (error) {
            setError(error.message || "Upload failed. Please try again.");
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    const photoCount = studioData?.photos?.length || 0;
    const audioFile = studioData?.audioFile;
    const maxPhotos = 5;

    const tabs = [
        { id: "photos", label: "Upload Photos", icon: Camera },
        { id: "audio", label: "Upload Audio", icon: Headphones }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push("/dashboard/studio/media")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Media
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Upload Media
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Add photos and audio to showcase your studio
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-gray-100 rounded-xl">
                            <span className="text-sm font-medium text-gray-900">
                                {photoCount}/{maxPhotos} Photos
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-gray-100 rounded-xl">
                            <span className="text-sm font-medium text-gray-900">
                                Audio: {audioFile ? "✓" : "✗"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {photoCount > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Storage Used</span>
                        <span className="text-sm font-medium text-gray-900">{photoCount}/{maxPhotos}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${photoCount === maxPhotos ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${(photoCount / maxPhotos) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {photoCount === maxPhotos ? (
                            <span className="text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Storage full. Delete some photos to upload more.
                            </span>
                        ) : photoCount >= 3 ? (
                            <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Good! {maxPhotos - photoCount} slots remaining
                            </span>
                        ) : (
                            <span className="text-yellow-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Consider adding more photos ({maxPhotos - photoCount} slots available)
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedFiles([]);
                                    setError("");
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Upload Area */}
                <div className="lg:col-span-2">
                    {/* Upload Zone */}
                    <FileUploader
                        activeTab={activeTab}
                        onFileSelect={handleFileSelect}
                        selectedFiles={selectedFiles}
                        onRemoveFile={handleRemoveFile}
                        maxPhotos={maxPhotos}
                        currentPhotoCount={photoCount}
                        hasAudio={!!audioFile}
                    />

                    {/* Upload Progress */}
                    {uploading && (
                        <UploadProgress progress={uploadProgress} />
                    )}

                    {/* Error & Success Messages */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-green-700">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploading || (activeTab === "photos" && photoCount >= maxPhotos)}
                            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${selectedFiles.length === 0 || uploading || (activeTab === "photos" && photoCount >= maxPhotos)
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Uploading... {uploadProgress}%
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

                {/* Right Column - Preview & Info */}
                <div className="space-y-6">
                    {/* Preview Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {activeTab === "photos" ? "Photo Preview" : "Audio Preview"}
                        </h3>

                        {selectedFiles.length > 0 ? (
                            activeTab === "photos" ? (
                                <div className="space-y-4">
                                    {selectedFiles.slice(0, 3).map((file, index) => (
                                        <ImagePreview key={index} file={file} index={index} />
                                    ))}
                                    {selectedFiles.length > 3 && (
                                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                                            <p className="text-sm text-gray-600">
                                                +{selectedFiles.length - 3} more photos
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <AudioPreview file={selectedFiles[0]} />
                            )
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {activeTab === "photos" ? (
                                        <Image className="w-8 h-8 text-gray-400" />
                                    ) : (
                                        <Music className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <p className="text-gray-600">No files selected yet</p>
                            </div>
                        )}
                    </div>

                    {/* Upload Guidelines */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {activeTab === "photos" ? "Photo Guidelines" : "Audio Guidelines"}
                        </h3>

                        <ul className="space-y-3">
                            {activeTab === "photos" ? (
                                <>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Maximum 5 photos total</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Max 10MB per photo</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Supported: JPG, PNG, WebP</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">High-quality, well-lit photos recommended</span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Maximum 1 audio file</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Max 50MB file size</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Supported: MP3, WAV, FLAC</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">Upload your best quality work</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Current Media Status */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-4">Current Status</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Camera className="w-5 h-5" />
                                    <span>Photos Uploaded</span>
                                </div>
                                <span className="font-bold">{photoCount}/5</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Headphones className="w-5 h-5" />
                                    <span>Audio Sample</span>
                                </div>
                                <span className="font-bold">{audioFile ? "✓ Added" : "✗ Not added"}</span>
                            </div>

                            <div className="pt-4 border-t border-white/20">
                                <div className="flex items-center justify-between">
                                    <span>Profile Completeness</span>
                                    <span className="font-bold">
                                        {photoCount > 0 && audioFile ? "100%" :
                                            photoCount > 0 ? "75%" :
                                                audioFile ? "50%" : "25%"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}