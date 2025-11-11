"use client";
import {
    Building2,
    Calendar,
    CalendarDays,
    Clock,
    Globe,
    Mail,
    MapPin,
    Phone,
    User,
    Users,
    X
} from "lucide-react";

const VenueDetailModal = ({ venue, onClose, onEdit }) => {
    if (!venue) return null;

    const getCapacityColor = (capacity) => {
        if (capacity > 1000) return "bg-purple-100 text-purple-800 border-purple-200";
        if (capacity > 500) return "bg-blue-100 text-blue-800 border-blue-200";
        if (capacity > 200) return "bg-green-100 text-green-800 border-green-200";
        return "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">{venue.venueName}</h4>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <User className="w-4 h-4 mr-2" />
                                    {venue.user?.username}
                                </p>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {venue.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Location:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {venue.city || "Not specified"}
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
                                        {venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {venue.phone && (
                            <div>
                                <label className="font-medium text-gray-700">Phone:</label>
                                <p className="text-gray-600 mt-1 flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {venue.phone}
                                </p>
                            </div>
                        )}

                        {venue.website && (
                            <div>
                                <label className="font-medium text-gray-700">Website:</label>
                                <p className="text-gray-600 mt-1">
                                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                        <Globe className="w-4 h-4 mr-2" />
                                        {venue.website}
                                    </a>
                                </p>
                            </div>
                        )}

                        {venue.biography && (
                            <div>
                                <label className="font-medium text-gray-700">About:</label>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{venue.biography}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(venue);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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