"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import {
    Building2,
    Camera,
    CheckCircle,
    Edit2,
    Facebook,
    Globe,
    Instagram,
    Mail,
    MapPin,
    Music,
    Package,
    Phone,
    Star,
    Upload,
    Users,
    Youtube
} from "lucide-react";
import { useEffect, useState } from "react";

export default function StudioProfile() {
    const [studioData, setStudioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchStudioData();
    }, []);

    const fetchStudioData = async () => {
        try {
            const response = await api.get("/api/studios/profile");
            setStudioData(response.data);
        } catch (error) {
            console.error("Error fetching studio data:", error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: Building2 },
        { id: "services", label: "Services", icon: Package },
        { id: "portfolio", label: "Portfolio", icon: Camera },
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "analytics", label: "Analytics", icon: Users }
    ];

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!studioData) {
        return <NoStudioData />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
            {/* Profile Header */}
            <div className="relative mb-8">
                {/* Cover Image */}
                <div className="h-48 md:h-64 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Studio Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex items-end gap-4">
                                {/* Studio Avatar */}
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                                    {studioData.photos?.[0]?.url ? (
                                        <img
                                            src={studioData.photos[0].url}
                                            alt={studioData.name}
                                            className="w-full h-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <Building2 className="w-12 h-12 text-blue-600" />
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white">{studioData.name}</h1>
                                        {studioData.isVerified && (
                                            <Badge variant="verified">
                                                <CheckCircle className="w-4 h-4" />
                                                Verified
                                            </Badge>
                                        )}
                                        {studioData.isFeatured && (
                                            <Badge variant="featured">
                                                <Star className="w-4 h-4" />
                                                Featured
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-white/90">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{studioData.city}, {studioData.state}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            <span>{studioData.services?.length || 0} Services</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Camera className="w-4 h-4" />
                                            <span>{studioData.photos?.length || 0}/5 Photos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" size="lg">
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                                <Button variant="primary" size="lg">
                                    <Upload className="w-4 h-4" />
                                    Upload Media
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-4 z-10 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Overview & Bio */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Biography */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">About Our Studio</h2>
                            <button className="text-blue-600 hover:text-blue-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                {studioData.biography || "No biography added yet. Add a compelling description of your studio to attract clients."}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Globe, label: "Website", color: "text-gray-600" },
                                    { icon: Instagram, label: "Instagram", color: "text-pink-600" },
                                    { icon: Youtube, label: "YouTube", color: "text-red-600" },
                                    { icon: Facebook, label: "Facebook", color: "text-blue-600" },
                                    { icon: Phone, label: "Phone", color: "text-green-600" },
                                    { icon: Mail, label: "Email", color: "text-blue-500" }
                                ].map((social, index) => (
                                    <button
                                        key={index}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className={`w-10 h-10 ${social.color} bg-gray-50 rounded-lg flex items-center justify-center`}>
                                            <social.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs text-gray-600">{social.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    {activeTab === "services" && (
                        <ServicesSection services={studioData.services} />
                    )}

                    {/* Portfolio Section */}
                    {activeTab === "portfolio" && (
                        <PortfolioSection
                            photos={studioData.photos}
                            audioFile={studioData.audioFile}
                        />
                    )}
                </div>

                {/* Right Column - Stats & Quick Info */}
                <div className="space-y-8">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Studio Stats</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Profile Views", value: "1,234", change: "+12%", icon: Users },
                                { label: "Audio Plays", value: "456", change: "+23%", icon: Music },
                                { label: "Service Inquiries", value: "89", change: "+5%", icon: Package },
                                { label: "Client Rating", value: "4.8", change: "+0.2", icon: Star }
                            ].map((stat, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Location</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-blue-100">State</p>
                                <p className="text-lg font-semibold">{studioData.state}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-100">City</p>
                                <p className="text-lg font-semibold">{studioData.city}</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                            <p className="text-sm">📍 Located in the heart of Gulf Coast's music scene</p>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Status</h3>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl ${studioData.isVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${studioData.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} rounded-lg flex items-center justify-center`}>
                                        {studioData.isVerified ? <CheckCircle className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{studioData.isVerified ? 'Verified Studio' : 'Verification Pending'}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {studioData.isVerified
                                                ? 'Your studio is officially verified'
                                                : 'Complete verification for better visibility'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!studioData.isVerified && (
                                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                                    Request Verification
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Additional Component Functions


function NoStudioData() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Studio Profile Found</h2>
                <p className="text-gray-600 mb-6">Create your studio profile to get started</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Create Studio Profile
                </button>
            </div>
        </div>
    );
}