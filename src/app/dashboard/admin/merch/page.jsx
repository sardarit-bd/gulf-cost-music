"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import OrderManagement from "@/components/modules/merch/orders/OrdersManagement";
import ProductManagement from "@/components/modules/merch/orders/ProductManagement";
import { Grid, Package, Truck } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("products");

    const tabs = [
        { id: "overview", name: "Overview", icon: Grid },
        { id: "products", name: "Product Management", icon: Package },
        { id: "orders", name: "Order Management", icon: Truck },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Tab Navigation */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? "border-purple-600 text-purple-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-12xl mx-auto p-6">
                    {activeTab === "overview" && <DashboardOverview />}
                    {activeTab === "products" && <ProductManagement />}
                    {activeTab === "orders" && <OrderManagement />}
                </div>
            </div>
        </AdminLayout>
    );
}

// Dashboard Overview Component
function DashboardOverview() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Statistics Cards */}
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Package className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">25</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">156</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Package className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Products</p>
                            <p className="text-2xl font-bold text-gray-900">18</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Truck className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.href = '/admin#products'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Manage Products
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin#orders'}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Manage Orders
                    </button>
                </div>
            </div>
        </div>
    );
}