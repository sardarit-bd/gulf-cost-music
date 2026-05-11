"use client";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  MoreVertical,
  RefreshCw,
  Truck,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const OrderRow = ({
  order,
  dropdownOpen,
  onToggleDropdown,
  onViewDetails,
  onUpdateDeliveryStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
  statusUpdateLoading,
  actionLoading,
}) => {
  const menuRef = useRef(null);
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);

  const isOpen = dropdownOpen === order._id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isOpen) {
          onToggleDropdown(order._id);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggleDropdown, order._id]);

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleDropdown(order._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: "bg-amber-100 text-amber-700", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-700", icon: CheckCircle },
      processing: { color: "bg-indigo-100 text-indigo-700", icon: RefreshCw },
      shipped: { color: "bg-cyan-100 text-cyan-700", icon: Truck },
      delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
    };
    const { color, icon: Icon } = config[status] || config.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <Icon className="w-2.5 h-2.5" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (method, status) => {
    const methodConfig = {
      stripe: { icon: CreditCard, text: "Stripe" },
      cod: { icon: Wallet, text: "COD" },
    };
    const { icon: Icon, text } = methodConfig[method] || methodConfig.cod;

    const statusConfig = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-purple-100 text-purple-700",
    };

    return (
      <div className="flex flex-col gap-0.5">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig.pending}`}
        >
          <Icon className="w-2.5 h-2.5" />
          {text}
        </span>
        <span className="text-xs text-gray-500 capitalize">{status}</span>
      </div>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 font-mono text-xs font-medium text-gray-900">
        #{order._id.slice(-6).toUpperCase()}
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 text-xs">
              {order.buyer?.username || "N/A"}
            </div>
            <div className="text-gray-500 text-xs truncate max-w-[120px]">
              {order.buyer?.email || "N/A"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <img
            src={order.merch?.image}
            alt=""
            className="w-8 h-8 object-cover rounded border border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-900 text-xs truncate max-w-[150px]">
              {order.merch?.name || "Deleted"}
            </div>
            <div className="text-gray-500 text-xs">
              ${order.merch?.price?.toFixed(2) || "0"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {order.quantity}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="font-bold text-emerald-600 text-sm">
          ${order.totalPrice?.toFixed(2)}
        </span>
      </td>
      <td className="px-3 py-2">{getPaymentBadge(order.paymentMethod)}</td>
      <td className="px-3 py-2">{getStatusBadge(order.deliveryStatus)}</td>
      <td className="px-3 py-2 text-gray-500 text-xs">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-3 py-2 text-right">
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleToggle}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  onViewDetails(order);
                  onToggleDropdown(order._id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
              >
                <Eye className="w-3 h-3" /> View Details
              </button>

              {order.deliveryStatus !== "delivered" &&
                order.deliveryStatus !== "cancelled" && (
                  <button
                    onClick={() => {
                      onUpdateDeliveryStatus(order._id, "delivered");
                      onToggleDropdown(order._id);
                    }}
                    disabled={statusUpdateLoading === order._id}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-green-700 hover:bg-green-50 w-full text-left cursor-pointer"
                  >
                    {statusUpdateLoading === order._id ? (
                      <div className="w-3 h-3 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    Mark Delivered
                  </button>
                )}

              {order.deliveryStatus !== "delivered" &&
                order.deliveryStatus !== "cancelled" && (
                  <button
                    onClick={() => {
                      onDeleteOrder(order._id);
                      onToggleDropdown(order._id);
                    }}
                    disabled={actionLoading === order._id}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 w-full text-left cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" /> Delete Order
                  </button>
                )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderRow;
