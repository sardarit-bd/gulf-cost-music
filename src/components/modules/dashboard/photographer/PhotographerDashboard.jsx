"use client";

import {
  Briefcase,
  Camera,
  CreditCard,
  Crown,
  Edit3,
  ImageIcon,
  MapPin,
  ShoppingBag,
  Users,
  Video,
} from "lucide-react";
import BillingTab from "../billing/BillingTab";
import EditProfileTab from "./photographer/EditProfileTab";
import MarketTab from "./photographer/MarketTab";
import OverviewTab from "./photographer/OverviewTab";
import PhotosTab from "./photographer/PhotosTab";
import ServicesTab from "./photographer/ServicesTab";
import VideosTab from "./photographer/VideosTab";

// Plan Badge Component
const PlanBadge = ({ subscriptionPlan }) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${subscriptionPlan === "pro"
      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      : "bg-gray-700 text-gray-300 border border-gray-600"
      }`}
  >
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
  stateOptions, // Added
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
  user,
  billingData,
  billingLoading,
  onUpgrade,
  onOpenPortal,
  onCancel,
  onResume,
  onRefresh,
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
            <h1 className="text-4xl font-bold text-white">
              Photographer Dashboard
            </h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <PlanBadge subscriptionPlan={subscriptionPlan} />
              {photographer.state && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm">
                  <MapPin size={12} />
                  {photographer.state.charAt(0).toUpperCase() + photographer.state.slice(1)}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-lg">
          Manage your photography services and portfolio
        </p>
      </div>

      {/* Plan Stats Bar - Updated for free features */}
      {/* <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ImageIcon size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Photo Uploads</p>
              <p className="text-gray-400 text-sm">
                {previewImages.length}/5 photos available
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
                {photographer.videos?.length || 0}/1 video available
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
                Unlimited services available
              </p>
            </div>
          </div>
          {subscriptionPlan === "free" && (
            <button
              onClick={onUpgrade}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition"
            >
              <Crown size={16} />
              <span>
                Upgrade to Pro
                <span className="ml-1 text-sm text-black/70">· $10/month</span>
              </span>
            </button>
          )}
        </div>
      </div> */}

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
              { id: "billing", label: "Billing", icon: CreditCard },
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
              stateOptions={stateOptions} // Added
              cityOptions={cityOptions}
              handleChange={handleChange}
              handleSave={handleSave}
              saving={saving}
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
          {!loading && activeTab === "billing" && (
            <BillingTab
              user={user}
              billingData={billingData}
              loading={billingLoading}
              onUpgrade={onUpgrade}
              onOpenPortal={onOpenPortal}
              onCancel={onCancel}
              onResume={onResume}
              onRefresh={onRefresh}
              invoices={[]}
              onDownloadInvoice={() => { }}
            />
          )}
        </div>
      </div>
    </>
  );
}