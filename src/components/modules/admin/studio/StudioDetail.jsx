"use client";

import {
  Building2,
  Calendar,
  DollarSign,
  Edit2,
  Image as ImageIcon,
  Mail,
  MapPin,
  Music,
  Play,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const StudioDetail = ({ studio, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudio, setEditedStudio] = useState(studio);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSave = () => {
    onUpdate(editedStudio);
    setIsEditing(false);
  };

  const handleStatusChange = (field, value) => {
    const updated = onUpdate(studio._id, { [field]: value });
    if (updated) {
      setEditedStudio((prev) => ({ ...prev, [field]: value }));
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "photos", label: "Photos" },
    { id: "audio", label: "Audio" },
    { id: "activity", label: "Activity" },
  ];

  const StatusToggle = ({ label, value, field, onToggle }) => (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">Toggle to change status</p>
      </div>
      <button
        onClick={() => onToggle(field, !value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          value ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{studio.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {studio.city}, {studio.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Biography */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Biography</h3>
                  {isEditing ? (
                    <textarea
                      value={editedStudio.biography || ""}
                      onChange={(e) =>
                        setEditedStudio({
                          ...editedStudio,
                          biography: e.target.value,
                        })
                      }
                      className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Write studio biography..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {studio.biography || "No biography provided."}
                    </p>
                  )}
                </div>

                {/* Services Preview */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {studio.services?.map((service, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{service.service}</h4>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                              {service.price}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Status & Info */}
              <div className="space-y-6">
                {/* Status Controls */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Studio Status</h3>
                  <div className="space-y-3">
                    <StatusToggle
                      label="Active"
                      value={studio.isActive}
                      field="isActive"
                      onToggle={handleStatusChange}
                    />
                    <StatusToggle
                      label="Verified"
                      value={studio.isVerified}
                      field="isVerified"
                      onToggle={handleStatusChange}
                    />
                    <StatusToggle
                      label="Featured"
                      value={studio.isFeatured}
                      field="isFeatured"
                      onToggle={handleStatusChange}
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Owner Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{studio.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="font-medium">
                          {new Date(studio.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {studio.photos?.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={photo.url}
                        alt={`Studio photo ${idx + 1}`}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="p-2 bg-white rounded-lg">
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {(!studio.photos || studio.photos.length === 0) && (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No photos uploaded</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "audio" && (
            <div className="space-y-6">
              {studio.audioFile ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Audio Sample</h3>
                      <p className="text-gray-600 mt-1">Studio audio demo</p>
                    </div>
                    <button className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                      <Play className="h-6 w-6 text-blue-600" />
                    </button>
                  </div>
                  <audio
                    controls
                    src={studio.audioFile.url}
                    className="w-full mt-6"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No audio file uploaded</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-4">
              {studio.services?.map((service, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-xl hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-lg">{service.service}</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {service.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!studio.services || studio.services.length === 0) && (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No services added</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;
