import { BadgeCheck, Package } from "lucide-react";

export default function MarketplaceHeader({ existingItem, user }) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Photographer Marketplace
                    </h1>
                    <p className="text-blue-100">
                        {existingItem
                            ? "Manage your gear, services, or merchandise listings"
                            : "List music gear, services, or merchandise for sale"
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                        <BadgeCheck className="w-5 h-5" />
                        <span className="font-medium">Verified Artist</span>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}