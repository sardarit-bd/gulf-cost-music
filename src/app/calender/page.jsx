"use client";
import { useState } from "react";

export default function CalendarBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState("Mobile");
  const [view, setView] = useState("month");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const events = [
    { date: 22, title: "Mawas Birthday", color: "bg-red-100 text-red-600" },
    { date: 24, title: "Team Meeting", color: "bg-green-100 text-green-600" },
  ];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToday = () => setCurrentDate(new Date());

  // Week and Day time slots
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // Week days
  const getWeekDates = () => {
    const currentDay = currentDate.getDay();
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDay);
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  return (
    <section className="bg-[#F9FAFB] shadow-md p-6 py-10">
      <div className="container mx-auto">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Calender Board
          </h2>

          {/* City Dropdown */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
          >
            <option>New Orleans</option>
            <option>Biloxi</option>
            <option>Mobile</option>
            <option>Pensacola</option>
          </select>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center border border-gray-200 p-3 rounded-md mb-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="px-2 py-1 bg-yellow-300 border border-yellow-400 rounded hover:bg-yellow-400 transition"
            >
              &lt;
            </button>
            <button
              onClick={nextMonth}
              className="px-2 py-1 bg-yellow-300 border border-yellow-400 rounded hover:bg-yellow-400 transition"
            >
              &gt;
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1 bg-yellow-200 border border-yellow-300 rounded hover:bg-yellow-300 transition"
            >
              today
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            {view === "month"
              ? `${
                  monthNames[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`
              : view === "week"
              ? `${getWeekDates()[0].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - ${getWeekDates()[6].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : `${
                  monthNames[currentDate.getMonth()]
                } ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
          </h3>

          <div className="flex gap-1">
            {["month", "week", "day"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 border border-yellow-400 rounded ${
                  view === v ? "bg-yellow-300" : "bg-yellow-200"
                } hover:bg-yellow-400 transition`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* --- MONTH VIEW --- */}
        {view === "month" && (
          <div className="grid grid-cols-7 border border-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="border-b border-gray-200 py-2 text-center text-gray-700 font-medium bg-gray-50"
              >
                {d}
              </div>
            ))}

            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="border h-24 bg-gray-50"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              const event = events.find((e) => e.date === day);
              return (
                <div
                  key={day}
                  className={`border h-24 p-2 relative ${
                    event ? "bg-yellow-50" : ""
                  }`}
                >
                  <div className="absolute top-1 right-2 text-xs text-gray-500">
                    {day}
                  </div>

                  {event && (
                    <div
                      className={`absolute bottom-2 left-1 right-1 rounded-md text-xs px-2 py-1 ${event.color} border border-gray-300`}
                    >
                      • {event.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- WEEK VIEW --- */}
        {view === "week" && (
          <div className="border border-gray-300 rounded-md overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-gray-50 p-2 text-left">all-day</th>
                  {getWeekDates().map((d, i) => (
                    <th key={i} className="border bg-gray-50 p-2 text-center">
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
                    {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="border border-gray-200 h-8"></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- DAY VIEW --- */}
        {view === "day" && (
          <div className="border border-gray-300 rounded-md overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-gray-50 p-2 text-left w-24">
                    all-day
                  </th>
                  <th className="border bg-gray-50 p-2 text-center">
                    {currentDate.toLocaleDateString("en-US", {
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
                    <td className="border border-gray-200 h-8"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
