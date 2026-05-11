import { Edit, Eye, MapPin, Newspaper, Power, Save, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";

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
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                if (actionMenu === news._id) {
                    onActionMenuToggle(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionMenu, news._id, onActionMenuToggle]);

    const handleToggleMenu = (e) => {
        e.stopPropagation();
        onActionMenuToggle(news._id);
    };

    const handleMenuAction = (callback) => {
        return () => {
            callback();
            onActionMenuToggle(null);
        };
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                        {news.photos && news.photos.length > 0 ? (
                            <img
                                src={news.photos[0].url}
                                alt={news.title}
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                                <Newspaper className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => onInputChange('title', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="News title"
                                />
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => onInputChange('description', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="News description"
                                    rows="2"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {news.title || "Untitled"}
                                    </h3>
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                                        #{news.views || 0} views
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {truncateText(news.description, 60)}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center text-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                            {news.journalist?.fullName?.charAt(0) || news.journalist?.username?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-gray-700">
                            {news.journalist?.fullName || news.journalist?.username || "Unknown"}
                        </span>
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => onInputChange('location', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Location"
                        />
                    ) : news.location && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getLocationColor(news.location)}`}>
                            <MapPin className="w-3 h-3 mr-1" />
                            {news.location}
                        </span>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                    {new Date(news.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">
                    {new Date(news.createdAt).toLocaleTimeString()}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.isActive?.toString() || 'false'}
                        onChange={(e) => onInputChange('isActive', e.target.value === 'true')}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                    >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${news.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${news.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        {news.isActive ? 'Published' : 'Draft'}
                    </span>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-1">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(news._id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer"
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
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium cursor-pointer"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onViewNews(news)}
                                className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                                title="View Details"
                            >
                                <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                                onClick={() => onToggleStatus(news._id, news.isActive, news.title)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${news.isActive
                                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                                title={news.isActive ? "Unpublish" : "Publish"}
                            >
                                <Power className="w-3.5 h-3.5" />
                            </button>

                            <div className="relative">
                                <button
                                    ref={buttonRef}
                                    onClick={handleToggleMenu}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </button>

                                {actionMenu === news._id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
                                    >
                                        <button
                                            onClick={handleMenuAction(() => onEdit(news))}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Article
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleMenuAction(() => onDeleteNews(news._id, news.title))}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
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


export default NewsRow;