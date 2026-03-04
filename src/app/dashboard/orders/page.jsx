// app/orders/page.jsx
"use client";

import { useAuth } from '@/context/AuthContext';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Eye,
    FileText,
    Mail,
    MapPin,
    Package,
    Phone,
    RefreshCw,
    ShoppingBag,
    Truck,
    User,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        try {
            setLoading(true);

            // Get token from cookie (same as AuthContext)
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                setError('Not authenticated');
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.data || []);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            setCancelling(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            toast.success('Order cancelled successfully');
            fetchOrders(); // Refresh orders
            setModalOpen(false);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPaymentStatusBadge = (status) => {
        const config = {
            paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            failed: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
            refunded: { bg: 'bg-purple-100', text: 'text-purple-700', icon: RefreshCw }
        };

        const { bg, text, icon: Icon } = config[status] || config.pending;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getDeliveryStatusBadge = (status) => {
        const config = {
            pending: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock },
            confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
            processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: RefreshCw },
            'ready-for-pickup': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Package },
            shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Truck },
            delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
        };

        const displayStatus = status === 'ready-for-pickup' ? 'Ready for Pickup' :
            status.charAt(0).toUpperCase() + status.slice(1);

        const { bg, text, icon: Icon } = config[status] || config.pending;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
                <Icon className="w-3 h-3" />
                {displayStatus}
            </span>
        );
    };

    if (loading) {
        return <OrdersSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Orders</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchOrders}
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
            <div className="min-h-screen bg-gray-50 py-8">
                <div className=" px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-1">View and manage your orders</p>
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
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={order.merch?.image || '/placeholder.jpg'}
                                                                alt={order.merch?.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="font-medium text-gray-900">
                                                            {order.merch?.name || 'Product'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(order.merch?.price || 0)}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {order.paymentMethod === 'stripe' ? 'Card' : 'COD'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        {getPaymentStatusBadge(order.paymentStatus)}
                                                        {getDeliveryStatusBadge(order.deliveryStatus)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setModalOpen(true);
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {order.deliveryStatus !== 'delivered' &&
                                                            order.deliveryStatus !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => handleCancelOrder(order._id)}
                                                                    disabled={cancelling}
                                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                    title="Cancel Order"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
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
                                        onCancel={() => handleCancelOrder(order._id)}
                                        cancelling={cancelling}
                                        formatCurrency={formatCurrency}
                                        formatDate={formatDate}
                                        getPaymentStatusBadge={getPaymentStatusBadge}
                                        getDeliveryStatusBadge={getDeliveryStatusBadge}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Order Details Modal */}
                {modalOpen && selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={() => setModalOpen(false)}
                        onCancel={() => handleCancelOrder(selectedOrder._id)}
                        cancelling={cancelling}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getPaymentStatusBadge={getPaymentStatusBadge}
                        getDeliveryStatusBadge={getDeliveryStatusBadge}
                    />
                )}
            </div>
        </>
    );
}

// Mobile Order Card Component
function MobileOrderCard({ order, onViewDetails, onCancel, cancelling, formatCurrency, formatDate, getPaymentStatusBadge, getDeliveryStatusBadge }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                        src={order.merch?.image || '/placeholder.jpg'}
                        alt={order.merch?.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{order.merch?.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatCurrency(order.totalPrice)}</p>
                </div>
            </div>

            <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium">{order.paymentMethod === 'stripe' ? 'Card' : 'Cash on Delivery'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex gap-2">
                        {getPaymentStatusBadge(order.paymentStatus)}
                        {getDeliveryStatusBadge(order.deliveryStatus)}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                    onClick={onViewDetails}
                    className="flex-1 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                >
                    View Details
                </button>
                {order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'cancelled' && (
                    <button
                        onClick={onCancel}
                        disabled={cancelling}
                        className="flex-1 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

// Order Details Modal
function OrderDetailsModal({ order, onClose, onCancel, cancelling, formatCurrency, formatDate, getPaymentStatusBadge, getDeliveryStatusBadge }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden">
                            <img
                                src={order.merch?.image || '/placeholder.jpg'}
                                alt={order.merch?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{order.merch?.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{order.merch?.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-600">Quantity: {order.quantity}</span>
                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
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
                                <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Payment:</span>
                                <span className="font-medium text-gray-900">
                                    {order.paymentMethod === 'stripe' ? 'Card' : 'Cash on Delivery'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    {order.shippingInfo && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Shipping Information</h4>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{order.shippingInfo.name}</span>
                                </div>
                                {order.shippingInfo.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{order.shippingInfo.email}</span>
                                    </div>
                                )}
                                {order.shippingInfo.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{order.shippingInfo.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <span className="text-gray-600">
                                        {order.shippingInfo.address}, {order.shippingInfo.city} {order.shippingInfo.postalCode}
                                    </span>
                                </div>
                                {order.shippingInfo.note && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <span className="text-gray-600">{order.shippingInfo.note}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'cancelled' && (
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                        <button
                            onClick={onCancel}
                            disabled={cancelling}
                            className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    </div>
                )}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't placed any orders yet. Browse our merch store and grab some cool items!
            </p>
            <a
                href="/merch"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700"
            >
                Browse Merch
            </a>
        </div>
    );
}

// Loading Skeleton
function OrdersSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}