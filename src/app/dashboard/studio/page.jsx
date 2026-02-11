"use client";

import MediaGalleryPreview from "@/components/modules/dashboard/studio/MediaGalleryPreview";
import QuickActions from "@/components/modules/dashboard/studio/QuickActions";
import ServicesPreview from "@/components/modules/dashboard/studio/ServicesPreview";
import { useSession } from "@/lib/auth";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Camera,
  CheckCircle,
  Package,
  Star,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./lib/api";

export default function StudioDashboard() {
  const { user } = useSession();
  const [studioData, setStudioData] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    audioPlays: 0,
    bookings: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState([
    { label: "Profile Completion", value: "65%", color: "bg-blue-500" },
    { label: "Verified", value: "Pending", color: "bg-yellow-500" },
    { label: "Services", value: "3", color: "bg-green-500" },
    { label: "Photos", value: "2/5", color: "bg-purple-500" },
  ]);

  useEffect(() => {
    fetchStudioData();
    // fetchAnalytics();
  }, []);

  const fetchStudioData = async () => {
    try {
      const response = await api.get("/api/studios/profile");
      setStudioData(response.data);

      // Update quick stats
      const profileCompletion = calculateProfileCompletion(response.data);
      setQuickStats((prev) =>
        prev.map((stat) =>
          stat.label === "Profile Completion"
            ? { ...stat, value: `${profileCompletion}%` }
            : stat.label === "Verified"
              ? { ...stat, value: response.data.isVerified ? "Yes" : "Pending" }
              : stat.label === "Services"
                ? { ...stat, value: response.data.services?.length || 0 }
                : stat.label === "Photos"
                  ? { ...stat, value: `${response.data.photos?.length || 0}/5` }
                  : stat,
        ),
      );
    } catch (error) {
      console.error("Error fetching studio data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchAnalytics = async () => {
  //     try {
  //         const response = await api.get("/api/studio/analytics");
  //         setStats(response.data);
  //     } catch (error) {
  //         console.error("Error fetching analytics:", error);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const calculateProfileCompletion = (data) => {
    let score = 0;
    const fields = [
      data?.name,
      data?.city,
      data?.state,
      data?.biography,
      data?.services?.length > 0,
      data?.photos?.length > 0,
      data?.audioFile?.url,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const quickActions = [
    {
      title: "Update Services",
      description: "Add or modify your services and pricing",
      icon: Package,
      href: "/dashboard/studios/profile/services",
      color: "bg-blue-500",
    },
    {
      title: "Upload Media",
      description: "Add photos and audio samples",
      icon: Upload,
      href: "/dashboard/studios/media/upload",
      color: "bg-green-500",
    },
    {
      title: "Complete Profile",
      description: "Fill missing information",
      icon: CheckCircle,
      href: "/dashboard/studios/profile/edit",
      color: "bg-purple-500",
      badge:
        studioData && calculateProfileCompletion(studioData) < 100
          ? "Required"
          : null,
    },
    {
      title: "View Analytics",
      description: "Check your performance insights",
      icon: BarChart3,
      href: "/dashboard/studios/analytics",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back,{" "}
              <span className="text-blue-600">
                {studioData?.name || "Studio"}
              </span>
              !
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your studio, showcase your work, and connect with clients
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-full ${studioData?.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} font-medium flex items-center gap-2`}
            >
              {studioData?.isVerified ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {studioData?.isVerified
                ? "Verified Studio"
                : "Verification Pending"}
            </div>
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {studioData?.state || "Gulf Coast"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Profile Views"
                    value={stats.profileViews.toLocaleString()}
                    change="+12%"
                    icon={Eye}
                    color="bg-blue-500"
                    trend="up"
                />
                <StatCard
                    title="Audio Plays"
                    value={stats.audioPlays.toLocaleString()}
                    change="+23%"
                    icon={Headphones}
                    color="bg-green-500"
                    trend="up"
                />
                <StatCard
                    title="Bookings"
                    value={stats.bookings}
                    change="+5%"
                    icon={Calendar}
                    color="bg-purple-500"
                    trend="up"
                />
                <StatCard
                    title="Total Earnings"
                    value={`$${stats.earnings.toLocaleString()}`}
                    change="+18%"
                    icon={DollarSign}
                    color="bg-orange-500"
                    trend="up"
                />
            </div> */}

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  {stat.label === "Profile Completion" && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                  {stat.label === "Verified" && (
                    <Star className="w-6 h-6 text-white" />
                  )}
                  {stat.label === "Services" && (
                    <Package className="w-6 h-6 text-white" />
                  )}
                  {stat.label === "Photos" && (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              {stat.label === "Profile Completion" && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: stat.value }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Complete profile for better visibility
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Actions & Services */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <QuickActions actions={quickActions} />

          {/* Services Preview */}
          <ServicesPreview services={studioData?.services || []} />

          {/* Recent Activity */}
          {/* <RecentActivity /> */}
        </div>

        {/* Right Column - Media Gallery & Profile Status */}
        <div className="space-y-8">
          {/* Media Gallery Preview */}
          <MediaGalleryPreview
            photos={studioData?.photos || []}
            audioFile={studioData?.audioFile}
          />

          {/* Profile Status Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Profile Status</h3>
              <div className="text-3xl font-bold">
                {calculateProfileCompletion(studioData)}%
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "Basic Info",
                  completed: !!studioData?.name && !!studioData?.city,
                },
                { label: "Biography", completed: !!studioData?.biography },
                {
                  label: "Services",
                  completed: (studioData?.services?.length || 0) > 0,
                },
                {
                  label: "Photos",
                  completed: (studioData?.photos?.length || 0) > 0,
                },
                {
                  label: "Audio Sample",
                  completed: !!studioData?.audioFile?.url,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? "bg-green-400" : "bg-gray-300"}`}
                  >
                    {item.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Complete Profile
            </button>
          </div>

          {/* Tips & Updates */}
          {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Tips for Success
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Upload high-quality studio photos to attract more clients
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Add audio samples to showcase your production quality
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-600">
                  Complete profile for 40% more visibility in search results
                </span>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}
