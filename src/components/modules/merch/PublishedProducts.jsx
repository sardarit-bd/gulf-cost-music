import { formatPrice } from "@/utils/helpers";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function PublishedProducts({ publishedProducts, onDeletePublishedProduct }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProduct) {
            onDeletePublishedProduct(selectedProduct);
        }
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    return (
        <>
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
                                        onClick={() => handleDeleteClick(product)}
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

            {/* Confirmation Modal */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Remove Product
                            </h3>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Are you sure you want to remove this product from your store?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                            {selectedProduct.name}
                                        </h4>
                                        <p className="text-green-600 text-sm font-medium">
                                            {formatPrice(selectedProduct.price)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                This product will be removed from your store but will remain in your Printify account.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove from Store
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}