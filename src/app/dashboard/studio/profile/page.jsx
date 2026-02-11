"use client";

import {
  AlertCircle,
  Building2,
  Camera,
  CheckCircle,
  DollarSign,
  Edit,
  FileText,
  Headphones,
  MapPin,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function StudioProfile() {
  const router = useRouter();
  const [studioData, setStudioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileViews: 1254,
    audioPlays: 567,
    bookings: 23,
    earnings: 4520,
  });
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    try {
      const response = await api.get("/api/studios/profile");
      setStudioData(response.data);

      // Calculate profile completion
      const completedFields = [
        response.data?.name,
        response.data?.city,
        response.data?.state,
        response.data?.biography,
        response.data?.services?.length > 0,
        response.data?.photos?.length > 0,
        response.data?.audioFile?.url,
      ].filter(Boolean).length;
      setProfileCompletion(Math.round((completedFields / 7) * 100));
    } catch (error) {
      console.error("Error fetching studio data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const photos = studioData?.photos || [];
  const services = studioData?.services || [];
  const audioFile = studioData?.audioFile;

  const profileSections = [
    {
      title: "Basic Information",
      items: [
        {
          label: "Studio Name",
          value: studioData?.name || "Not set",
          icon: Building2,
        },
        {
          label: "Location",
          value: `${studioData?.state || "State"}, ${studioData?.city || "City"}`,
          icon: MapPin,
        },
        {
          label: "Biography",
          value: studioData?.biography
            ? `${studioData.biography.substring(0, 100)}...`
            : "Not set",
          icon: FileText,
        },
      ],
      editLink: "/dashboard/studio/profile/edit",
    },
    {
      title: "Services",
      items: [
        { label: "Total Services", value: services.length, icon: Package },
        {
          label: "Price Range",
          value:
            services.length > 0
              ? `$${Math.min(...services.map((s) => parseFloat(s.price)))} - $${Math.max(...services.map((s) => parseFloat(s.price)))}`
              : "Not set",
          icon: DollarSign,
        },
      ],
      editLink: "/dashboard/studio/profile/services",
    },
    {
      title: "Media",
      items: [
        { label: "Photos", value: `${photos.length}/5 uploaded`, icon: Camera },
        {
          label: "Audio Sample",
          value: audioFile ? "Uploaded" : "Not uploaded",
          icon: Headphones,
        },
      ],
      editLink: "/dashboard/studio/media",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Studio Profile
        </h1>
        <p className="text-gray-600">
          Manage and showcase your studio to attract clients
        </p>
      </div>

      {/* Profile Status Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {profileCompletion === 100 ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {profileCompletion === 100
                    ? "Profile Complete!"
                    : "Complete Your Profile"}
                </h3>
                <p className="text-blue-100">
                  {profileCompletion === 100
                    ? "Your profile is fully optimized for maximum visibility"
                    : `${100 - profileCompletion}% remaining to complete your profile`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{profileCompletion}%</p>
                <p className="text-sm text-blue-200">Complete</p>
              </div>
              {profileCompletion < 100 && (
                <button
                  onClick={() => router.push("/dashboard/studios/profile/edit")}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                  Complete Profile
                </button>
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Profile Progress</span>
              <span className="text-sm font-medium">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${profileCompletion === 100 ? "bg-green-400" : "bg-white"}`}
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.profileViews}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Audio Plays</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.audioPlays}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +23% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.bookings}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +5% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.earnings}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18% this month
          </p>
        </div>
      </div> */}

      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {profileSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {section.title}
              </h3>
              <Link
                href={section.editLink}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white text-gray-600 rounded-lg flex items-center justify-center border border-gray-200">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span
                    className={`font-medium ${item.value === "Not set" || item.value === "Not uploaded" ? "text-yellow-600" : "text-gray-900"}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/studio/media"
            className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Upload Media</h4>
                <p className="text-sm text-gray-600">Add photos & audio</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {photos.length < 5
                ? `${5 - photos.length} photo slots available`
                : "Max photos reached"}
            </p>
          </Link>

          <Link
            href="/dashboard/studio/profile/services"
            className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Manage Services</h4>
                <p className="text-sm text-gray-600">
                  Update pricing & packages
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {services.length} service{services.length !== 1 ? "s" : ""} listed
            </p>
          </Link>

          {/* <Link
            href="/dashboard/studios/profile/edit"
            className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Edit className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Edit Profile</h4>
                <p className="text-sm text-gray-600">
                  Update basic information
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {profileCompletion}% complete
            </p>
          </Link> */}
        </div>
      </div>

      {/* Verification Status */}
      {/* {studioData && (
        <div className="mt-8">
          <div
            className={`p-6 rounded-2xl ${studioData.isVerified ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${studioData.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"} rounded-xl flex items-center justify-center`}
              >
                {studioData.isVerified ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  {studioData.isVerified
                    ? "Verified Studio"
                    : "Verification Pending"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {studioData.isVerified
                    ? "Your studio has been verified and appears as trusted to clients"
                    : "Complete your profile and contact admin@ulfcoastmusic.com for verification"}
                </p>
              </div>
              {!studioData.isVerified && profileCompletion >= 80 && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Request Verification
                </button>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
