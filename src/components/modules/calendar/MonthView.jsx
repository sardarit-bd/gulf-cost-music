import { CalendarIcon } from "lucide-react";

export default function MonthView({
    calendarDays,
    weekDays,
    events,
    filteredVenueIds,
    selectedCity,
    formatCityDisplay,
    onEventClick,
    getFilteredEvents
}) {
    return (
        <div className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center py-3 text-sm font-semibold text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayObj, index) => {
                    const isToday = dayObj.date &&
                        dayObj.currentMonth &&
                        dayObj.date.toDateString() === new Date().toDateString();

                    const filteredDayEvents = getFilteredEvents(dayObj.events);

                    return (
                        <div
                            key={index}
                            className={`min-h-32 p-2 rounded-lg border transition-all duration-200
                ${dayObj.currentMonth
                                    ? "bg-white border-gray-200 hover:bg-gray-50"
                                    : "bg-gray-50 border-gray-200 opacity-60"
                                }
                ${isToday ? "bg-blue-50 border-blue-300" : ""}
                ${filteredDayEvents.length > 0 ? "hover:shadow-md" : ""}
              `}
                        >
                            {dayObj.day && (
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-sm font-medium ${dayObj.currentMonth ? "text-gray-900" : "text-gray-400"} ${isToday ? "text-blue-600 font-bold" : ""}`}>
                                        {dayObj.day}
                                    </span>
                                    {dayObj.currentMonth && filteredDayEvents.length > 0 && (
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                            {filteredDayEvents.length}
                                        </span>
                                    )}
                                </div>
                            )}

                            {dayObj.currentMonth && (
                                <div className="space-y-1">
                                    {filteredDayEvents.slice(0, 3).map((event) => (
                                        <div
                                            key={event.id}
                                            className="text-xs p-2 rounded truncate cursor-pointer hover:opacity-90 transition capitalize"
                                            style={{
                                                backgroundColor: `${event.color}20`,
                                                borderLeft: `3px solid ${event.color}`,
                                            }}
                                            onClick={() => onEventClick(event)}
                                            title={`${event.title} at ${event.venue} - ${event.time}`}
                                        >
                                            <div className="font-medium truncate text-gray-600">{event.title}</div>
                                            <div className="text-xs text-gray-500 truncate mt-1">
                                                {event.time} • {event.venue}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredDayEvents.length > 3 && (
                                        <div className="text-xs text-gray-500 text-center">
                                            +{filteredDayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* No Events Message */}
            {events.length === 0 && (
                <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No events found for {formatCityDisplay(selectedCity)}
                    </h3>
                    <p className="text-gray-600">
                        Try selecting a different city or check back later for upcoming shows.
                    </p>
                </div>
            )}
        </div>
    );
}