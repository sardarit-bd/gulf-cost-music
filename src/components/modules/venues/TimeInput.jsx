// components/TimeInput.js
"use client";

import { Clock } from "lucide-react";

export default function TimeInput({ value, onChange, disabled, required }) {
  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      const [time, period] = timeString.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }

    return timeString;
  };

  const handleChange = (e) => {
    let timeValue = e.target.value;

    if (!timeValue) {
      onChange("");
      return;
    }

    if (timeValue.includes(":")) {
      const [hours, minutes] = timeValue.split(":");
      let hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      timeValue = `${hour}:${minutes.padStart(2, "0")} ${ampm}`;
    }

    onChange(timeValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Clock size={18} className="text-gray-500" />
        Show Time *
      </label>
      <div className="relative">
        <input
          type="time"
          value={formatTimeForInput(value)}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
          required={required}
          step="1800"
        />
        <button
          type="button"
          onClick={() =>
            document.querySelector('input[type="time"]')?.showPicker()
          }
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
          disabled={disabled}
        >
          <Clock size={18} />
        </button>
      </div>
    </div>
  );
}
