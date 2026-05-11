"use client";
import {
  Calendar,
  Crown,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreVertical,
  Music,
  Power,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

const ArtistTable = ({
  artists,
  loading,
  page,
  pages,
  editingArtist,
  formData,
  saveLoading,
  actionMenu,
  onPageChange,
  onViewProfile,
  onToggleActive,
  onOpenDeactivateModal,
  onOpenPlanChangeModal,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onDeleteArtist,
  onActionMenuToggle,
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyPress,
  onClearFilters,
  hasActiveFilters,
  activeSearchTerm,
  statusFilter,
  planFilter,
}) => {
  const getGenreColor = (genre) => {
    const colors = {
      rock: "bg-red-100 text-red-800 border-red-200",
      pop: "bg-blue-100 text-blue-800 border-blue-200",
      jazz: "bg-yellow-100 text-yellow-800 border-yellow-200",
      hiphop: "bg-purple-100 text-purple-800 border-purple-200",
      electronic: "bg-green-100 text-green-800 border-green-200",
      classical: "bg-indigo-100 text-indigo-800 border-indigo-200",
      rnb: "bg-pink-100 text-pink-800 border-pink-200",
      country: "bg-orange-100 text-orange-800 border-orange-200",
      metal: "bg-gray-100 text-gray-800 border-gray-200",
      folk: "bg-teal-100 text-teal-800 border-teal-200",
    };
    return (
      colors[genre?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const availableGenres = [
    "Rock",
    "Pop",
    "Jazz",
    "Hip Hop",
    "Electronic",
    "Classical",
    "R&B",
    "Country",
    "Metal",
    "Folk",
    "Blues",
    "Reggae",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Search Header */}
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Artists ({artists.length})
            </h3>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search artists..."
                className="text-gray-700 w-56 pl-8 pr-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-yellow-400 focus:border-purple-400 outline-none"
                value={searchInput || ""}
                onChange={(e) => onSearchInputChange?.(e.target.value)}
                onKeyPress={onKeyPress}
              />
            </div>
            <button
              onClick={onSearch}
              className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3 h-3" />
              Search
            </button>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {activeSearchTerm && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Searching for:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
              <Search className="w-2.5 h-2.5" />
              {activeSearchTerm}
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <ArtistRow
                  key={artist._id}
                  artist={artist}
                  editingArtist={editingArtist}
                  formData={formData}
                  saveLoading={saveLoading}
                  actionMenu={actionMenu}
                  getGenreColor={getGenreColor}
                  availableGenres={availableGenres}
                  capitalize={capitalize}
                  onViewProfile={onViewProfile}
                  onToggleActive={onToggleActive}
                  onOpenDeactivateModal={onOpenDeactivateModal}
                  onOpenPlanChangeModal={onOpenPlanChangeModal}
                  onEdit={onEdit}
                  onSave={onSave}
                  onCancel={onCancel}
                  onInputChange={onInputChange}
                  onDeleteArtist={onDeleteArtist}
                  onActionMenuToggle={onActionMenuToggle}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-3 py-8 text-center">
                  <div className="text-gray-500">
                    <Music className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      No artists found
                    </p>
                    <p className="text-xs">
                      No artists have been registered yet
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Page {page} of {pages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100"
              >
                Prev
              </button>
              <span className="px-2 py-1 text-xs text-gray-700">{page}</span>
              <button
                onClick={() => onPageChange(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArtistRow = ({
  artist,
  editingArtist,
  formData,
  saveLoading,
  actionMenu,
  getGenreColor,
  availableGenres,
  capitalize,
  onViewProfile,
  onToggleActive,
  onOpenDeactivateModal,
  onOpenPlanChangeModal,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onDeleteArtist,
  onActionMenuToggle,
}) => {
  const isEditing = editingArtist === artist._id;
  const currentPlan = artist.user?.subscriptionPlan || "free";
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        if (actionMenu === artist._id) {
          onActionMenuToggle(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenu, artist._id, onActionMenuToggle]);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    onActionMenuToggle(artist._id);
  };

  const handleMenuAction = (callback) => {
    return () => {
      callback();
      onActionMenuToggle(null);
    };
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer">
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {artist.name?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2">
            {isEditing ? (
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="text-gray-500 text-xs border border-gray-300 rounded px-1 py-0.5 focus:ring-2 focus:ring-purple-500 w-24"
                placeholder="Artist name"
              />
            ) : (
              <>
                <div className="text-xs font-medium text-gray-900">
                  {capitalize(artist.name)}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Mail className="w-2.5 h-2.5 mr-1" />
                  {artist.user?.email}
                </div>
              </>
            )}
          </div>
        </div>
      </td>

      <td className="px-3 py-2 whitespace-nowrap">
        {isEditing ? (
          <select
            value={formData.subscriptionPlan || "free"}
            onChange={(e) => onInputChange("subscriptionPlan", e.target.value)}
            className="text-gray-500 text-xs border border-gray-300 rounded px-1 py-0.5"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        ) : (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 ${
                currentPlan === "pro"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {currentPlan === "pro" ? (
                <>
                  <Crown className="w-2.5 h-2.5 mr-0.5" /> Pro
                </>
              ) : (
                <>
                  <Users className="w-2.5 h-2.5 mr-0.5" /> Free
                </>
              )}
            </span>
          </div>
        )}
      </td>

      <td className="px-3 py-2">
        <div className="space-y-0.5">
          {isEditing ? (
            <>
              <select
                value={formData.genre || ""}
                onChange={(e) => onInputChange("genre", e.target.value)}
                className="text-gray-500 text-xs border border-gray-300 rounded px-1 py-0.5 w-full"
              >
                <option value="">Select Genre</option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              {artist.genre && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getGenreColor(artist.genre)}`}
                >
                  <Music className="w-2.5 h-2.5 mr-0.5" />
                  {capitalize(artist.genre)}
                </span>
              )}
              {artist.city && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-2.5 h-2.5 mr-0.5" />
                  {capitalize(artist.city)}
                </div>
              )}
            </>
          )}
        </div>
      </td>

      <td className="px-3 py-2 whitespace-nowrap">
        {isEditing ? (
          <select
            value={formData.isActive?.toString() || "false"}
            onChange={(e) =>
              onInputChange("isActive", e.target.value === "true")
            }
            className="text-gray-500 text-xs border border-gray-300 rounded px-1 py-0.5"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        ) : artist.isActive ? (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
            Inactive
          </span>
        )}
      </td>

      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
        <div className="flex items-center">
          <Calendar className="w-2.5 h-2.5 mr-1 text-gray-400" />
          {artist.createdAt
            ? new Date(artist.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </td>

      <td className="px-3 py-2 whitespace-nowrap text-right">
        <div className="flex justify-end items-center space-x-1">
          <button
            onClick={() => onViewProfile(artist)}
            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors cursor-pointer"
            title="View Profile"
          >
            <Eye className="w-3 h-3" />
          </button>

          <button
            onClick={() =>
              artist.isActive
                ? onOpenDeactivateModal(artist)
                : onToggleActive(artist._id, false)
            }
            className={`p-1 rounded transition-colors cursor-pointer ${
              artist.isActive
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={artist.isActive ? "Deactivate" : "Activate"}
          >
            <Power className="w-3 h-3" />
          </button>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleToggleMenu}
              className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-3 h-3" />
            </button>

            {actionMenu === artist._id && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <button
                  onClick={handleMenuAction(() => onEdit(artist))}
                  className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Edit Profile
                </button>

                <button
                  onClick={handleMenuAction(() =>
                    onOpenPlanChangeModal(
                      artist,
                      currentPlan === "pro" ? "free" : "pro",
                    ),
                  )}
                  className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                >
                  {currentPlan === "pro" ? (
                    <>
                      <Users className="w-3 h-3 mr-2" /> Downgrade
                    </>
                  ) : (
                    <>
                      <Crown className="w-3 h-3 mr-2" /> Upgrade
                    </>
                  )}
                </button>

                <button
                  onClick={handleMenuAction(() => onDeleteArtist(artist._id))}
                  className="flex items-center px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ArtistTable;
