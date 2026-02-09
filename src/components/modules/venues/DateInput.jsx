// components/DateInput.js
"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function DateInput({
  value,
  onChange,
  disabled,
  minDate,
  required,
}) {
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (value) {
      const dateParts = value.split("/");
      if (dateParts.length === 3) {
        const [month, day, year] = dateParts;
        setDateInput(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        );
      }
    } else {
      setDateInput("");
    }
  }, [value]);

  const validateAndSetDate = (value) => {
    setDateInput(value);
    setError("");

    if (!value) {
      onChange("");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      setError("Please use YYYY-MM-DD format");
      return;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      setError("Invalid date");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      setError("Date cannot be in the past");
      return;
    }

    const formattedDate = `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`;
    onChange(formattedDate);
  };

  const handleChange = (e) => {
    validateAndSetDate(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Calendar size={18} className="text-gray-500" />
        Show Date *
      </label>
      <div className="relative">
        <input
          type="date"
          value={dateInput}
          onChange={handleChange}
          className="w-full px-4 py-3 pr-10 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          min={minDate}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          onClick={() =>
            document.querySelector('input[type="date"]')?.showPicker()
          }
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
          disabled={disabled}
        >
          <Calendar size={18} />
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
}
