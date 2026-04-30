import { Building2, Calendar, Clock, Edit, Eye, MapPin, Music, Trash2 } from "lucide-react";

export const EventRow = ({ event, onToggleStatus, onDeleteEvent, onViewEvent, onEditEvent }) => {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    const isToday = eventDate.toDateString() === new Date().toDateString();
    const isEventExpired = eventDate < new Date();

    // Get venue display name - FIXED: Show custom venue name if no existing venue
    const getVenueDisplayName = () => {
        if (event.venue?.venueName && event.venue.venueName !== "N/A") {
            return event.venue.venueName;
        }
        if (event.customVenueName) {
            return event.customVenueName;
        }
        return "Venue info not available";
    };

    const handleDeleteClick = () => {
        onDeleteEvent(event);
    };

    const handleViewClick = () => {
        onViewEvent(event);
    };

    const handleEditClick = () => {
        if (onEditEvent) {
            onEditEvent(event);
        }
    };

    const handleToggleStatus = () => {
        if (!isEventExpired) {
            onToggleStatus(event._id, event.isActive, event.artistBandName);
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            {/* Event Details - Smaller */}
            <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                        <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900 group-hover:text-yellow-600 line-clamp-1">
                            {event.artistBandName}
                        </div>
                        {event.description && (
                            <div className="text-xs text-gray-400 line-clamp-1">
                                {event.description}
                            </div>
                        )}
                    </div>
                </div>
            </td>

            {/* Venue & Location - Fixed N/A issue */}
            <td className="px-4 py-2">
                <div className="space-y-0.5">
                    <div className="flex items-center text-xs text-gray-600">
                        <Building2 className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{getVenueDisplayName()}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="capitalize">{event.city || "Unknown"}</span>
                    </div>
                </div>
            </td>

            {/* Date & Time - Smaller */}
            <td className="px-4 py-2">
                <div className="space-y-0.5">
                    <div className="flex items-center text-xs text-gray-600 flex-wrap gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>
                            {eventDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                        {isToday && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">
                                Today
                            </span>
                        )}
                        {isUpcoming && !isToday && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">
                                Upcoming
                            </span>
                        )}
                        {isEventExpired && !isToday && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                                Past
                            </span>
                        )}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1 text-gray-400" />
                        {event.time || "Time TBD"}
                    </div>
                </div>
            </td>

            {/* Status - Smaller */}
            <td className="px-4 py-2">
                <button
                    onClick={handleToggleStatus}
                    disabled={isEventExpired}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${event.isActive
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        } ${isEventExpired
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:opacity-80"
                        }`}
                    title={
                        isEventExpired
                            ? "Cannot modify status of past events"
                            : event.isActive
                                ? "Deactivate event"
                                : "Activate event"
                    }
                >
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${event.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                    {event.isActive ? "Active" : "Inactive"}
                </button>
            </td>

            {/* Actions - Smaller with Edit button */}
            <td className="px-4 py-2 text-right">
                <div className="flex justify-end items-center gap-1">
                    <button
                        onClick={handleViewClick}
                        className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                        title="View Event Details"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleEditClick}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Edit Event"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete Event"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};