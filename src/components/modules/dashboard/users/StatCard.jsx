const StatCard = ({ icon: Icon, label, value, color, description }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        red: "from-red-500 to-red-600",
        orange: "from-orange-500 to-orange-600",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5 mb-2">
                <div
                    className={`p-1.5 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}
                >
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div >
                    <h3 className="text-xl font-bold text-gray-900 mb-0.5">{value || 0}</h3>
                    <p className="text-gray-700 text-xs font-medium">{label}</p>
                    {description && (
                        <p className="text-gray-400 text-[10px] mt-0.5">{description}</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StatCard;