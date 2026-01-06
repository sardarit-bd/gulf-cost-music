const Input = ({ label, name, value, onChange, type = "text", icon, placeholder, disabled = false, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            {icon}
            {label}
        </label>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400 focus:ring-2 transition ${disabled
                ? "border-gray-700 bg-gray-900/50 text-gray-500 cursor-not-allowed"
                : "border-gray-600 focus:border-yellow-500 focus:ring-yellow-500/20"
                }`}
            required={!disabled}
            {...props}
        />
    </div>
);

export default Input;