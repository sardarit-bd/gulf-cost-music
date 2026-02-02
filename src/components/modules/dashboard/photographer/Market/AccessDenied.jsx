import { Package, Lock } from "lucide-react";

export default function AccessDenied() {
    return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Marketplace Access Required
                </h3>
                <p className="text-gray-600 mb-6">
                    You need to be a verified photographer, artist, or venue to access the marketplace.
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>Contact support for verification</span>
                </div>
            </div>
        </div>
    );
}