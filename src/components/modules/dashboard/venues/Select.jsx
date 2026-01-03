const Select = ({ label, name, value, options, onChange, icon, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            {icon}
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border text-white focus:ring-2 transition ${disabled
                ? "border-gray-700 bg-gray-900/50 text-gray-500 cursor-not-allowed"
                : "border-gray-600 focus:border-yellow-500 focus:ring-yellow-500/20"
                }`}
        >
            <option value="">Select a city</option>
            {options.map((opt) => (
                <option key={opt} value={opt.toLowerCase()}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default Select;