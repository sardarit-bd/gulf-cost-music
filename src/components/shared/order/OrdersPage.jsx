"use client";

import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomLoader from "../loader/Loader";
import ConfirmModal from "./ConfirmModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  // Confirm modal states
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 10;

  const { user } = useAuth();

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user?page=${page}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.pages || 1);
      setTotalOrders(data.total || 0);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Open confirm modal before cancelling
  const openCancelConfirm = (orderId) => {
    setOrderToCancel(orderId);
    setConfirmModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setCancellingId(orderToCancel);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderToCancel}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          throw new Error("You don't have permission to cancel this order");
        }
        throw new Error(error.message || "Failed to cancel order");
      }

      toast.success("Order cancelled successfully");
      fetchOrders(currentPage); // Refresh orders

      // Close modal if open
      if (selectedOrder?._id === orderToCancel) {
        setModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
      setOrderToCancel(null);
      setConfirmModalOpen(false);
    }
  };

  const handlePayNow = async (order) => {
    try {
      setPayingId(order._id);

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            merchId: order.merch._id,
            quantity: order.quantity,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment");
      }

      if (data.data?.stripeSession?.url) {
        window.location.href = data.data.stripeSession.url;
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPayingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentStatusBadge = (status) => {
    const config = {
      paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: RefreshCw,
      },
      cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: XCircle,
      },
    };

    const { bg, text, icon: Icon } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        <Icon className="w-3 h-3" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getDeliveryStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-gray-100", text: "text-gray-700", icon: Clock },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: CheckCircle,
      },
      processing: { bg: "bg-blue-100", text: "text-blue-700", icon: RefreshCw },
      "ready-for-pickup": {
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: Package,
      },
      shipped: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Truck },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };

    const displayStatus =
      status === "ready-for-pickup"
        ? "Ready for Pickup"
        : status?.charAt(0).toUpperCase() + status?.slice(1);

    const { bg, text, icon: Icon } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        <Icon className="w-3 h-3" />
        {displayStatus}
      </span>
    );
  };

  const canCancel = (order) => {
    return (
      order.paymentStatus === "pending" &&
      order.deliveryStatus !== "delivered" &&
      order.deliveryStatus !== "cancelled"
    );
  };

  const canPay = (order) => {
    return (
      order.paymentMethod === "stripe" &&
      order.paymentStatus === "pending" &&
      order.deliveryStatus !== "cancelled" &&
      order.deliveryStatus !== "delivered"
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20 bg-white">
        <div className="text-center">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Orders
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchOrders(currentPage)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              Total Orders: {totalOrders} | Page {currentPage} of {totalPages}
            </p>
          </div>

          {orders.length === 0 ? (
            <EmptyOrdersState />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={order.merch?.image || "/placeholder.jpg"}
                                alt={order.merch?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-gray-900">
                              {order.merch?.name || "Product"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatCurrency(order.merch?.price || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2 space-x-1">
                            {getPaymentStatusBadge(order.paymentStatus)}
                            {getDeliveryStatusBadge(order.deliveryStatus)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>

                            {canPay(order) && (
                              <button
                                onClick={() => handlePayNow(order)}
                                disabled={payingId === order._id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Pay Now"
                              >
                                {payingId === order._id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-4 h-4" />
                                    <span>Pay Now</span>
                                  </>
                                )}
                              </button>
                            )}

                            {canCancel(order) && (
                              <button
                                onClick={() => openCancelConfirm(order._id)}
                                disabled={cancellingId === order._id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cancel Order"
                              >
                                {cancellingId === order._id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Cancelling...</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    <span>Cancel</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                  <MobileOrderCard
                    key={order._id}
                    order={order}
                    onViewDetails={() => {
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}
                    onCancel={openCancelConfirm}
                    onPay={handlePayNow}
                    cancellingId={cancellingId}
                    payingId={payingId}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    getPaymentStatusBadge={getPaymentStatusBadge}
                    getDeliveryStatusBadge={getDeliveryStatusBadge}
                    canCancel={canCancel(order)}
                    canPay={canPay(order)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalOrders)}
                        </span>{" "}
                        of <span className="font-medium">{totalOrders}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1
                              ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {modalOpen && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setModalOpen(false)}
            onCancel={openCancelConfirm}
            onPay={handlePayNow}
            cancellingId={cancellingId}
            payingId={payingId}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getPaymentStatusBadge={getPaymentStatusBadge}
            getDeliveryStatusBadge={getDeliveryStatusBadge}
            canCancel={canCancel(selectedOrder)}
            canPay={canPay(selectedOrder)}
          />
        )}

        {/* Confirm Cancel Modal */}
        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => {
            setConfirmModalOpen(false);
            setOrderToCancel(null);
          }}
          onConfirm={handleCancelOrder}
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText="Yes, Cancel"
          cancelText="No, Keep"
          type="danger"
        />
      </div>
    </>
  );
}

// Mobile Order Card Component
function MobileOrderCard({
  order,
  onViewDetails,
  onCancel,
  onPay,
  cancellingId,
  payingId,
  formatCurrency,
  formatDate,
  getPaymentStatusBadge,
  getDeliveryStatusBadge,
  canCancel,
  canPay,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={order.merch?.image || "/placeholder.jpg"}
            alt={order.merch?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{order.merch?.name}</h3>
          <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            {formatCurrency(order.totalPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium">
            {order.paymentMethod === "stripe" ? "Card" : "Cash on Delivery"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">Payment Status:</span>
          <div>{getPaymentStatusBadge(order.paymentStatus)}</div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-600 text-sm">Delivery Status:</span>
          <div>{getDeliveryStatusBadge(order.deliveryStatus)}</div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
        >
          View Details
        </button>

        {canPay && (
          <button
            onClick={() => onPay(order)}
            disabled={payingId === order._id}
            className="flex-1 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {payingId === order._id ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "Pay Now"
            )}
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onCancel(order._id)}
            disabled={cancellingId === order._id}
            className="flex-1 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancellingId === order._id ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "Cancel"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Order Details Modal
function OrderDetailsModal({
  order,
  onClose,
  onCancel,
  onPay,
  cancellingId,
  payingId,
  formatCurrency,
  formatDate,
  getPaymentStatusBadge,
  getDeliveryStatusBadge,
  canCancel,
  canPay,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden">
              <img
                src={order.merch?.image || "/placeholder.jpg"}
                alt={order.merch?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {order.merch?.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {order.merch?.description || "No description available"}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">
                  Quantity: {order.quantity}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Payment Status</p>
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Delivery Status</p>
              {getDeliveryStatusBadge(order.deliveryStatus)}
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Order Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Payment:</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === "stripe"
                    ? "Card"
                    : "Cash on Delivery"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.shippingInfo && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                Shipping Information
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {order.shippingInfo.name}
                  </span>
                </div>
                {order.shippingInfo.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {order.shippingInfo.email}
                    </span>
                  </div>
                )}
                {order.shippingInfo.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {order.shippingInfo.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">
                    {order.shippingInfo.address}, {order.shippingInfo.city}{" "}
                    {order.shippingInfo.postalCode}
                  </span>
                </div>
                {order.shippingInfo.note && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">
                      {order.shippingInfo.note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(canPay || canCancel) && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {canPay && (
                <button
                  onClick={() => onPay(order)}
                  disabled={payingId === order._id}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {payingId === order._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay Now
                    </>
                  )}
                </button>
              )}

              {canCancel && (
                <button
                  onClick={() => onCancel(order._id)}
                  disabled={cancellingId === order._id}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cancellingId === order._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyOrdersState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Orders Yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        You haven't placed any orders yet. Browse our merch store and grab some
        cool items!
      </p>
      <a
        href="/merch"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition"
      >
        Browse Merch
      </a>
    </div>
  );
}