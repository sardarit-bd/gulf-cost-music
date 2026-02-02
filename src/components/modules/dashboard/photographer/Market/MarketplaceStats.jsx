import { Package, DollarSign, Image, CheckCircle, XCircle } from "lucide-react";

export default function MarketplaceStats({ existingItem, stripeConnected }) {
    const activeCount = existingItem?.status === "active" ? 1 : 0;
    const totalPhotos = existingItem?.photos?.length || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Active Listings</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {activeCount}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Your Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {existingItem?.price
                                ? `$${parseFloat(existingItem.price).toFixed(2)}`
                                : "$0.00"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Photos</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {totalPhotos}/5
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        {stripeConnected ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Stripe Status</p>
                        <p className="text-lg font-bold text-gray-900">
                            {stripeConnected ? "Connected" : "Not Connected"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}