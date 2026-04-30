import { MiniCalendar } from "@/components/modules/calendar/MiniCalendar";
import { Calendar as CalendarIcon, Filter, MapPin, Users } from "lucide-react";

export default function CalendarSidebar({
    currentDate,
    setCurrentDate,
    monthNames,
    venues,
    filteredVenueIds,
    onToggleVenue,
    onClearFilters,
    selectedState,
    selectedCity,
    formatCityDisplay,
    events,
    view
}) {
    // Calculate stats
    const totalEvents = events.length;
    const uniqueVenues = new Set(events.map(e => e.venueKey || e.venueId)).size;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    const pastEvents = totalEvents - upcomingEvents;

    // Group venues by color for better visualization (only existing venues)
    const venuesByColor = venues.reduce((acc, venue) => {
        const color = venue.colorCode || "#000000";
        if (!acc[color]) acc[color] = [];
        acc[color].push(venue);
        return acc;
    }, {});

    // Group custom venues from events
    const customVenues = events
        .filter(event => event.isCustomVenue && event.customVenueName)
        .reduce((acc, event) => {
            const key = event.venueKey;
            if (!acc[key]) {
                acc[key] = {
                    _id: key,
                    venueName: event.customVenueName,
                    colorCode: event.color,
                    verifiedOrder: 0,
                    isCustom: true
                };
            }
            return acc;
        }, {});

    const allFilterableVenues = [
        ...venues,
        ...Object.values(customVenues)
    ];

    return (
        <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-4">
                {/* Mini Calendar */}
                <div className="mb-8">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        CALENDAR
                    </h4>
                    <MiniCalendar
                        currentDate={currentDate}
                        onChange={setCurrentDate}
                        monthNames={monthNames}
                    />
                </div>

                {/* Venue Filters */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            VENUES ({allFilterableVenues.length})
                        </h4>
                        {filteredVenueIds.length > 0 && (
                            <button
                                onClick={onClearFilters}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {filteredVenueIds.length > 0 && (
                        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-800 flex items-center gap-1">
                                <Filter className="w-3 h-3" />
                                <span className="font-medium">{filteredVenueIds.length}</span> venue{filteredVenueIds.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    )}

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {allFilterableVenues.length > 0 ? (
                            // Group existing venues by color
                            <>
                                {Object.entries(venuesByColor).map(([color, colorVenues]) => (
                                    <div key={color} className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                            <span>{colorVenues.length} venue{colorVenues.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        {colorVenues.map((venue) => {
                                            const isActive = filteredVenueIds.includes(venue._id);
                                            const venueEventCount = events.filter(e => (e.venueId === venue._id) || (e.venueKey === venue._id)).length;

                                            return (
                                                <div
                                                    key={venue._id}
                                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
                                                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                        : 'hover:bg-gray-50 border border-transparent'
                                                        }`}
                                                    onClick={() => onToggleVenue(venue._id)}
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
                                                            style={{ backgroundColor: venue.colorCode || "#000000" }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <span className={`text-sm truncate block ${isActive ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                                                {venue.venueName}
                                                            </span>
                                                            {venueEventCount > 0 && (
                                                                <span className="text-xs text-gray-400">
                                                                    {venueEventCount} event{venueEventCount !== 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {venue.verifiedOrder > 0 && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isActive && (
                                                        <span className="text-xs text-blue-600 font-medium">✓</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}

                                {/* Custom Venues Section */}
                                {Object.values(customVenues).length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                                            <span>Custom Venues</span>
                                        </div>
                                        {Object.values(customVenues).map((venue) => {
                                            const isActive = filteredVenueIds.includes(venue._id);
                                            const venueEventCount = events.filter(e => e.venueKey === venue._id).length;

                                            return (
                                                <div
                                                    key={venue._id}
                                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
                                                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                        : 'hover:bg-gray-50 border border-transparent'
                                                        }`}
                                                    onClick={() => onToggleVenue(venue._id)}
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
                                                            style={{ backgroundColor: venue.colorCode || "#9CA3AF" }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <span className={`text-sm truncate block ${isActive ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                                                {venue.venueName}
                                                                <span className="ml-1 text-xs text-gray-400">(Custom)</span>
                                                            </span>
                                                            {venueEventCount > 0 && (
                                                                <span className="text-xs text-gray-400">
                                                                    {venueEventCount} event{venueEventCount !== 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isActive && (
                                                        <span className="text-xs text-blue-600 font-medium">✓</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">
                                    No venues found for {formatCityDisplay(selectedCity)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Venues will appear when events are added
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        STATISTICS
                    </h4>

                    <div className="space-y-3">
                        {/* Location Info */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">Current Location</span>
                            </div>
                            <div className="pl-6 space-y-1">
                                <p className="text-sm text-gray-800">{selectedState}</p>
                                <p className="text-sm text-gray-600">{formatCityDisplay(selectedCity)}</p>
                            </div>
                        </div>

                        {/* Event Stats */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-blue-600">{totalEvents}</p>
                                <p className="text-xs text-gray-600">Total Events</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-green-600">{uniqueVenues}</p>
                                <p className="text-xs text-gray-600">Active Venues</p>
                            </div>
                        </div>

                        {/* Upcoming/Past Events */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Upcoming:</span>
                                <span className="font-medium text-gray-800">{upcomingEvents}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Past:</span>
                                <span className="font-medium text-gray-800">{pastEvents}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${totalEvents ? (upcomingEvents / totalEvents) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* View Info */}
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Current View:</span>
                                <span className="font-medium text-gray-800 capitalize">{view}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-gray-600">Month:</span>
                                <span className="font-medium text-gray-800">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                {Object.keys(venuesByColor).length > 0 && (
                    <div className="border-t mt-4 pt-4">
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">COLOR LEGEND</h4>
                        <div className="space-y-1">
                            {Object.entries(venuesByColor).slice(0, 5).map(([color, colorVenues]) => (
                                <div key={color} className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-gray-600 truncate">
                                        {colorVenues.map(v => v.venueName).join(', ')}
                                    </span>
                                </div>
                            ))}
                            {Object.keys(venuesByColor).length > 5 && (
                                <p className="text-xs text-gray-400 mt-1">
                                    +{Object.keys(venuesByColor).length - 5} more colors
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #999;
                }
            `}</style>
        </div>
    );
}