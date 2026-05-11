"use client";
import { Clock, CheckCircle, RefreshCw, Truck, XCircle, Package } from "lucide-react";

const StatusBadge = ({ status, type = "delivery" }) => {
  const deliveryConfig = {
    pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, text: "Pending" },
    confirmed: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle, text: "Confirmed" },
    processing: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: RefreshCw, text: "Processing" },
    "ready-for-pickup": { color: "bg-purple-100 text-purple-700 border-purple-200", icon: Package, text: "Ready for Pickup" },
    shipped: { color: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: Truck, text: "Shipped" },
    delivered: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle, text: "Delivered" },
    cancelled: { color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle, text: "Cancelled" },
  };

  const paymentConfig = {
    pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, text: "Pending" },
    paid: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle, text: "Paid" },
    failed: { color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle, text: "Failed" },
    refunded: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: RefreshCw, text: "Refunded" },
  };

  const config = type === "delivery" ? deliveryConfig : paymentConfig;
  const { color, icon: Icon, text } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
};

export default StatusBadge;