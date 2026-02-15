// app/dashboard/admin/studios/page.js
"use client";

import StudioDetail from "@/components/modules/admin/studio/StudioDetail";
import StudioTable from "@/components/modules/admin/studio/StudioTable";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
// import StudioDetail from "@/components/studios/StudioDetail";
// import StudioTable from "@/components/studios/StudioTable";
import { Building2, Download, Filter, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { toast } from "sonner";

export default function StudiosPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const fetchStudios = async () => {
    try {
      setLoading(true);
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
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStudios(data.data);
        toast.success(`Loaded ${data.data.length} studios`);
      } else {
        toast.error(data.message || "Failed to load studios");
      }
    } catch (error) {
      console.error("Error fetching studios:", error);
      toast.error("Failed to load studios. Please try again.");
    } finally {
      setLoading(false);
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
        },
      );

      const data = await response.json();

      if (data.success) {
        setStudios((prev) =>
          prev.map((studio) =>
            studio._id === studioId ? { ...studio, ...updates } : studio,
          ),
        );

        if (selectedStudio && selectedStudio._id === studioId) {
          setSelectedStudio((prev) => ({ ...prev, ...updates }));
        }

        const action =
          updates.isActive !== undefined
            ? updates.isActive
              ? "activated"
              : "deactivated"
            : updates.isVerified !== undefined
              ? updates.isVerified
                ? "verified"
                : "unverified"
              : updates.isFeatured !== undefined
                ? updates.isFeatured
                  ? "featured"
                  : "unfeatured"
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
    if (
      !confirm(
        "Are you sure you want to delete this studio? This will also delete the user account. This action cannot be undone.",
      )
    ) {
      return;
    }

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
        },
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

  const handleExport = () => {
    try {
      const csvData = studios.map((studio) => ({
        Name: studio.name,
        Email: studio.user?.email || "",
        City: studio.city,
        State: studio.state,
        "Services Count": studio.services?.length || 0,
        Status: studio.isActive ? "Active" : "Inactive",
        Verified: studio.isVerified ? "Yes" : "No",
        Featured: studio.isFeatured ? "Yes" : "No",
        "Created At": new Date(studio.createdAt).toLocaleDateString(),
        Biography: studio.biography || "",
      }));

      const headers = Object.keys(csvData[0] || {});
      const csv = [
        headers.join(","),
        ...csvData.map((row) =>
          headers
            .map(
              (header) => `"${String(row[header] || "").replace(/"/g, '""')}"`,
            )
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `studios_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export started successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  useEffect(() => {
    fetchStudios();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchStudios, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStudioClick = (studio) => {
    setSelectedStudio(studio);
    setShowDetail(true);
  };

  if (loading && studios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Loading studios...
          </p>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your studio data
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Studio Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage all recording studios, verify profiles, and feature
                    premium studios
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={fetchStudios}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
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

        {/* Empty State */}
        {!loading && studios.length === 0 && (
          <div className="text-center py-20">
            <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Studios Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no studios registered in the system yet. Studios will
              appear here once they complete their registration.
            </p>
            <button
              onClick={fetchStudios}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Check Again
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
