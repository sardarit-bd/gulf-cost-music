// ui/Select.jsx
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
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Close dropdown when clicking outside
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

        const syntheticEvent = {
            target: {
                name,
                value: optionValue,
            },
        };

        onChange(syntheticEvent);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption?.label || placeholder;

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
          w-full flex items-center justify-between gap-3 
          bg-gray-800 text-white px-4 py-3 rounded-xl 
          border ${disabled ? 'border-gray-700' : 'border-gray-600 hover:border-yellow-500'} 
          transition-all duration-200
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
        `}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-gray-400">{icon}</span>}
                    <span className={`${!selectedOption ? 'text-gray-400' : 'text-white'}`}>
                        {displayValue}
                    </span>
                </div>
                <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={18}
                />
            </button>

            {/* Dropdown Options */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-64 overflow-auto">
                    {options.map((option, index) => (
                        <button
                            key={`${option.value}-${index}`}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            disabled={option.disabled}
                            className={`
                w-full px-4 py-3 text-left transition-colors duration-150
                ${option.value === value
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                flex items-center justify-between
                border-b border-gray-700 last:border-b-0
              `}
                        >
                            <span>{option.label}</span>
                            {option.value === value && (
                                <span className="text-yellow-500">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}