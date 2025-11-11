const StatCard = ({ icon: Icon, label, value, color, description }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        red: "from-red-500 to-red-600",
        orange: "from-orange-500 to-orange-600",
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
            <p className="text-gray-900 font-medium text-sm">{label}</p>
            {description && (
                <p className="text-gray-500 text-xs mt-1">{description}</p>
            )}
        </div>
    );
};

export default StatCard;