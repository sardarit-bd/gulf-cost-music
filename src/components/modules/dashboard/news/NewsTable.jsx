"use client";
import {
    Newspaper,
    Search,
    X
} from "lucide-react";
import { useEffect, useRef } from "react";
import NewsRow from "./NewsRow";

const NewsTable = ({
    newsList,
    loading,
    page,
    pages,
    editingNews,
    formData,
    saveLoading,
    actionMenu,
    onPageChange,
    onViewNews,
    onToggleStatus,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteNews,
    onActionMenuToggle,
    // Search props
    searchInput,
    onSearchInputChange,
    onSearch,
    onKeyPress,
    onClearFilters,
    hasActiveFilters,
    activeSearchTerm
}) => {
    const tableRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                if (actionMenu !== null) {
                    onActionMenuToggle(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionMenu, onActionMenuToggle]);

    const getLocationColor = (location) => {
        const colors = {
            'new orleans': 'bg-purple-100 text-purple-800 border-purple-200',
            'mobile': 'bg-blue-100 text-blue-800 border-blue-200',
            'biloxi': 'bg-green-100 text-green-800 border-green-200',
            'pensacola': 'bg-orange-100 text-orange-800 border-orange-200',
            'baton rouge': 'bg-red-100 text-red-800 border-red-200',
            'jackson': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
        return colors[location?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Search Header - Inside Table Container */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                            News Articles ({newsList.length})
                        </h3>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <input
                                type="text"
                                placeholder="Search news..."
                                className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-400 focus:border-orange-400 outline-none transition-colors"
                                value={searchInput || ""}
                                onChange={(e) => onSearchInputChange(e.target.value)}
                                onKeyPress={onKeyPress}
                            />
                        </div>
                        <button
                            onClick={onSearch}
                            className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <Search className="w-3.5 h-3.5" />
                            Search
                        </button>
                        {searchInput && (
                            <button
                                onClick={onClearFilters}
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                            <Search className="w-3 h-3" />
                            {activeSearchTerm}
                        </span>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Article
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author & Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {newsList.length > 0 ? (
                            newsList.map((news) => (
                                <NewsRow
                                    key={news._id}
                                    news={news}
                                    editingNews={editingNews}
                                    formData={formData}
                                    saveLoading={saveLoading}
                                    actionMenu={actionMenu}
                                    getLocationColor={getLocationColor}
                                    truncateText={truncateText}
                                    onViewNews={onViewNews}
                                    onToggleStatus={onToggleStatus}
                                    onEdit={onEdit}
                                    onSave={onSave}
                                    onCancel={onCancel}
                                    onInputChange={onInputChange}
                                    onDeleteNews={onDeleteNews}
                                    onActionMenuToggle={onActionMenuToggle}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900 mb-1">No news found</p>
                                        <p className="text-sm">
                                            {activeSearchTerm ? `No results found for "${activeSearchTerm}"` : "No news articles have been created yet"}
                                        </p>
                                        {activeSearchTerm && (
                                            <button
                                                onClick={onClearFilters}
                                                className="mt-3 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors cursor-pointer"
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
            {pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{pages}</span>
                        </p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onPageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${page === pageNumber
                                            ? "bg-orange-600 text-white"
                                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => onPageChange(Math.min(pages, page + 1))}
                                disabled={page === pages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default NewsTable;