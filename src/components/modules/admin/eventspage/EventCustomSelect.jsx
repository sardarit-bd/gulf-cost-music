"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EventCustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    error = false,
    disabled = false,
    icon: Icon = null,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
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
                <div className="flex items-center gap-2 flex-1">
                    {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
                    <span className={`text-sm ${!selectedOption ? "text-gray-400" : "text-gray-700"}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
            </div>

            {/* Dropdown Options */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full text-gray-500 px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-44 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value === option.value
                                        ? "bg-yellow-50 text-yellow-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-400 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}