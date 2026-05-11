"use client";
import { X, Truck, Package, User, CreditCard, Wallet, DollarSign } from "lucide-react";
import StatusDropdown from "./StatusDropdown";

const OrderDetailModal = ({ order, onClose, onUpdateDeliveryStatus, onUpdatePaymentStatus, onDeleteOrder, statusUpdateLoading, actionLoading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="text-base font-mono font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatTime(order.createdAt)}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <div className="flex items-center gap-2 mt-1">
                {order.paymentMethod === "stripe" ? (
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Wallet className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-800 capitalize">{order.paymentMethod}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
              <p className="text-xs text-emerald-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-700">${order.totalPrice?.toFixed(2)}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              Customer Information
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
              <p className="font-semibold text-gray-900 text-base">{order.buyer?.username || "N/A"}</p>
              <p className="text-sm text-gray-700 mt-1">{order.buyer?.email || "N/A"}</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Package className="w-4 h-4 text-orange-600" />
              </div>
              Product Information
            </h3>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <img 
                src={order.merch?.image} 
                alt={order.merch?.name} 
                className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-base">{order.merch?.name || "Product Deleted"}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{order.merch?.description || "No description available"}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                    Qty: {order.quantity}
                  </span>
                  <span className="text-lg font-bold text-emerald-600">${order.merch?.price?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Updates Section - Using Custom StatusDropdown */}
          <div className="mb-6">
            <StatusDropdown
              order={order}
              onStatusUpdate={(type, status) => {
                if (type === "delivery") {
                  onUpdateDeliveryStatus(order._id, status);
                } else {
                  onUpdatePaymentStatus(order._id, status);
                }
              }}
              loading={statusUpdateLoading === order._id}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
            >
              Close
            </button>
            {order.deliveryStatus !== "delivered" && order.deliveryStatus !== "cancelled" && (
              <button
                onClick={() => onDeleteOrder(order._id)}
                disabled={actionLoading === order._id}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {actionLoading === order._id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Order"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;