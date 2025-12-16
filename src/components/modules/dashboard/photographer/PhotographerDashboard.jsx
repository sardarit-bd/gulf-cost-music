"use client";

import { Briefcase, Camera, Crown, Edit3, ImageIcon, ShoppingBag, Users, Video } from "lucide-react";
import EditProfileTab from "./photographer/EditProfileTab";
import MarketTab from "./photographer/MarketTab";
import OverviewTab from "./photographer/OverviewTab";
import PhotosTab from "./photographer/PhotosTab";
import ServicesTab from "./photographer/ServicesTab";
import VideosTab from "./photographer/VideosTab";

// Plan Badge Component
const PlanBadge = ({ subscriptionPlan }) => (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${subscriptionPlan === "pro"
        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        : "bg-gray-700 text-gray-300 border border-gray-600"
        }`}>
        {subscriptionPlan === "pro" ? (
            <>
                <Crown size={14} />
                Pro Plan
            </>
        ) : (
            <>
                <Users size={14} />
                Free Plan
            </>
        )}
    </div>
);

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
    subscriptionPlan,
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
    API_BASE,
    user
}) {
    return (
        <>
            {/* Header with Plan Info */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                        <Camera size={32} className="text-black" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Photographer Dashboard</h1>
                        <div className="flex items-center justify-center gap-3 mt-2">
                            <PlanBadge subscriptionPlan={subscriptionPlan} />
                        </div>
                    </div>
                </div>
                <p className="text-gray-400 text-lg">
                    Manage your photography services and portfolio
                </p>
            </div>

            {/* Plan Stats Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <ImageIcon size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Photo Uploads</p>
                            <p className="text-gray-400 text-sm">
                                {subscriptionPlan === "pro"
                                    ? `${previewImages.length}/5 photos allowed`
                                    : "Not available in Free plan"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Video size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Video Uploads</p>
                            <p className="text-gray-400 text-sm">
                                {subscriptionPlan === "pro"
                                    ? `${photographer.videos?.length || 0}/5 videos allowed`
                                    : "Not available in Free plan"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Briefcase size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Services</p>
                            <p className="text-gray-400 text-sm">
                                {subscriptionPlan === "pro"
                                    ? `${photographer.services?.length || 0} services allowed`
                                    : "Not available in Free plan"}
                            </p>
                        </div>
                    </div>

                    {subscriptionPlan === "free" && (
                        <button
                            onClick={() => window.open("/pricing", "_blank")}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition"
                        >
                            <Crown size={16} />
                            Upgrade to Pro
                        </button>
                    )}
                </div>
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
                            { id: "market", label: "Market", icon: ShoppingBag },
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

                    {!loading && activeTab === "overview" && (
                        <OverviewTab
                            photographer={photographer}
                            previewImages={previewImages}
                            subscriptionPlan={subscriptionPlan}
                        />
                    )}

                    {!loading && activeTab === "edit" && (
                        <EditProfileTab
                            photographer={photographer}
                            subscriptionPlan={subscriptionPlan}
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

                    {!loading && activeTab === "services" && (
                        <ServicesTab
                            services={photographer.services}
                            subscriptionPlan={subscriptionPlan}
                            newService={newService}
                            setNewService={setNewService}
                            handleAddService={handleAddService}
                            handleDeleteService={handleDeleteService}
                            loading={loading}
                        />
                    )}

                    {!loading && activeTab === "photos" && (
                        <PhotosTab
                            photos={photographer.photos}
                            subscriptionPlan={subscriptionPlan}
                            removeImage={removeImage}
                            MAX_PHOTOS={MAX_PHOTOS}
                            handleImageUpload={handleImageUpload}
                            uploadingPhotos={uploadingPhotos}
                        />
                    )}

                    {!loading && activeTab === "videos" && (
                        <VideosTab
                            videos={photographer.videos}
                            subscriptionPlan={subscriptionPlan}
                            onVideoAdded={handleAddVideo}
                            onVideoDeleted={handleDeleteVideo}
                        />
                    )}
                    {!loading && activeTab === "market" && (
                        <MarketTab
                            API_BASE={API_BASE}
                            subscriptionPlan={subscriptionPlan}
                            user={user}
                        />
                    )}

                </div>
            </div>
        </>
    );
}