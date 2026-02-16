// components/modules/admin/studio/StudioTable.js
"use client";

import DeleteModal from "@/ui/DeleteModal";
import Select from "@/ui/Select";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  Search,
  Star,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import StatsCard from "./StatsCard";

const StudioTable = ({ studios, onStatusChange, onDelete, onStudioClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudios, setSelectedStudios] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, studioId: null, studioName: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Calculate stats
  const stats = {
    total: studios.length,
    active: studios.filter((s) => s.isActive).length,
    verified: studios.filter((s) => s.isVerified).length,
    featured: studios.filter((s) => s.isFeatured).length,
    withPhotos: studios.filter((s) => s.photos?.length > 0).length,
  };

  // Filter options for Select component
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active Only" },
    { value: "inactive", label: "Inactive Only" },
    { value: "verified", label: "Verified Only" },
    { value: "featured", label: "Featured Only" },
  ];

  const perPageOptions = [
    { value: "10", label: "10 per page" },
    { value: "25", label: "25 per page" },
    { value: "50", label: "50 per page" },
    { value: "100", label: "100 per page" },
  ];

  // Filter and sort studios
  const filteredStudios = studios
    .filter((studio) => {
      const matchesSearch =
        studio.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && studio.isActive) ||
        (statusFilter === "inactive" && !studio.isActive) ||
        (statusFilter === "verified" && studio.isVerified) ||
        (statusFilter === "featured" && studio.isFeatured);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "name") {
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage);
  const paginatedStudios = filteredStudios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudios(paginatedStudios.map((s) => s._id));
    } else {
      setSelectedStudios([]);
    }
  };

  const handleSelectStudio = (id) => {
    setSelectedStudios((prev) =>
      prev.includes(id)
        ? prev.filter((studioId) => studioId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedStudios.length === 0) return;

    if (action === "activate") {
      selectedStudios.forEach((id) => onStatusChange(id, { isActive: true }));
    } else if (action === "deactivate") {
      selectedStudios.forEach((id) => onStatusChange(id, { isActive: false }));
    } else if (action === "verify") {
      selectedStudios.forEach((id) => onStatusChange(id, { isVerified: true }));
    } else if (action === "feature") {
      selectedStudios.forEach((id) => onStatusChange(id, { isFeatured: true }));
    }
    setSelectedStudios([]);
  };

  const handleDeleteClick = (studioId, studioName) => {
    setDeleteModal({ isOpen: true, studioId, studioName });
  };

  const handleDeleteConfirm = async () => {
    await onDelete(deleteModal.studioId);
    setDeleteModal({ isOpen: false, studioId: null, studioName: "" });
  };

  const handleExport = () => {
    try {
      const dataToExport = selectedStudios.length > 0
        ? studios.filter(s => selectedStudios.includes(s._id))
        : filteredStudios;

      const csvData = dataToExport.map((studio) => ({
        Name: studio.name,
        Email: studio.user?.email || "",
        City: studio.city,
        State: studio.state,
        "Services Count": studio.services?.length || 0,
        Status: studio.isActive ? "Active" : "Inactive",
        Verified: studio.isVerified ? "Yes" : "No",
        Featured: studio.isFeatured ? "Yes" : "No",
        "Created At": new Date(studio.createdAt).toLocaleDateString(),
        "Photo Count": studio.photos?.length || 0,
      }));

      const headers = Object.keys(csvData[0] || {});
      const csv = [
        headers.join(","),
        ...csvData.map((row) =>
          headers
            .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `studios_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const SortableHeader = ({ children, sortKey }) => (
    <th
      className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        <span className="text-gray-900">{children}</span>
        {sortConfig.key === sortKey && (
          <span className="text-xs text-gray-500">
            {sortConfig.direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, studioId: null, studioName: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Studio"
        description={`Are you sure you want to delete "${deleteModal.studioName}"? This will also delete the user account.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        itemName={deleteModal.studioName}
      />

      {/* Stats Overview - Fixed text colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Studios"
          value={stats.total}
          icon={Building2}
          color="blue"
          description="All registered studios"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={Check}
          color="green"
          description="Currently active"
        />
        <StatsCard
          title="Verified"
          value={stats.verified}
          icon={Star}
          color="yellow"
          description="Verified by admin"
        />
        <StatsCard
          title="Featured"
          value={stats.featured}
          icon={Star}
          color="purple"
          description="Premium featured"
        />
        <StatsCard
          title="With Photos"
          value={stats.withPhotos}
          icon={Eye}
          color="gray"
          description="Have uploaded photos"
        />
      </div>

      {/* Filters and Actions - Fixed border colors */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, city, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${showFilters
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Filter className="h-4 w-4" />
                <span className="text-gray-700">Filters</span>
                {statusFilter !== "all" && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {selectedStudios.length > 0 && (
                <>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedStudios.length} selected
                  </span>
                  <Select
                    options={[
                      { value: "activate", label: "✓ Activate" },
                      { value: "deactivate", label: "✗ Deactivate" },
                      { value: "verify", label: "★ Verify" },
                      { value: "feature", label: "✨ Feature" },
                    ]}
                    value=""
                    onChange={(e) => handleBulkAction(e.target.value)}
                    placeholder="Bulk Actions"
                    className="w-40"
                  />
                </>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <div className="w-48">
                  <Select
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    placeholder="Filter by status"
                  />
                </div>
                <div className="w-40">
                  <Select
                    options={perPageOptions}
                    value={itemsPerPage.toString()}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    placeholder="Items per page"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table - Fixed text colors */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedStudios.length === paginatedStudios.length &&
                      paginatedStudios.length > 0
                    }
                    className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <SortableHeader sortKey="name">Studio</SortableHeader>
                <SortableHeader sortKey="city">Location</SortableHeader>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Services
                </th>
                <SortableHeader sortKey="isActive">Status</SortableHeader>
                <SortableHeader sortKey="createdAt">Created</SortableHeader>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedStudios.map((studio) => (
                <tr
                  key={studio._id}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => onStudioClick(studio)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedStudios.includes(studio._id)}
                      onChange={() => handleSelectStudio(studio._id)}
                      className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {studio.photos?.[0]?.url ? (
                          <Image
                            src={studio.photos[0].url}
                            alt={studio.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900 truncate">
                            {studio.name}
                          </span>
                          <div className="flex gap-1">
                            {studio.isFeatured && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                Featured
                              </span>
                            )}
                            {studio.isVerified && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {studio.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {studio.city}
                      </div>
                      <div className="text-gray-600 text-xs">{studio.state}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {studio.services?.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded border border-blue-200"
                        >
                          {service.service}
                        </span>
                      ))}
                      {studio.services?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-200">
                          +{studio.services.length - 2}
                        </span>
                      )}
                      {(!studio.services || studio.services.length === 0) && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-200">
                          No services
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${studio.isActive ? "bg-green-500" : "bg-red-400"
                          }`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {studio.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(studio.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <Link
                        href={`/studios/${studio._id}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Public Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Link> */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStudioClick(studio);
                        }}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Studio"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(studio._id, studio.name);
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Studio"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudios.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-900 text-lg font-medium mb-1">No studios found</p>
              <p className="text-gray-600 text-sm">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "Try changing your filters"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Fixed text colors */}
        {filteredStudios.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span> to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(currentPage * itemsPerPage, filteredStudios.length)}
                </span>{" "}
                of <span className="font-medium text-gray-900">{filteredStudios.length}</span> studios
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioTable;