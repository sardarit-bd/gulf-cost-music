"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import OrderManagement from "@/components/modules/merch/orders/OrdersManagement";
import ProductManagement from "@/components/modules/merch/orders/ProductManagement";
import { Package, Truck } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("products");

    const tabs = [
        { id: "products", name: "Product Management", icon: Package },
        { id: "orders", name: "Order Management", icon: Truck },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Tab Navigation */}
                <div className="bg-white border-b border-gray-100">
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
                    {/* {activeTab === "overview" && <DashboardOverview />} */}
                    {activeTab === "products" && <ProductManagement />}
                    {activeTab === "orders" && <OrderManagement />}
                </div>
            </div>
        </AdminLayout>
    );
}
