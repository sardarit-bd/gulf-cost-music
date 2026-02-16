// components/modules/admin/stats/StatsCard.js
"use client";

const StatsCard = ({ title, value, icon: Icon, color = "blue", description, trend }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      iconBg: "bg-green-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      iconBg: "bg-yellow-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      iconBg: "bg-red-100",
    },
    gray: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
    },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-xl border ${classes.border} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${classes.text}`}>{value.toLocaleString()}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <div className={`${classes.iconBg} p-3 rounded-lg`}>
          <Icon className={`h-5 w-5 ${classes.text}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className={`text-sm font-medium ${trend.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;