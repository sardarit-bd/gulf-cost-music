"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";

// City options (same as backend)
const CITIES = [
  { key: "mobile", label: "Mobile" },
  { key: "biloxi", label: "Biloxi" },
  { key: "new orleans", label: "New Orleans" },
  { key: "pensacola", label: "Pensacola" },
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("mobile");
  const [venues, setVenues] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);



  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Sunday

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  // Fetch events from backend API
  const fetchEvents = async (city, year = null, month = null) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        city: city
      });

      // If specific month/year is selected
      if (year && month !== null) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/calendar?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      console.log("Calendar:", data);
      if (data.success) {
        // Transform backend events to frontend format
        const transformedEvents = data.data.events.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          time: event.time,
          venue: event.venue,
          venueId: event.venueId,
          color: event.color || "#000000",
          city: event.city,
          verified: event.verified || false,
          rawData: event // Keep original data for details
        }));

        setEvents(transformedEvents);

        // Also fetch venues for this city to show in sidebar
        fetchVenues(city);
      } else {
        console.error('API Error:', data.message);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch venues for the selected city
  const fetchVenues = async (city) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/venues?city=${city}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter only venues with color codes
          const venuesWithColors = data.data.venues.filter(
            venue => venue.colorCode && venue.colorCode !== "#000000"
          );
          setVenues(venuesWithColors);
        }
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  // Initial fetch and when city changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchEvents(selectedCity, year, month);
  }, [selectedCity, currentDate]);

  // Calendar grid generation
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];

    // Previous month blanks
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: null,
        currentMonth: false,
        day: null,
        events: []
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === i &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });

      days.push({
        date,
        currentMonth: true,
        day: i,
        events: dayEvents
      });
    }
    // Next month blanks to fill the grid (up to 42 cells)
    for (let i = 1; i <= 3; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        day: i,
        events: []
      });
    }

    return days;
  };


  // Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Filter events by venue
  const [filteredVenueIds, setFilteredVenueIds] = useState([]);

  const toggleVenueFilter = (venueId) => {
    setFilteredVenueIds(prev => {
      if (prev.includes(venueId)) {
        return prev.filter(id => id !== venueId);
      } else {
        return [...prev, venueId];
      }
    });
  };

  // Get filtered events based on venue filter
  const getFilteredEvents = (dayEvents) => {
    if (filteredVenueIds.length === 0) return dayEvents;
    return dayEvents.filter(event => filteredVenueIds.includes(event.venueId));
  };

  const calendarDays = generateCalendarGrid();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Gulf Coast Music Calendar
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Live shows and events in {CITIES.find(c => c.key === selectedCity)?.label}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">City:</span>
            </div>

            <Select
              value={selectedCity}
              onValueChange={(value) => {
                setSelectedCity(value);
                setCurrentDate(new Date());
              }}
            >
              <SelectTrigger className="w-[180px] bg-white border-gray-300 text-black">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border border-gray-200">
                {CITIES.map((city) => (
                  <SelectItem
                    key={city.key}
                    value={city.key}
                    className="capitalize"
                  >
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar View - 3/4 width */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Calendar Controls */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleToday}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                    >
                      Today
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>

                      <h2 className="text-xl font-bold text-gray-900 min-w-[180px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </h2>

                      <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* View Toggles */}
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setView("month")}
                      className={`px-4 py-2 rounded-md transition ${view === "month" ? 'bg-white shadow-sm text-yellow-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setView("week")}
                      className={`px-4 py-2 rounded-md transition ${view === "week" ? 'bg-white shadow-sm text-yellow-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setView("agenda")}
                      className={`px-4 py-2 rounded-md transition ${view === "agenda" ? 'bg-white shadow-sm text-yellow-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Agenda
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events for {CITIES.find(c => c.key === selectedCity)?.label}...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Month View */}
                  {view === "month" && (
                    <div className="p-4">
                      {/* Week Days Header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                          <div
                            key={day}
                            className="text-center py-3 text-sm font-semibold text-gray-500"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((dayObj, index) => {
                          const isToday =
                            dayObj.date &&
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
                              {/* Date + event count */}
                              {dayObj.day && (
                                <div className="flex justify-between items-center mb-1">
                                  <span
                                    className={`text-sm font-medium
                                      ${dayObj.currentMonth
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                      }
                                      ${isToday ? "text-blue-600 font-bold" : ""}
                                    `}
                                  >
                                    {dayObj.day}
                                  </span>

                                  {dayObj.currentMonth && filteredDayEvents.length > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                      {filteredDayEvents.length}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Events */}
                              {dayObj.currentMonth && (
                                <div className="space-y-1">
                                  {filteredDayEvents.slice(0, 3).map((event) => (
                                    <div
                                      key={event.id}
                                      className="text-xs p-2 rounded truncate cursor-pointer hover:opacity-90 transition"
                                      style={{
                                        backgroundColor: `${event.color}20`,
                                        borderLeft: `3px solid ${event.color}`,
                                      }}
                                      onClick={() => handleEventClick(event)}
                                      title={`${event.title} at ${event.venue} - ${event.time}`}
                                    >
                                      <div className="font-medium truncate text-gray-600">
                                        {event.title}
                                      </div>
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
                            No events found for {CITIES.find(c => c.key === selectedCity)?.label}
                          </h3>
                          <p className="text-gray-600">
                            Try selecting a different city or check back later for upcoming shows.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Week View */}
                  {view === "week" && (
                    <div className="p-4">
                      <div className="grid grid-cols-7 gap-2">
                        {getWeekDates(currentDate).map((date, idx) => {
                          const dayEvents = events.filter(e =>
                            e.date.toDateString() === date.toDateString()
                          );

                          return (
                            <div
                              key={idx}
                              className="border rounded-lg p-2 min-h-40 bg-white text-gray-600"
                            >
                              <div className="font-semibold text-sm mb-2">
                                {date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  day: "numeric"
                                })}
                              </div>

                              <div className="space-y-1">
                                {dayEvents.map(event => (
                                  <div
                                    key={event.id}
                                    className="text-xs p-1 rounded text-gray-600"
                                    style={{
                                      backgroundColor: `${event.color}20`,
                                      borderLeft: `3px solid ${event.color}`
                                    }}
                                  >
                                    {event.title}
                                  </div>
                                ))}

                                {dayEvents.length === 0 && (
                                  <p className="text-xs text-gray-400">No events</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  {/* Agenda View */}
                  {view === "agenda" && (
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Agenda - {CITIES.find(c => c.key === selectedCity)?.label}
                      </h3>
                      <div className="space-y-4">
                        {events.length > 0 ? (
                          events.map((event) => (
                            <div
                              key={event.id}
                              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                  style={{ backgroundColor: event.color }}
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {event.time}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {event.date.toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-sm text-gray-700">{event.venue}</span>
                                    {event.verified && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            No events scheduled
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Side Panel - 1/4 width */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              {/* Mini Calendar */}
              <div className="mb-8">
                <MiniCalendar
                  currentDate={currentDate}
                  onChange={setCurrentDate}
                />
              </div>

              {/* Venue Filters */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  VENUES IN {CITIES.find(c => c.key === selectedCity)?.label.toUpperCase()}
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {venues.length > 0 ? (
                    venues.map((venue) => (
                      <div
                        key={venue._id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => toggleVenueFilter(venue._id)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: venue.colorCode || "#000000" }}
                          />
                          <span className="text-sm text-gray-700 truncate">
                            {venue.venueName}
                          </span>
                          {venue.verifiedOrder > 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* <div
                          className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition
                            ${filteredVenueIds.includes(venue._id)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                            }`}
                        >
                          {filteredVenueIds.includes(venue._id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div> */}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No venues found for this city
                    </p>
                  )}
                </div>

                {/* {filteredVenueIds.length > 0 && (
                  <button
                    onClick={() => setFilteredVenueIds([])}
                    className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                )} */}
              </div>

              {/* Stats */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">CALENDAR STATS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Events:</span>
                    <span className="font-medium text-gray-600">{events.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Venues:</span>
                    <span className="font-medium text-gray-600">{venues.length}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Filtered:</span>
                    <span className="font-medium text-gray-600">{filteredVenueIds.length} venue(s)</span>
                  </div> */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Month:</span>
                    <span className="font-medium text-gray-600">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div
                    className="w-full h-2 rounded-full mb-2"
                    style={{ backgroundColor: selectedEvent.color }}
                  />
                  <h4 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {selectedEvent.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{selectedEvent.time}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.venue}</span>
                  {selectedEvent.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Verified Venue
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                  <span>Venue Color: {selectedEvent.color}</span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    City: {CITIES.find(c => c.key === selectedEvent.city)?.label || selectedEvent.city}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Add to Google Calendar functionality
                    const startDate = new Date(selectedEvent.date);
                    const [hours, minutes] = selectedEvent.time.split(':').map(Number);
                    startDate.setHours(hours, minutes);

                    const endDate = new Date(startDate);
                    endDate.setHours(endDate.getHours() + 2);

                    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedEvent.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`Venue: ${selectedEvent.venue}`)}&location=${encodeURIComponent(selectedEvent.venue)}`;

                    window.open(googleCalendarUrl, '_blank');
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini Calendar Component
export function MiniCalendar({ currentDate, onChange }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const today = new Date();

  const handlePrev = () => {
    onChange(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    onChange(new Date(year, month + 1, 1));
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div className="text-sm font-semibold text-gray-800">
          {monthNames[month]} {year}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <button
              key={day}
              onClick={() => onChange(new Date(year, month, day))}
              className={`h-8 rounded-full flex items-center justify-center transition
                ${isToday
                  ? "bg-yellow-500 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }
                ${currentDate.getDate() === day ? "ring-2 ring-yellow-300" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}