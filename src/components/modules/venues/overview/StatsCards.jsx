// components/venue/StatsCards.js
import { Clock, Globe, MapPin, Users, Calendar } from "lucide-react";

const formatCityName = (city) => {
  if (!city) return "—";
  return city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const StatCard = ({ icon, label, value, color, subValue }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-100 rounded-xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600 text-sm">{label}</p>
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
      </div>
    </div>
  </div>
);

export default function StatsCards({ venue, subscriptionPlan }) {
  if (!venue) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<Users size={24} className="text-blue-600" />}
        label="Seating Capacity"
        value={venue.seatingCapacity || "0"}
        color="blue"
      />

      <StatCard
        icon={<MapPin size={24} className="text-green-600" />}
        label="City"
        value={formatCityName(venue.city) || "—"}
        color="green"
        subValue={venue.state}
      />

      <StatCard
        icon={<Globe size={24} className="text-purple-600" />}
        label="State"
        value={venue.state || "—"}
        color="purple"
      />

      <StatCard
        icon={<Clock size={24} className={venue.openHours ? "text-amber-600" : "text-gray-400"} />}
        label="Open Hours"
        value={venue.openHours ? venue.openHours.split(' ')[0] : "—"}
        color={venue.openHours ? "amber" : "gray"}
        subValue={subscriptionPlan === "free" && !venue.openHours ? "Pro feature" : null}
      />
    </div>
  );
}