import { Building2, Calendar, Clock, MapPin, Music, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const EventDetailModal = ({ event, isOpen, onClose }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !mounted || !event) return null;

    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    const isToday = eventDate.toDateString() === new Date().toDateString();

    // Get venue display name (custom venue support)
    const getVenueDisplayName = () => {
        if (event.venue?.venueName && event.venue.venueName !== "N/A") {
            return event.venue.venueName;
        }
        if (event.customVenueName) {
            return event.customVenueName;
        }
        return "Venue info not available";
    };

    const modalContent = (
        <>
            {/* Backdrop - High z-index to cover sidebar */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                style={{ zIndex: 999999 }}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
                style={{ zIndex: 1000000 }}
            >
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-popup">
                    <div className="p-6">
                        {/* Header with close button */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Header with Event Info */}
                            <div className="flex items-center space-x-4">
                                {/* Event Image or Icon */}
                                {event.image && (event.image.url || event.image) ? (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={event.image.url || event.image}
                                            alt={event.artistBandName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
                                        <Music className="w-8 h-8" />
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-2xl font-bold text-gray-900 capitalize">
                                        {event.artistBandName}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
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

                            {/* Event Color Indicator */}
                            {event.color && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-sm"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <span className="text-xs text-gray-500">Venue Color Code</span>
                                </div>
                            )}

                            {/* Event Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="font-medium text-gray-700 text-sm">
                                            Date & Time:
                                        </label>
                                        <p className="text-gray-600 mt-1 flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {eventDate.toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p className="text-gray-600 mt-1 flex items-center text-sm ml-6">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            {event.time || "Time TBD"}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="font-medium text-gray-700 text-sm">Venue:</label>
                                        <p className="text-gray-600 mt-1 flex items-center text-sm">
                                            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                            {getVenueDisplayName()}
                                        </p>
                                        {event.isCustomVenue && (
                                            <span className="inline-block ml-6 mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                                Custom Venue
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="font-medium text-gray-700 text-sm">Location:</label>
                                        <p className="text-gray-600 mt-1 flex items-center text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="capitalize">{event.city || "Unknown"}</span>
                                            {event.state && <span className="ml-1">, {event.state}</span>}
                                        </p>
                                    </div>

                                    {event.venue?.seatingCapacity && (
                                        <div>
                                            <label className="font-medium text-gray-700 text-sm">Capacity:</label>
                                            <p className="text-gray-600 mt-1 text-sm">
                                                {event.venue.seatingCapacity} seats
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="font-medium text-gray-700 text-sm">
                                        Description:
                                    </label>
                                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            )}

                            {/* Footer Info */}
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                <p className="text-gray-400 text-xs">
                                    Created: {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                                {event.venue?.verifiedOrder > 0 && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Verified Venue
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 text-sm font-medium cursor-pointer shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation CSS */}
            <style jsx>{`
                @keyframes modal-popup {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-modal-popup {
                    animation: modal-popup 0.2s ease-out;
                }
            `}</style>
        </>
    );

    return createPortal(modalContent, document.body);
};