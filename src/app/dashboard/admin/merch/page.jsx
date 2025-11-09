"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import EmptyState from "@/components/modules/merch/EmptyState";
import HeaderSection from "@/components/modules/merch/HeaderSection";
import LoadingState from "@/components/modules/merch/LoadingState";
import ProductGrid from "@/components/modules/merch/ProductGrid";
import PublishedProducts from "@/components/modules/merch/PublishedProducts";
import StatsSection from "@/components/modules/merch/StatsSection";
import TabNavigation from "@/components/modules/merch/TabNavigation";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminPrintifyMerch() {
    const [printifyProducts, setPrintifyProducts] = useState([]);
    const [publishedProducts, setPublishedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publishedLoading, setPublishedLoading] = useState(false);
    const [syncingProducts, setSyncingProducts] = useState(new Set());
    const [activeTab, setActiveTab] = useState('all');
    const [token, setToken] = useState("");

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // Fetch published products first, then Printify products
    const fetchPublishedProducts = async () => {
        if (!token) return;

        setPublishedLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE}/api/merch`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setPublishedProducts(data.data || []);
                // After getting published products, fetch Printify products
                await fetchPrintifyProducts(data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch published products:", err);
            setPublishedLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPublishedProducts();
        }
    }, [token]);

    // Fetch Printify products with published status
    const fetchPrintifyProducts = async (publishedProductsList = null) => {
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE}/api/merch/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                const publishedList = publishedProductsList || publishedProducts;

                // Mark which products are already published
                const productsWithStatus = data.data.map(product => ({
                    ...product,
                    isPublished: publishedList.some(published =>
                        published.printifyId === product.id ||
                        published._id === product.id ||
                        published.name?.toLowerCase() === product.title?.toLowerCase()
                    )
                }));

                setPrintifyProducts(productsWithStatus);
                // toast.success(`Loaded ${data.data.length} products`);
            }
        } catch (err) {
            console.error("Printify Fetch Error:", err);
            if (err.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
            } else if (err.response?.status === 500) {
                toast.error("Server error. Please check Printify connection.");
            } else {
                toast.error("Failed to fetch Printify products");
            }
        } finally {
            setLoading(false);
            setPublishedLoading(false);
        }
    };

    // Refresh both product lists
    const handleRefresh = async () => {
        await fetchPublishedProducts();
    };

    // Add all unpublished products
    const handleAddAll = async () => {
        const unpublishedProducts = printifyProducts.filter(p => !p.isPublished);
        if (unpublishedProducts.length === 0) {
            toast.success("All products are already published!");
            return;
        }

        if (!confirm(`Add all ${unpublishedProducts.length} unpublished products to your store?`)) return;

        const loadingToast = toast.loading(`Importing ${unpublishedProducts.length} products...`);
        try {
            const { data } = await axios.post(
                `${API_BASE}/api/merch/add-all`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.dismiss(loadingToast);
            toast.success(data.message || `All ${unpublishedProducts.length} products added successfully!`);

            // Refresh both lists
            await fetchPublishedProducts();
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || "Failed to add all products";
            toast.error(errorMsg);
            console.error(err);
        }
    };

    // Add single product
    const handleAddSingle = async (product) => {
        if (product.isPublished) {
            toast.success("Product is already published!");
            return;
        }

        setSyncingProducts(prev => new Set(prev).add(product.id));

        try {
            const { data } = await axios.post(
                `${API_BASE}/api/merch/add/${product.id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(data.message || `${product.title} published successfully!`);

            // Update local state
            setPrintifyProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, isPublished: true } : p
            ));

            // Refresh published products list
            await fetchPublishedProducts();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to publish this product";
            toast.error(errorMsg);
            console.error(err);
        } finally {
            setSyncingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    // Delete product from Printify (completely remove)
    const handleDeleteFromPrintify = async (product) => {
        if (!confirm(`Permanently delete "${product.title}" from Printify? This action cannot be undone.`)) return;

        const loadingToast = toast.loading('Deleting from Printify...');
        try {
            const { data } = await axios.delete(
                `${API_BASE}/api/merch/${product.id}?deleteFromPrintify=true`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.dismiss(loadingToast);
            toast.success(data.message || "Product deleted from Printify successfully!");

            // Remove from Printify products list
            setPrintifyProducts(prev => prev.filter((p) => p.id !== product.id));
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || "Failed to delete product from Printify";
            toast.error(errorMsg);
            console.error(err);
        }
    };

    // Delete published product from store only
    const handleDeleteFromStore = async (product) => {
        if (!confirm(`Remove "${product.title}" from your store? The product will remain in Printify.`)) return;

        const loadingToast = toast.loading("Removing from store...");
        try {
            const { data } = await axios.delete(
                `${API_BASE}/api/merch/${product.id}?deleteFromPrintify=false`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.dismiss(loadingToast);
            toast.success(data.message || "Product removed from store successfully!");

            // Update local state
            setPrintifyProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, isPublished: false } : p
            ));

            // Refresh published products list
            await fetchPublishedProducts();
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || "Failed to remove product from store";
            toast.error(errorMsg);
            console.error(err);
        }
    };

    // Delete published product (from database only)
    const handleDeletePublishedProduct = async (product) => {
        const loadingToast = toast.loading("Removing product...");
        try {
            const { data } = await axios.delete(
                `${API_BASE}/api/merch/${product._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss(loadingToast);
            toast.success(data.message || "Product removed from store successfully!");

            // Remove from published products
            setPublishedProducts((prev) =>
                prev.filter((p) => p._id !== product._id)
            );

            // Update Printify products status
            setPrintifyProducts((prev) =>
                prev.map((p) =>
                    p.id === product.printifyId ? { ...p, isPublished: false } : p
                )
            );
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || "Failed to remove product";
            toast.error(errorMsg);
            console.error(err);
        }
    };

    // Calculate statistics
    const totalProducts = printifyProducts.length;
    const publishedCount = printifyProducts.filter(p => p.isPublished).length;
    const unpublishedCount = totalProducts - publishedCount;

    // Filter products based on active tab
    const filteredProducts = printifyProducts.filter(product => {
        switch (activeTab) {
            case 'published':
                return product.isPublished;
            case 'unpublished':
                return !product.isPublished;
            default:
                return true;
        }
    });

    return (
        <AdminLayout>
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
                <Toaster />

                <div className="max-w-7xl mx-auto">
                    <HeaderSection
                        onRefresh={handleRefresh}
                        onAddAll={handleAddAll}
                        loading={loading}
                        publishedLoading={publishedLoading}
                        unpublishedCount={unpublishedCount}
                    />

                    {printifyProducts.length > 0 && (
                        <StatsSection
                            totalProducts={totalProducts}
                            publishedCount={publishedCount}
                            unpublishedCount={unpublishedCount}
                        />
                    )}

                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        totalProducts={totalProducts}
                        publishedCount={publishedCount}
                        unpublishedCount={unpublishedCount}
                    />

                    {activeTab === 'published' && publishedProducts.length > 0 && (
                        <PublishedProducts
                            publishedProducts={publishedProducts}
                            onDeletePublishedProduct={handleDeletePublishedProduct}
                        />
                    )}

                    {loading ? (
                        <LoadingState />
                    ) : filteredProducts.length === 0 ? (
                        <EmptyState
                            activeTab={activeTab}
                            onRefresh={handleRefresh}
                        />
                    ) : (
                        <ProductGrid
                            products={filteredProducts}
                            syncingProducts={syncingProducts}
                            onAddSingle={handleAddSingle}
                            onDeleteFromPrintify={handleDeleteFromPrintify}
                            onDeleteFromStore={handleDeleteFromStore}
                        />
                    )}

                    {printifyProducts.length > 0 && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Published products will appear in your store's merchandise section.{" "}
                                <a
                                    href="https://developers.printify.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1"
                                >
                                    Printify API Docs <ExternalLink className="w-3 h-3" />
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}