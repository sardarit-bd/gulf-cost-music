// components/studios/StudioTable.js
"use client";

import {
  AlertCircle,
  Building2,
  Check,
  Edit,
  Eye,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StatsCard from "./StatsCard";

const StudioTable = ({ studios, onStatusChange, onDelete, onStudioClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudios, setSelectedStudios] = useState([]);
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
    recent: studios.filter((s) => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(s.createdAt) > oneWeekAgo;
    }).length,
  };

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

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudios(filteredStudios.map((s) => s._id));
    } else {
      setSelectedStudios([]);
    }
  };

  const handleSelectStudio = (id) => {
    setSelectedStudios((prev) =>
      prev.includes(id)
        ? prev.filter((studioId) => studioId !== id)
        : [...prev, id],
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

  const SortableHeader = ({ children, sortKey }) => (
    <th
      className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortConfig.key === sortKey && (
          <span className="text-xs">
            {sortConfig.direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Studios"
          value={stats.total}
          icon={Building2}
          color="blue"
          description="All registered studios"
        />
        <StatsCard
          title="Active Studios"
          value={stats.active}
          icon={Check}
          color="green"
          trend={{ type: "up", value: "+12%" }}
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
          description="Premium featured studios"
        />
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search studios by name, city, state, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          {selectedStudios.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedStudios.length} selected
              </span>
              <div className="flex gap-2">
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Bulk Actions</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="verify">Mark Verified</option>
                  <option value="feature">Mark Featured</option>
                </select>
                <button
                  onClick={() => setSelectedStudios([])}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedStudios.length === filteredStudios.length &&
                      filteredStudios.length > 0
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              {filteredStudios.map((studio) => (
                <tr
                  key={studio._id}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => onStudioClick && onStudioClick(studio)}
                >
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudios.includes(studio._id)}
                      onChange={() => handleSelectStudio(studio._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
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
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900 truncate">
                            {studio.name}
                          </div>
                          <div className="flex gap-1">
                            {studio.isFeatured && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full whitespace-nowrap">
                                Featured
                              </span>
                            )}
                            {studio.isVerified && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full whitespace-nowrap">
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
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {studio.city}
                      </div>
                      <div className="text-gray-500">{studio.state}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {studio.services?.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded whitespace-nowrap"
                        >
                          {service.service}
                        </span>
                      ))}
                      {studio.services?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded whitespace-nowrap">
                          +{studio.services.length - 2} more
                        </span>
                      )}
                      {(!studio.services || studio.services.length === 0) && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                          No services
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          studio.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">
                        {studio.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(studio.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/studios/${studio._id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Public Profile"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStudioClick && onStudioClick(studio);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Studio"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(studio._id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No studios found</p>
              <p className="text-gray-400 text-sm">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "Try changing your filters"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination/Footer */}
        {filteredStudios.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{filteredStudios.length}</span> of{" "}
                <span className="font-medium">{studios.length}</span> studios
              </div>
              <div className="text-sm text-gray-500">
                {selectedStudios.length > 0 && (
                  <span className="mr-4">
                    {selectedStudios.length} selected
                  </span>
                )}
                Last updated:{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioTable;
