import { Edit2, Home, ShoppingBag } from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab, hasMarketplaceAccess }) => {
    return (
        <div className="flex border-b border-gray-700 overflow-x-auto">
            <button
                className={`flex items-center px-6 py-4 text-sm font-medium transition ${activeTab === 'overview' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('overview')}
            >
                <Home className="w-4 h-4 mr-2" />
                Overview
            </button>

            <button
                className={`flex items-center px-6 py-4 text-sm font-medium transition ${activeTab === 'edit' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('edit')}
            >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
            </button>

            {hasMarketplaceAccess && (
                <button
                    className={`flex items-center px-6 py-4 text-sm font-medium transition ${activeTab === 'marketplace' ? 'text-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('marketplace')}
                >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Marketplace
                </button>
            )}
        </div>
    );
};

export default Tabs;