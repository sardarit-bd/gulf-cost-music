import { Edit, Loader2, Trash2, Video } from "lucide-react";

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

    if (podcasts.length === 0) {
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
                    Click on YouTube links to view
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Podcast
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                YouTube Link
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Thumbnail
                            </th>
                            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {podcasts.map((podcast) => (
                            <tr key={podcast._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {podcast.title}
                                        </div>
                                        {podcast.description && (
                                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {podcast.description}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <a
                                        href={podcast.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                    >
                                        <Video className="w-4 h-4" />
                                        Watch on YouTube
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    {podcast.thumbnail ? (
                                        <img
                                            src={podcast.thumbnail}
                                            alt={podcast.title}
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No thumbnail</span>
                                    )}
                                </td>
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