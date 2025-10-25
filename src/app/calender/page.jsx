"use client";
import { useState, useMemo, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function CalendarBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState("Mobile");
  const [view, setView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const monthNames = useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    []
  );

  const weekDays = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  // ---------------------- Dummy Data by City ----------------------
  const cityEvents = {
    Mobile: [
      {
        date: 22,
        title: "Mawa’s Birthday 🎂",
        color: "bg-red-100 text-red-700",
        desc: "Celebrate Mawa’s birthday with the whole team!",
        banner:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=60",
        time: "7:00 PM – 10:00 PM",
        venue: "Main Hall, Mobile HQ",
        tag: "Celebration",
      },
      {
        date: 24,
        title: "Team Meeting 💼",
        color: "bg-green-100 text-green-700",
        desc: "Weekly sprint meeting with the development team.",
        banner:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=60",
        time: "11:00 AM – 12:30 PM",
        venue: "Conference Room, Mobile HQ",
        tag: "Meeting",
      },
    ],
    Biloxi: [
      {
        date: 18,
        title: "Marketing Strategy Session 📊",
        color: "bg-purple-100 text-purple-700",
        desc: "Quarterly planning for marketing goals and outreach.",
        banner:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=60",
        time: "9:00 AM – 11:00 AM",
        venue: "Oceanview Office, Biloxi",
        tag: "Planning",
      },
      {
        date: 26,
        title: "Product Launch 🚀",
        color: "bg-blue-100 text-blue-700",
        desc: "Introducing our new product line to the market.",
        banner:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=60",
        time: "3:00 PM – 6:00 PM",
        venue: "Downtown Biloxi Auditorium",
        tag: "Launch",
      },
    ],
    "New Orleans": [
      {
        date: 15,
        title: "Charity Event ❤️",
        color: "bg-pink-100 text-pink-700",
        desc: "Fundraising and awareness for local shelters.",
        banner:
          "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=60",
        time: "6:00 PM – 9:00 PM",
        venue: "City Park Arena, New Orleans",
        tag: "Charity",
      },
    ],
    Pensacola: [
      {
        date: 10,
        title: "Workshop: Innovation Day ⚙️",
        color: "bg-orange-100 text-orange-700",
        desc: "A full-day creative workshop for our R&D team.",
        banner:
          "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=900&q=60",
        time: "10:00 AM – 5:00 PM",
        venue: "Innovation Lab, Pensacola",
        tag: "Workshop",
      },
    ],
  };

  // ---------------------- Update Events on City Change ----------------------
  useEffect(() => {
    setEvents(cityEvents[selectedCity] || []);
  }, [selectedCity]);

  // ---------------------- Calendar Date Logic ----------------------
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

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

  // ---------------------- JSX ----------------------
  return (
    <section className="brandBg min-h-screen py-10">
      <div className="container mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 relative">
        {/* ---------- Header ---------- */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <CalendarDays className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold brandColor">Calendar Board</h1>
          </div>

          {/* ---------- Custom Venue Selector ---------- */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:border-yellow-400 hover:bg-yellow-50 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.5 8c0 7-7.5 13-7.5 13S4.5 15 4.5 8A7.5 7.5 0 0112 0.5 7.5 7.5 0 0119.5 8z"
                />
              </svg>
              <span className="font-medium">{selectedCity}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ml-1 transform transition-transform ${dropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-dropdownIn">
                {Object.keys(cityEvents).map((city) => (
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
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------- Controls ---------- */}
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

        {/* ---------- Month View ---------- */}
        {view === "month" && (
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
                  onClick={() => event && setSelectedEvent(event)}
                  className={`relative border h-24 p-2 cursor-pointer hover:bg-yellow-50 transition ${event ? "bg-yellow-50" : "bg-white"
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
        )}

        {/* ---------- Modal ---------- */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl overflow-hidden animate-fadeIn relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-52 md:h-64 bg-gray-200 overflow-hidden">
                <img
                  src={
                    selectedEvent.banner ||
                    "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=60"
                  }
                  alt="Event Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold brandColor">{selectedEvent.title}</h2>
                <p className="text-gray-500 text-sm">
                  {monthNames[currentDate.getMonth()]} {selectedEvent.date},{" "}
                  {currentDate.getFullYear()} • {selectedCity}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🕒 Time:</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📍 Venue:</span>
                    <span>{selectedEvent.venue}</span>
                  </div>
                </div>

                <div
                  className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${selectedEvent.color}`}
                >
                  {selectedEvent.tag}
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {selectedEvent.desc}
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-2 rounded-md brandBg text-white font-semibold hover:opacity-90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
