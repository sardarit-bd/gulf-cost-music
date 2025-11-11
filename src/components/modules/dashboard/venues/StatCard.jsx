const StatCard = ({ icon: Icon, label, value, change, color }) => {
    const colorClasses = {
        blue: "from-blue-500 to-cyan-600",
        green: "from-green-500 to-emerald-600",
        orange: "from-orange-500 to-red-600",
        purple: "from-purple-500 to-pink-600",
    };

    const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
    const changeIcon = change >= 0 ? "↗" : "↘";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}>
                    <span>{changeIcon}</span>
                    <span>{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
            <p className="text-gray-600 text-sm">{label}</p>
        </div>
    );
};

export default StatCard;