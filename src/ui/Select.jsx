"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Select({
  label,
  name,
  value,
  options,
  onChange,
  icon,
  required,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    if (optionValue === value || optionValue === "") return;

    if (typeof onChange === "function") {
      if (onChange.length === 1) {
        // value-based onChange (like your venue page)
        onChange(optionValue);
      } else {
        // event-based onChange (old usage)
        onChange({
          target: {
            name,
            value: optionValue,
          },
        });
      }
    }

    setIsOpen(false);
  };


  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
                    w-full flex items-center justify-between gap-3 
                    bg-white text-gray-900 px-4 py-3 rounded-xl 
                    border ${error ? "border-red-300" : "border-gray-300 hover:border-blue-500"} 
                    transition-all duration-200 shadow-sm
                    ${disabled ? "cursor-not-allowed opacity-60 bg-gray-50" : "cursor-pointer"}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                `}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span
            className={`${!selectedOption ? "text-gray-400" : "text-gray-900"}`}
          >
            {displayValue}
          </span>
        </div>
        <ChevronDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto">
          {options.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={option.disabled}
              className={`
                                w-full px-4 py-3 text-left transition-colors duration-150
                                ${option.value === value
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
                }
                                ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                flex items-center justify-between
                                border-b border-gray-100 last:border-b-0
                            `}
            >
              <span className={option.disabled ? "text-gray-400" : ""}>
                {option.label}
              </span>
              {option.value === value && (
                <span className="text-blue-600 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}