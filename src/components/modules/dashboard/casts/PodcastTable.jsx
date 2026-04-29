"use client";

import CustomLoader from "@/components/shared/loader/Loader";
import { Edit, ExternalLink, Play, Trash2, Upload, Youtube } from "lucide-react";

const PodcastTable = ({ podcasts, loading, onEdit, onDelete, onAddNew }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading podcasts...</p>
                </div>
            </div>
        );
    }

    if (!podcasts || podcasts.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="py-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No podcasts found
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Get started by adding your first podcast episode. You can add YouTube links or upload videos directly.
                    </p>
                    <button
                        onClick={onAddNew}
                        className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm"
                    >
                        Add Your First Podcast
                    </button>
                </div>
            </div>
        );
    }

    // Desktop Table View
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Podcast
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Source
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Thumbnail
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {podcasts.map((podcast) => (
                            <tr key={podcast._id} className="hover:bg-gray-50 transition-colors">
                                {/* Podcast info */}
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">
                                        {podcast.title}
                                    </div>
                                    {podcast.description && (
                                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {podcast.description}
                                        </div>
                                    )}
                                </td>

                                {/* Source */}
                                <td className="px-6 py-4">
                                    {podcast.videoType === "youtube" ? (
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                                <Youtube className="w-3.5 h-3.5" />
                                                YouTube
                                            </span>
                                            {podcast.youtubeUrl && (
                                                <a
                                                    href={podcast.youtubeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                <Upload className="w-3.5 h-3.5" />
                                                Uploaded
                                            </span>
                                            {podcast.video && (
                                                <a
                                                    href={podcast.video}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </td>

                                {/* Thumbnail */}
                                <td className="px-6 py-4">
                                    {podcast.thumbnail ? (
                                        <img
                                            src={podcast.thumbnail}
                                            alt={podcast.title}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                            <Play className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </td>

                                {/* Actions - Modern Style */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(podcast)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium"
                                            title="Edit podcast"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(podcast._id, podcast.title)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                                            title="Delete podcast"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
                {podcasts.map((podcast) => (
                    <div key={podcast._id} className="p-4 space-y-3">
                        <div className="flex gap-3">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0">
                                {podcast.thumbnail ? (
                                    <img
                                        src={podcast.thumbnail}
                                        alt={podcast.title}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        <Play className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                    {podcast.title}
                                </h3>
                                {podcast.description && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {podcast.description}
                                    </p>
                                )}
                                <div className="mt-2">
                                    {podcast.videoType === "youtube" ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                            <Youtube className="w-3 h-3" />
                                            YouTube
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            <Upload className="w-3 h-3" />
                                            Uploaded
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => onEdit(podcast)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(podcast._id, podcast.title)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    Total: <span className="font-medium text-gray-700">{podcasts.length}</span> podcasts
                </p>
            </div>
        </div>
    );
};

export default PodcastTable;