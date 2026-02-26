export const CustomInput = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    minLength,
    maxLength,
    disabled = false,
    icon
}) => {
    return (
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
                minLength={minLength}
                maxLength={maxLength}
                disabled={disabled}
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder:text-gray-400 text-gray-700 transition-all duration-200 ${icon ? "pl-10" : ""
                    } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
        </div>
    );
};