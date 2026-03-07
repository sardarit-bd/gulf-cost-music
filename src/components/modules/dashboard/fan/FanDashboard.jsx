// src/app/dashboard/fan/page.jsx
"use client";

import { useAuth } from '@/context/AuthContext';
import {
    Calendar,
    Clock,
    Heart,
    MapPin,
    Music,
    ShoppingBag,
    TrendingUp,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FanDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        upcomingEvents: 0,
        favorites: 0,
        totalSpent: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            // Fetch orders
            const ordersRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const ordersData = await ordersRes.json();

            const orders = ordersData.data || [];
            const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

            setStats({
                totalOrders: orders.length,
                upcomingEvents: 0, // Will be implemented later
                favorites: 0, // Will be implemented later
                totalSpent: totalSpent
            });

            // Get recent orders (last 3)
            setRecentOrders(orders.slice(0, 3));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return <FanDashboardSkeleton />;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.username || 'Fan'}! 👋
                </h1>
                <p className="text-purple-100">
                    Discover amazing artists, events, and merch tailored just for you.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={ShoppingBag}
                    label="Total Orders"
                    value={stats.totalOrders}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Calendar}
                    label="Upcoming Events"
                    value={stats.upcomingEvents}
                    color="bg-green-500"
                />
                <StatCard
                    icon={Heart}
                    label="Favorites"
                    value={stats.favorites}
                    color="bg-red-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Total Spent"
                    value={formatCurrency(stats.totalSpent)}
                    color="bg-purple-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <QuickActionButton
                    href="/merch"
                    icon={ShoppingBag}
                    label="Browse Merch"
                    color="bg-purple-100 text-purple-600"
                />
                <QuickActionButton
                    href="/artists"
                    icon={Music}
                    label="Explore Artists"
                    color="bg-blue-100 text-blue-600"
                />
                <QuickActionButton
                    href="/events"
                    icon={Calendar}
                    label="Find Events"
                    color="bg-green-100 text-green-600"
                />
                <QuickActionButton
                    href="/profile"
                    icon={User}
                    label="My Profile"
                    color="bg-orange-100 text-orange-600"
                />
            </div>

            {/* Recent Orders & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <Link
                            href="/dashboard/fan/orders"
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            View All →
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No orders yet</p>
                            <Link
                                href="/merch"
                                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden">
                                        <img
                                            src={order.merch?.image || '/placeholder.jpg'}
                                            alt={order.merch?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {order.merch?.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Ordered on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(order.totalPrice)}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.deliveryStatus === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.deliveryStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommendations/Events */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>

                    <div className="space-y-4">
                        {/* Sample events - will be replaced with real data */}
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                                    <Music className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">Summer Music Fest</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        Miami, FL
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Jun 15, 2024
                                    </p>
                                </div>
                                <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">
                                    Buy
                                </button>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                    <Music className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">Jazz Night</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        New Orleans, LA
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Jun 20, 2024
                                    </p>
                                </div>
                                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                                    Buy
                                </button>
                            </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                                    <Music className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">Rock Concert</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        Austin, TX
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Jun 25, 2024
                                    </p>
                                </div>
                                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/events"
                        className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700"
                    >
                        Browse All Events →
                    </Link>
                </div>
            </div>

            {/* Recommended Artists */}
            
        </div>
    );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
    );
}

// Quick Action Button
function QuickActionButton({ href, icon: Icon, label, color }) {
    return (
        <Link
            href={href}
            className={`${color} p-4 rounded-xl flex flex-col items-center justify-center hover:scale-105 transition`}
        >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}

// Loading Skeleton
function FanDashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
    );
}