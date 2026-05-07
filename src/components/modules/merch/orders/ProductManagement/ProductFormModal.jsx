"use client";
import axios from "axios";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ProductFormModal = ({ editingItem, onClose, onSuccess, API_BASE, getTokenFromCookies }) => {
    const [formData, setFormData] = useState({
        name: editingItem?.name || "",
        price: editingItem?.price || "",
        description: editingItem?.description || "",
        stock: editingItem?.stock || "",
        image: null,
        isActive: editingItem?.isActive !== undefined ? editingItem.isActive : true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setFormData({ ...formData, image: file });
            setErrors({ ...errors, image: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
        if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = "Valid stock quantity is required";
        if (!editingItem && !formData.image) newErrors.image = "Product image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        const token = getTokenFromCookies();
        if (!token) {
            toast.error("Authentication required");
            return;
        }

        setLoading(true);
        const toastId = toast.loading(editingItem ? "Updating product..." : "Creating product...");

        try {
            const submitData = new FormData();
            submitData.append("name", formData.name.trim());
            submitData.append("price", parseFloat(formData.price));
            submitData.append("description", formData.description || "");
            submitData.append("stock", parseInt(formData.stock));
            submitData.append("quantity", "1");
            submitData.append("isActive", formData.isActive);

            if (formData.image) {
                submitData.append("image", formData.image);
            }

            let response;
            if (editingItem) {
                response = await axios.put(`${API_BASE}/api/merch/${editingItem._id}`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                response = await axios.post(`${API_BASE}/api/merch`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            if (response.data.success) {
                toast.success(editingItem ? "Product updated successfully!" : "Product created successfully!", { id: toastId });
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("API Error:", error.response?.data);

            // Handle validation errors from backend
            if (error.response?.data?.errors) {
                const backendErrors = {};
                error.response.data.errors.forEach(err => {
                    backendErrors[err.param] = err.msg;
                });
                setErrors(backendErrors);
                toast.error("Validation failed. Please check the form.", { id: toastId });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message, { id: toastId });
            } else {
                toast.error("Failed to save product", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingItem ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`text-gray-700 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className={`text-gray-700 w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none`}
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className={`text-gray-700 w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none`}
                            />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${formData.isActive ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                                <span className={`font-medium ${formData.isActive ? "text-green-600" : "text-gray-600"}`}>
                                    {formData.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image {!editingItem && <span className="text-red-500">*</span>}
                            </label>
                            <div className={`border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-center hover:border-yellow-400 transition-colors cursor-pointer`}>
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
                                            <span>{formData.image.name || "Image selected"}</span>
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
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            {editingItem && !formData.image && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">Current image:</p>
                                    <img src={editingItem.image} alt="Current" className="w-16 h-16 object-cover rounded mt-1" />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                                placeholder="Product description..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                            {editingItem ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;