import { Building2, Calendar, Clock, MapPin, Music, X } from "lucide-react";

export const EventDetailModal = ({ event, isOpen, onClose }) => {
    if (!isOpen || !event) return null;

    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    const isToday = eventDate.toDateString() === new Date().toDateString();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                                <Music className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">
                                    {event.artistBandName}
                                </h4>
                                <div className="flex items-center space-x-2 mt-2">
                                    {isToday && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                            Today
                                        </span>
                                    )}
                                    {isUpcoming && !isToday && (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                            Upcoming
                                        </span>
                                    )}
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${event.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {event.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">
                                        Date & Time:
                                    </label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {eventDate.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p className="text-gray-600 mt-1 flex items-center ml-6">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {event.time}
                                    </p>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Venue:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        {event.venue?.venueName || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Location:</label>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span className="capitalize">{event.city}</span>
                                    </p>
                                    {event.venue?.address && (
                                        <p className="text-gray-600 text-sm mt-1 ml-6">
                                            {event.venue.address}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Capacity:</label>
                                    <p className="text-gray-600 mt-1">
                                        {event.venue?.seatingCapacity || "Not specified"} seats
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div>
                                <label className="font-medium text-gray-700">
                                    Description:
                                </label>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        )}

                        {/* Created Info */}
                        <div className="border-t pt-4">
                            <p className="text-gray-500 text-sm">
                                Created: {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
