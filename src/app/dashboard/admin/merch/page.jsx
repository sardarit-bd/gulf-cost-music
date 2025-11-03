"use client";
import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Edit,
    Loader2,
    ShoppingBag,
    Search,
    Filter,
    Download,
    RefreshCw,
    DollarSign,
    Image,
    Tag,
    MoreVertical,
    Eye,
    TrendingUp,
    Package,
    Store
} from "lucide-react";
import axios from "axios";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";
import toast, { Toaster } from 'react-hot-toast';
import { handleApiError } from "@/utils/errorHandler";
// import { handleApiError } from "@/utils/errorHandler";

export default function AdminMerchPage() {
    const [token, setToken] = useState(null);
    const [merchItems, setMerchItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionMenu, setActionMenu] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        image: "",
        printifyId: "",
        description: "",
        category: "",
        stock: ""
    });

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;


    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedToken = localStorage.getItem("token");
            setToken(savedToken);
        }
    }, []);

    // ===== Fetch All Merch =====
    const fetchMerch = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE}/api/merch`);

            if (data.success && Array.isArray(data.data)) {
                setMerchItems(data.data);
            } else {
                setMerchItems([]);
            }

        } catch (error) {
            const msg = handleApiError(error, "Failed to load merchandise");
            toast.error(msg);
            setMerchItems([]);
        } finally {
            setLoading(false);
        }
    };



    // ===== Handle Input =====
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // ===== Create or Update Merch =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        const savePromise = new Promise(async (resolve, reject) => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                if (editingItem) {
                    await axios.put(`${API_BASE}/api/merch/${editingItem._id}`, formData, { headers });
                } else {
                    await axios.post(`${API_BASE}/api/merch`, formData, { headers });
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(savePromise, {
            loading: editingItem ? "Updating product..." : "Creating product...",
            success: () => {
                resetForm();
                fetchMerch();
                return editingItem
                    ? "Product updated successfully!"
                    : "Product created successfully!";
            },
            error: (error) => handleApiError(error, "Failed to save product"),
        });
    };


    // ===== Edit Merch =====
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price,
            image: item.image,
            printifyId: item.printifyId || "",
            description: item.description || "",
            category: item.category || "",
            stock: item.stock || ""
        });
        setShowForm(true);
        toast.success('Product loaded for editing');
    };

    // ===== Delete Merch =====
    const handleDelete = async (id) => {
        const deletePromise = new Promise(async (resolve, reject) => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                await axios.delete(`${API_BASE}/api/merch/${id}`, { headers });
                resolve();
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(deletePromise, {
            loading: "Deleting product...",
            success: () => {
                fetchMerch();
                setActionMenu(null);
                return "Product deleted successfully!";
            },
            error: (error) => handleApiError(error, "Failed to delete product"),
        });
    };

    // ===== Reset Form =====
    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            image: "",
            printifyId: "",
            description: "",
            category: "",
            stock: ""
        });
        setEditingItem(null);
        setShowForm(false);
        // toast.success('Form reset successfully');
    };

    // ===== Refresh Data =====
    const handleRefresh = async () => {
        const refreshPromise = fetchMerch();

        toast.promise(refreshPromise, {
            loading: "Refreshing data...",
            success: "Data refreshed successfully!",
            error: (error) => handleApiError(error, "Failed to refresh data"),
        });
    };


    // ===== Filtered Items =====
    const filteredItems = (merchItems || []).filter(
        (item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    useEffect(() => {
        fetchMerch();
    }, []);

    // ===== UI =====
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* React Hot Toast Container */}
                <Toaster />

                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                                    <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                Merchandise Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage your merchandise inventory, prices, and product details
                            </p>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                            <button
                                onClick={handleRefresh}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                            <button
                                onClick={() => {
                                  setShowForm(true);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Product</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={ShoppingBag}
                            label="Total Products"
                            value={merchItems?.length || 0}
                            change={15}
                            color="purple"
                        />
                        <StatCard
                            icon={DollarSign}
                            label="Average Price"
                            value={`$${merchItems?.length > 0 ? (merchItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '') || 0), 0) / merchItems.length).toFixed(2) : '0'}`}
                            change={8}
                            color="green"
                        />
                        <StatCard
                            icon={Package}
                            label="Low Stock"
                            value={merchItems?.filter(item => item.stock < 10).length}
                            change={-5}
                            color="orange"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="This Month"
                            value={Math.floor(merchItems?.length * 0.25)}
                            change={25}
                            color="blue"
                        />
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Products
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by product name or category..."
                                        className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-48">
                                <label className="text-gray-500 block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        toast.success(`Filtered by ${e.target.value || 'all categories'}`);
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="music">Music</option>
                                </select>
                            </div>
                            <button
                                onClick={() => toast.success('Filters applied successfully')}
                                className="w-full lg:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center space-x-2"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Apply Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Form Section */}
                    {showForm && (
                        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editingItem ? "Edit Product" : "Add New Product"}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price *
                                        </label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="$20.00"
                                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="https://example.com/image.png"
                                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Printify ID (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="printifyId"
                                            value={formData.printifyId}
                                            onChange={handleChange}
                                            placeholder="65ae5df1234567"
                                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                                    >
                                        {editingItem ? "Update Product" : "Add Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Products ({filteredItems.length})
                            </h3>
                            <div className="text-sm text-gray-500">
                                Showing all products
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                                    <p className="text-gray-600">Loading merchandise...</p>
                                </div>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-12">
                                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
                                <p className="text-gray-600">
                                    {searchTerm ? "Try adjusting your search" : "Get started by adding your first product"}
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                                    >
                                        Add Your First Product
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Printify ID
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredItems.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-10 h-10 object-contain rounded"
                                                                />
                                                            ) : (
                                                                <Image className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                                                                {item.name}
                                                            </div>
                                                            {item.category && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                                                    <Tag className="w-3 h-3 mr-1" />
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 max-w-xs">
                                                        {item.description || "No description"}
                                                    </div>
                                                    {item.stock !== undefined && (
                                                        <div className={`text-xs font-medium mt-1 ${item.stock < 10 ? 'text-red-600' : 'text-green-600'
                                                            }`}>
                                                            Stock: {item.stock}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {item.price}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {item.printifyId || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                            title="Edit Product"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => toast.success(`Viewing ${item.name}`)}
                                                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                            title="View Product"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setActionMenu(actionMenu === item._id ? null : item._id)}
                                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>

                                                            {actionMenu === item._id && (
                                                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                                                    <button
                                                                        onClick={() => {
                                                                            setActionMenu(null);
                                                                            toast.success(`Viewing details for ${item.name}`);
                                                                        }}
                                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View Details
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(item._id)}
                                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete Product
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
    const colorClasses = {
        purple: "from-purple-500 to-pink-600",
        green: "from-green-500 to-emerald-600",
        orange: "from-orange-500 to-red-600",
        blue: "from-blue-500 to-cyan-600",
    };

    const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
    const changeIcon = change >= 0 ? "↗" : "↘";

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}>
                    <span>{changeIcon}</span>
                    <span>{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-gray-600 text-sm">{label}</p>
        </div>
    );
};