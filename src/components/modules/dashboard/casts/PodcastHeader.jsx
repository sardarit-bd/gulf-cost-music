"use client";

import {
  Plus,
  Settings,
  Video,
  RefreshCw,
  Loader2,
  Search,
  X,
} from "lucide-react";

const PodcastHeader = ({
  loading,
  onRefresh,
  onAddClick,
  onEditSectionText,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg">
            <Video className="w-5 h-5 text-white" />
          </div>
          Podcast Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your podcast episodes, YouTube links, and uploaded videos
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3 lg:mt-0">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span>Refresh</span>
        </button>

        <button
          onClick={onEditSectionText}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Page Settings</span>
        </button>

        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Podcast</span>
        </button>
      </div>
    </div>
  );
};

export default PodcastHeader;
