import { Ban, Camera, CheckCircle, Crown, Users } from "lucide-react";

export default function PhotographerStats({ stats, loading }) {
    if (!stats && !loading) return null;

    const colorClasses = {
        blue: "from-blue-500 to-cyan-600",
        green: "from-green-500 to-emerald-600",
        orange: "from-orange-500 to-red-600",
        purple: "from-purple-500 to-pink-600",
        yellow: "from-yellow-500 to-amber-600",
        gray: "from-gray-500 to-gray-600",
        red: "from-red-500 to-rose-600",
    };

    const getIconColor = (color) => colorClasses[color] || colorClasses.gray;

    const Card = ({ icon: Icon, label, value, color = "gray" }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value || 0}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getIconColor(color)}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <Card
                icon={Camera}
                label="Total Photographers"
                value={stats?.total || 0}
                color="blue"
            />
            <Card
                icon={Crown}
                label="Pro Plan"
                value={stats?.pro || 0}
                color="yellow"
            />
            <Card
                icon={Users}
                label="Free Plan"
                value={stats?.free || 0}
                color="gray"
            />
            <Card
                icon={CheckCircle}
                label="Active"
                value={stats?.active || 0}
                color="green"
            />
            <Card
                icon={Ban}
                label="Inactive"
                value={stats?.inactive || 0}
                color="red"
            />
        </div>
    );
}