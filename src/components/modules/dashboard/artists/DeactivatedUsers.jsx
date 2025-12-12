"use client";
import {
    Calendar,
    Crown,
    Edit,
    Eye,
    Mail,
    MapPin,
    MoreVertical,
    Power,
    RefreshCw,
    Search,
    Trash2,
    User,
    Users,
    X
} from "lucide-react";
import { useState } from "react";

const DeactivatedUsers = ({
    deactivatedArtists,
    loading,
    onActivateUser,
    onOpenPlanChangeModal,
    onViewProfile,
    onEdit,
    onDeleteArtist,
    search,
    onSearchChange,
    onRefresh
}) => {
    const [actionMenu, setActionMenu] = useState(null);

    const handleActionMenuToggle = (artistId) => {
        setActionMenu(actionMenu === artistId ? null : artistId);
    };

    const handleActivate = async (artist) => {
        if (!window.confirm(`Are you sure you want to activate ${artist.name}?`)) return;
        await onActivateUser(artist._id, artist.isActive);
        setActionMenu(null);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-8">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-red-500" />
                        Deactivated Artists ({deactivatedArtists.length})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Inactive artist accounts that can be reactivated
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search deactivated artists..."
                            className="text-gray-500 w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onRefresh}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-red-50 border-b border-red-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                                Artist
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                                Plan
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                                Deactivated Since
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {deactivatedArtists.length > 0 ? (
                            deactivatedArtists.map((artist) => (
                                <DeactivatedArtistRow
                                    key={artist._id}
                                    artist={artist}
                                    actionMenu={actionMenu}
                                    onActionMenuToggle={handleActionMenuToggle}
                                    onActivate={handleActivate}
                                    onOpenPlanChangeModal={onOpenPlanChangeModal}
                                    onViewProfile={onViewProfile}
                                    onEdit={onEdit}
                                    onDeleteArtist={onDeleteArtist}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                            {search ? "No matching deactivated artists found" : "No deactivated artists"}
                                        </p>
                                        <p className="text-sm">
                                            {search
                                                ? "Try adjusting your search terms"
                                                : "All artists are currently active"
                                            }
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DeactivatedArtistRow = ({
    artist,
    actionMenu,
    onActionMenuToggle,
    onActivate,
    onOpenPlanChangeModal,
    onViewProfile,
    onEdit,
    onDeleteArtist
}) => {
    const getDeactivatedDuration = (createdAt) => {
        if (!createdAt) return "Unknown";

        const deactivatedDate = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - deactivatedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "1 day ago";
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const currentPlan = artist.user?.subscriptionPlan || "free";

    return (
        <tr className="hover:bg-red-50 transition-colors group border-l-4 border-l-red-400">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {artist.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-red-700">
                            {artist.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {artist.user?.email}
                        </div>
                    </div>
                </div>
            </td>

            {/* 🔥 Plan Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentPlan === "pro"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                        {currentPlan === "pro" ? (
                            <>
                                <Crown className="w-3 h-3 mr-1" />
                                Pro Plan
                            </>
                        ) : (
                            <>
                                <Users className="w-3 h-3 mr-1" />
                                Free Plan
                            </>
                        )}
                    </span>

                    {/* Quick Plan Change Buttons */}
                    <div className="flex gap-1">
                        {currentPlan === "free" ? (
                            <button
                                onClick={() => onOpenPlanChangeModal(artist, "pro")}
                                className="inline-flex items-center px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                title="Upgrade to Pro"
                            >
                                <Crown className="w-3 h-3" />
                            </button>
                        ) : (
                            <button
                                onClick={() => onOpenPlanChangeModal(artist, "free")}
                                className="inline-flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                title="Downgrade to Free"
                            >
                                <Users className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="space-y-1">
                    {artist.genre && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            {artist.genre}
                        </span>
                    )}
                    {artist.city && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {artist.city}
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {getDeactivatedDuration(artist.updatedAt || artist.createdAt)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Deactivated
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-2">
                    {/* Activate Button */}
                    <button
                        onClick={() => onActivate(artist)}
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        title="Activate Artist"
                    >
                        <Power className="w-4 h-4 mr-1" />
                        Activate
                    </button>

                    {/* View Profile */}
                    <button
                        onClick={() => onViewProfile(artist)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Profile"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    {/* More Actions Menu */}
                    <div className="relative">
                        <button
                            onClick={() => onActionMenuToggle(artist._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {actionMenu === artist._id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                <button
                                    onClick={() => {
                                        onEdit(artist);
                                        onActionMenuToggle(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>

                                {/* 🔥 Plan Change Option */}
                                <button
                                    onClick={() => {
                                        onOpenPlanChangeModal(artist,
                                            currentPlan === "pro" ? "free" : "pro"
                                        );
                                        onActionMenuToggle(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    {currentPlan === "pro" ? (
                                        <>
                                            <Users className="w-4 h-4 mr-2" />
                                            Downgrade to Free
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="w-4 h-4 mr-2" />
                                            Upgrade to Pro
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        onDeleteArtist(artist._id);
                                        onActionMenuToggle(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Permanently
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default DeactivatedUsers;