
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
            </div>
        </div>
    );
}