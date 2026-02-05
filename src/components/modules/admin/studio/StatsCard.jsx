// components/studios/StatsCard.js
"use client";

const StatsCard = ({ title, value, icon: Icon, color, trend, description }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    gray: "bg-gray-500",
  };

  const bgColorClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    yellow: "bg-yellow-50",
    purple: "bg-purple-50",
    red: "bg-red-50",
    indigo: "bg-indigo-50",
    pink: "bg-pink-50",
    gray: "bg-gray-50",
  };

  return (
    <div
      className={`${bgColorClasses[color] || "bg-white"} rounded-xl border p-6 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${trend.type === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {trend.value}
              </span>
              <span className="text-xs text-gray-500">
                {trend.type === "up" ? "↑" : "↓"} from last month
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${colorClasses[color] || "bg-blue-500"}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
