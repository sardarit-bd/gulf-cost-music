export default function LoadingState({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-center">
                <p className="text-gray-800 font-medium">{message}</p>
                <p className="text-gray-600 text-sm">Please wait...</p>
            </div>
        </div>
    );
}