"use client";

// import ImageGrid from "@/components/studio/ImageGrid";
// import ImageList from "@/components/studio/ImageList";
// import Lightbox from "@/components/studio/Lightbox";
import {
    ArrowLeft,
    Camera,
    Download,
    Filter,
    Grid,
    Image as ImageIcon,
    List,
    Search,
    Share2,
    Trash2,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
// import EmptyState from "@/components/ui/EmptyState";
import { api } from "../../lib/api";

export default function GalleryPage() {
    const router = useRouter();
    const [studioData, setStudioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPhotos, setSelectedPhotos] = useState(new Set());
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [filter, setFilter] = useState("all");

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
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (!confirm("Are you sure you want to delete this photo?")) return;

        try {
            await api.delete(`/api/studios/photos/${photoId}`);
            fetchStudioData();
            // Remove from selected if it was selected
            const newSelected = new Set(selectedPhotos);
            newSelected.delete(photoId);
            setSelectedPhotos(newSelected);
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Failed to delete photo");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedPhotos.size === 0) return;

        if (!confirm(`Delete ${selectedPhotos.size} selected photos?`)) return;

        try {
            for (const photoId of selectedPhotos) {
                await api.delete(`/api/studios/photos/${photoId}`);
            }
            setSelectedPhotos(new Set());
            fetchStudioData();
        } catch (error) {
            console.error("Error deleting photos:", error);
            alert("Failed to delete photos");
        }
    };

    const handlePhotoSelect = (photoId) => {
        const newSelected = new Set(selectedPhotos);
        if (newSelected.has(photoId)) {
            newSelected.delete(photoId);
        } else {
            newSelected.add(photoId);
        }
        setSelectedPhotos(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedPhotos.size === filteredPhotos.length) {
            setSelectedPhotos(new Set());
        } else {
            setSelectedPhotos(new Set(filteredPhotos.map(p => p._id)));
        }
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const filteredPhotos = (studioData?.photos || [])
        .filter(photo => {
            if (filter === "recent") {
                // Mock recent filter - in real app, check upload date
                return true;
            }
            return true;
        })
        .filter(photo => {
            if (!searchQuery) return true;
            // In real app, you might have photo metadata to search
            return photo.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                photo.description?.toLowerCase().includes(searchQuery.toLowerCase());
        });

    if (loading) {
        return <LoadingSpinner message="Loading gallery..." />;
    }

    const photos = studioData?.photos || [];

    if (photos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <EmptyState
                    icon={Camera}
                    title="No Photos in Gallery"
                    description="Upload photos to create your studio gallery"
                    actionText="Upload Photos"
                    onAction={() => router.push("/dashboard/studio/media/upload")}
                />
            </div>
        );
    }

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
                            Studio Gallery
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {photos.length} photos • Manage your studio portfolio
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
                                <p className="text-xs text-gray-600">Total Photos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{selectedPhotos.size}</p>
                                <p className="text-xs text-gray-600">Selected</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/dashboard/studio/media/upload")}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Add Photos
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedPhotos.size > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {selectedPhotos.size} photos selected
                                </p>
                                <p className="text-sm text-gray-600">
                                    Select actions to perform on selected items
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Selected
                            </button>
                            <button
                                onClick={handleSelectAll}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                {selectedPhotos.size === filteredPhotos.length ? "Deselect All" : "Select All"}
                            </button>
                            <button
                                onClick={() => setSelectedPhotos(new Set())}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search photos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters and View Toggle */}
                        <div className="flex items-center gap-4">
                            {/* Filter Dropdown */}
                            <div className="relative">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : "text-gray-600"}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : "text-gray-600"}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-sm ${filter === "all"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                            All Photos
                        </button>
                        <button
                            onClick={() => setFilter("recent")}
                            className={`px-3 py-1.5 rounded-lg text-sm ${filter === "recent"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                            Recently Added
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Studio Space
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Equipment
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery Content */}
            {filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
                    <p className="text-gray-600">Try a different search term or filter</p>
                </div>
            ) : (
                <>
                    {viewMode === "grid" ? (
                        <ImageGrid
                            photos={filteredPhotos}
                            selectedPhotos={selectedPhotos}
                            onSelect={handlePhotoSelect}
                            onDelete={handleDeletePhoto}
                            onView={openLightbox}
                        />
                    ) : (
                        <ImageList
                            photos={filteredPhotos}
                            selectedPhotos={selectedPhotos}
                            onSelect={handlePhotoSelect}
                            onDelete={handleDeletePhoto}
                            onView={openLightbox}
                        />
                    )}

                    {/* Info Bar */}
                    <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
                                <p className="text-sm text-gray-600">Total Photos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {5 - photos.length}
                                </p>
                                <p className="text-sm text-gray-600">Remaining Slots</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {selectedPhotos.size}
                                </p>
                                <p className="text-sm text-gray-600">Currently Selected</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                photos={filteredPhotos}
                currentIndex={currentImageIndex}
                onNext={() => setCurrentImageIndex(prev =>
                    prev < filteredPhotos.length - 1 ? prev + 1 : 0
                )}
                onPrev={() => setCurrentImageIndex(prev =>
                    prev > 0 ? prev - 1 : filteredPhotos.length - 1
                )}
                onDelete={() => {
                    handleDeletePhoto(filteredPhotos[currentImageIndex]._id);
                    setLightboxOpen(false);
                }}
            />
        </div>
    );
}