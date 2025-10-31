"use client";
import { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

export default function CalendarBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState("Mobile");
  const [view, setView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);

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
        const res = await fetch(
          `${API_BASE}/api/venues/calendar?city=${selectedCity.toLowerCase()}`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          const formattedEvents = [];

          data.data.venues.forEach((venue) => {
            venue.shows.forEach((show) => {
              const eventDate = new Date(show.date);
              formattedEvents.push({
                date: eventDate.getDate(),
                title: show.artist,
                color: `bg-${venue.colorCode.toLowerCase()}-100 text-${venue.colorCode.toLowerCase()}-700`,
                time: show.time,
                venue: venue.venueName,
                desc: `Performance by ${show.artist} at ${venue.venueName}`,
                tag: "Show",
                banner:
                  "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=60",
              });
            });
          });

          formattedEvents.sort((a, b) => a.date - b.date);
          setEvents(formattedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [selectedCity]);

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
              <span className="font-medium">{selectedCity}</span>
              <ChevronDownIcon open={dropdownOpen} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {["Mobile", "Biloxi", "New Orleans", "Pensacola"].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-100 transition ${
                      selectedCity === city
                        ? "bg-yellow-50 font-semibold text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {city}
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
                className={`px-3 py-1 rounded-md border text-sm text-gray-600 capitalize transition ${
                  view === v
                    ? "bg-yellow-300 border-yellow-400"
                    : "bg-white border-gray-300 hover:bg-yellow-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Month View */}
        {view === "month" && (
          <MonthView
            weekDays={weekDays}
            startDay={startDay}
            daysInMonth={daysInMonth}
            events={events}
            onSelect={(e) => setSelectedEvent(e)}
          />
        )}

        {/* Week View */}
        {view === "week" && (
          <WeekView
            weekDays={getWeekDates()}
            hours={hours}
            events={events}
            onSelect={(e) => setSelectedEvent(e)}
          />
        )}

        {/* Day View */}
        {view === "day" && (
          <DayView
            date={currentDate}
            hours={hours}
            events={events}
            onSelect={(e) => setSelectedEvent(e)}
          />
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

const MonthView = ({ weekDays, startDay, daysInMonth, events, onSelect }) => (
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
      const event = events.find((e) => e.date === day);
      return (
        <div
          key={day}
          onClick={() => event && onSelect(event)}
          className={`relative border h-24 p-2 cursor-pointer hover:bg-yellow-50 transition ${
            event ? "bg-yellow-50" : "bg-white"
          }`}
        >
          <span className="absolute top-1 right-2 text-xs text-gray-500 font-medium">
            {day}
          </span>
          {event && (
            <div
              className={`absolute bottom-2 left-2 right-2 border border-gray-200 rounded-md text-xs px-2 py-1 ${event.color} shadow-sm`}
            >
              • {event.title}
            </div>
          )}
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
          <th className="border p-2 text-left w-24">All-day</th>
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
            {Array.from({ length: 7 }).map((_, i) => {
              const dateNum = weekDays[i].getDate();
              const event = events.find((e) => e.date === dateNum);
              return (
                <td
                  key={i}
                  onClick={() => event && onSelect(event)}
                  className={`border border-gray-200 h-8 hover:bg-yellow-50 transition ${
                    event ? "bg-yellow-50" : ""
                  }`}
                >
                  {event && (
                    <span className={`text-xs ${event.color.split(" ")[1]}`}>
                      {event.title}
                    </span>
                  )}
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
  const event = events.find((e) => e.date === date.getDate());
  return (
    <div className="border border-gray-200 rounded-lg overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-left w-24">All-day</th>
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
          {hours.map((h) => (
            <tr key={h} className="text-gray-600">
              <td className="border px-2 py-1 text-xs">{h}</td>
              <td
                onClick={() => event && onSelect(event)}
                className={`border border-gray-200 h-8 hover:bg-yellow-50 transition ${
                  event ? "bg-yellow-50" : ""
                }`}
              >
                {event && h.startsWith("10") && (
                  <span className={`text-xs ${event.color.split(" ")[1]}`}>
                    {event.title}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EventModal = ({ event, city, monthNames, currentDate, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl overflow-hidden animate-fadeIn relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="w-full h-52 md:h-64 bg-gray-200 overflow-hidden">
        <Image
          src={
            event.banner ||
            "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=60"
          }
          width={800}
          height={400}
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold brandColor">{event.title}</h2>
        <p className="text-gray-500 text-sm">
          {monthNames[currentDate.getMonth()]} {event.date},{" "}
          {currentDate.getFullYear()} • {city}
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
          className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${event.color}`}
        >
          {event.tag}
        </div>
        <p className="text-gray-700 leading-relaxed">{event.desc}</p>
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md brandBg text-white font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* helper icon */
const ChevronDownIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 ml-1 transform transition-transform ${
      open ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);
