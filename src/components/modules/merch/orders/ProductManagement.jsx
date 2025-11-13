"use client";

import axios from "axios";
import {
    DollarSign,
    Edit,
    Eye,
    Image as ImageIcon,
    Loader2,
    Package,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    Upload,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProductManagement() {
    const [merchItems, setMerchItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        quantity: "1",
        image: null,
        isActive: true
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        fetchMerch();
    }, []);

    const fetchMerch = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/merch`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setMerchItems(data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.stock) {
            toast.error("Name, price and stock are required");
            return;
        }

        const token = localStorage.getItem("token");
        const submitData = new FormData();

        submitData.append("name", formData.name);
        submitData.append("price", parseFloat(formData.price));
        submitData.append("description", formData.description);
        submitData.append("stock", parseInt(formData.stock));
        submitData.append("quantity", formData.quantity);
        submitData.append("isActive", formData.isActive);

        if (formData.image) {
            submitData.append("image", formData.image);
        }

        try {
            let response;
            if (editingItem) {
                response = await axios.put(`${API_BASE}/api/merch/${editingItem._id}`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
                toast.success("Product updated successfully!");
            } else {
                response = await axios.post(`${API_BASE}/api/merch`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
                toast.success("Product created successfully!");
            }

            resetForm();
            fetchMerch();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to save product";
            toast.error(errorMsg);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

        setActionLoading(id);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/api/merch/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Product deleted successfully!");
            fetchMerch();
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setActionLoading(null);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price,
            description: item.description || "",
            stock: item.stock,
            quantity: item.quantity || "1",
            image: null,
            isActive: item.isActive
        });
        setShowForm(true);
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowDetailsModal(true);
    };

    const toggleProductStatus = async (item) => {
        setActionLoading(item._id);
        try {
            const token = localStorage.getItem("token");
            const updatedData = {
                name: item.name,
                price: item.price,
                description: item.description,
                stock: item.stock,
                quantity: item.quantity,
                isActive: !item.isActive
            };

            const response = await axios.put(`${API_BASE}/api/merch/${item._id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                toast.success(`Product ${item.isActive ? 'deactivated' : 'activated'} successfully!`);
                fetchMerch();
            }
        } catch (error) {
            toast.error("Failed to update product status");
        } finally {
            setActionLoading(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            description: "",
            stock: "",
            quantity: "1",
            image: null,
            isActive: true
        });
        setEditingItem(null);
        setShowForm(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setFormData({ ...formData, image: file });
        }
    };

    const filteredItems = merchItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && item.isActive) ||
            (statusFilter === "inactive" && !item.isActive) ||
            (statusFilter === "outOfStock" && item.stock <= 0);

        return matchesSearch && matchesStatus;
    });

    // Statistics
    const stats = {
        total: merchItems.length,
        active: merchItems.filter(item => item.isActive).length,
        inactive: merchItems.filter(item => !item.isActive).length,
        outOfStock: merchItems.filter(item => item.stock <= 0).length,
        inStock: merchItems.filter(item => item.stock > 0).length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Package className="w-8 h-8 text-purple-600" />
                        Product Management
                    </h1>
                    <p className="text-gray-600 mt-2">Create, edit and manage your product inventory</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inactive}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <p className="text-sm text-gray-500">In Stock</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inStock}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border">
                    <p className="text-sm text-gray-500">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-gray-500 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={fetchMerch}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingItem ? 'Edit Product' : 'Add New Product'}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                                <span className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label htmlFor="imageUpload" className="cursor-pointer">
                                    {formData.image ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <ImageIcon className="w-5 h-5" />
                                            <span>Image selected</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <Upload className="w-6 h-6" />
                                            <span>Click to upload image</span>
                                            <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                            {editingItem && !formData.image && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">Current image:</p>
                                    <img src={editingItem.image} alt="Current" className="w-16 h-16 object-cover rounded mt-1" />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                                placeholder="Product description..."
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                            >
                                {editingItem ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-900">
                        Products ({filteredItems.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No products found</p>
                        {merchItems.length === 0 && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Create Your First Product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">
                                                        {item.description || "No description"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-500">{item.price}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock > 10 ? 'bg-green-100 text-green-800' :
                                                item.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {item.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => toggleProductStatus(item)}
                                                    disabled={actionLoading === item._id}
                                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${item.isActive
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {actionLoading === item._id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : item.isActive ? (
                                                        <ToggleRight className="w-3 h-3" />
                                                    ) : (
                                                        <ToggleLeft className="w-3 h-3" />
                                                    )}
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                                {item.stock <= 0 && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(item)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                                                title="Edit Product"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id, item.name)}
                                                disabled={actionLoading === item._id}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                                                title="Delete Product"
                                            >
                                                {actionLoading === item._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            {showDetailsModal && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowDetailsModal(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <XCircle className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                                    <img
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        className="object-contain max-h-80 w-full rounded-lg"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-600">
                                            {selectedItem.description || "No description available."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="text-2xl font-bold text-purple-600">${selectedItem.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Stock</p>
                                            <p className={`text-lg font-semibold ${selectedItem.stock > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {selectedItem.stock} units
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${selectedItem.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedItem.isActive ? (
                                                    <ToggleRight className="w-3 h-3" />
                                                ) : (
                                                    <ToggleLeft className="w-3 h-3" />
                                                )}
                                                {selectedItem.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created</p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(selectedItem.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleEdit(selectedItem);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Product
                                        </button>
                                        <button
                                            onClick={() => setShowDetailsModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}