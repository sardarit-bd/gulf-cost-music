export const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        purple: "from-purple-500 to-pink-600",
        green: "from-green-500 to-emerald-600",
        blue: "from-blue-500 to-cyan-600",
        orange: "from-orange-500 to-red-600",
        yellow: "from-yellow-500 to-yellow-600",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                    <h3 className="text-xl font-bold text-gray-900">{value}</h3>
                    <p className="text-xs text-gray-500">{label}</p>
                </div>
            </div>
        </div>
    );
};