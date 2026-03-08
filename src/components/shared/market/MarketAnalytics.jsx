// components/market/MarketAnalytics.jsx
"use client";

import { useSession } from "@/lib/auth";
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    CreditCard,
    Crown,
    DollarSign,
    Download,
    Eye,
    Filter,
    Loader2,
    Package,
    RefreshCw,
    ShoppingBag,
    Store,
    TrendingUp,
    Truck,
    Users,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function MarketAnalytics() {
    const { user } = useSession();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [stripeBalance, setStripeBalance] = useState(null);
    const [dateRange, setDateRange] = useState("30days"); // 7days, 30days, 90days, year
    const [showFilters, setShowFilters] = useState(false);

    const userTypes = ["artist", "venue", "journalist", "photographer", "studio", "fan"];

    // Check if current user can sell
    const canSell = user && userTypes.includes(user?.userType);

    useEffect(() => {
        if (canSell) {
            fetchAnalytics();
            fetchStripeBalance();
        } else {
            setLoading(false);
        }
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${BASE_URL}/api/market-analytics`);
            setAnalytics(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    const fetchStripeBalance = async () => {
        try {
            const response = await api.get(`${BASE_URL}/api/stripe/connect/balance`);
            setStripeBalance(response.data);
        } catch (error) {
            console.error("Error fetching stripe balance:", error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const getPlatformFee = (price) => {
        // Free plan: 10% fee, Pro plan: 0% fee
        const feePercentage = user?.subscriptionPlan === "pro" ? 0 : 10;
        return (price * feePercentage) / 100;
    };

    const getSellerReceives = (price) => {
        const fee = getPlatformFee(price);
        return price - fee;
    };

    if (!canSell) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Seller Analytics Unavailable
                    </h3>
                    <p className="text-gray-600 max-w-md">
                        This section is only available for artists, venues, journalists, photographers, studios, and fans who have listed items.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your marketplace analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No analytics data available yet.</p>
            </div>
        );
    }

    const {
        totalSales = 0,
        totalRevenue = 0,
        totalFees = 0,
        netEarnings = 0,
        activeListings = 0,
        totalOrders = 0,
        pendingOrders = 0,
        completedOrders = 0,
        recentOrders = [],
        salesByDay = [],
        topSellingItems = []
    } = analytics;

    // Chart data
    const chartData = {
        labels: salesByDay.map(item => formatDate(item.date)),
        datasets: [
            {
                label: 'Sales',
                data: salesByDay.map(item => item.amount),
                borderColor: 'rgb(234, 179, 8)',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `$${context.raw.toFixed(2)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value}`
                }
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header with Stripe Balance */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">Seller Dashboard</h2>
                        </div>
                        <p className="text-white/90">
                            {user?.subscriptionPlan === "pro" ? (
                                "✨ Pro Plan: 0% Platform Fees on all sales"
                            ) : (
                                "💡 Free Plan: 10% Platform Fee • Upgrade to Pro for 0% fees"
                            )}
                        </p>
                    </div>

                    {/* Stripe Balance Card */}
                    {stripeBalance && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                            <p className="text-white/80 text-sm mb-1">Available Balance</p>
                            <p className="text-3xl font-bold">
                                {formatPrice(stripeBalance.available?.[0]?.amount || 0)}
                            </p>
                            <p className="text-white/60 text-xs mt-1">
                                Pending: {formatPrice(stripeBalance.pending?.[0]?.amount || 0)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <ShoppingBag className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs text-gray-500">All Time</span>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Total Sales</h3>
                    <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                            {((totalSales / (totalSales + 1)) * 100).toFixed(1)}% success rate
                        </span>
                    </div>
                </div>

                {/* Revenue */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500">Net Earnings</span>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Your Earnings</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(netEarnings)}</p>
                    <div className="mt-2 text-sm">
                        <span className="text-gray-500">
                            From {formatPrice(totalRevenue)} total sales
                        </span>
                    </div>
                </div>

                {/* Platform Fees */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <CreditCard className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${user?.subscriptionPlan === "pro" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {user?.subscriptionPlan === "pro" ? "Pro Plan" : "Free Plan"}
                        </span>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Platform Fees Paid</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(totalFees)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {user?.subscriptionPlan === "pro"
                            ? "✨ 0% fee rate (Pro benefit)"
                            : `💰 ${((totalFees / (totalRevenue || 1)) * 100).toFixed(1)}% avg fee rate`}
                    </p>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-xl">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="text-xs text-gray-500">Active</span>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Active Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">{completedOrders} completed</span>
                    </div>
                </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                    <div className="flex gap-2">
                        {["7days", "30days", "90days", "year"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${dateRange === range
                                    ? "bg-yellow-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {range === "7days" ? "7D" :
                                    range === "30days" ? "30D" :
                                        range === "90days" ? "90D" : "1Y"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[300px]">
                    {salesByDay.length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-400">No sales data for this period</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">You Receive</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => {
                                    const fee = getPlatformFee(order.totalPrice);
                                    const sellerReceives = getSellerReceives(order.totalPrice);

                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-gray-600">
                                                    #{order._id.slice(-8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {order.marketItem?.photos?.[0] && (
                                                        <img
                                                            src={order.marketItem.photos[0]}
                                                            alt={order.marketItem.title}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                    )}
                                                    <span className="font-medium text-gray-900">
                                                        {order.marketItem?.title || "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {order.buyer?.username || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.buyer?.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">
                                                    {formatPrice(order.totalPrice)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm ${user?.subscriptionPlan === "pro"
                                                    ? "text-green-600"
                                                    : "text-yellow-600"}`}>
                                                    {formatPrice(fee)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-green-600">
                                                    {formatPrice(sellerReceives)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.deliveryStatus === "delivered" ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1 w-fit">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Delivered
                                                    </span>
                                                ) : order.deliveryStatus === "cancelled" ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1 w-fit">
                                                        <XCircle className="w-3 h-3" />
                                                        Cancelled
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center gap-1 w-fit">
                                                        <Clock className="w-3 h-3" />
                                                        {order.deliveryStatus}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No orders yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Selling Items */}
            {topSellingItems.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topSellingItems.map((item) => {
                            const fee = getPlatformFee(item.price);
                            const sellerReceives = getSellerReceives(item.price);

                            return (
                                <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    {item.photos?.[0] && (
                                        <img
                                            src={item.photos[0]}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 capitalize">{item.title}</h4>
                                        <p className="text-sm text-gray-600">
                                            Sold: {item.soldCount || 0} times
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-500">Revenue:</span>
                                            <span className="font-semibold text-green-600">
                                                {formatPrice((item.price - fee) * (item.soldCount || 0))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Platform Fee Explanation */}
            <div className={`p-6 rounded-2xl ${user?.subscriptionPlan === "pro"
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"}`}>
                <div className="flex items-start gap-4">
                    {user?.subscriptionPlan === "pro" ? (
                        <Crown className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    )}
                    <div>
                        <h4 className={`font-semibold mb-2 ${user?.subscriptionPlan === "pro" ? "text-green-800" : "text-yellow-800"
                            }`}>
                            {user?.subscriptionPlan === "pro"
                                ? "✨ You're on Pro Plan - 0% Platform Fees"
                                : "💡 You're on Free Plan - 10% Platform Fee"}
                        </h4>
                        <p className="text-sm text-gray-700">
                            {user?.subscriptionPlan === "pro" ? (
                                "As a Pro member, you keep 100% of your sales! No marketplace fees deducted."
                            ) : (
                                "When you sell an item, 10% platform fee is deducted. Upgrade to Pro for 0% fees and keep all your earnings."
                            )}
                        </p>
                        {user?.subscriptionPlan !== "pro" && (
                            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all">
                                Upgrade to Pro - 0% Fees
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}