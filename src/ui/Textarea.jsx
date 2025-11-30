
const Textarea = ({
    label,
    name,
    value,
    onChange,
    icon,
    placeholder,
    rows = 4,
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
                    <div className="absolute left-3 top-3 text-gray-400">
                        {icon}
                    </div>
                )}
                <textarea
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    className={`w-full bg-gray-800 border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none ${icon ? 'pl-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    );
};

export default Textarea;