"use client";

import { DollarSign, Edit2, Loader2, Mail, Phone, Trash2, User } from "lucide-react";

const ServiceTag = ({ children, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]}`}
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
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-3">
      {/* Header - Service Name and Actions */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
              {service.service}
            </h3>
            <ServiceTag color={getCategoryColor(service.category)}>
              {categoryOptions.find((c) => c.value === service.category)
                ?.label || service.category}
            </ServiceTag>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <button
            onClick={onEdit}
            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
            title="Edit service"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(service)}
            disabled={isDeleting === service._id}
            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Delete service"
          >
            {isDeleting === service._id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Price Row - Prominent */}
      <div className="flex items-center gap-1 mb-2">
        <span className="flex items-center justify-center text-sm font-medium text-gray-900"><DollarSign className="w-3.5 h-3.5 text-green-600" />{Number(service.price).toLocaleString()}</span>
      </div>

      {/* Contact Info - Compact Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{service.contact?.email || "—"}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Phone className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {service.contact?.phone || "—"}
            {service.contact?.showPhonePublicly && " 📢"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 col-span-2">
          <User className="w-3 h-3 flex-shrink-0" />
          <span>Contact: {service.contact?.preferredContact === "phone" ? "Phone" : "Email"}</span>
        </div>
      </div>
    </div>
  );
}