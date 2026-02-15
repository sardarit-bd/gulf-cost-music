// components/venue/StatsCards.js
import { Clock, Globe, MapPin, Users } from "lucide-react";

const formatCityName = (city) => {
  if (!city) return "—";
  return city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function StatsCards({ venue, subscriptionPlan }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Seating Capacity Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {venue?.seatingCapacity || "0"}
            </p>
            <p className="text-gray-600">Seating Capacity</p>
          </div>
        </div>
      </div>

      {/* City Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <MapPin size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 truncate">
              {formatCityName(venue?.city)}
            </p>
            <p className="text-gray-600">City</p>
          </div>
        </div>
      </div>

      {/* State Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Globe size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 truncate">
              {venue?.state || "—"}
            </p>
            <p className="text-gray-600">State</p>
          </div>
        </div>
      </div>

      {/* Open Hours Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-lg ${subscriptionPlan === "pro" ? "bg-yellow-100" : "bg-gray-100"}`}
          >
            <Clock
              size={24}
              className={
                subscriptionPlan === "pro" ? "text-yellow-600" : "text-gray-500"
              }
            />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 truncate">
              {venue?.openHours || "—"}
            </p>
            <p className="text-gray-600">Open Hours</p>
            {subscriptionPlan === "free" && !venue?.openHours && (
              <p className="text-xs text-gray-500 mt-1">Pro feature</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
