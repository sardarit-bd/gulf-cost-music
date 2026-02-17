import {
    Calendar,
    CheckSquare,
    Clock,
    Edit,
    Eye,
    MapPin,
    MoreVertical,
    Newspaper,
    Power,
    Save,
    Square,
    Trash2,
    X
} from "lucide-react";

export const NewsRow = ({
    news,
    editingNews,
    formData,
    saveLoading,
    actionMenu,
    getLocationColor,
    truncateText,
    isSelected,
    onSelect,
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
        <tr className={`hover:bg-gray-50 transition-colors group ${isSelected ? 'bg-orange-50/50' : ''}`}>
            <td className="px-6 py-4">
                <div className="flex items-start space-x-3">
                    {/* Checkbox for selection (only in table mode) */}
                    {onSelect && (
                        <button
                            onClick={onSelect}
                            className="mt-1 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                            {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-orange-600" />
                            ) : (
                                <Square className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    {/* News Image */}
                    <div className="relative flex-shrink-0">
                        {news.photos && news.photos.length > 0 ? (
                            <img
                                src={news.photos[0].url}
                                alt={news.title}
                                className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-100"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white ring-2 ring-orange-100">
                                <Newspaper className="w-5 h-5" />
                            </div>
                        )}
                        {news.isFeatured && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full ring-2 ring-white"></span>
                        )}
                    </div>

                    {/* News Content */}
                    <div className="min-w-0">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => onInputChange('title', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="News title"
                                />
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => onInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="News description"
                                    rows="3"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 line-clamp-1">
                                        {news.title || "Untitled"}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        #{news.views || 0} views
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {truncateText(news.description, 50)}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                            {news.journalist?.fullName?.charAt(0) || news.journalist?.username?.charAt(0) || 'U'}
                        </div>
                        <span className="text-gray-700 font-medium">
                            {news.journalist?.fullName || news.journalist?.username || "Unknown"}
                        </span>
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => onInputChange('location', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Location"
                        />
                    ) : news.location && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLocationColor(news.location)}`}>
                            <MapPin className="w-3 h-3 mr-1" />
                            {news.location}
                        </span>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(news.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(news.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.isActive?.toString() || 'false'}
                        onChange={(e) => onInputChange('isActive', e.target.value === 'true')}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                ) : (
                    <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${news.isActive
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${news.isActive ? 'bg-green-500' : 'bg-red-500'
                                }`}></span>
                            {news.isActive ? 'Published' : 'Draft'}
                        </span>

                        {/* {news.isActive && (
                            <button
                                onClick={() => window.open(`/news/${news._id}`, '_blank')}
                                className="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View on site
                            </button>
                        )} */}
                    </div>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(news._id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium disabled:opacity-50"
                            >
                                {saveLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                                ) : (
                                    <Save className="w-4 h-4 mr-1" />
                                )}
                                {saveLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onViewNews(news)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all hover:scale-105"
                                title="View Details"
                            >
                                <Eye className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => onToggleStatus(news._id, news.isActive, news.title)}
                                className={`p-2 rounded-lg transition-all hover:scale-105 ${news.isActive
                                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                title={news.isActive ? "Unpublish" : "Publish"}
                            >
                                <Power className="w-4 h-4" />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => onActionMenuToggle(news._id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === news._id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border py-1 z-10 animate-slideDown">
                                        <button
                                            onClick={() => onEdit(news)}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Article
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={() => onDeleteNews(news._id, news.title)}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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