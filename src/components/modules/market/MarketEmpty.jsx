import { ShoppingBag } from "lucide-react";

export default function MarketEmpty() {
    return (
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-10 text-center">
            <ShoppingBag className="w-14 h-14 mx-auto text-gray-500 mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">No items found</h3>
            <p className="text-gray-400">Try changing search or filters.</p>
        </div>
    );
}
