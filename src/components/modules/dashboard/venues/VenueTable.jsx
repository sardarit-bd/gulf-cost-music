"use client";

import {
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Crown,
    DollarSign,
    Edit,
    Eye,
    Mail,
    MapPin,
    MoreVertical,
    Power,
    Save,
    Search,
    Sparkles,
    Trash2,
    Users,
    X
} from "lucide-react";
import { useEffect, useRef } from "react";

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
    onActionMenuToggle,
    onVerifyVenue,
    onChangePlan,
    // Search props
    searchInput,
    onSearchInputChange,
    onSearch,
    onKeyPress,
    onClearFilters,
    hasActiveFilters,
    activeSearchTerm,
    statusFilter,
    planFilter,
    cityFilter,
    cities,
    onStatusFilterChange,
    onPlanFilterChange,
    onCityFilterChange
}) => {
    const tableRef = useRef(null);

    // Global click outside handler for action menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                if (actionMenu !== null) {
                    onActionMenuToggle(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionMenu, onActionMenuToggle]);

    const getCapacityColor = (capacity) => {
        if (capacity > 1000) return "bg-purple-100 text-purple-800 border-purple-200";
        if (capacity > 500) return "bg-blue-100 text-blue-800 border-blue-200";
        if (capacity > 200) return "bg-green-100 text-green-800 border-green-200";
        return "bg-gray-100 text-gray-800 border-gray-200";
    };

    const PlanBadge = ({ plan }) => (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${plan === "pro"
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
        >
            {plan === "pro" ? (
                <>
                    <Crown className="w-3 h-3" />
                    Pro
                </>
            ) : (
                <>
                    <DollarSign className="w-3 h-3" />
                    Free
                </>
            )}
        </span>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Search and Filters Header - Inside Table Container */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* <div className="flex gap-2 flex-wrap">
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            className="text-gray-700 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <select
                            value={planFilter}
                            onChange={(e) => onPlanFilterChange(e.target.value)}
                            className="text-gray-700 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 cursor-pointer"
                        >
                            <option value="all">All Plans</option>
                            <option value="pro">Pro Plan</option>
                            <option value="free">Free Plan</option>
                        </select>
                        {cities && cities.length > 0 && (
                            <select
                                value={cityFilter}
                                onChange={(e) => onCityFilterChange(e.target.value)}
                                className="text-gray-700 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 cursor-pointer"
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        )}
                    </div> */}

                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <input
                                type="text"
                                placeholder="Search venues..."
                                className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors"
                                value={searchInput || ""}
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
                        {hasActiveFilters && (
                            <button
                                onClick={onClearFilters}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Active filters:</span>
                        {activeSearchTerm && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                <Search className="w-3 h-3" />
                                Search: {activeSearchTerm}
                            </span>
                        )}
                        {statusFilter !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Status: {statusFilter === "true" ? "Active" : "Inactive"}
                            </span>
                        )}
                        {planFilter !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Plan: {planFilter === "pro" ? "Pro" : "Free"}
                            </span>
                        )}
                        {cityFilter && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                City: {cityFilter}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Venue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan & Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location & Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    PlanBadge={PlanBadge}
                                    onViewVenue={onViewVenue}
                                    onToggleActive={onToggleActive}
                                    onEdit={onEdit}
                                    onSave={onSave}
                                    onCancel={onCancel}
                                    onInputChange={onInputChange}
                                    onDeleteVenue={onDeleteVenue}
                                    onActionMenuToggle={onActionMenuToggle}
                                    onVerifyVenue={onVerifyVenue}
                                    onChangePlan={onChangePlan}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-lg font-medium text-gray-900 mb-1">No venues found</p>
                                        <p className="text-sm">
                                            {hasActiveFilters ? "Try adjusting your search filters" : "No venues have been registered yet"}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{pages}</span>
                        </p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onPageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${page === pageNumber
                                            ? "bg-blue-600 text-white"
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
                                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
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

// VenueRow component
const VenueRow = ({
    venue,
    editingVenue,
    formData,
    saveLoading,
    actionMenu,
    getCapacityColor,
    PlanBadge,
    onViewVenue,
    onToggleActive,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onDeleteVenue,
    onActionMenuToggle,
    onVerifyVenue,
    onChangePlan,
}) => {
    const isEditing = editingVenue === venue._id;
    const isVerified = venue.verifiedOrder > 0;
    const hasColor = venue.colorCode;
    const currentPlan = venue.user?.subscriptionPlan || "free";
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                if (actionMenu === venue._id) {
                    onActionMenuToggle(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionMenu, venue._id, onActionMenuToggle]);

    const handleToggleMenu = (e) => {
        e.stopPropagation();
        onActionMenuToggle(venue._id);
    };

    const handleMenuAction = (callback) => {
        return () => {
            callback();
            onActionMenuToggle(null);
        };
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                            backgroundColor: hasColor ? venue.colorCode : '#6b7280',
                        }}
                    >
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.venueName || ''}
                                onChange={(e) => onInputChange('venueName', e.target.value)}
                                className="text-gray-500 text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                placeholder="Venue name"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900">
                                    {venue.venueName}
                                </div>
                                {isVerified && (
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: venue.colorCode }}
                                        title={`Verified - Order: ${venue.verifiedOrder}`}
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        #{venue.verifiedOrder}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                            <PlanBadge plan={currentPlan} />
                            {venue.eventCount > 0 && (
                                <span className="text-xs text-gray-500">
                                    {venue.eventCount} shows
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Plan & Status Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-2">
                    {isEditing ? (
                        <select
                            value={formData.isActive?.toString() || 'false'}
                            onChange={(e) => onInputChange('isActive', e.target.value === 'true')}
                            className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    ) : venue.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Inactive
                        </span>
                    )}

                    {/* Plan change buttons */}
                    {!isEditing && (
                        <div className="flex gap-1">
                            {currentPlan === "free" ? (
                                <button
                                    onClick={() => onChangePlan(venue._id, venue.venueName, "free", "pro")}
                                    className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 cursor-pointer transition-colors"
                                >
                                    ↑ Upgrade
                                </button>
                            ) : (
                                <button
                                    onClick={() => onChangePlan(venue._id, venue.venueName, "pro", "free")}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors"
                                >
                                    ↓ Downgrade
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </td>

            {/* Location & Contact Column */}
            <td className="px-6 py-4">
                <div className="space-y-1">
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
                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{venue.city ? venue.city.charAt(0).toUpperCase() + venue.city.slice(1) : "Not specified"}</span>
                            </div>
                            {venue.address && (
                                <div className="text-xs text-gray-500 ml-4">
                                    {venue.address}
                                </div>
                            )}
                            {venue.user?.email && (
                                <div className="flex items-center text-xs text-gray-500">
                                    <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                    <span className="truncate">{venue.user.email}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </td>

            {/* Details Column */}
            <td className="px-6 py-4">
                <div className="space-y-1">
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
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCapacityColor(venue.seatingCapacity)}`}>
                                    <Users className="w-3 h-3 mr-1" />
                                    {venue.seatingCapacity} cap
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

            {/* Actions Column */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-1">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(venue._id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer"
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
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium cursor-pointer"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onViewVenue(venue)}
                                className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                                title="View Venue"
                            >
                                <Eye className="w-3.5 h-3.5" />
                            </button>

                            {!isVerified && venue.isActive && (
                                <button
                                    onClick={() => onVerifyVenue(venue._id, venue.venueName)}
                                    className="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                                    title="Verify Venue & Assign Color"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            )}

                            <button
                                onClick={() => onToggleActive(venue._id, venue.isActive, venue.venueName)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${venue.isActive
                                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                title={venue.isActive ? "Deactivate" : "Activate"}
                            >
                                <Power className="w-3.5 h-3.5" />
                            </button>

                            <div className="relative">
                                <button
                                    ref={buttonRef}
                                    onClick={handleToggleMenu}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </button>

                                {actionMenu === venue._id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-300 py-1 z-50"
                                    >
                                        <button
                                            onClick={handleMenuAction(() => onEdit(venue))}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Venue
                                        </button>

                                        {/* Plan Management */}
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <div className="px-4 py-1 text-xs font-medium text-gray-500">Plan</div>
                                        {currentPlan === "free" ? (
                                            <button
                                                onClick={handleMenuAction(() => onChangePlan(venue._id, venue.venueName, "free", "pro"))}
                                                className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left cursor-pointer"
                                            >
                                                <Crown className="w-4 h-4 mr-2" />
                                                Upgrade to Pro
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleMenuAction(() => onChangePlan(venue._id, venue.venueName, "pro", "free"))}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                            >
                                                <DollarSign className="w-4 h-4 mr-2" />
                                                Downgrade to Free
                                            </button>
                                        )}

                                        {/* Verification */}
                                        {!isVerified && venue.isActive && (
                                            <>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button
                                                    onClick={handleMenuAction(() => onVerifyVenue(venue._id, venue.venueName))}
                                                    className="flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 w-full text-left cursor-pointer"
                                                >
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Verify Venue
                                                </button>
                                            </>
                                        )}

                                        {/* Delete */}
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleMenuAction(() => onDeleteVenue(venue._id, venue.venueName))}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
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

export default VenueTable;