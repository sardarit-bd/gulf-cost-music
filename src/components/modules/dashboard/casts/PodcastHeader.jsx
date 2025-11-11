import { Plus, RefreshCw, Video } from "lucide-react";

const PodcastHeader = ({ loading, showForm, onRefresh, onToggleForm }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Video className="w-7 h-7 text-purple-600" />
                Podcast Management
            </h1>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
                <button
                    onClick={onToggleForm}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>{showForm ? 'Cancel' : 'Add Podcast'}</span>
                </button>
            </div>
        </div>
    );
};

export default PodcastHeader;