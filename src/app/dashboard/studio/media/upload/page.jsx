// app/dashboard/studio/upload/page.jsx
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
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

export default function UploadMediaPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("photos");
  const [studioData, setStudioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/studios/profile");
      setStudioData(response.data);
    } catch (error) {
      console.error("Error fetching studio data:", error);
      toast.error("Failed to load studio data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);

    // 🔥 FIX: Validate files
    const validFiles = fileArray.filter((file) => {
      if (activeTab === "photos") {
        const isValidType = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isValidType && isValidSize;
      } else {
        const isValidType = [
          "audio/mpeg",
          "audio/wav",
          "audio/mp3",
          "audio/flac",
        ].includes(file.type);
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
        return isValidType && isValidSize;
      }
    });

    if (validFiles.length === 0) {
      setError(
        `No valid ${activeTab} files selected. Please check file types and sizes.`,
      );
      return;
    }

    if (validFiles.length !== fileArray.length) {
      setError(
        `${fileArray.length - validFiles.length} file(s) were invalid and removed.`,
      );
    }

    // 🔥 FIX: Check photo limit
    if (activeTab === "photos") {
      const currentCount = studioData?.photos?.length || 0;
      if (currentCount + validFiles.length > 5) {
        setError(`You can only upload ${5 - currentCount} more photos`);
        return;
      }
    }

    // 🔥 FIX: Check audio limit
    if (activeTab === "audio" && studioData?.audioFile) {
      setError(
        "You already have an audio file. Delete it first to upload a new one.",
      );
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setError("");
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
        selectedFiles.forEach((file) => {
          formData.append("photos", file);
        });
      } else {
        formData.append("audio", selectedFiles[0]);
      }

      // 🔥 FIX: Real progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 200);

      const endpoint =
        activeTab === "photos" ? "/api/studios/photos" : "/api/studios/audio";
      const response = await api.upload(endpoint, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // 🔥 FIX: Show success message
      if (activeTab === "photos") {
        setSuccess(`${selectedFiles.length} photo(s) uploaded successfully!`);
        toast.success(`${selectedFiles.length} photo(s) uploaded`);
      } else {
        setSuccess("Audio file uploaded successfully!");
        toast.success("Audio uploaded successfully");
      }

      // 🔥 FIX: Refresh data
      await fetchStudioData();

      // 🔥 FIX: Clear selected files
      setSelectedFiles([]);

      // 🔥 FIX: Redirect after success
      setTimeout(() => {
        router.push("/dashboard/studio/media");
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Upload failed. Please try again.");
      setUploadProgress(0);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading studio data...</p>
        </div>
      </div>
    );
  }

  const photoCount = studioData?.photos?.length || 0;
  const audioFile = studioData?.audioFile;
  const maxPhotos = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/studio/media")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
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
            <div
              className={`px-4 py-2 rounded-xl ${
                photoCount === maxPhotos
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <span className="text-sm font-medium">
                {photoCount}/{maxPhotos} Photos
              </span>
            </div>
            <div
              className={`px-4 py-2 rounded-xl ${
                audioFile
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <span className="text-sm font-medium">
                Audio: {audioFile ? "✓" : "✗"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Progress */}
      {photoCount > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Storage Used
            </span>
            <span className="text-sm font-medium text-gray-900">
              {photoCount}/{maxPhotos}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                photoCount === maxPhotos
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : photoCount >= 3
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
              }`}
              style={{ width: `${(photoCount / maxPhotos) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs mt-2">
            {photoCount === maxPhotos ? (
              <span className="text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Storage full. Delete some photos to upload more.
              </span>
            ) : photoCount >= 3 ? (
              <span className="text-yellow-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {maxPhotos - photoCount} slot
                {maxPhotos - photoCount !== 1 ? "s" : ""} remaining
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {maxPhotos - photoCount} slot
                {maxPhotos - photoCount !== 1 ? "s" : ""} available
              </span>
            )}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveTab("photos");
                setSelectedFiles([]);
                setError("");
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === "photos"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Camera className="w-4 h-4" />
              Upload Photos
            </button>
            <button
              onClick={() => {
                setActiveTab("audio");
                setSelectedFiles([]);
                setError("");
              }}
              disabled={!!audioFile}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === "audio"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                  : audioFile
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Headphones className="w-4 h-4" />
              Upload Audio {audioFile && "(Already added)"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Area */}
        <div className="lg:col-span-2 space-y-6">
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
          {uploading && <UploadProgress progress={uploadProgress} />}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Upload Failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Success!</p>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={
              selectedFiles.length === 0 ||
              uploading ||
              (activeTab === "photos" && photoCount >= maxPhotos) ||
              (activeTab === "audio" && audioFile)
            }
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              selectedFiles.length === 0 ||
              uploading ||
              (activeTab === "photos" && photoCount >= maxPhotos) ||
              (activeTab === "audio" && audioFile)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                  ? `Upload ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? "s" : ""}`
                  : "Upload Audio Sample"}
              </>
            )}
          </button>
        </div>

        {/* Right Column - Preview & Info */}
        <div className="space-y-6">
          {/* Preview Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              {activeTab === "photos" ? (
                <Camera className="w-5 h-5 text-blue-600" />
              ) : (
                <Headphones className="w-5 h-5 text-purple-600" />
              )}
              {activeTab === "photos" ? "Photo Preview" : "Audio Preview"}
            </h3>

            {selectedFiles.length > 0 ? (
              <div className="space-y-4">
                {activeTab === "photos" ? (
                  <>
                    {selectedFiles.slice(0, 3).map((file, index) => (
                      <ImagePreview
                        key={index}
                        file={file}
                        index={index}
                        onRemove={handleRemoveFile}
                      />
                    ))}
                    {selectedFiles.length > 3 && (
                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                        <p className="text-sm font-medium text-blue-700">
                          +{selectedFiles.length - 3} more photo
                          {selectedFiles.length - 3 !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <AudioPreview
                    file={selectedFiles[0]}
                    index={0}
                    onRemove={handleRemoveFile}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "photos" ? (
                    <Image className="w-10 h-10 text-gray-500" />
                  ) : (
                    <Music className="w-10 h-10 text-gray-500" />
                  )}
                </div>
                <p className="text-gray-600 font-medium">No files selected</p>
                <p className="text-sm text-gray-500 mt-1">
                  Select files to see preview
                </p>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {activeTab === "photos"
                ? "📸 Photo Guidelines"
                : "🎵 Audio Guidelines"}
            </h3>
            <ul className="space-y-3">
              {activeTab === "photos" ? (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Maximum <span className="font-bold">5 photos</span> total
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Maximum <span className="font-bold">10MB</span> per photo
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Supported formats:{" "}
                      <span className="font-bold">JPG, PNG, WebP</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <span className="w-5 h-5 flex-shrink-0">💡</span>
                    <span>Use high-resolution, well-lit photos</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Maximum <span className="font-bold">1 audio file</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Maximum <span className="font-bold">50MB</span> file size
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Supported formats:{" "}
                      <span className="font-bold">MP3, WAV, FLAC</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <span className="w-5 h-5 flex-shrink-0">💡</span>
                    <span>Upload your best quality work</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Current Status */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                📊
              </span>
              Current Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 opacity-80" />
                  <span>Photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{photoCount}</span>
                  <span className="text-white/80">/5</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 opacity-80" />
                  <span>Audio Sample</span>
                </div>
                <span
                  className={`font-bold px-3 py-1 rounded-full text-sm ${
                    audioFile
                      ? "bg-green-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {audioFile ? "✓ Added" : "Not added"}
                </span>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="opacity-90">Profile Completeness</span>
                  <span className="font-bold text-xl">
                    {photoCount > 0 && audioFile
                      ? "100%"
                      : photoCount > 0
                        ? "75%"
                        : audioFile
                          ? "50%"
                          : "25%"}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{
                      width:
                        photoCount > 0 && audioFile
                          ? "100%"
                          : photoCount > 0
                            ? "75%"
                            : audioFile
                              ? "50%"
                              : "25%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
