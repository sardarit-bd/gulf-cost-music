"use client";

import {
    Briefcase,
    Camera,
    Edit3,
    ImageIcon,
    Video
} from "lucide-react";
import EditProfileTab from "./photographer/EditProfileTab";
import OverviewTab from "./photographer/OverviewTab";
import PhotosTab from "./photographer/PhotosTab";
import ServicesTab from "./photographer/ServicesTab";
import VideosTab from "./photographer/VideosTab";

export default function PhotographerDashboard({
    activeTab,
    setActiveTab,
    photographer,
    previewImages,
    newService,
    setNewService,
    loading,
    saving,
    uploadingPhotos,
    cityOptions,
    MAX_PHOTOS,
    handleChange,
    handleImageUpload,
    removeImage,
    handleSave,
    handleAddService,
    handleDeleteService,
    handleAddVideo,
    handleDeleteVideo,
}) {
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <div className="p-2 bg-yellow-500 rounded-lg">
                            <Camera size={32} className="text-black" />
                        </div>
                        Photographer Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Manage your photography services and portfolio
                    </p>
                </div>

                {/* Main Container */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                    {/* Enhanced Tabs */}
                    <div className="border-b border-gray-700 bg-gray-900">
                        <div className="flex overflow-x-auto">
                            {[
                                { id: "overview", label: "Overview", icon: Camera },
                                { id: "edit", label: "Edit Profile", icon: Edit3 },
                                { id: "services", label: "Services", icon: Briefcase },
                                { id: "photos", label: "Photos", icon: ImageIcon },
                                { id: "videos", label: "Videos", icon: Video },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === id
                                        ? "text-yellow-400 border-b-2 border-yellow-400 bg-gray-800"
                                        : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800/50"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {loading && (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                                <span className="ml-3 text-gray-400">Loading...</span>
                            </div>
                        )}

                        {activeTab === "overview" && (
                            <OverviewTab photographer={photographer} previewImages={previewImages} />
                        )}
                        {activeTab === "edit" && (
                            <EditProfileTab
                                photographer={photographer}
                                cityOptions={cityOptions}
                                handleChange={handleChange}
                                handleImageUpload={handleImageUpload}
                                removeImage={removeImage}
                                previewImages={previewImages}
                                handleSave={handleSave}
                                saving={saving}
                                uploadingPhotos={uploadingPhotos}
                                maxPhotos={MAX_PHOTOS}
                            />
                        )}
                        {activeTab === "services" && (
                            <ServicesTab
                                services={photographer.services}
                                newService={newService}
                                setNewService={setNewService}
                                handleAddService={handleAddService}
                                handleDeleteService={handleDeleteService}
                                loading={loading}
                            />
                        )}
                        {activeTab === "photos" && (
                            <PhotosTab
                                photos={photographer.photos}
                                removeImage={removeImage}
                                MAX_PHOTOS={MAX_PHOTOS}
                                handleImageUpload={handleImageUpload}
                                uploadingPhotos={uploadingPhotos}
                            />
                        )}
                        {activeTab === "videos" && (
                            <VideosTab
                                videos={photographer.videos}
                                onVideoAdded={handleAddVideo}
                                onVideoDeleted={handleDeleteVideo}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}