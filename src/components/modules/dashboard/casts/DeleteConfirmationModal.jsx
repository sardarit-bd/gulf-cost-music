import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    podcastTitle
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Delete Podcast
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete the podcast?
                    </p>
                    <p className="font-medium text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                        "{podcastTitle}"
                    </p>
                    <p className="text-sm text-red-600 mt-3">
                        This action cannot be undone. All data associated with this podcast will be permanently removed.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center space-x-2"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Delete Podcast</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;