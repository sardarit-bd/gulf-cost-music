import { formatPrice, truncateText } from "@/utils/helpers";
import { CheckCircle2, Eye, Loader2, Plus } from "lucide-react";

export default function ProductCard({ product, isSyncing, onAddSingle, onDeleteFromPrintify, onDeleteFromStore }) {
    const isPublished = product.isPublished;

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group ${isPublished ? 'border-green-200' : 'border-gray-200'
            }`}>
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
                            onClick={() => onAddSingle(product)}
                            disabled={isSyncing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEDA19] text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
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

                    {/* <div className="flex flex-col gap-2">
                        {isPublished ? (
                            <button
                                onClick={() => onDeleteFromStore(product)}
                                className="flex items-center justify-center px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-all duration-200 font-medium text-xs"
                                title="Remove from store"
                            >
                                <XCircle className="w-3 h-3" />
                            </button>
                        ) : null}
                        <button
                            onClick={() => onDeleteFromPrintify(product)}
                            disabled={isPublished}
                            className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-xs"
                            title={isPublished ? "Cannot delete published products from Printify" : "Delete from Printify"}
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}