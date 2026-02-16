// components/modules/admin/studio/StudioDetail.js
"use client";

import {
  Building2,
  Calendar,
  DollarSign,
  Eye,
  Image as ImageIcon,
  Mail,
  MapPin,
  Music,
  X
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const StudioDetail = ({ studio, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "services", label: "Services", icon: "💰" },
    { id: "photos", label: "Photos", icon: "🖼️" },
    { id: "audio", label: "Audio", icon: "🎵" },
    { id: "details", label: "Details", icon: "⚙️" },
  ];

  const StatusBadge = ({ label, value }) => (
    <span className={`px-3 py-1.5 text-sm font-medium rounded-full border ${value
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-red-100 text-red-700 border-red-200"
      }`}>
      {label}: {value ? "Yes" : "No"}
    </span>
  );

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{studio.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    {studio.city}, {studio.state}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <StatusBadge label="Active" value={studio.isActive} />
                  <StatusBadge label="Verified" value={studio.isVerified} />
                  <StatusBadge label="Featured" value={studio.isFeatured} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Biography */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {studio.biography || "No biography provided."}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem icon={Mail} label="Email" value={studio.user?.email} />
                  <InfoItem icon={Calendar} label="Joined" value={new Date(studio.createdAt).toLocaleDateString()} />
                  <InfoItem icon={ImageIcon} label="Photos" value={`${studio.photos?.length || 0} images`} />
                  <InfoItem icon={Music} label="Services" value={`${studio.services?.length || 0} services`} />
                </div>

                {/* Services Preview */}
                {studio.services?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {studio.services.slice(0, 4).map((service, idx) => (
                        <div
                          key={idx}
                          className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.service}</h4>
                              <p className="text-xl font-bold text-blue-600 mt-2">
                                {service.price}
                              </p>
                            </div>
                            <DollarSign className="h-6 w-6 text-blue-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Stats */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm text-gray-600">Studio ID</dt>
                      <dd className="text-sm font-mono text-gray-900">{studio._id.slice(-8)}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm text-gray-600">Total Photos</dt>
                      <dd className="text-sm font-medium text-gray-900">{studio.photos?.length || 0}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm text-gray-600">Total Services</dt>
                      <dd className="text-sm font-medium text-gray-900">{studio.services?.length || 0}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <dt className="text-sm text-gray-600">Has Audio</dt>
                      <dd className="text-sm font-medium text-gray-900">{studio.audioFile ? "Yes" : "No"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studio.services?.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{service.service}</h4>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          {service.price}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {(!studio.services || studio.services.length === 0) && (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-10 w-10 text-gray-500" />
                  </div>
                  <p className="text-gray-700 font-medium">No services added yet</p>
                </div>
              )}
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === "photos" && (
            <div>
              {selectedImage ? (
                <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-900" />
                  </button>
                  <div className="relative w-full max-w-4xl h-[80vh]">
                    <Image
                      src={selectedImage.url}
                      alt="Studio"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {studio.photos?.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                        onClick={() => setSelectedImage(photo)}
                      >
                        <Image
                          src={photo.url}
                          alt={`Studio photo ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {(!studio.photos || studio.photos.length === 0) && (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-10 w-10 text-gray-500" />
                  </div>
                  <p className="text-gray-700 font-medium">No photos uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === "audio" && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Audio Sample</h3>
              {studio.audioFile ? (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-600 mt-1">Listen to the studio's work</p>
                    </div>
                    <div className="p-4 bg-white rounded-full shadow-lg">
                      <Music className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <audio controls src={studio.audioFile.url} className="w-full" />
                  <p className="text-xs text-gray-500 mt-4">
                    Uploaded: {new Date(studio.audioFile.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-10 w-10 text-gray-500" />
                  </div>
                  <p className="text-gray-700 font-medium">No audio file uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Studio ID</dt>
                      <dd className="text-sm font-mono bg-gray-50 p-2 rounded border border-gray-200 text-gray-900">
                        {studio._id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">User ID</dt>
                      <dd className="text-sm font-mono bg-gray-50 p-2 rounded border border-gray-200 text-gray-900">
                        {studio.user?._id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Created At</dt>
                      <dd className="text-sm text-gray-900">{new Date(studio.createdAt).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Last Updated</dt>
                      <dd className="text-sm text-gray-900">{new Date(studio.updatedAt).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h4>
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Total Photos</dt>
                      <dd className="font-medium text-gray-900">{studio.photos?.length || 0}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Total Services</dt>
                      <dd className="font-medium text-gray-900">{studio.services?.length || 0}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Has Audio</dt>
                      <dd className="font-medium text-gray-900">{studio.audioFile ? "Yes" : "No"}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <dt className="text-gray-600">Status</dt>
                      <dd className="font-medium text-gray-900">
                        {studio.isActive ? "Active" : "Inactive"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;