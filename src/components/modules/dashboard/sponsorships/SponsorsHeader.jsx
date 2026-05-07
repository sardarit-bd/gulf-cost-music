"use client";

import { Loader2, Plus, RefreshCw, Settings } from "lucide-react";

const SponsorsHeader = ({
  loading,
  onRefresh,
  onAddSponsor,
  onOpenSettings,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          Sponsor Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your sponsors and partners
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
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Page Settings</span>
        </button>

        <button
          onClick={onAddSponsor}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sponsor</span>
        </button>
      </div>
    </div>
  );
};

export default SponsorsHeader;
