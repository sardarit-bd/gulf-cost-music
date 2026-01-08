import { Edit, Loader2, Trash2, Upload, Video, Youtube } from "lucide-react";

const PodcastTable = ({ podcasts, loading, onEdit, onDelete, onAddNew }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                    <span className="text-gray-600">Loading podcasts...</span>
                </div>
            </div>
        );
    }

    if (!podcasts || podcasts.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="py-16 text-center">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No podcasts found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Get started by adding your first podcast.
                    </p>
                    <button
                        onClick={onAddNew}
                        className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 transition"
                    >
                        Add Your First Podcast
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                    Podcasts ({podcasts.length})
                </h3>
                <span className="text-sm text-gray-500">
                    YouTube & Uploaded Videos
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                Podcast
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                Source
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                Thumbnail
                            </th>
                            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {podcasts.map((podcast) => (
                            <tr key={podcast._id} className="hover:bg-gray-50">
                                {/* Podcast info */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {podcast.title}
                                    </div>

                                    {podcast.description && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {podcast.description.length > 60
                                                ? podcast.description.slice(0, 60) + "..."
                                                : podcast.description}
                                        </div>
                                    )}
                                </td>



                                {/* Source */}
                                <td className="px-6 py-4">
                                    {podcast.videoType === "youtube" ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                <Youtube className="w-3 h-3" />
                                                YouTube
                                            </div>
                                            <a
                                                href={podcast.youtubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                            >
                                                Watch
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <Upload className="w-3 h-3" />
                                                Uploaded
                                            </div>
                                            {podcast.video && (
                                                <a
                                                    href={podcast.video}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                                >
                                                    Watch
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
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            No thumbnail
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(podcast)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                        title="Edit podcast"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(podcast._id, podcast.title)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                        title="Delete podcast"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PodcastTable;