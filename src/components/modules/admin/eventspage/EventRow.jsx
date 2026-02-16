import { Building2, Calendar, Clock, Eye, MapPin, Music, Trash2 } from "lucide-react";
import { ConfirmationModal } from "./ConfirmationModal";
import { EventDetailModal } from "./EventDetailModal";
import { useState } from "react";

export const EventRow = ({ event, onToggleStatus, onDeleteEvent }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    const isToday = eventDate.toDateString() === new Date().toDateString();
    const isEventExpired = eventDate < new Date(); // Check if event date has passed

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDeleteEvent(event._id, event.artistBandName);
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleViewClick = () => {
        setShowDetailModal(true);
    };

    const handleToggleStatus = () => {
        if (!isEventExpired) {
            onToggleStatus(event._id, event.isActive, event.artistBandName);
        }
    };

    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                            <Music className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                                {event.artistBandName}
                            </div>
                            {event.description && (
                                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {event.description}
                                </div>
                            )}
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                            {event.venue?.venueName || "N/A"}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="capitalize">{event.city}</span>
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {eventDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                            {isToday && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    Today
                                </span>
                            )}
                            {isUpcoming && !isToday && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Upcoming
                                </span>
                            )}
                            {isEventExpired && !isToday && (
                                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                    Past
                                </span>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            {event.time}
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4">
                    <button
                        onClick={handleToggleStatus}
                        disabled={isEventExpired}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${event.isActive
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                            : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                            } ${isEventExpired
                                ? "opacity-50 cursor-not-allowed hover:bg-gray-100 hover:text-gray-800"
                                : "cursor-pointer"
                            }`}
                        title={
                            isEventExpired
                                ? "Cannot modify status of past events"
                                : event.isActive
                                    ? "Deactivate event"
                                    : "Activate event"
                        }
                    >
                        <div
                            className={`w-2 h-2 rounded-full mr-2 ${event.isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                        ></div>
                        {event.isActive ? "Active" : "Inactive"}
                        {isEventExpired && (
                            <span className="ml-2 text-xs text-gray-500">(Expired)</span>
                        )}
                    </button>
                </td>

                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-2">
                        {/* View Button */}
                        <button
                            onClick={handleViewClick}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Event Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Button - WITH CONFIRMATION MODAL */}
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete Event"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Event"
                message={`Are you sure you want to delete "${event.artistBandName}"? This action cannot be undone and all event data will be permanently lost.`}
                confirmText="Delete Event"
                type="danger"
            />

            {/* Event Detail Modal */}
            <EventDetailModal
                event={event}
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
            />
        </>
    );
};