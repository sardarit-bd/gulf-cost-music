"use client";

import { Edit, Play, Search, Trash2, Upload, X, Youtube } from "lucide-react";
import { useRef } from "react";

const PodcastTable = ({
  podcasts,
  loading,
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyPress,
  onClearSearch,
  hasActiveFilters,
  activeSearchTerm,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const tableRef = useRef(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Search Header - Inside Table Container */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Podcasts ({podcasts.length})
            </h3>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search podcasts..."
                className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-colors"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyPress={onKeyPress}
              />
            </div>
            <button
              onClick={onSearch}
              className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            {(searchInput || activeSearchTerm) && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Search Badge */}
        {activeSearchTerm && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Searching for:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              <Search className="w-3 h-3" />
              {activeSearchTerm}
            </span>
          </div>
        )}
      </div>

      {!podcasts || podcasts.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters
              ? "No matching podcasts found"
              : "No podcasts found"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
            {hasActiveFilters
              ? `No results found for "${activeSearchTerm}". Try adjusting your search.`
              : "Get started by adding your first podcast episode."}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={onClearSearch}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm text-sm font-medium cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={onAddNew}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm text-sm font-medium cursor-pointer"
            >
              Add Your First Podcast
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Podcast
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {podcasts.map((podcast) => (
                  <tr
                    key={podcast._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {podcast.title}
                      </div>
                      {podcast.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {podcast.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {podcast.videoType === "youtube" ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                            <Youtube className="w-3 h-3" />
                            YouTube
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            <Upload className="w-3 h-3" />
                            Uploaded
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {podcast.thumbnail ? (
                        <img
                          src={podcast.thumbnail}
                          alt={podcast.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <Play className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(podcast)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-xs font-medium cursor-pointer"
                          title="Edit podcast"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(podcast._id, podcast.title)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium cursor-pointer"
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
          <div className="md:hidden divide-y divide-gray-200">
            {podcasts.map((podcast) => (
              <div key={podcast._id} className="p-4 space-y-3">
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {podcast.thumbnail ? (
                      <img
                        src={podcast.thumbnail}
                        alt={podcast.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <Play className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {podcast.title}
                    </h3>
                    {podcast.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {podcast.description}
                      </p>
                    )}
                    <div className="mt-2">
                      {podcast.videoType === "youtube" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <Youtube className="w-3 h-3" />
                          YouTube
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-xs font-medium cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(podcast._id, podcast.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium cursor-pointer"
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
              Total:{" "}
              <span className="font-medium text-gray-700">
                {podcasts.length}
              </span>{" "}
              podcasts
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PodcastTable;
