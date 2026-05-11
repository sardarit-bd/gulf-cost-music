"use client";

import DeleteModal from "@/ui/DeleteModal";
import {
  Building2,
  Check,
  Eye,
  Search,
  Star,
  Trash2,
  X
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import StatsCard from "./StatsCard";

const StudioTable = ({ studios, onStatusChange, onDelete, onStudioClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, studioId: null, studioName: "" });
  const tableRef = useRef(null);

  // Calculate stats
  const stats = {
    total: studios.length,
    active: studios.filter((s) => s.isActive).length,
    verified: studios.filter((s) => s.isVerified).length,
    featured: studios.filter((s) => s.isFeatured).length,
    withPhotos: studios.filter((s) => s.photos?.length > 0).length,
  };

  const hasActiveFilters = searchTerm !== "";

  const handleSearch = () => {
    setSearchTerm(localSearch);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter studios
  const filteredStudios = studios.filter((studio) => {
    const matchesSearch =
      searchTerm === "" ||
      studio.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage);
  const paginatedStudios = filteredStudios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (studioId, studioName) => {
    setDeleteModal({ isOpen: true, studioId, studioName });
  };

  const handleDeleteConfirm = async () => {
    await onDelete(deleteModal.studioId);
    setDeleteModal({ isOpen: false, studioId: null, studioName: "" });
  };

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

      {/* Stats Cards - Matching Events Page Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatsCard
          title="Total Studios"
          value={stats.total}
          icon={Building2}
          color="blue"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={Check}
          color="green"
        />
        <StatsCard
          title="Verified"
          value={stats.verified}
          icon={Star}
          color="yellow"
        />
        <StatsCard
          title="Featured"
          value={stats.featured}
          icon={Star}
          color="purple"
        />
        <StatsCard
          title="With Photos"
          value={stats.withPhotos}
          icon={Eye}
          color="gray"
        />
      </div>

      {/* Table Container */}
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Header - Inside Table Container */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Studios ({filteredStudios.length})
              </h3>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search studios..."
                  className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
              {(localSearch || searchTerm) && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active Search Badge */}
          {searchTerm && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Searching for:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                <Search className="w-3 h-3" />
                {searchTerm}
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Studio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudios.length > 0 ? (
                paginatedStudios.map((studio) => (
                  <tr
                    key={studio._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onStudioClick(studio)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {studio.photos?.[0]?.url ? (
                            <Image
                              src={studio.photos[0].url}
                              alt={studio.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {studio.name}
                            </span>
                            <div className="flex gap-1">
                              {studio.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                  Featured
                                </span>
                              )}
                              {studio.isVerified && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {studio.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {studio.city || "N/A"}
                        </div>
                        <div className="text-gray-500 text-xs">{studio.state || ""}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {studio.services?.slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                          >
                            {service.service}
                          </span>
                        ))}
                        {studio.services?.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            +{studio.services.length - 2}
                          </span>
                        )}
                        {(!studio.services || studio.services.length === 0) && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                            No services
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${studio.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${studio.isActive ? "bg-green-500" : "bg-red-500"}`} />
                        {studio.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(studio.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStudioClick(studio);
                          }}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Studio"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(studio._id, studio.name);
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Studio"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900 mb-1">No studios found</p>
                      <p className="text-sm">
                        {searchTerm ? `No results found for "${searchTerm}"` : "No studios have been registered yet"}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors cursor-pointer"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                >
                  Next
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