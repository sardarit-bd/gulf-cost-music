import { Loader2 } from "lucide-react";

const LoadingState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-gray-700 text-lg font-medium">Fetching Printify products...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
    );
};

export default LoadingState;