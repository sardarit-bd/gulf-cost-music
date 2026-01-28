const Select = ({
    label,
    name,
    value,
    options,
    onChange,
    icon,
    disabled = false,
    placeholder = "",
    required = false,
    className = ""
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    {icon}
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {options.map((opt) => {
                    // Handle both object and string options
                    const optionValue = typeof opt === 'object' && opt !== null ? opt.value : opt;
                    const optionLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;

                    // If opt is string and we need to lowercase it
                    const finalValue = typeof opt === 'string' ? opt.toLowerCase() : optionValue;

                    return (
                        <option
                            key={finalValue}
                            value={finalValue}
                        >
                            {optionLabel}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Select;