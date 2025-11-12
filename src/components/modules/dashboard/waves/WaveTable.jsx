"use client";
import {
    Calendar,
    Edit,
    ExternalLink,
    Eye,
    MoreVertical,
    Music,
    Trash2
} from "lucide-react";

const WaveTable = ({
    waves,
    loading,
    onEdit,
    onDelete,
    onView,
    actionMenu,
    onActionMenuToggle
}) => {
    // Extract YouTube video ID
    const getYouTubeId = (url) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <div className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    <p className="text-gray-600">Loading open mic sessions...</p>
                </div>
            </div>
        );
    }

    if (waves.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <Music className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No sessions found</p>
                <p className="text-gray-600 text-sm sm:text-base">
                    Get started by adding your first open mic session
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    Open Mic Sessions ({waves.length})
                </h3>
                <div className="text-sm text-gray-500">
                    {waves.length} sessions found
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Session
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                YouTube Video
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Thumbnail
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {waves.map((wave) => {
                            const youtubeId = getYouTubeId(wave.youtubeUrl);
                            return (
                                <WaveRow
                                    key={wave._id}
                                    wave={wave}
                                    youtubeId={youtubeId}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onView={onView}
                                    actionMenu={actionMenu}
                                    onActionMenuToggle={onActionMenuToggle}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const WaveRow = ({
    wave,
    youtubeId,
    onEdit,
    onDelete,
    onView,
    actionMenu,
    onActionMenuToggle
}) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                            {wave.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {wave.createdAt ? new Date(wave.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        {/* Mobile only YouTube link */}
                        <div className="sm:hidden mt-2">
                            <a
                                href={wave.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                            >
                                <span>Watch on YouTube</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                <a
                    href={wave.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                    {wave.youtubeUrl}
                </p>
            </td>
            <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                <div className="flex items-center space-x-2">
                    {wave.thumbnail ? (
                        <img
                            src={wave.thumbnail}
                            alt={wave.title}
                            className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded border"
                        />
                    ) : youtubeId ? (
                        <img
                            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt="YouTube thumbnail"
                            className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded border"
                        />
                    ) : (
                        <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gray-100 rounded border flex items-center justify-center">
                            <Music className="w-4 h-4 text-gray-400" />
                        </div>
                    )}
                    <span className="text-xs text-gray-500 hidden lg:inline">
                        {wave.thumbnail ? 'Custom' : 'YouTube'}
                    </span>
                </div>
            </td>
            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-1 sm:space-x-2">
                    <button
                        onClick={() => onEdit(wave)}
                        className="p-1 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit Session"
                    >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                        onClick={() => onView(wave.youtubeUrl)}
                        className="p-1 sm:p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Watch on YouTube"
                    >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => onActionMenuToggle(wave._id)}
                            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>

                        {actionMenu === wave._id && (
                            <div className="absolute right-0 mt-1 w-36 sm:w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                <button
                                    onClick={() => {
                                        onActionMenuToggle(null);
                                        onEdit(wave);
                                    }}
                                    className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                    Edit Session
                                </button>
                                <button
                                    onClick={() => onDelete(wave._id, wave.title)}
                                    className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                    Delete Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default WaveTable;