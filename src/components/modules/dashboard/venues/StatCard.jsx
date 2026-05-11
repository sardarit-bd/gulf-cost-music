import { Crown, DollarSign, Sparkles } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        blue: "from-blue-500 to-cyan-600",
        green: "from-green-500 to-emerald-600",
        orange: "from-orange-500 to-red-600",
        purple: "from-purple-500 to-pink-600",
        yellow: "from-yellow-500 to-amber-600",
        gray: "from-gray-500 to-gray-600",
        pink: "from-pink-500 to-rose-600",
        cyan: "from-cyan-500 to-teal-600",
    };

    // Special icons for specific labels
    const renderIcon = () => {
        if (label === "Pro Plan") return <Crown className="w-5 h-5 text-white" />;
        if (label === "Free Plan") return <DollarSign className="w-5 h-5 text-white" />;
        if (label === "Colors Assigned") return <Sparkles className="w-5 h-5 text-white" />;
        return <Icon className="w-5 h-5 text-white" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value || 0}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color] || "from-gray-500 to-gray-600"}`}>
                    {renderIcon()}
                </div>
            </div>
        </div>
    );
};

export default StatCard;