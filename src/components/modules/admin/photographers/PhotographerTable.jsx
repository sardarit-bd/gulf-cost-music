"use client";

import { useState, useEffect, useRef } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PhotographerRow from "./PhotographerRow";
import PlanChangeModal from "./PlanChangeModal";
import ViewProfileModal from "./ViewProfileModal";
import { Search, X, Camera } from "lucide-react";

export default function PhotographerTable({
    photographers,
    pagination,
    filters,
    onFilterChange,
    onRefresh,
    onPageChange,
    loading,
}) {
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [planTarget, setPlanTarget] = useState(null);
    const [localSearch, setLocalSearch] = useState(filters.search || "");
    const tableRef = useRef(null);

    const hasActiveFilters = filters.search;

    const handleSearch = () => {
        onFilterChange("search", localSearch);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setLocalSearch("");
        onFilterChange("search", "");
    };

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
        <>
            <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Search Header - Inside Table Container */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                                Photographers ({photographers.length})
                            </h3>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                                <input
                                    type="text"
                                    placeholder="Search photographers..."
                                    className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-colors"
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
                            {localSearch && (
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
                    {filters.search && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500">Searching for:</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                <Search className="w-3 h-3" />
                                {filters.search}
                            </span>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Photographer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {photographers.length > 0 ? (
                                photographers.map((photographer) => (
                                    <PhotographerRow
                                        key={photographer._id}
                                        photographer={photographer}
                                        onRefresh={onRefresh}
                                        onView={setSelected}
                                        onDelete={setDeleteTarget}
                                        onPlan={setPlanTarget}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="text-lg font-medium text-gray-900 mb-1">No photographers found</p>
                                            <p className="text-sm">
                                                {hasActiveFilters ? `No results found for "${filters.search}"` : "No photographers have been registered yet"}
                                            </p>
                                            {hasActiveFilters && (
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
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{pagination.current}</span> of{" "}
                                <span className="font-medium">{pagination.pages}</span>
                            </p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onPageChange(Math.max(1, pagination.current - 1))}
                                    disabled={pagination.current === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => onPageChange(pageNumber)}
                                            className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${pagination.current === pageNumber
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => onPageChange(Math.min(pagination.pages, pagination.current + 1))}
                                    disabled={pagination.current === pagination.pages}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ViewProfileModal
                photographer={selected}
                isOpen={!!selected}
                onClose={() => setSelected(null)}
            />

            <DeleteConfirmationModal
                photographer={deleteTarget}
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    setDeleteTarget(null);
                    onRefresh();
                }}
            />

            <PlanChangeModal
                photographer={planTarget}
                isOpen={!!planTarget}
                onClose={() => setPlanTarget(null)}
                onConfirm={onRefresh}
            />
        </>
    );
}