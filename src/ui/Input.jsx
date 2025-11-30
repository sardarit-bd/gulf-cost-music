
const Input = ({
    label,
    name,
    value,
    onChange,
    icon,
    placeholder,
    type = "text",
    required = false,
    disabled = false
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-300"
                >
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
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
                    id={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full bg-gray-800 border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition ${icon ? 'pl-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    );
};

export default Input;