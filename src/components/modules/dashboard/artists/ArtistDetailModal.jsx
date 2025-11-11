"use client";
import { Calendar, Mail, MapPin, Music, X } from "lucide-react";

const ArtistDetailModal = ({ artist, onClose, onEdit }) => {
    if (!artist) return null;

    const getGenreColor = (genre) => {
        const colors = {
            'rock': 'bg-red-100 text-red-800 border-red-200',
            'pop': 'bg-blue-100 text-blue-800 border-blue-200',
            'jazz': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'hiphop': 'bg-purple-100 text-purple-800 border-purple-200',
            'electronic': 'bg-green-100 text-green-800 border-green-200',
            'classical': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'rnb': 'bg-pink-100 text-pink-800 border-pink-200',
            'country': 'bg-orange-100 text-orange-800 border-orange-200',
            'metal': 'bg-gray-100 text-gray-800 border-gray-200',
            'folk': 'bg-teal-100 text-teal-800 border-teal-200',
        };
        return colors[genre?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Artist Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                                {artist.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">{artist.name}</h4>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {artist.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Genre:</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGenreColor(artist.genre)}`}>
                                            <Music className="w-4 h-4 mr-1" />
                                            {artist.genre || "Not specified"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Location:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {artist.city || "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Status:</label>
                                    <div className="mt-1">
                                        {artist.isActive ? (
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
                                <div>
                                    <label className="font-medium text-gray-700">Joined:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>

                                {artist.phone && (
                                    <div>
                                        <label className="font-medium text-gray-700">Phone:</label>
                                        <p className="text-gray-600 mt-1">{artist.phone}</p>
                                    </div>
                                )}

                                {artist.website && (
                                    <div>
                                        <label className="font-medium text-gray-700">Website:</label>
                                        <p className="text-gray-600 mt-1 truncate">
                                            <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {artist.website}
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {artist.bio && (
                            <div>
                                <label className="font-medium text-gray-700">Bio:</label>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{artist.bio}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(artist);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Edit Profile
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

export default ArtistDetailModal;