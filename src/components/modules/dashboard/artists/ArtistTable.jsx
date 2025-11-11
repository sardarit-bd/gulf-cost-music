"use client";
import {
    Calendar,
    Edit,
    Eye,
    Mail,
    MapPin,
    MoreVertical,
    Music,
    Power,
    Save,
    Trash2,
    X
} from "lucide-react";

const ArtistTable = ({
    artists,
    loading,
    page,
    pages,
    editingArtist,
    formData,
    saveLoading,
    actionMenu,
    onPageChange,
    onViewProfile,
    onToggleActive,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteArtist,
    onActionMenuToggle
}) => {
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

    const availableGenres = [
        'Rock', 'Pop', 'Jazz', 'Hip Hop', 'Electronic', 'Classical',
        'R&B', 'Country', 'Metal', 'Folk', 'Blues', 'Reggae'
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Artists ({artists.length})
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
                                Artist
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {artists.length > 0 ? (
                            artists.map((artist) => (
                                <ArtistRow
                                    key={artist._id}
                                    artist={artist}
                                    editingArtist={editingArtist}
                                    formData={formData}
                                    saveLoading={saveLoading}
                                    actionMenu={actionMenu}
                                    getGenreColor={getGenreColor}
                                    availableGenres={availableGenres}
                                    onViewProfile={onViewProfile}
                                    onToggleActive={onToggleActive}
                                    onEdit={onEdit}
                                    onSave={onSave}
                                    onCancel={onCancel}
                                    onInputChange={onInputChange}
                                    onDeleteArtist={onDeleteArtist}
                                    onActionMenuToggle={onActionMenuToggle}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">No artists found</p>
                                        <p className="text-sm">No artists have been registered yet</p>
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
                    artistsCount={artists.length}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

const ArtistRow = ({
    artist,
    editingArtist,
    formData,
    saveLoading,
    actionMenu,
    getGenreColor,
    availableGenres,
    onViewProfile,
    onToggleActive,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteArtist,
    onActionMenuToggle
}) => {
    const isEditing = editingArtist === artist._id;

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {artist.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => onInputChange('name', e.target.value)}
                                className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-32"
                                placeholder="Artist name"
                            />
                        ) : (
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                                {artist.name}
                            </div>
                        )}
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {artist.user?.email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    {isEditing ? (
                        <>
                            <select
                                value={formData.genre || ''}
                                onChange={(e) => onInputChange('genre', e.target.value)}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                            >
                                <option value="">Select Genre</option>
                                {availableGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={formData.city || ''}
                                onChange={(e) => onInputChange('city', e.target.value)}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                                placeholder="City"
                            />
                        </>
                    ) : (
                        <>
                            {artist.genre && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGenreColor(artist.genre)}`}>
                                    <Music className="w-3 h-3 mr-1" />
                                    {artist.genre}
                                </span>
                            )}
                            {artist.city && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {artist.city}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.isActive?.toString() || 'false'}
                        onChange={(e) => onInputChange('isActive', e.target.value === 'true')}
                        className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                ) : artist.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Inactive
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(artist._id)}
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
                                onClick={() => onViewProfile(artist)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Profile"
                            >
                                <Eye className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => onToggleActive(artist._id, artist.isActive)}
                                className={`p-2 rounded-lg transition-colors ${artist.isActive
                                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                title={artist.isActive ? "Deactivate" : "Activate"}
                            >
                                <Power className="w-4 h-4" />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => onActionMenuToggle(artist._id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === artist._id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button
                                            onClick={() => onEdit(artist)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={() => onDeleteArtist(artist._id)}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Artist
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

const Pagination = ({ page, pages, artistsCount, onPageChange }) => {
    return (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing {artistsCount} artists on page {page} of {pages}
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
                                        ? "bg-purple-600 text-white shadow-sm"
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

export default ArtistTable;