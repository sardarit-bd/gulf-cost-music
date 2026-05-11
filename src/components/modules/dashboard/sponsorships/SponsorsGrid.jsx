"use client";

import { Building2, Search, X } from "lucide-react";
import SponsorCard from "./SponsorCard";

const SponsorsGrid = ({
  sponsors,
  loading,
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyPress,
  onClearSearch,
  hasActiveFilters,
  activeSearchTerm,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Search Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Sponsors ({sponsors.length})
            </h3>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search sponsors..."
                className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-colors"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyPress={onKeyPress}
              />
            </div>
            <button
              onClick={onSearch}
              className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            {(searchInput || activeSearchTerm) && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Search Badge */}
        {activeSearchTerm && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Searching for:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              <Search className="w-3 h-3" />
              {activeSearchTerm}
            </span>
          </div>
        )}
      </div>

      {/* Sponsors Grid */}
      {sponsors.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters
              ? "No matching sponsors found"
              : "No sponsors found"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
            {hasActiveFilters
              ? `No results found for "${activeSearchTerm}". Try adjusting your search.`
              : "Get started by adding your first sponsor."}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={onClearSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={onAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer"
            >
              Add Your First Sponsor
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {sponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor._id}
                sponsor={sponsor}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Footer Stats */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-medium text-gray-700">
                {sponsors.length}
              </span>{" "}
              sponsors
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SponsorsGrid;
