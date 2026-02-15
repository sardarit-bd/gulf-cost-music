// app/dashboard/venues/overview/page.js
"use client";

import ActionButtons from "@/components/modules/venues/overview/ActionButtons";
import StatsCards from "@/components/modules/venues/overview/StatsCards";
import StatusAlerts from "@/components/modules/venues/overview/StatusAlerts";
import VenueInformation from "@/components/modules/venues/overview/VenueInformation";
import VenuePhotosGallery from "@/components/modules/venues/overview/VenuePhotosGallery";
// import ActionButtons from "@/components/venue/ActionButtons";
// import StatsCards from "@/components/venue/StatsCards";
// import StatusAlerts from "@/components/venue/StatusAlerts";
// import VenueInformation from "@/components/venue/VenueInformation";
// import VenuePhotosGallery from "@/components/venue/VenuePhotosGallery";
import { getCookie } from "@/utils/cookies";
import { ArrowLeft, Edit3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OverviewPage() {
  const [venue, setVenue] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchVenueData();
  }, []);

  const fetchVenueData = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");
      if (!token) {
        toast.error("You must be logged in.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch venue.");
      }

      if (data.data?.venue) {
        const v = data.data.venue;
        setVenue({
          venueName: v.venueName || "",
          name: v.venueName || "",
          state: v.state || "Alabama",
          city: v.city || "",
          address: v.address || "",
          seating: v.seatingCapacity?.toString() || "",
          seatingCapacity: v.seatingCapacity || 0,
          biography: v.biography || "",
          openHours: v.openHours || "",
          openDays: v.openDays || "",
          phone: v.phone || "",
          website: v.website || "",
          photos: v.photos || [],
          isActive: v.isActive || false,
          verifiedOrder: v.verifiedOrder || 0,
          colorCode: v.colorCode || null,
        });
        setPreviewImages(v.photos?.map((p) => p.url) || []);
      }

      if (data.data?.user?.subscriptionPlan) {
        setSubscriptionPlan(data.data.user.subscriptionPlan);
      }
    } catch (error) {
      console.error("Error fetching venue:", error);
      toast.error(error.message || "Server error while loading venue.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/venues"
              className="p-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Venue Overview
              </h1>
              <p className="text-gray-600">
                View your venue details and statistics
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/venues/edit-profile"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
          >
            <Edit3 size={18} />
            Edit Profile
          </Link>
        </div>

        {/* Status Alerts */}
        <StatusAlerts venue={venue} />

        {/* Stats Cards */}
        <StatsCards venue={venue} subscriptionPlan={subscriptionPlan} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <VenueInformation venue={venue} subscriptionPlan={subscriptionPlan} />
          <VenuePhotosGallery
            previewImages={previewImages}
            venueName={venue?.venueName || ""}
          />
        </div>

        {/* Action Buttons */}
        <ActionButtons />
      </div>
    </div>
  );
}
