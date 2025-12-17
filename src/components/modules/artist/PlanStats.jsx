import { Camera, Music, ShoppingBag } from 'lucide-react';

const PlanStats = ({
    subscriptionPlan,
    photosCount,
    audiosCount,
    listingsCount = 0,
    hasMarketplaceAccess = false
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Photo Stats */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Photo Uploads</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {photosCount}/{subscriptionPlan === 'pro' ? '5' : '0'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">photos allowed</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Audio Stats */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Audio Uploads</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {audiosCount}/{subscriptionPlan === 'pro' ? '5' : '0'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">audios allowed</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Marketplace Stats */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Marketplace</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {listingsCount} {hasMarketplaceAccess ? 'active' : 'locked'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            {hasMarketplaceAccess ? 'listings active' : 'upgrade to pro'}
                        </p>
                    </div>
                    <div className={`w-12 h-12 ${hasMarketplaceAccess ? 'bg-green-500/20' : 'bg-gray-700'} rounded-lg flex items-center justify-center`}>
                        <ShoppingBag className={`w-6 h-6 ${hasMarketplaceAccess ? 'text-green-500' : 'text-gray-500'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanStats;