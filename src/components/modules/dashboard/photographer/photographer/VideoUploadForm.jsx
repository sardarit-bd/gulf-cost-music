import { ExternalLink, FileVideo, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const VideoUploadForm = ({
    isOpen,
    onClose,
    onUpload,
    onAddURL,
    uploadingVideos,
    videosCount,
    maxVideos = 1
}) => {
    const [activeTab, setActiveTab] = useState("upload");
    const [file, setFile] = useState(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 200 * 1024 * 1024) {
                toast.error("Video must be under 200MB");
                return;
            }

            setFile(selectedFile);

            setVideoTitle("");
        }
    };


    const handleUpload = async () => {
        if (activeTab === "upload" && !file) {
            toast.error("Please select a video file");
            return;
        }

        if (activeTab === "url" && !videoUrl.trim()) {
            toast.error("Please enter a video URL");
            return;
        }

        if (!videoTitle.trim()) {
            toast.error("Please enter a video title");
            return;
        }

        if (activeTab === "upload") {
            await onUpload(file, videoTitle, videoDescription);
        } else {
            await onAddURL(videoUrl, videoTitle, videoDescription);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-5xl transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Upload size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Add Video</h3>
                                <p className="text-gray-600 text-sm">
                                    Upload video file or add video URL
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab("upload")}
                            className={`flex-1 py-3 font-medium transition ${activeTab === "upload"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab("url")}
                            className={`flex-1 py-3 font-medium transition ${activeTab === "url"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Add URL
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Title & Description Fields (Common for both tabs) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video Title *
                                </label>
                                <input
                                    type="text"
                                    value={videoTitle}
                                    onChange={(e) => setVideoTitle(e.target.value)}
                                    placeholder="Enter video title"
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={videoDescription}
                                    onChange={(e) => setVideoDescription(e.target.value)}
                                    placeholder="Brief description of the video..."
                                    rows="3"
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                    maxLength={500}
                                />
                            </div>
                        </div>

                        {/* Upload File Section */}
                        {activeTab === "upload" && (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <Upload size={32} className="text-blue-600" />
                                    </div>
                                    <p className="text-gray-600 mb-4">Select video file to upload</p>
                                    <label className="cursor-pointer">
                                        <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition shadow-sm">
                                            Browse Files
                                        </div>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            hidden
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                    {file && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg w-full max-w-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileVideo className="text-blue-600" size={20} />
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setFile(null)}
                                                    className="p-1 text-gray-400 hover:text-red-500"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* URL Section */}
                        {activeTab === "url" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video URL *
                                </label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://example.com/video.mp4 or YouTube URL"
                                        className="w-full pl-12 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Supports MP4, MOV, AVI, WebM, MKV formats or YouTube URLs
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition border border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploadingVideos || videosCount >= maxVideos}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2 ${uploadingVideos || videosCount >= maxVideos
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600"
                                    }`}
                            >
                                {uploadingVideos ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Add Video
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};