"use client";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CalendarBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState("mobile");
  const [view, setView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // === Fetch events from backend ===
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/events/calendar?city=${selectedCity}`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          const formattedEvents = data.data.events.map(event => ({
            id: event.id,
            fullDate: event.date,
            date: new Date(event.date).getUTCDate(),
            title: event.title,
            color: event.color,
            time: event.time,
            venue: event.venue,
            desc: `Performance by ${event.title} at ${event.venue}`,
            tag: "Show",
            banner: "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=60",
          }));

          formattedEvents.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
          setEvents(formattedEvents);
        } else {
          console.error("API Error:", data.message);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCity, API_BASE]);

  // calendar helpers
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const getWeekDates = () => {
    const currentDay = currentDate.getDay();
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDay);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const handlePrev = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNext = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Format city name for display
  const formatCityName = (city) => {
    return city.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // ---- JSX ----
  return (
    <section className="brandBg min-h-screen py-10">
      <div className="container mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 relative">
        {/* header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <CalendarDays className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold brandColor">Calendar Board</h1>
          </div>

          {/* city dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition"
            >
              <span className="font-medium">{formatCityName(selectedCity)}</span>
              <ChevronDownIcon open={dropdownOpen} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {["mobile", "biloxi", "new orleans", "pensacola"].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-100 transition ${selectedCity === city
                      ? "bg-yellow-50 font-semibold text-gray-800"
                      : "text-gray-600"
                      }`}
                  >
                    {formatCityName(city)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-wrap justify-between items-center gap-3 border border-gray-200 p-3 rounded-lg bg-gray-50 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-1 bg-yellow-200 text-gray-800 text-sm border border-yellow-300 rounded hover:bg-yellow-300 transition"
            >
              Today
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            {view === "month" &&
              `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {view === "week" && (
              <>
                {getWeekDates()[0].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {getWeekDates()[6].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </>
            )}
            {view === "day" &&
              `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
          </h3>

          <div className="flex gap-2">
            {["month", "week", "day"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md border text-sm text-gray-600 capitalize transition ${view === v
                  ? "bg-yellow-300 border-yellow-400"
                  : "bg-white border-gray-300 hover:bg-yellow-100"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-2 text-gray-600">Loading events...</span>
          </div>
        )}

        {/* Month View */}
        {!loading && view === "month" && (
          <MonthView
            weekDays={weekDays}
            startDay={startDay}
            daysInMonth={daysInMonth}
            events={events}
            currentDate={currentDate}
            onSelect={(e) => setSelectedEvent(e)}
          />
        )}

        {/* Week View */}
        {!loading && view === "week" && (
          <WeekView
            weekDays={getWeekDates()}
            hours={hours}
            events={events}
            onSelect={(e) => setSelectedEvent(e)}
          />
        )}

        {/* Day View */}
        {!loading && view === "day" && (
          <DayView
            date={currentDate}
            hours={hours}
            events={events}
            onSelect={(e) => setSelectedEvent(e)}
          />
        )}

        {/* No Events State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No events found for {formatCityName(selectedCity)}</p>
            <p className="text-sm">Try selecting a different city or check back later.</p>
          </div>
        )}

        {/* Event Modal */}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            city={selectedCity}
            monthNames={monthNames}
            currentDate={currentDate}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </section>
  );
}

/* ------------ Sub-components ------------ */

const MonthView = ({ weekDays, startDay, daysInMonth, events, currentDate, onSelect }) => (
  <div className="grid grid-cols-7 border border-gray-200 rounded-xl overflow-hidden text-sm">
    {weekDays.map((d) => (
      <div
        key={d}
        className="border-b border-gray-200 py-2 text-center font-medium text-gray-600 bg-gray-50"
      >
        {d}
      </div>
    ))}

    {Array.from({ length: startDay }).map((_, i) => (
      <div key={`empty-${i}`} className="border h-24 bg-gray-50" />
    ))}

    {Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const dayEvents = events.filter((e) => {
        const evDate = new Date(e.fullDate);
        return (
          evDate.getUTCDate() === day &&
          evDate.getMonth() === currentDate.getMonth() &&
          evDate.getFullYear() === currentDate.getFullYear()
        );
      });

      return (
        <div
          key={day}
          className={`relative border h-24 p-2 ${dayEvents.length > 0 ? "cursor-pointer hover:bg-yellow-50" : ""} transition ${dayEvents.length > 0 ? "bg-yellow-50" : "bg-white"
            }`}
        >
          <span className="absolute top-1 right-2 text-xs text-gray-500 font-medium">
            {day}
          </span>
          {dayEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => onSelect(event)}
              className="absolute left-2 right-2 rounded-md text-xs px-2 py-1 shadow-sm mb-1 cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: event.color,
                color: "white",
                borderLeft: "3px solid rgba(0,0,0,0.25)",
                bottom: `${(index * 28) + 2}px`,
                fontSize: "11px",
                filter: "brightness(0.95)"
              }}

            >
              • {event.title}
            </div>
          ))}
        </div>
      );
    })}
  </div>
);

