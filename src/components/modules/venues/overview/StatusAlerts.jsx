// components/venue/StatusAlerts.js
import { CheckCircle, Clock } from "lucide-react";

const Alert = ({ type, icon, title, children }) => {
  const colors = {
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      titleColor: "text-amber-800",
      textColor: "text-amber-700"
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      textColor: "text-green-700"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      textColor: "text-blue-700"
    }
  };

  const style = colors[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 ${style.iconBg} rounded-lg`}>
          {icon}
        </div>
        <div>
          <h4 className={`${style.titleColor} font-semibold mb-1`}>{title}</h4>
          <p className={`${style.textColor} text-sm`}>{children}</p>
        </div>
      </div>
    </div>
  );
};

export default function StatusAlerts({ venue }) {
  if (!venue) return null;

  return (
    <div className="space-y-4 mb-6">
      {!venue.isActive && (
        <Alert
          type="warning"
          icon={<Clock size={20} className="text-amber-600" />}
          title="Pending Verification"
        >
          Your venue is under review. You'll receive a verification color code once approved.
        </Alert>
      )}

      {venue.isActive && venue.verifiedOrder === 0 && (
        <Alert
          type="info"
          icon={<CheckCircle size={20} className="text-blue-600" />}
          title="Verification in Progress"
        >
          Your venue is active but verification color is being assigned. This will be updated soon.
        </Alert>
      )}

      {venue.colorCode && venue.colorCode !== "#000000" && venue.colorCode !== null && (
        <Alert
          type="success"
          icon={
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: venue.colorCode }}
            />
          }
          title="Venue Color Assigned"
        >
          Your venue color is <span className="font-mono font-medium">{venue.colorCode}</span>.
          All your events will appear with this color in the calendar.
        </Alert>
      )}
    </div>
  );
}