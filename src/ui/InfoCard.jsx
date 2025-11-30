
const InfoCard = ({
    icon,
    label,
    value,
    description,
    variant = "default",
    className = "",
    valueClassName = "",
    onClick
}) => {
    const variants = {
        default: "bg-gray-800/30 border-gray-700/50",
        highlighted: "bg-yellow-500/10 border-yellow-500/20",
        success: "bg-green-500/10 border-green-500/20",
        warning: "bg-orange-500/10 border-orange-500/20",
        error: "bg-red-500/10 border-red-500/20"
    };

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg border ${variants[variant]} ${onClick ? 'cursor-pointer hover:bg-gray-700/30 transition' : ''} ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 flex-1">
                {icon && (
                    <div className="flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <div className="flex-1">
                    <span className="text-gray-300 font-medium block">{label}</span>
                    {description && (
                        <span className="text-gray-500 text-sm block mt-1">{description}</span>
                    )}
                </div>
            </div>
            <span className={`text-white font-semibold ${valueClassName}`}>
                {value || "—"}
            </span>
        </div>
    );
};

export default InfoCard;