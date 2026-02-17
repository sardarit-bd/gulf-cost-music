"use client";
import {
    Calendar,
    CheckSquare,
    Edit,
    Eye,
    MapPin,
    MoreVertical,
    Newspaper,
    Power,
    Square,
    Trash2,
    User
} from "lucide-react";

export const NewsGrid = ({
    newsList,
    editingNews,
    formData,
    saveLoading,
    actionMenu,
    selectedNews = [],
    onSelectNews,
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
            'new orleans': 'bg-purple-100 text-purple-800',
            'mobile': 'bg-blue-100 text-blue-800',
            'biloxi': 'bg-green-100 text-green-800',
            'pensacola': 'bg-orange-100 text-orange-800',
        };
        return colors[location?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((news) => {
                    const isEditing = editingNews === news._id;

                    if (isEditing) {
                        return (
                            <div key={news._id} className="col-span-1 bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) => onInputChange('title', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                        placeholder="News title"
                                    />
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => onInputChange('description', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                        placeholder="News description"
                                        rows="4"
                                    />
                                    <input
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={(e) => onInputChange('location', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                        placeholder="Location"
                                    />
                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            onClick={() => onSave(news._id)}
                                            disabled={saveLoading}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                                        >
                                            {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={onCancel}
                                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={news._id}
                            className={`group relative bg-white rounded-2xl border ${selectedNews.includes(news._id)
                                    ? 'border-orange-500 ring-2 ring-orange-200'
                                    : 'border-gray-200 hover:border-orange-200'
                                } overflow-hidden hover:shadow-xl transition-all`}
                        >
                            {/* Selection Checkbox */}
                            {onSelectNews && (
                                <button
                                    onClick={() => onSelectNews(news._id)}
                                    className="absolute top-4 left-4 z-10 p-1.5 bg-white rounded-lg shadow-md hover:bg-orange-50 transition-colors"
                                >
                                    {selectedNews.includes(news._id) ? (
                                        <CheckSquare className="w-4 h-4 text-orange-600" />
                                    ) : (
                                        <Square className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            )}

                            {/* Image Section */}
                            <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600">
                                {news.photos && news.photos.length > 0 ? (
                                    <img
                                        src={news.photos[0].url}
                                        alt={news.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Newspaper className="w-16 h-16 text-white/50" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${news.isActive
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }`}>
                                        {news.isActive ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                {/* Views Count */}
                                <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
                                    {news.views || 0} views
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
                                    {news.title || "Untitled"}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                    {news.description}
                                </p>

                                {/* Meta Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">
                                            {news.journalist?.fullName || news.journalist?.username || "Unknown"}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLocationColor(news.location)}`}>
                                            {news.location || "No location"}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        {new Date(news.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewNews(news)}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onToggleStatus(news._id, news.isActive, news.title)}
                                            className={`p-2 rounded-lg transition-all ${news.isActive
                                                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                            title={news.isActive ? "Unpublish" : "Publish"}
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => onActionMenuToggle(news._id)}
                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {actionMenu === news._id && (
                                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-10 animate-slideDown">
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
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};