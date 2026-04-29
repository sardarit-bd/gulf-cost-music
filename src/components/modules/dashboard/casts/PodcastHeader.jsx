"use client";

import { Plus, Settings, Video, RefreshCw, Loader2 } from "lucide-react";

const PodcastHeader = ({ loading, onRefresh, onAddClick, onEditSectionText }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Video className="w-8 h-8 text-yellow-500" />
                    Podcast Management
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Manage your podcast episodes, YouTube links, and uploaded videos
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh
                </button>

                <button
                    onClick={onEditSectionText}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                    <Settings className="w-4 h-4" />
                    Page Settings
                </button>

                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Podcast
                </button>
            </div>
        </div>
    );
};

export default PodcastHeader;