const WeekView = ({ weekDays, hours, events, onSelect }) => (
  <div className="border border-gray-200 rounded-lg overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="border p-2 text-left w-24">Time</th>
          {weekDays.map((d, i) => (
            <th key={i} className="border p-2 text-center font-medium text-gray-600">
              {d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "numeric",
                day: "numeric",
              })}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((h) => (
          <tr key={h} className="text-gray-600">
            <td className="border px-2 py-1 text-xs">{h}</td>
            {weekDays.map((date, i) => {
              const dateEvents = events.filter((e) => {
                const evDate = new Date(e.fullDate);
                return (
                  evDate.getUTCDate() === date.getUTCDate() &&
                  evDate.getMonth() === date.getMonth() &&
                  evDate.getFullYear() === date.getFullYear()
                );
              });

              // Filter events for this specific hour
              const hourEvents = dateEvents.filter(event => {
                const eventHour = event.time.split(':')[0];
                return eventHour === h.split(':')[0];
              });

              return (
                <td
                  key={i}
                  className="border border-gray-200 h-8 relative p-0"
                >
                  {hourEvents.map((event, index) => (
                    <div
                      key={event.id}
                      onClick={() => onSelect(event)}
                      className="absolute left-0 right-0 mx-1 rounded text-xs px-1 py-0.5 cursor-pointer hover:opacity-80 z-10"
                      style={{
                        backgroundColor: event.color,
                        color: "white",
                        borderLeft: "2px solid rgba(0,0,0,0.25)",
                        top: `${index * 20}px`,
                        filter: "brightness(0.95)"

                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DayView = ({ date, hours, events, onSelect }) => {
  const dayEvents = events.filter((e) => {
    const evDate = new Date(e.fullDate);
    return (
      evDate.getDate() === date.getDate() &&
      evDate.getMonth() === date.getMonth() &&
      evDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-left w-24">Time</th>
            <th className="border p-2 text-center font-medium text-gray-600">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </th>
          </tr>
        </thead>
        <tbody>
          {hours.map((h) => {
            const hourEvents = dayEvents.filter(event => {
              const eventHour = event.time.split(':')[0];
              return eventHour === h.split(':')[0];
            });

            return (
              <tr key={h} className="text-gray-600">
                <td className="border px-2 py-3 text-xs align-top">{h}</td>
                <td className="border border-gray-200 p-0 relative">
                  {hourEvents.map((event, index) => (
                    <div
                      key={event.id}
                      onClick={() => onSelect(event)}
                      className="mx-2 my-1 rounded text-xs px-2 py-2 cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: event.color,
                        color: "white",
                        borderLeft: "3px solid rgba(0,0,0,0.25)",
                        minHeight: "40px",
                        filter: "brightness(0.92)"
                      }}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs opacity-75">{event.time} • {event.venue}</div>
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const EventModal = ({ event, city, monthNames, currentDate, onClose }) => {
  const eventDate = new Date(event.fullDate);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-full h-52 md:h-64 bg-gray-200 overflow-hidden">
          <Image
            src={event.banner}
            width={800}
            height={400}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          <p className="text-gray-600 text-sm">
            {eventDate.toLocaleDateString("en-US", {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })} • {event.time} • {city.split(' ').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🕒 Time:</span>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">📍 Venue:</span>
              <span>{event.venue}</span>
            </div>
          </div>
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${event.color}20`,
              color: event.color,
              border: `1px solid ${event.color}`
            }}
          >
            {event.tag}
          </div>
          <p className="text-gray-700 leading-relaxed">{event.desc}</p>
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-2 rounded-md bg-yellow-400 text-gray-800 font-semibold hover:bg-yellow-500 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* helper icon */
const ChevronDownIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 ml-1 transform transition-transform ${open ? "rotate-180" : ""
      }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);