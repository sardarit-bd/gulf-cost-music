import { MapPin } from "lucide-react";

export default function WeekView({
    weekDates,
    events,
    filteredVenueIds,
    onEventClick,
    getFilteredEvents
}) {
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <div className="p-4">
            <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, idx) => {
                    const dayEvents = events.filter(e =>
                        new Date(e.date).toDateString() === date.toDateString()
                    );
                    const filteredDayEvents = getFilteredEvents(dayEvents);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <div
                            key={idx}
                            className={`border rounded-lg p-3 min-h-40 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="text-black font-semibold text-sm mb-2 flex justify-between items-center">
                                <span>
                                    {date.toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric"
                                    })}
                                </span>
                                {isToday && (
                                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                        Today
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                {filteredDayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="text-xs p-2 rounded cursor-pointer hover:opacity-90 transition-all hover:shadow-md"
                                        style={{
                                            backgroundColor: `${event.color}20`,
                                            borderLeft: `3px solid ${event.color}`
                                        }}
                                        onClick={() => onEventClick(event)}
                                    >
                                        <div className="font-medium truncate text-gray-700">
                                            {event.title}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 truncate mt-1">
                                            <span>{event.time}</span>
                                            <span>•</span>
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>
                                ))}

                                {filteredDayEvents.length === 0 && (
                                    <p className="text-xs text-gray-400 text-center py-4">
                                        No events
                                    </p>
                                )}
                            </div>

                            {filteredDayEvents.length > 5 && (
                                <div className="text-xs text-gray-500 text-center mt-2 pt-1 border-t border-gray-100">
                                    +{filteredDayEvents.length - 5} more
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}