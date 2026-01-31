"use client";

import {
    Building2,
    Calendar,
    Camera,
    CheckCircle,
    DollarSign,
    Edit2,
    FileAudio,
    Grid,
    Headphones,
    Image as ImageIcon,
    List,
    LogOut,
    MapPin,
    Plus,
    Trash2,
    Upload,
    User,
    XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function StudioDashboard() {
    const router = useRouter();
    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ service: "", price: "" });
    const [editingServiceIndex, setEditingServiceIndex] = useState(null);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [uploadingAudio, setUploadingAudio] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadType, setUploadType] = useState("photos");
    const [viewMode, setViewMode] = useState("grid");

    // Fetch studio data
    useEffect(() => {
        fetchStudioData();
    }, []);

    const fetchStudioData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/signin");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                router.push("/signin");
                return;
            }

            const data = await response.json();
            if (data.success) {
                setStudio(data.data);
                setServices(data.data.services || []);
            } else {
                toast.error("Failed to load studio data");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/signin");
    };

    // Handle service operations
    const handleAddService = () => {
        if (!newService.service.trim() || !newService.price.trim()) {
            toast.error("Please fill in both service and price");
            return;
        }

        if (editingServiceIndex !== null) {
            // Update existing service
            const updatedServices = [...services];
            updatedServices[editingServiceIndex] = newService;
            setServices(updatedServices);
            setEditingServiceIndex(null);
            toast.success("Service updated");
        } else {
            // Add new service
            setServices([...services, newService]);
            toast.success("Service added");
        }

        setNewService({ service: "", price: "" });
    };

    const handleEditService = (index) => {
        setNewService(services[index]);
        setEditingServiceIndex(index);
    };

    const handleDeleteService = async (index) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);

        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/services`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ services: updatedServices }),
            });
            toast.success("Service deleted");
        } catch (error) {
            toast.error("Failed to delete service");
        }
    };

    // Handle photo upload
    const handlePhotoUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const totalPhotos = studio.photos.length + files.length;
        if (totalPhotos > 5) {
            toast.error(`Maximum 5 photos allowed. You can upload ${5 - studio.photos.length} more.`);
            return;
        }

        setUploadingPhotos(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("photos", files[i]);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/photos`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setStudio({ ...studio, photos: data.data });
                toast.success("Photos uploaded successfully");
                setShowUploadModal(false);
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploadingPhotos(false);
        }
    };

    // Handle audio upload
    const handleAudioUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/aac", "audio/flac"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid audio format. Use MP3, WAV, AAC, or FLAC");
            return;
        }

        // Check file size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast.error("File too large. Maximum 50MB");
            return;
        }

        setUploadingAudio(true);
        const formData = new FormData();
        formData.append("audio", file);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/audio`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setStudio({ ...studio, audioFile: data.data });
                toast.success("Audio uploaded successfully");
                setShowUploadModal(false);
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploadingAudio(false);
        }
    };

    // Handle photo delete
    const handleDeletePhoto = async (photoId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/photos/${photoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedPhotos = studio.photos.filter(photo => photo._id !== photoId);
                setStudio({ ...studio, photos: updatedPhotos });
                toast.success("Photo deleted");
            } else {
                toast.error("Failed to delete photo");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // Handle audio delete
    const handleDeleteAudio = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/audio`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setStudio({ ...studio, audioFile: null });
                toast.success("Audio deleted");
            } else {
                toast.error("Failed to delete audio");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (!studio) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Studio not found</h2>
                    <p className="text-gray-500 mb-4">Please create a studio profile first</p>
                    <button
                        onClick={() => router.push("/signup")}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Create Studio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-4">
                                <Building2 className="h-8 w-8 text-yellow-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{studio.name || "Studio"}</h1>
                                    <p className="text-sm text-gray-500">
                                        <MapPin className="inline h-3 w-3 mr-1" />
                                        {studio.city ? `${studio.city.charAt(0).toUpperCase() + studio.city.slice(1)}, ${studio.state}` : "Location not set"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex space-x-8">
                            {[
                                { id: "overview", label: "Overview", icon: <Grid className="h-4 w-4" /> },
                                { id: "services", label: "Services", icon: <DollarSign className="h-4 w-4" /> },
                                { id: "portfolio", label: "Portfolio", icon: <Camera className="h-4 w-4" /> },
                                { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? "border-yellow-500 text-yellow-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl shadow-sm p-6 border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total Services</p>
                                            <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                                        </div>
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Portfolio Photos</p>
                                            <p className="text-2xl font-bold text-gray-900">{studio.photos?.length || 0}/5</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <ImageIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Audio Sample</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {studio.audioFile ? "Uploaded" : "Not uploaded"}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <Headphones className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => { setActiveTab("services"); }}
                                        className="flex items-center justify-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <Plus className="h-5 w-5 text-gray-600" />
                                        <span>Add Service</span>
                                    </button>

                                    <button
                                        onClick={() => { setUploadType("photos"); setShowUploadModal(true); }}
                                        className="flex items-center justify-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <Upload className="h-5 w-5 text-gray-600" />
                                        <span>Upload Photos</span>
                                    </button>

                                    <button
                                        onClick={() => { setUploadType("audio"); setShowUploadModal(true); }}
                                        className="flex items-center justify-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <FileAudio className="h-5 w-5 text-gray-600" />
                                        <span>Upload Audio</span>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium">Profile Created</p>
                                                <p className="text-sm text-gray-500">{new Date(studio.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === "services" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Services</h3>

                                {/* Add/Edit Service Form */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-3">
                                        {editingServiceIndex !== null ? "Edit Service" : "Add New Service"}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Service name (e.g., Mixing)"
                                            value={newService.service}
                                            onChange={(e) => setNewService({ ...newService, service: e.target.value })}
                                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Price (e.g., $99)"
                                            value={newService.price}
                                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={handleAddService}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            {editingServiceIndex !== null ? "Update Service" : "Add Service"}
                                        </button>
                                        {editingServiceIndex !== null && (
                                            <button
                                                onClick={() => { setNewService({ service: "", price: "" }); setEditingServiceIndex(null); }}
                                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Services List */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Service
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {services.map((service, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{service.service}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 font-semibold">{service.price}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEditService(index)}
                                                            className="text-yellow-600 hover:text-yellow-900 mr-4"
                                                        >
                                                            <Edit2 className="h-4 w-4 inline" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteService(index)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="h-4 w-4 inline" /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {services.length === 0 && (
                                    <div className="text-center py-8">
                                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                                        <p className="text-gray-500">Add your first service to get started</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Portfolio Tab */}
                    {activeTab === "portfolio" && (
                        <div className="space-y-6">
                            {/* Photos Section */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Portfolio Photos ({studio.photos?.length || 0}/5)</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                            className="p-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => { setUploadType("photos"); setShowUploadModal(true); }}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center space-x-2"
                                            disabled={studio.photos?.length >= 5}
                                        >
                                            <Upload className="h-4 w-4" />
                                            <span>Upload Photos</span>
                                        </button>
                                    </div>
                                </div>

                                {viewMode === "grid" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {studio.photos?.map((photo, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={photo.url}
                                                    alt={`Studio photo ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <button
                                                        onClick={() => handleDeletePhoto(photo._id)}
                                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {studio.photos?.map((photo, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <img src={photo.url} alt={`Photo ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                                                    <div>
                                                        <p className="font-medium">Photo {index + 1}</p>
                                                        <p className="text-sm text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeletePhoto(photo._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {(!studio.photos || studio.photos.length === 0) && (
                                    <div className="text-center py-8">
                                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
                                        <p className="text-gray-500 mb-4">Upload photos to showcase your studio</p>
                                        <button
                                            onClick={() => { setUploadType("photos"); setShowUploadModal(true); }}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            <Upload className="h-4 w-4 inline mr-2" />
                                            Upload Photos
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Audio Section */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Audio Sample</h3>
                                    {studio.audioFile ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleDeleteAudio}
                                                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 inline mr-2" />
                                                Delete Audio
                                            </button>
                                            <button
                                                onClick={() => { setUploadType("audio"); setShowUploadModal(true); }}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                            >
                                                <Upload className="h-4 w-4 inline mr-2" />
                                                Replace Audio
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setUploadType("audio"); setShowUploadModal(true); }}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            <Upload className="h-4 w-4 inline mr-2" />
                                            Upload Audio
                                        </button>
                                    )}
                                </div>

                                {studio.audioFile ? (
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <Headphones className="h-8 w-8 text-green-500" />
                                        <div className="flex-1">
                                            <p className="font-medium">Audio Sample</p>
                                            <p className="text-sm text-gray-500">Ready for clients to listen</p>
                                        </div>
                                        <audio controls className="flex-1">
                                            <source src={studio.audioFile.url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No audio sample</h3>
                                        <p className="text-gray-500 mb-4">Upload an audio sample to showcase your work</p>
                                        <button
                                            onClick={() => { setUploadType("audio"); setShowUploadModal(true); }}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            <Upload className="h-4 w-4 inline mr-2" />
                                            Upload Audio
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Studio Profile</h3>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Studio Name</label>
                                            <input
                                                type="text"
                                                defaultValue={studio.name}
                                                className="w-full border rounded-lg px-4 py-2 bg-gray-50"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    defaultValue={studio.state}
                                                    className="w-1/2 border rounded-lg px-4 py-2 bg-gray-50"
                                                    readOnly
                                                />
                                                <input
                                                    type="text"
                                                    defaultValue={studio.city ? studio.city.charAt(0).toUpperCase() + studio.city.slice(1) : ""}
                                                    className="w-1/2 border rounded-lg px-4 py-2 bg-gray-50"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                                        <textarea
                                            defaultValue={studio.biography}
                                            rows={6}
                                            className="w-full border rounded-lg px-4 py-2 bg-gray-50"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                                        <div className="flex items-center space-x-2">
                                            {studio.isVerified ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span className="text-green-600 font-medium">Verified Studio</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 text-yellow-500" />
                                                    <span className="text-yellow-600 font-medium">Pending Verification</span>
                                                    <span className="text-sm text-gray-500">(Please contact admin)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                                        <div className="flex items-center space-x-2">
                                            {studio.isActive ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span className="text-green-600 font-medium">Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                    <span className="text-red-600 font-medium">Inactive</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Upload {uploadType === "photos" ? "Photos" : "Audio"}
                            </h3>

                            {uploadType === "photos" ? (
                                <>
                                    <p className="text-gray-600 mb-4">
                                        You can upload up to {5 - (studio.photos?.length || 0)} more photos.
                                        Each photo should be under 10MB.
                                    </p>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Drag and drop your photos here, or click to browse</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhotos}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className={`inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer ${uploadingPhotos ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {uploadingPhotos ? "Uploading..." : "Select Photos"}
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-600 mb-4">
                                        Upload an audio sample (MP3, WAV, AAC, FLAC). Maximum file size is 50MB.
                                    </p>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Select your audio file</p>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleAudioUpload}
                                            disabled={uploadingAudio}
                                            className="hidden"
                                            id="audio-upload"
                                        />
                                        <label
                                            htmlFor="audio-upload"
                                            className={`inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer ${uploadingAudio ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {uploadingAudio ? "Uploading..." : "Select Audio File"}
                                        </label>
                                    </div>
                                </>
                            )}

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}