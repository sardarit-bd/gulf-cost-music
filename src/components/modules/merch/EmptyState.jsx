import { AlertCircle } from "lucide-react";

const EmptyState = ({ activeTab, onRefresh }) => {
    const getEmptyStateConfig = () => {
        switch (activeTab) {
            case 'published':
                return {
                    title: 'No published products',
                    description: 'No products have been published to your store yet.'
                };
            case 'unpublished':
                return {
                    title: 'No unpublished products',
                    description: 'All products are already published to your store.'
                };
            default:
                return {
                    title: 'No products found',
                    description: 'No products were found on your Printify account. Try refreshing or check your API connection.'
                };
        }
    };

    const { title, description } = getEmptyStateConfig();

    return (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
            <button
                onClick={onRefresh}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
            >
                Try Again
            </button>
        </div>
    );
};

export default EmptyState;