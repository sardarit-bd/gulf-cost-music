"use client";
import AgendaView from "@/components/modules/calendar/AgendaView";
import CalendarControls from "@/components/modules/calendar/CalendarControls";
import CalendarHeader from "@/components/modules/calendar/CalendarHeader";
import CalendarSidebar from "@/components/modules/calendar/CalendarSidebar";
import EventModal from "@/components/modules/calendar/EventModal";
import MonthView from "@/components/modules/calendar/MonthView";
import WeekView from "@/components/modules/calendar/WeekView";
import CustomLoader from "@/components/shared/loader/Loader";
import { useEffect, useState } from "react";
// import AgendaView from "./AgendaView";
// import CalendarControls from "./CalendarControls";
// import CalendarHeader from "./CalendarHeader";
// import CalendarSidebar from "./CalendarSidebar";
// import EventModal from "./EventModal";
// import MonthView from "./MonthView";
// import WeekView from "./WeekView";

// State-City Mapping (same as backend)
const STATE_CITY_MAPPING = {
  Louisiana: [
    { key: "new orleans", label: "New Orleans" },
    { key: "baton rouge", label: "Baton Rouge" },
    { key: "lafayette", label: "Lafayette" },
    { key: "shreveport", label: "Shreveport" },
    { key: "lake charles", label: "Lake Charles" },
    { key: "monroe", label: "Monroe" }
  ],
  Mississippi: [
    { key: "jackson", label: "Jackson" },
    { key: "biloxi", label: "Biloxi" },
    { key: "gulfport", label: "Gulfport" },
    { key: "oxford", label: "Oxford" },
    { key: "hattiesburg", label: "Hattiesburg" }
  ],
  Alabama: [
    { key: "birmingham", label: "Birmingham" },
    { key: "mobile", label: "Mobile" },
    { key: "huntsville", label: "Huntsville" },
    { key: "tuscaloosa", label: "Tuscaloosa" }
  ],
  Florida: [
    { key: "tampa", label: "Tampa" },
    { key: "st. petersburg", label: "St. Petersburg" },
    { key: "clearwater", label: "Clearwater" },
    { key: "pensacola", label: "Pensacola" },
    { key: "panama city", label: "Panama City" },
    { key: "fort myers", label: "Fort Myers" }
  ]
};

const DEFAULT_STATE = "Alabama";
const DEFAULT_CITY = "mobile";

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
  const [selectedState, setSelectedState] = useState(DEFAULT_STATE);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [availableCities, setAvailableCities] = useState(STATE_CITY_MAPPING[DEFAULT_STATE]);
  const [venues, setVenues] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredVenueIds, setFilteredVenueIds] = useState([]);
  const [allStates] = useState(Object.keys(STATE_CITY_MAPPING));

  // Update available cities when state changes
  useEffect(() => {
    const cities = STATE_CITY_MAPPING[selectedState] || [];
    setAvailableCities(cities);
    if (!cities.some(city => city.key === selectedCity)) {
      setSelectedCity(cities[0]?.key || DEFAULT_CITY);
    }
  }, [selectedState]);

  // Fetch events when state, city, or date changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchEvents(selectedState, selectedCity, year, month);
  }, [selectedState, selectedCity, currentDate]);

  // Fetch events from backend API
  const fetchEvents = async (state, city, year = null, month = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ state, city });
      if (year !== null && month !== null) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/calendar?${params.toString()}`
      );

      if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);

      const data = await response.json();
      console.log("Calender Data:", data);

      if (data.success) {
        const transformedEvents = data.data.events.map(event => {
          let eventDate;
          if (event.date) eventDate = new Date(event.date);
          else if (event.rawUTC) eventDate = new Date(event.rawUTC);
          else eventDate = new Date();

          return {
            id: event.id || event._id,
            title: event.title || event.artistBandName,
            date: eventDate,
            time: event.time || event.eventTime,
            venue: event.venue,
            venueId: event.venueId,
            color: event.color || "#000000",
            state: event.state,
            city: event.city,
            verified: event.verified || false,
            image: event.image,
            description: event.description,
            rawData: event
          };
        });

        setEvents(transformedEvents);
        fetchVenues(state, city);
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
  const fetchVenues = async (state, city) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues?state=${state}&city=${city}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("venues: ", data)
        if (data.success) {
          const venuesWithColors = data.data.venues.filter(
            venue => venue.colorCode && venue.colorCode !== "#000000" && venue.colorCode !== null
          );
          setVenues(venuesWithColors);
        }
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  // Calendar grid generation
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ date: null, currentMonth: false, day: null, events: [] });
    }

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
      days.push({ date, currentMonth: true, day: i, events: dayEvents });
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false, day: i, events: [] });
    }
    return days;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const toggleVenueFilter = (venueId) => {
    setFilteredVenueIds(prev =>
      prev.includes(venueId) ? prev.filter(id => id !== venueId) : [...prev, venueId]
    );
  };

  const clearAllFilters = () => setFilteredVenueIds([]);

  const getFilteredEvents = (dayEvents) => {
    if (filteredVenueIds.length === 0) return dayEvents;
    return dayEvents.filter(event => filteredVenueIds.includes(event.venueId));
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const formatCityDisplay = (cityKey) => {
    const city = availableCities.find(c => c.key === cityKey);
    return city ? city.label : cityKey;
  };

  const calendarDays = generateCalendarGrid();
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="container mx-auto">
        <CalendarHeader
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          availableCities={availableCities}
          allStates={allStates}
          formatCityDisplay={formatCityDisplay}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar View - 3/4 width */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <CalendarControls
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                view={view}
                setView={setView}
                monthNames={monthNames}
                onToday={handleToday}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />

              {loading ? (
                <div className="flex justify-center items-center min-h-screen py-20 bg-white">
                  <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                  </div>
                </div>
              ) : (
                <>
                  {view === "month" && (
                    <MonthView
                      calendarDays={calendarDays}
                      weekDays={weekDays}
                      events={events}
                      filteredVenueIds={filteredVenueIds}
                      selectedCity={selectedCity}
                      formatCityDisplay={formatCityDisplay}
                      onEventClick={handleEventClick}
                      getFilteredEvents={getFilteredEvents}
                    />
                  )}
                  {view === "week" && (
                    <WeekView
                      weekDates={weekDates}
                      events={events}
                      filteredVenueIds={filteredVenueIds}
                      onEventClick={handleEventClick}
                      getFilteredEvents={getFilteredEvents}
                    />
                  )}
                  {view === "agenda" && (
                    <AgendaView
                      events={events}
                      selectedCity={selectedCity}
                      formatCityDisplay={formatCityDisplay}
                      onEventClick={handleEventClick}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Side Panel - 1/4 width */}
          <CalendarSidebar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            monthNames={monthNames}
            venues={venues}
            filteredVenueIds={filteredVenueIds}
            onToggleVenue={toggleVenueFilter}
            onClearFilters={clearAllFilters}
            selectedState={selectedState}
            selectedCity={selectedCity}
            formatCityDisplay={formatCityDisplay}
            events={events}
            view={view}
          />
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        venues={venues}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
}