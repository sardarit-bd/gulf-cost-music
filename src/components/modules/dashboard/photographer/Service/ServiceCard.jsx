// components/modules/dashboard/photographer/ServiceCard.jsx
"use client";

import {
  Clock,
  DollarSign,
  Edit2,
  Loader2,
  Mail,
  Phone,
  Trash2,
  User,
} from "lucide-react";

const InfoItem = ({ icon: Icon, label, value, color = "gray" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    amber: "text-amber-600",
    gray: "text-gray-600",
  };

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <div
        className={`p-2 rounded-lg ${colorClasses[color]} bg-white border border-gray-200`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium">{value || "—"}</p>
      </div>
    </div>
  );
};

const ServiceTag = ({ children, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
  isDeleting,
  durationOptions,
  categoryOptions,
}) {
  const getCategoryColor = (category) => {
    const colors = {
      photography: "blue",
      videography: "purple",
      editing: "green",
      consultation: "amber",
      workshop: "indigo",
      equipment: "rose",
      other: "gray",
    };
    return colors[category] || "gray";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {service.service}
            </h3>
            <ServiceTag color={getCategoryColor(service.category)}>
              {categoryOptions.find((c) => c.value === service.category)
                ?.label || service.category}
            </ServiceTag>
          </div>
          {/* {service.description && (
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          )} */}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(service)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Edit service"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service)}
            disabled={isDeleting === service._id}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Delete service"
          >
            {isDeleting === service._id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <InfoItem
            icon={DollarSign}
            label="Price"
            value={service.price}
            color="green"
          />
          <InfoItem
            icon={Clock}
            label="Duration"
            value={
              durationOptions.find((d) => d.value === service.duration)
                ?.label ||
              service.duration ||
              "Not set"
            }
            color="blue"
          />
        </div>

        <div className="space-y-1">
          <InfoItem
            icon={Mail}
            label="Email"
            value={service.contact?.email || "Not set"}
            color="gray"
          />
          <InfoItem
            icon={Phone}
            label="Phone"
            value={
              service.contact?.phone
                ? `${service.contact.phone} ${service.contact.showPhonePublicly ? "(Public)" : "(Private)"}`
                : "Not set"
            }
            color="gray"
          />
          <InfoItem
            icon={User}
            label="Preferred Contact"
            value={
              service.contact?.preferredContact === "phone" ? "Phone" : "Email"
            }
            color="gray"
          />
        </div>
      </div>
    </div>
  );
}
