import { CheckCircle2, Package } from "lucide-react";

const StatsSection = ({ printifyProducts, totalProducts, publishedCount, unpublishedCount }) => {
    if (printifyProducts.length === 0) return null;

    return (
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
    );
};

export default StatsSection;