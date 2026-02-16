// app/dashboard/admin/studios/page.js
"use client";

import StudioDetail from "@/components/modules/admin/studio/StudioDetail";
import StudioTable from "@/components/modules/admin/studio/StudioTable";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import { Building2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StudiosPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchStudios = async (showToast = false) => {
    try {
      setRefreshing(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Authentication required");
        router.push("/signin");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/admin/all?limit=500`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStudios(data.data);
        if (showToast) {
          toast.success(`Loaded ${data.data.length} studios`);
        }
      } else {
        toast.error(data.message || "Failed to load studios");
      }
    } catch (error) {
      console.error("Error fetching studios:", error);
      toast.error("Failed to load studios. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (studioId, updates) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/admin/status/${studioId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStudios((prev) =>
          prev.map((studio) =>
            studio._id === studioId ? { ...studio, ...updates } : studio
          )
        );

        if (selectedStudio && selectedStudio._id === studioId) {
          setSelectedStudio((prev) => ({ ...prev, ...updates }));
        }

        const action =
          updates.isActive !== undefined
            ? updates.isActive ? "activated" : "deactivated"
            : updates.isVerified !== undefined
              ? updates.isVerified ? "verified" : "unverified"
              : updates.isFeatured !== undefined
                ? updates.isFeatured ? "featured" : "unfeatured"
                : "updated";

        toast.success(`Studio ${action} successfully`);
      } else {
        toast.error(data.message || "Failed to update studio");
      }
    } catch (error) {
      console.error("Error updating studio:", error);
      toast.error("Failed to update studio");
    }
  };

  const handleDelete = async (studioId) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/studios/admin/${studioId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStudios((prev) => prev.filter((studio) => studio._id !== studioId));
        if (selectedStudio && selectedStudio._id === studioId) {
          setSelectedStudio(null);
          setShowDetail(false);
        }
        toast.success("Studio deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete studio");
      }
    } catch (error) {
      console.error("Error deleting studio:", error);
      toast.error("Failed to delete studio");
    }
  };

  const handleStudioClick = (studio) => {
    setSelectedStudio(studio);
    setShowDetail(true);
  };

  useEffect(() => {
    fetchStudios();

    // Refresh data every 5 minutes
    const interval = setInterval(() => fetchStudios(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && studios.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
            </div>
            <p className="text-lg font-medium text-gray-900">Loading studios...</p>
            <p className="text-gray-600 mt-2">Please wait while we fetch your studio data</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Studio Management</h1>
                  <p className="text-gray-600 mt-1">
                    Manage all recording studios, verify profiles, and feature premium studios
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => fetchStudios(true)}
              disabled={refreshing}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Main Content */}
        <StudioTable
          studios={studios}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onStudioClick={handleStudioClick}
        />

        {/* Studio Detail Modal */}
        {showDetail && selectedStudio && (
          <StudioDetail
            studio={selectedStudio}
            onUpdate={handleStatusChange}
            onClose={() => {
              setShowDetail(false);
              setSelectedStudio(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}