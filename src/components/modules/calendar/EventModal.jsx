import { CalendarIcon, Clock, MapPin, X } from "lucide-react";

export default function EventModal({ event, venues, isOpen, onClose }) {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Event Image */}
                    {event.image && (event.image.url || event.image) && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 mb-4">
                            <img
                                src={event.image.url || event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                                }}
                            />
                            {/* Color indicator */}
                            <div
                                className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-white shadow-lg"
                                style={{ backgroundColor: event.color }}
                            />
                        </div>
                    )}

                    {/* Color bar (if no image) */}
                    {!event.image && (
                        <div
                            className="w-full h-2 rounded-full mb-4"
                            style={{ backgroundColor: event.color }}
                        />
                    )}

                    {/* Event Title */}
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                        {event.title}
                    </h4>

                    {/* Event Description */}
                    {event.description && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    )}

                    {/* Event Details */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {/* Date */}
                        <div className="flex items-start gap-3 text-gray-700">
                            <CalendarIcon className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                            <div>
                                <span className="text-sm font-medium text-gray-900">Date</span>
                                <p className="text-sm">
                                    {event.date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-start gap-3 text-gray-700">
                            <Clock className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                            <div>
                                <span className="text-sm font-medium text-gray-900">Time</span>
                                <p className="text-sm">{event.time}</p>
                            </div>
                        </div>

                        {/* Venue - FIXED: Show correct venue name */}
                        <div className="flex items-start gap-3 text-gray-700">
                            <MapPin className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">Venue</span>
                                {event.verified && (
                                    <span className="inline-block ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        Verified
                                    </span>
                                )}
                                {/* NEW: Custom venue badge */}
                                {/* {event.isCustomVenue && (
                                    <span className="inline-block ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                        Custom Venue
                                    </span>
                                )} */}
                                <p className="text-sm capitalize mt-1">
                                    {event.venue || event.customVenueName || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Location Summary */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">Location:</span>{' '}
                            <span className="capitalize">{event.city}</span>,{' '}
                            <span className="capitalize">{event.state}</span>
                        </p>
                    </div>

                    {/* Close Button */}
                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}