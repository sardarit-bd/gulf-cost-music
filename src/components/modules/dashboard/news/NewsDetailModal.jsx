"use client";
import {
    Calendar,
    MapPin,
    Newspaper,
    PenTool,
    User,
    X
} from "lucide-react";

const NewsDetailModal = ({ newsItem, onClose, onEdit }) => {
    if (!newsItem) return null;

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">News Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
                                <Newspaper className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">{newsItem.title}</h4>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <PenTool className="w-4 h-4 mr-2" />
                                    By {newsItem.journalist?.fullName || newsItem.journalist?.username}
                                </p>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {newsItem.createdAt ? new Date(newsItem.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Location:</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLocationColor(newsItem.location)}`}>
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {newsItem.location ? newsItem.location.charAt(0).toUpperCase() + newsItem.location.slice(1) : "Not specified"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Status:</label>
                                    <div className="mt-1">
                                        {newsItem.isActive ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {newsItem.credit && (
                                    <div>
                                        <label className="font-medium text-gray-700">Credit:</label>
                                        <p className="text-gray-600 mt-1">{newsItem.credit}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="font-medium text-gray-700">Journalist:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        {newsItem.journalist?.fullName || newsItem.journalist?.username}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1 ml-6">
                                        {newsItem.journalist?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700">Description:</label>
                            <p className="text-gray-600 mt-2 text-sm leading-relaxed whitespace-pre-line">
                                {newsItem.description}
                            </p>
                        </div>

                        {newsItem.photos && newsItem.photos.length > 0 && (
                            <div>
                                <label className="font-medium text-gray-700">Photos:</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {newsItem.photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo.url}
                                            alt={`News ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(newsItem);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Edit News
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailModal;