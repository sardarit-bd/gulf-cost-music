import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder,
    disabled = false,
    icon,
    className = "",
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:border-gray-400"
                    }`}
            >
                <div className="flex items-center space-x-3">
                    {icon && <span className="text-gray-400">{icon}</span>}
                    <span className={!selectedOption ? "text-gray-400" : ""}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-yellow-50 transition-colors duration-150 ${value === option.value ? "bg-yellow-50 text-yellow-700" : "text-gray-700"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                {option.icon && <span className="text-gray-500">{option.icon}</span>}
                                <span>{option.label}</span>
                            </div>
                            {value === option.value && (
                                <Check className="h-4 w-4 text-yellow-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};