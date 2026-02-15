// components/venue/VenueInformation.js
import {
  Building2,
  Clock,
  Edit3,
  Globe,
  MapPin,
  Palette,
  Phone,
  Star,
  Users,
} from "lucide-react";

const InfoCard = ({
  icon,
  label,
  value,
  isProFeature = false,
  isLink = false,
}) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
    <div className="text-gray-500 mt-1">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-600 mb-1 truncate">{label}</p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-900 font-medium truncate">{value || "—"}</p>
      )}
      {isProFeature && (
        <p className="text-xs text-gray-500 mt-1">Pro feature</p>
      )}
    </div>
  </div>
);

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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Building2 size={24} className="text-gray-700" />
        Venue Information
      </h3>

      <div className="space-y-4">
        {/* Venue Name */}
        <InfoCard
          icon={<Star className="text-yellow-500" size={20} />}
          label="Venue Name"
          value={venue.venueName || venue.name || "—"}
        />

        {/* State & City */}
        <div className="grid grid-cols-2 gap-4">
          <InfoCard
            icon={<Globe className="text-purple-500" size={20} />}
            label="State"
            value={venue.state || "—"}
          />
          <InfoCard
            icon={<MapPin className="text-red-500" size={20} />}
            label="City"
            value={formatCityName(venue.city)}
          />
        </div>

        {/* Address */}
        <InfoCard
          icon={<MapPin className="text-red-500" size={20} />}
          label="Address"
          value={venue.address}
        />

        {/* Seating Capacity */}
        <InfoCard
          icon={<Users className="text-blue-500" size={20} />}
          label="Seating Capacity"
          value={
            venue.seatingCapacity ? `${venue.seatingCapacity} people` : "—"
          }
        />

        {/* Open Hours */}
        <InfoCard
          icon={<Clock className="text-green-500" size={20} />}
          label="Open Hours"
          value={venue.openHours || "Not set"}
          isProFeature={!venue.openHours && subscriptionPlan === "free"}
        />

        {/* Open Days */}
        <InfoCard
          icon={<Clock className="text-green-500" size={20} />}
          label="Open Days"
          value={venue.openDays || "Not set"}
          isProFeature={!venue.openDays && subscriptionPlan === "free"}
        />

        {/* Phone */}
        {venue.phone && (
          <InfoCard
            icon={<Phone className="text-cyan-500" size={20} />}
            label="Phone"
            value={venue.phone}
          />
        )}

        {/* Website */}
        {venue.website && (
          <InfoCard
            icon={<Globe className="text-cyan-500" size={20} />}
            label="Website"
            value={venue.website}
            isLink={true}
          />
        )}

        {/* Venue Color */}
        {venue.colorCode &&
          venue.colorCode !== "#000000" &&
          venue.colorCode !== null && (
            <InfoCard
              icon={<Palette className="text-pink-500" size={20} />}
              label="Venue Color"
              value={
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: venue.colorCode }}
                  />
                  <span>{venue.colorCode}</span>
                </div>
              }
            />
          )}

        {/* Verification Status */}
        {venue.verifiedOrder > 0 && (
          <InfoCard
            icon={<Star className="text-yellow-500" size={20} />}
            label="Verification Status"
            value={`Verified (#${venue.verifiedOrder} in ${formatCityName(venue.city)})`}
          />
        )}
      </div>

      {/* Biography Section */}
      {venue.biography && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Edit3 size={18} className="text-gray-700" />
            About Venue
          </h4>
          <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
            {venue.biography}
          </p>
        </div>
      )}
    </div>
  );
}
