"use client";
import {
    Building2,
    Calendar,
    Clock,
    Edit,
    Eye,
    Globe,
    Mail,
    MapPin,
    MoreVertical,
    Phone,
    Power,
    Save,
    Trash2,
    User,
    Users,
    X
} from "lucide-react";

const VenueTable = ({
    venues,
    loading,
    page,
    pages,
    editingVenue,
    formData,
    saveLoading,
    actionMenu,
    onPageChange,
    onViewVenue,
    onToggleActive,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteVenue,
    onActionMenuToggle
}) => {
    const getCapacityColor = (capacity) => {
        if (capacity > 1000) return "bg-purple-100 text-purple-800 border-purple-200";
        if (capacity > 500) return "bg-blue-100 text-blue-800 border-blue-200";
        if (capacity > 200) return "bg-green-100 text-green-800 border-green-200";
        return "bg-gray-100 text-gray-800 border-gray-200";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Venues ({venues.length})
                </h3>
                <div className="text-sm text-gray-500">
                    Page {page} of {pages}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Venue
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location & Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {venues.length > 0 ? (
                            venues.map((venue) => (
                                <VenueRow
                                    key={venue._id}
                                    venue={venue}
                                    editingVenue={editingVenue}
                                    formData={formData}
                                    saveLoading={saveLoading}
                                    actionMenu={actionMenu}
                                    getCapacityColor={getCapacityColor}
                                    onViewVenue={onViewVenue}
                                    onToggleActive={onToggleActive}
                                    onEdit={onEdit}
                                    onSave={onSave}
                                    onCancel={onCancel}
                                    onInputChange={onInputChange}
                                    onDeleteVenue={onDeleteVenue}
                                    onActionMenuToggle={onActionMenuToggle}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">No venues found</p>
                                        <p className="text-sm">No venues have been registered yet</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <Pagination
                    page={page}
                    pages={pages}
                    venuesCount={venues.length}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

const VenueRow = ({
    venue,
    editingVenue,
    formData,
    saveLoading,
    actionMenu,
    getCapacityColor,
    onViewVenue,
    onToggleActive,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteVenue,
    onActionMenuToggle
}) => {
    const isEditing = editingVenue === venue._id;

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.venueName || ''}
                                onChange={(e) => onInputChange('venueName', e.target.value)}
                                className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                placeholder="Venue name"
                            />
                        ) : (
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                                {venue.venueName}
                            </div>
                        )}
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {venue.user?.username}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {venue.user?.email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={formData.city || ''}
                                onChange={(e) => onInputChange('city', e.target.value)}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                placeholder="City"
                            />
                            <input
                                type="text"
                                value={formData.address || ''}
                                onChange={(e) => onInputChange('address', e.target.value)}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                placeholder="Address"
                            />
                        </>
                    ) : (
                        <>
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{venue.city || "Not specified"}</span>
                            </div>
                            {venue.address && (
                                <div className="text-sm text-gray-500 ml-6">
                                    {venue.address}
                                </div>
                            )}
                            {venue.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                    <span>{venue.phone}</span>
                                </div>
                            )}
                            {venue.website && (
                                <div className="flex items-center text-sm text-blue-600">
                                    <Globe className="w-3 h-3 mr-2" />
                                    <span className="truncate">Website</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    {isEditing ? (
                        <>
                            <input
                                type="number"
                                value={formData.seatingCapacity || ''}
                                onChange={(e) => onInputChange('seatingCapacity', e.target.value)}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                placeholder="Seating Capacity"
                            />
                            <input
                                type="text"
                                value={formData.openHours || ''}
                                onChange={(e) => onInputChange('openHours', e.target.value)}
                                className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                placeholder="Open Hours"
                            />
                        </>
                    ) : (
                        <>
                            {venue.seatingCapacity && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCapacityColor(venue.seatingCapacity)}`}>
                                    <Users className="w-3 h-3 mr-1" />
                                    {venue.seatingCapacity} capacity
                                </span>
                            )}
                            {venue.openHours && (
                                <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {venue.openHours}
                                </div>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                        </>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.isActive?.toString() || 'false'}
                        onChange={(e) => onInputChange('isActive', e.target.value === 'true')}
                        className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                ) : venue.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Inactive
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(venue._id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {saveLoading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ) : (
                                    <Save className="w-3 h-3 mr-1" />
                                )}
                                {saveLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onViewVenue(venue)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Venue"
                            >
                                <Eye className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => onToggleActive(venue._id, venue.isActive, venue.venueName)}
                                className={`p-2 rounded-lg transition-colors ${venue.isActive
                                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                title={venue.isActive ? "Deactivate" : "Activate"}
                            >
                                <Power className="w-4 h-4" />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => onActionMenuToggle(venue._id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === venue._id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button
                                            onClick={() => onEdit(venue)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Venue
                                        </button>
                                        <button
                                            onClick={() => onDeleteVenue(venue._id, venue.venueName)}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Venue
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

const Pagination = ({ page, pages, venuesCount, onPageChange }) => {
    return (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing {venuesCount} venues on page {page} of {pages}
                </p>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="text-gray-500 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <span>Previous</span>
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === pageNumber
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => onPageChange(Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className="text-gray-500 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2"
                    >
                        <span>Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VenueTable;