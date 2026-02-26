// components/venue/VenueInformation.js
import {
  Building2,
  Clock,
  MapPin,
  Phone,
  Users,
  Globe,
  Calendar,
  Info,
  Star,
} from "lucide-react";
import Link from "next/link";

const InfoCard = ({ title, icon, children, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      header: "text-blue-800"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      header: "text-amber-800"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      header: "text-green-800"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      header: "text-purple-800"
    }
  };

  return (
    <div className={`${colorClasses[color].bg} border ${colorClasses[color].border} rounded-xl p-5 h-full`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 bg-white rounded-lg shadow-sm`}>
          {icon}
        </div>
        <h3 className={`font-semibold ${colorClasses[color].header}`}>{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, isLink = false }) => {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <span className="text-gray-500 text-xs block">{label}</span>
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">
            {value.length > 30 ? value.substring(0, 30) + '...' : value}
          </a>
        ) : (
          <span className="text-gray-800 font-medium">{value || '—'}</span>
        )}
      </div>
    </div>
  );
};

const formatCityName = (city) => {
  if (!city) return "—";
  return city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function VenueInformation({ venue, subscriptionPlan }) {
  if (!venue) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
          <Building2 size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{venue.venueName || venue.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${venue.isActive
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
              }`}>
              {venue.isActive ? 'Verified' : 'Pending'}
            </span>
            {venue.verifiedOrder > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                #{venue.verifiedOrder} in {formatCityName(venue.city)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Card */}
        <InfoCard title="Location" icon={<MapPin size={18} className="text-red-500" />} color="blue">
          <InfoRow icon={<Globe size={14} className="text-gray-400" />} label="State" value={venue.state} />
          <InfoRow icon={<MapPin size={14} className="text-gray-400" />} label="City" value={formatCityName(venue.city)} />
          <InfoRow icon={<MapPin size={14} className="text-gray-400" />} label="Address" value={venue.address} />
        </InfoCard>

        {/* Operating Hours Card */}
        <InfoCard title="Operating Hours" icon={<Clock size={18} className="text-amber-500" />} color="amber">
          {venue.openHours ? (
            <InfoRow icon={<Clock size={14} className="text-gray-400" />} label="Hours" value={venue.openHours} />
          ) : (
            <div className="text-sm text-gray-500 italic">Not set</div>
          )}
          {venue.openDays ? (
            <InfoRow icon={<Calendar size={14} className="text-gray-400" />} label="Days" value={venue.openDays} />
          ) : (
            <div className="text-sm text-gray-500 italic">Not set</div>
          )}
          {subscriptionPlan === "free" && (!venue.openHours || !venue.openDays) && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <span className="text-xs text-amber-600">⭐ Pro feature</span>
            </div>
          )}
        </InfoCard>

        {/* Capacity Card */}
        <InfoCard title="Capacity" icon={<Users size={18} className="text-green-500" />} color="green">
          <InfoRow icon={<Users size={14} className="text-gray-400" />} label="Seating" value={`${venue.seatingCapacity || 0} people`} />
        </InfoCard>

        {/* Contact Card */}
        {(venue.phone || venue.website) && (
          <InfoCard title="Contact" icon={<Phone size={18} className="text-purple-500" />} color="purple">
            {venue.phone && <InfoRow icon={<Phone size={14} className="text-gray-400" />} label="Phone" value={venue.phone} />}
            {venue.website && <InfoRow icon={<Globe size={14} className="text-gray-400" />} label="Website" value={venue.website} isLink={true} />}
          </InfoCard>
        )}
      </div>

      {/* Biography Section (if exists) */}
      {venue.biography && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-gray-400" />
            <h3 className="font-semibold text-gray-800">About</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
            {venue.biography}
          </p>
        </div>
      )}

      {/* Color Code (if exists) */}
      {venue.colorCode && venue.colorCode !== "#000000" && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: venue.colorCode }} />
          <span>Venue Color: <span className="font-mono">{venue.colorCode}</span></span>
        </div>
      )}
    </div>
  );
}