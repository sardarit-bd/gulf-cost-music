// components/ui/Input.js
"use client";

export default function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    disabled = false,
    icon,
    className = "",
    error = false,
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={` text-gray-600
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                            : 'border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                        }
            ${disabled ? 'cursor-not-allowed opacity-60 bg-gray-50' : 'bg-white'}
            focus:outline-none focus:border-transparent
          `}
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}