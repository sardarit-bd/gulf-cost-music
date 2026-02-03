"use client";

import { useRef } from "react";
import { Upload, X, Image, Music, File } from "lucide-react";

export default function FileUploader({
    activeTab,
    onFileSelect,
    selectedFiles,
    onRemoveFile,
    maxPhotos,
    currentPhotoCount,
    hasAudio
}) {
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        onFileSelect(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const getAcceptTypes = () => {
        return activeTab === "photos"
            ? "image/*"
            : "audio/*";
    };

    const getMaxFiles = () => {
        return activeTab === "photos"
            ? maxPhotos - currentPhotoCount
            : hasAudio ? 0 : 1;
    };

    const isDisabled = activeTab === "photos"
        ? currentPhotoCount >= maxPhotos
        : hasAudio;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClick}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDisabled
                        ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                        : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={activeTab === "photos"}
                    accept={getAcceptTypes()}
                    onChange={(e) => onFileSelect(e.target.files)}
                    className="hidden"
                    disabled={isDisabled}
                />

                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {activeTab === "photos" ? (
                        <Image className="w-10 h-10 text-blue-600" />
                    ) : (
                        <Music className="w-10 h-10 text-blue-600" />
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeTab === "photos" ? "Upload Studio Photos" : "Upload Audio Sample"}
                </h3>

                <p className="text-gray-600 mb-4">
                    {activeTab === "photos"
                        ? `Drag & drop or click to upload (${maxPhotos - currentPhotoCount} slots available)`
                        : "Drag & drop or click to upload audio sample"
                    }
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                    <Upload className="w-4 h-4" />
                    Choose Files
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    {activeTab === "photos"
                        ? "Supports JPG, PNG, WebP • Max 10MB each"
                        : "Supports MP3, WAV, FLAC • Max 50MB"
                    }
                </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4">
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
                                        <p className="text-sm text-gray-600">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveFile(index)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}