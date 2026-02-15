import { Plus, Settings, Video } from "lucide-react";

const PodcastHeader = ({ loading, showForm, onRefresh, onToggleForm, setShowSectionTextEditor }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Video className="w-7 h-7 text-purple-600" />
                Podcast Management
            </h1>
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setShowSectionTextEditor(true)}
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Page Settings
                </button>
                <button
                    onClick={onToggleForm}
                    className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-black rounded-lg hover:bg-primary/80 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>{showForm ? 'Cancel' : 'Add Podcast'}</span>
                </button>
            </div>
        </div>
    );
};

export default PodcastHeader;