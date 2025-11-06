import { CheckCircle2, Trash2 } from "lucide-react";

const PublishedProductsSection = ({ publishedProducts, onDeleteProduct }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (publishedProducts.length === 0) return null;

    return (
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
                                    onClick={() => onDeleteProduct(product)}
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
    );
};

export default PublishedProductsSection;