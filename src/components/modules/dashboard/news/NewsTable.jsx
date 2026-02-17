"use client";
import {
    CheckSquare,
    Newspaper,
    Square
} from "lucide-react";
import { NewsGrid } from "./NewsGrid";
import { NewsRow } from "./NewsRow";
import Pagination from "./Pagination";

const NewsTable = ({
    newsList,
    loading,
    page,
    pages,
    editingNews,
    formData,
    saveLoading,
    actionMenu,
    viewMode = "table",
    selectedNews = [],
    onSelectAll,
    onSelectNews,
    onPageChange,
    onViewNews,
    onToggleStatus,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteNews,
    onActionMenuToggle
}) => {
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
            <div className="bg-white rounded-2xl border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-500 font-medium">Loading news articles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center">
                            {viewMode === "table" && (
                                <button
                                    onClick={onSelectAll}
                                    className="mr-2 text-gray-400 hover:text-orange-600 transition-colors"
                                >
                                    {selectedNews.length === newsList.length && newsList.length > 0 ? (
                                        <CheckSquare className="w-5 h-5 text-orange-600" />
                                    ) : (
                                        <Square className="w-5 h-5" />
                                    )}
                                </button>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900">
                                {viewMode === "table" ? "News Articles" : "News Grid"}
                            </h3>
                        </div>
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {newsList.length} {newsList.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">
                            Page {page} of {pages}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {newsList.length > 0 ? (
                <>
                    {viewMode === "table" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                Article
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Author & Location
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {newsList.map((news) => (
                                        <NewsRow
                                            key={news._id}
                                            news={news}
                                            editingNews={editingNews}
                                            formData={formData}
                                            saveLoading={saveLoading}
                                            actionMenu={actionMenu}
                                            getLocationColor={getLocationColor}
                                            truncateText={truncateText}
                                            isSelected={selectedNews.includes(news._id)}
                                            onSelect={() => onSelectNews(news._id)}
                                            onViewNews={onViewNews}
                                            onToggleStatus={onToggleStatus}
                                            onEdit={onEdit}
                                            onSave={onSave}
                                            onCancel={onCancel}
                                            onInputChange={onInputChange}
                                            onDeleteNews={onDeleteNews}
                                            onActionMenuToggle={onActionMenuToggle}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <NewsGrid
                            newsList={newsList}
                            editingNews={editingNews}
                            formData={formData}
                            saveLoading={saveLoading}
                            actionMenu={actionMenu}
                            selectedNews={selectedNews}
                            onSelectNews={onSelectNews}
                            onViewNews={onViewNews}
                            onToggleStatus={onToggleStatus}
                            onEdit={onEdit}
                            onSave={onSave}
                            onCancel={onCancel}
                            onInputChange={onInputChange}
                            onDeleteNews={onDeleteNews}
                            onActionMenuToggle={onActionMenuToggle}
                        />
                    )}
                </>
            ) : (
                <div className="py-16 text-center">
                    <div className="inline-flex p-4 bg-orange-50 rounded-full mb-4">
                        <Newspaper className="w-12 h-12 text-orange-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No news articles found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first news article</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                        Create New Article
                    </button>
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                    <Pagination
                        page={page}
                        pages={pages}
                        newsCount={newsList.length}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default NewsTable;