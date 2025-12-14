import { Ban, Camera, CheckCircle, Crown, Users } from "lucide-react";

export default function PhotographerStats({ stats, loading }) {
    if (!stats && !loading) return null;

    const Card = ({ icon: Icon, label, value, color = "gray" }) => (
        <div className={`bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 transition-all hover:shadow-md ${loading ? 'animate-pulse' : ''}`}>
            <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'green' ? 'bg-green-50 text-green-600' : color === 'red' ? 'bg-red-50 text-red-600' : color === 'yellow' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                {loading ? (
                    <>
                        <div className="h-7 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 text-2xl font-bold">{value}</p>
                        <p className="text-sm text-gray-600">{label}</p>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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