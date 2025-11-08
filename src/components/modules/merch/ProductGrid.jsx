// import ProductCard from "./MerchCard";

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, syncingProducts, onAddSingle, onDeleteFromPrintify, onDeleteFromStore }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isSyncing={syncingProducts.has(product.id)}
                    onAddSingle={onAddSingle}
                    onDeleteFromPrintify={onDeleteFromPrintify}
                    onDeleteFromStore={onDeleteFromStore}
                />
            ))}
        </div>
    );
}