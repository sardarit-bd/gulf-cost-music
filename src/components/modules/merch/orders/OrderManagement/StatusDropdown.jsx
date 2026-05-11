"use client";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StatusDropdown = ({ order, onStatusUpdate, loading }) => {
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [updatingType, setUpdatingType] = useState(null);

  const deliveryRef = useRef(null);
  const paymentRef = useRef(null);

  const deliveryOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: CheckCircle,
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: RefreshCw,
    },
    {
      value: "ready-for-pickup",
      label: "Ready for Pickup",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Package,
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
      icon: Truck,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
  ];

  const paymentOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    {
      value: "paid",
      label: "Paid",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
    {
      value: "failed",
      label: "Failed",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: RefreshCw,
    },
  ];

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deliveryRef.current && !deliveryRef.current.contains(event.target)) {
        setDeliveryOpen(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(event.target)) {
        setPaymentOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeliveryUpdate = async (newStatus) => {
    if (newStatus === deliveryStatus) {
      setDeliveryOpen(false);
      return;
    }
    setUpdatingType("delivery");
    setDeliveryStatus(newStatus);
    setDeliveryOpen(false);
    await onStatusUpdate("delivery", newStatus);
    setUpdatingType(null);
  };

  const handlePaymentUpdate = async (newStatus) => {
    if (newStatus === paymentStatus) {
      setPaymentOpen(false);
      return;
    }
    setUpdatingType("payment");
    setPaymentStatus(newStatus);
    setPaymentOpen(false);
    await onStatusUpdate("payment", newStatus);
    setUpdatingType(null);
  };

  const getCurrentDeliveryOption = () => {
    return (
      deliveryOptions.find((opt) => opt.value === deliveryStatus) ||
      deliveryOptions[0]
    );
  };

  const getCurrentPaymentOption = () => {
    return (
      paymentOptions.find((opt) => opt.value === paymentStatus) ||
      paymentOptions[0]
    );
  };

  const isUpdating = (type) => updatingType === type || loading;

  const currentDelivery = getCurrentDeliveryOption();
  const currentPayment = getCurrentPaymentOption();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Delivery Status Dropdown */}
      <div ref={deliveryRef} className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <h4 className="text-sm font-semibold text-gray-800">
            Delivery Status
          </h4>
        </div>

        {/* Dropdown Button */}
        <button
          onClick={() => setDeliveryOpen(!deliveryOpen)}
          disabled={isUpdating("delivery")}
          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-200 cursor-pointer ${currentDelivery.color}`}
        >
          <div className="flex items-center gap-2">
            <currentDelivery.icon className="w-4 h-4" />
            <span>{currentDelivery.label}</span>
          </div>
          {isUpdating("delivery") ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          ) : deliveryOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Dropdown Menu */}
        {deliveryOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
            {deliveryOptions.map((option) => {
              const Icon = option.icon;
              const isActive = deliveryStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleDeliveryUpdate(option.value)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? `${option.color} border-l-4 border-l-current`
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                  {isActive && <CheckCircle className="w-4 h-4 text-current" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Status Dropdown */}
      <div ref={paymentRef} className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <DollarSign className="w-3.5 h-3.5 text-green-600" />
          </div>
          <h4 className="text-sm font-semibold text-gray-800">
            Payment Status
          </h4>
        </div>

        {/* Dropdown Button */}
        <button
          onClick={() => setPaymentOpen(!paymentOpen)}
          disabled={isUpdating("payment")}
          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-200 cursor-pointer ${currentPayment.color}`}
        >
          <div className="flex items-center gap-2">
            <currentPayment.icon className="w-4 h-4" />
            <span>{currentPayment.label}</span>
          </div>
          {isUpdating("payment") ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          ) : paymentOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Dropdown Menu */}
        {paymentOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = paymentStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handlePaymentUpdate(option.value)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? `${option.color} border-l-4 border-l-current`
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                  {isActive && <CheckCircle className="w-4 h-4 text-current" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDropdown;
