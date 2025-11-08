"use client";

import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import axios from "axios";
import {
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    Eye,
    Loader2,
    Package,
    Plus,
    RefreshCw,
    ShoppingBag,
    Trash2,
    XCircle
} from "lucide-react";
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
                toast.success(`Loaded ${data.data.length} products`);
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
        if (!confirm(`Remove "${product.name}" from your store?`)) return;

        const loadingToast = toast.loading("Removing product...");
        try {
            const { data } = await axios.delete(
                `${API_BASE}/api/merch/${product._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.dismiss(loadingToast);
            toast.success(data.message || "Product removed from store successfully!");

            // Remove from published products
            setPublishedProducts(prev => prev.filter((p) => p._id !== product._id));

            // Update Printify products status
            setPrintifyProducts(prev => prev.map(p =>
                p.id === product.printifyId ? { ...p, isPublished: false } : p
            ));
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || "Failed to remove product";
            toast.error(errorMsg);
            console.error(err);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const truncateText = (text, maxLength = 60) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
                    {/* Header */}
                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                                    <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Printify Product Manager</h1>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Manage your Printify merchandise and sync with your store
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading || publishedLoading}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    {loading ? 'Refreshing...' : 'Refresh'}
                                </button>
                                <button
                                    onClick={handleAddAll}
                                    disabled={unpublishedCount === 0 || loading}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Publish All ({unpublishedCount})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    {printifyProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Published</p>
                                <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    {publishedCount}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Unpublished</p>
                                <p className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    {unpublishedCount}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="text-lg font-semibold text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Connected
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit">
                        {[
                            { id: 'all', label: 'All Products', count: totalProducts },
                            { id: 'published', label: 'Published', count: publishedCount },
                            { id: 'unpublished', label: 'Unpublished', count: unpublishedCount }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                                    ? 'bg-purple-200 text-purple-700'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Published Products Section - Only show in All Products tab */}
                    {activeTab === 'published' && publishedProducts.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Published in Store ({publishedProducts.length})
                                    </h2>
                                </div>
                                <span className="text-sm text-gray-500">Manage store products</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {publishedProducts.map((product) => (
                                    <div key={product._id} className="bg-white rounded-xl border border-green-200 p-4 hover:shadow-lg transition-all duration-200">
                                        <div className="flex gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                                    {product.name}
                                                </h3>
                                                <p className="text-green-600 text-sm font-medium mb-2">
                                                    {formatPrice(product.price)}
                                                </p>
                                                <button
                                                    onClick={() => handleDeletePublishedProduct(product)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Remove from Store
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product List */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                            <p className="text-gray-700 text-lg font-medium">Fetching Printify products...</p>
                            <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {activeTab === 'published' ? 'No published products' :
                                    activeTab === 'unpublished' ? 'No unpublished products' : 'No products found'}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                {activeTab === 'published' ? 'No products have been published to your store yet.' :
                                    activeTab === 'unpublished' ? 'All products are already published to your store.' :
                                        'No products were found on your Printify account. Try refreshing or check your API connection.'}
                            </p>
                            <button
                                onClick={handleRefresh}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => {
                                const isSyncing = syncingProducts.has(product.id);
                                const isPublished = product.isPublished;

                                return (
                                    <div
                                        key={product.id}
                                        className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group ${isPublished ? 'border-green-200' : 'border-gray-200'
                                            }`}
                                    >
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden bg-gray-100">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                            {isPublished && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Published
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-5">
                                            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                                                {truncateText(product.title)}
                                            </h3>

                                            {product.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {truncateText(product.description, 80)}
                                                </p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                                {!isPublished ? (
                                                    <button
                                                        onClick={() => handleAddSingle(product)}
                                                        disabled={isSyncing}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                                                    >
                                                        {isSyncing ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Plus className="w-4 h-4" />
                                                        )}
                                                        {isSyncing ? 'Publishing...' : 'Publish to Store'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => window.open('/merch', '_blank')}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View in Store
                                                    </button>
                                                )}

                                                <div className="flex flex-col gap-2">
                                                    {isPublished ? (
                                                        <button
                                                            onClick={() => handleDeleteFromStore(product)}
                                                            className="flex items-center justify-center px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-all duration-200 font-medium text-xs"
                                                            title="Remove from store"
                                                        >
                                                            <XCircle className="w-3 h-3" />
                                                        </button>
                                                    ) : null}
                                                    <button
                                                        onClick={() => handleDeleteFromPrintify(product)}
                                                        disabled={isPublished} // Disable delete from Printify for published products
                                                        className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-xs"
                                                        title={isPublished ? "Cannot delete published products from Printify" : "Delete from Printify"}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer Help Text */}
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