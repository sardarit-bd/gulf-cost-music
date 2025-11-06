import { Plus, RefreshCw, ShoppingBag } from "lucide-react";

const HeaderSection = ({ loading, publishedLoading, unpublishedCount, onRefresh, onAddAll }) => {
    return (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Printify Product Manager</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage your Printify merchandise and sync with your store
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                        onClick={onRefresh}
                        disabled={loading || publishedLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                        onClick={onAddAll}
                        disabled={unpublishedCount === 0 || loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Publish All ({unpublishedCount})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeaderSection;