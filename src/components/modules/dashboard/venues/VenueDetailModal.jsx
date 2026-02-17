"use client";
import {
    Building2,
    Calendar,
    CalendarDays,
    CheckCircle,
    Clock,
    Crown,
    DollarSign,
    Globe,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    User,
    Users,
    X,
} from "lucide-react";

const VenueDetailModal = ({ venue, onClose, onEdit, onChangePlan, onVerifyVenue }) => {
    if (!venue) return null;

    const isVerified = venue.verifiedOrder > 0;
    const hasColor = venue.colorCode;
    const currentPlan = venue.user?.subscriptionPlan || "free";

    const getCapacityColor = (capacity) => {
        if (capacity > 1000) return "bg-purple-100 text-purple-800 border-purple-200";
        if (capacity > 500) return "bg-blue-100 text-blue-800 border-blue-200";
        if (capacity > 200) return "bg-green-100 text-green-800 border-green-200";
        return "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Venue Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-20 h-20 rounded-xl flex items-center justify-center text-white"
                                style={{
                                    backgroundColor: hasColor ? venue.colorCode : '#6b7280',
                                    background: hasColor ? `linear-gradient(135deg, ${venue.colorCode}99, ${venue.colorCode})` : 'linear-gradient(135deg, #6b7280, #4b5563)'
                                }}
                            >
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="text-2xl font-bold text-gray-900">{venue.venueName}</h4>
                                    {isVerified && (
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                                            style={{ backgroundColor: venue.colorCode }}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Verified #{venue.verifiedOrder}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${currentPlan === "pro"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}>
                                        {currentPlan === "pro" ? <Crown className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                                        {currentPlan === "pro" ? "Pro Plan" : "Free Plan"}
                                    </span>
                                    {venue.eventCount > 0 && (
                                        <span className="text-xs text-gray-500">
                                            {venue.eventCount} show{venue.eventCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 flex items-center mt-2">
                                    <User className="w-4 h-4 mr-2" />
                                    {venue.user?.username}
                                </p>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {venue.user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Plan Management Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-800 mb-2">Subscription Plan</h5>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm ${currentPlan === "pro" ? "text-yellow-700" : "text-gray-700"}`}>
                                        Current Plan: <span className="font-bold">{currentPlan === "pro" ? "Pro" : "Free"}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {currentPlan === "pro"
                                            ? "Full access to all features including photo uploads"
                                            : "Limited features, no photo uploads"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {currentPlan === "free" ? (
                                        <button
                                            onClick={() => {
                                                onClose();
                                                onChangePlan(venue._id, venue.venueName, "free", "pro");
                                            }}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
                                        >
                                            Upgrade to Pro
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                onClose();
                                                onChangePlan(venue._id, venue.venueName, "pro", "free");
                                            }}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                                        >
                                            Downgrade to Free
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Verification Status Section */}
                        {isVerified ? (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <h5 className="font-semibold text-green-800">Venue Verified</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-green-700 font-medium">Verification Order:</span>
                                        <p className="text-green-600">#{venue.verifiedOrder} in {venue.city}</p>
                                    </div>
                                    <div>
                                        <span className="text-green-700 font-medium">Assigned Color:</span>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <div
                                                className="w-6 h-6 rounded border border-gray-300"
                                                style={{ backgroundColor: venue.colorCode }}
                                            ></div>
                                            <span className="text-green-600 font-mono">{venue.colorCode}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-green-600 text-xs mt-2">
                                    This venue appears in the calendar with its assigned color
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-yellow-600" />
                                    <h5 className="font-semibold text-yellow-800">Venue Not Verified</h5>
                                </div>
                                <p className="text-yellow-700 text-sm mb-3">
                                    This venue is not yet verified. Verify to assign a unique color for calendar events.
                                </p>
                                {venue.isActive ? (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onVerifyVenue(venue._id, venue.venueName);
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Verify Venue
                                    </button>
                                ) : (
                                    <p className="text-yellow-700 text-sm">
                                        Activate the venue first to enable verification.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Venue Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Location:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {venue.city ? venue.city.charAt(0).toUpperCase() + venue.city.slice(1) : "Not specified"}
                                    </p>
                                    {venue.address && (
                                        <p className="text-gray-600 text-sm mt-1 ml-6">{venue.address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Capacity:</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCapacityColor(venue.seatingCapacity)}`}>
                                            <Users className="w-4 h-4 mr-1" />
                                            {venue.seatingCapacity || "Not specified"} seats
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Status:</label>
                                    <div className="mt-1">
                                        {venue.isActive ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Operating Hours:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {venue.openHours || "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Open Days:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <CalendarDays className="w-4 h-4 mr-2" />
                                        {venue.openDays || "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Joined:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        {(venue.phone || venue.website) && (
                            <div className="border-t pt-4">
                                <h5 className="font-medium text-gray-700 mb-3">Contact Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {venue.phone && (
                                        <div>
                                            <label className="font-medium text-gray-700 text-sm">Phone:</label>
                                            <p className="text-gray-600 mt-1 flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {venue.phone}
                                            </p>
                                        </div>
                                    )}

                                    {venue.website && (
                                        <div>
                                            <label className="font-medium text-gray-700 text-sm">Website:</label>
                                            <p className="text-gray-600 mt-1">
                                                <a
                                                    href={venue.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center"
                                                >
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    {venue.website}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Biography */}
                        {venue.biography && (
                            <div className="border-t pt-4">
                                <label className="font-medium text-gray-700">About:</label>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{venue.biography}</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        {!isVerified && venue.isActive && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onVerifyVenue(venue._id, venue.venueName);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Verify Venue
                            </button>
                        )}
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(venue);
                            }}
                            className="px-4 py-2 bg-[var(--primary)] text-black rounded-lg bg-primary/80 transition-colors text-sm font-medium"
                        >
                            Edit Venue
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailModal;