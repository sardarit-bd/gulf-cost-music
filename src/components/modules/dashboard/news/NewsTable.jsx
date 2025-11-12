"use client";
import {
    Calendar,
    Clock,
    Edit,
    Eye,
    MapPin,
    MoreVertical,
    Newspaper,
    Power,
    Save,
    Trash2,
    User,
    X
} from "lucide-react";

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
    onActionMenuToggle
}) => {
    const getLocationColor = (location) => {
        const colors = {
            'dubai': 'bg-blue-100 text-blue-800 border-blue-200',
            'abu dhabi': 'bg-green-100 text-green-800 border-green-200',
            'sharjah': 'bg-purple-100 text-purple-800 border-purple-200',
            'ajman': 'bg-orange-100 text-orange-800 border-orange-200',
            'ras al khaimah': 'bg-red-100 text-red-800 border-red-200',
            'fujairah': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'umm al quwain': 'bg-pink-100 text-pink-800 border-pink-200',
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    News Articles ({newsList.length})
                </h3>
                <div className="text-sm text-gray-500">
                    Page {page} of {pages}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Article
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
                                        <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">No news articles found</p>
                                        <p className="text-sm">
                                            Get started by creating your first news article
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <Pagination
                    page={page}
                    pages={pages}
                    newsCount={newsList.length}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

const NewsRow = ({
    news,
    editingNews,
    formData,
    saveLoading,
    actionMenu,
    getLocationColor,
    truncateText,
    onViewNews,
    onToggleStatus,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteNews,
    onActionMenuToggle
}) => {
    const isEditing = editingNews === news._id;

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-start space-x-3">
                    {news.photos && news.photos.length > 0 ? (
                        <img
                            src={news.photos[0].url}
                            alt={news.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                            <Newspaper className="w-5 h-5" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => onInputChange('title', e.target.value)}
                                    className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                                    placeholder="News title"
                                />
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => onInputChange('description', e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                                    placeholder="News description"
                                    rows="2"
                                />
                            </div>
                        ) : (
                            <>
                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 line-clamp-2">
                                    {news.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {truncateText(news.description, 80)}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{news.journalist?.fullName || news.journalist?.username || "Unknown"}</span>
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => onInputChange('location', e.target.value)}
                            className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                            placeholder="Location"
                        />
                    ) : news.location && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLocationColor(news.location)}`}>
                            <MapPin className="w-3 h-3 mr-1" />
                            {news.location}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(news.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(news.createdAt).toLocaleTimeString()}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.isActive?.toString() || 'false'}
                        onChange={(e) => onInputChange('isActive', e.target.value === 'true')}
                        className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                ) : news.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Published
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Draft
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(news._id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {saveLoading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ) : (
                                    <Save className="w-3 h-3 mr-1" />
                                )}
                                {saveLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onViewNews(news)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Article"
                            >
                                <Eye className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => onToggleStatus(news._id, news.isActive, news.title)}
                                className={`p-2 rounded-lg transition-colors ${news.isActive
                                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                title={news.isActive ? "Unpublish" : "Publish"}
                            >
                                <Power className="w-4 h-4" />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => onActionMenuToggle(news._id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === news._id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button
                                            onClick={() => onEdit(news)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Article
                                        </button>
                                        <button
                                            onClick={() => onDeleteNews(news._id, news.title)}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Article
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

const Pagination = ({ page, pages, newsCount, onPageChange }) => {
    return (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing {newsCount} articles on page {page} of {pages}
                </p>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="text-gray-500 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <span>Previous</span>
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === pageNumber
                                    ? "bg-orange-600 text-white shadow-sm"
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
                        className="text-gray-500 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <span>Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsTable;