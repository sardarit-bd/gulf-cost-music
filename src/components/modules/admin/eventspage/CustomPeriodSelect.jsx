"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CustomPeriodSelect({
    value,
    onChange,
    options,
    placeholder = "AM/PM",
    error = false,
    disabled = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-24" ref={dropdownRef}>
            {/* Selected Value Display */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 text-sm border rounded-lg flex items-center justify-between cursor-pointer transition-all ${error
                        ? "border-red-400 bg-red-50"
                        : disabled
                            ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                            : "border-gray-200 bg-white hover:border-yellow-400"
                    }`}
            >
                <span className={`text-sm ${!selectedOption ? "text-gray-400" : "text-gray-700"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
            </div>

            {/* Dropdown Options */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className={`px-3 py-2 text-sm cursor-pointer transition-colors text-center ${value === option.value
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}