import { MapPin, CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

export default function AgendaView({
    events,
    selectedCity,
    formatCityDisplay,
    onEventClick
}) {
    const [sortBy, setSortBy] = useState("date"); // date, venue, artist
    const [filterText, setFilterText] = useState("");

    // Group events by date
    const groupEventsByDate = () => {
        const grouped = {};

        // Sort events by date
        const sortedEvents = [...events].sort((a, b) => a.date - b.date);

        sortedEvents.forEach(event => {
            const dateKey = event.date.toDateString();
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(event);
        });

        return grouped;
    };

    // Filter events based on search text
    const filterEvents = (eventsList) => {
        if (!filterText.trim()) return eventsList;

        return eventsList.filter(event =>
            event.title.toLowerCase().includes(filterText.toLowerCase()) ||
            event.venue.toLowerCase().includes(filterText.toLowerCase()) ||
            (event.description && event.description.toLowerCase().includes(filterText.toLowerCase()))
        );
    };

    const groupedEvents = groupEventsByDate();
    const filteredGroupedEvents = {};

    // Apply filter to each group
    Object.keys(groupedEvents).forEach(dateKey => {
        const filtered = filterEvents(groupedEvents[dateKey]);
        if (filtered.length > 0) {
            filteredGroupedEvents[dateKey] = filtered;
        }
    });

    // Sort by venue or artist if needed
    const getSortedEvents = (eventsList) => {
        if (sortBy === "venue") {
            return [...eventsList].sort((a, b) => a.venue.localeCompare(b.venue));
        } else if (sortBy === "artist") {
            return [...eventsList].sort((a, b) => a.title.localeCompare(b.title));
        }
        return eventsList;
    };

    return (
        <div className="p-6">
            {/* Header with search and sort */}
            <div className="flex justify-center items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        Agenda - {formatCityDisplay(selectedCity)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {events.length} event{events.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-6">
                {Object.keys(filteredGroupedEvents).length > 0 ? (
                    Object.entries(filteredGroupedEvents).map(([dateKey, dayEvents]) => {
                        const sortedEvents = getSortedEvents(dayEvents);
                        const date = new Date(dateKey);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div key={dateKey} className="space-y-3">
                                {/* Date header */}
                                <div className={`flex items-center gap-3 sticky top-0 bg-white z-10 py-2 ${isToday ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                    <div className={`w-1 h-8 rounded-full ${isToday ? 'bg-blue-500' : 'bg-gray-300'
                                        }`} />
                                    <h4 className="font-semibold text-lg">
                                        {date.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                        {isToday && <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Today</span>}
                                    </h4>
                                </div>

                                {/* Events for this date */}
                                <div className="grid gap-3 ml-4">
                                    {sortedEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 hover:border-yellow-300 bg-white"
                                            onClick={() => onEventClick(event)}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Color indicator */}
                                                <div
                                                    className="w-1 h-12 rounded-full mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: event.color }}
                                                />

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                                                {event.title}
                                                            </h5>
                                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{event.time}</span>
                                                            </div>
                                                        </div>

                                                        {event.verified && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{event.venue}</span>
                                                    </div>

                                                    {event.description && (
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Arrow indicator */}
                                                <svg
                                                    className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No events found
                            </h3>
                            <p className="text-gray-600">
                                {filterText
                                    ? `No events matching "${filterText}" in ${formatCityDisplay(selectedCity)}`
                                    : `No events scheduled in ${formatCityDisplay(selectedCity)}`
                                }
                            </p>
                            {filterText && (
                                <button
                                    onClick={() => setFilterText("")}
                                    className="mt-4 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}