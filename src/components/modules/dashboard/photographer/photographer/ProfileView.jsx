// components/modules/dashboard/photographer/ProfileView.jsx
"use client";

import {
    Camera,
    FileText,
    ImageIcon,
    Mail,
    MapPin,
    Phone,
    User,
    Video
} from "lucide-react";

export default function ProfileView({ photographer, user, formatCityName, getFullStateName }) {
    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Camera className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{photographer.name || "Your Name"}</h1>
                        <div className="flex items-center gap-2 mt-2 text-white/80">
                            <MapPin className="w-4 h-4" />
                            <span>
                                {photographer.state
                                    ? `${getFullStateName(photographer.state)} (${photographer.state})${photographer.city ? ` • ${formatCityName(photographer.city)}` : ''}`
                                    : "Location not set"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Biography Section */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-600" />
                            Biography
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {photographer.biography || "No biography added yet."}
                        </p>
                    </div>

                    {/* Services Section */}
                    {/* <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-600" />
                            Services
                        </h2>
                        {photographer.services?.length > 0 ? (
                            <div className="grid gap-4">
                                {photographer.services.map((service, index) => (
                                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{service.service}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                {service.contact?.phone && (
                                                    <p className="text-sm text-gray-500 mt-2">📞 {service.contact.phone}</p>
                                                )}
                                            </div>
                                            <span className="text-lg font-bold text-blue-600">{service.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No services added yet.</p>
                        )}
                    </div> */}
                </div>

                {/* Sidebar - Right Side */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-600" />
                                <span className="text-sm text-gray-900">{user?.email || "Not available"}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-600" />
                                <span className="text-sm text-gray-900">
                                    {photographer.services?.[0]?.contact?.phone || "Not provided"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="text-sm text-gray-900 capitalize">{user?.userType || "Photographer"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Stats */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-blue-600" />
                                    <span className="text-gray-700">Photos</span>
                                </div>
                                <span className="font-semibold text-blue-600">{photographer.photos?.length || 0}/5</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4 text-purple-600" />
                                    <span className="text-gray-700">Videos</span>
                                </div>
                                <span className="font-semibold text-purple-600">{photographer.videos?.length || 0}/1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}