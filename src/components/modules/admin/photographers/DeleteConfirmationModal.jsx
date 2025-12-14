import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteConfirmationModal({
    photographer,
    isOpen,
    onClose,
    onConfirm
}) {
    if (!isOpen || !photographer) return null;

    const getDeleteConsequences = () => {
        const consequences = [];

        if (photographer.photos?.length > 0) {
            consequences.push(`${photographer.photos.length} photos will be permanently deleted`);
        }

        if (photographer.videos?.length > 0) {
            consequences.push(`${photographer.videos.length} videos will be permanently deleted`);
        }

        if (photographer.services?.length > 0) {
            consequences.push(`${photographer.services.length} services will be removed`);
        }

        consequences.push("All associated data will be lost");
        consequences.push("This action cannot be undone");

        return consequences;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3 text-red-600">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">Delete Photographer</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-red-800 font-medium">
                            You are about to permanently delete this photographer profile.
                        </p>
                    </div>

                    {/* Photographer Info */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                            {photographer.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{photographer.name}</p>
                            <p className="text-sm text-gray-600">{photographer.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <X size={18} />
                            Cancel
                        </div>
                    </button>
                    <button
                        onClick={() => {
                            const input = document.getElementById('delete-confirmation');
                            if (input?.value === 'DELETE') {
                                onConfirm();
                            } else {
                                alert('Please type "DELETE" to confirm deletion');
                            }
                        }}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Trash2 size={18} />
                            Delete Permanently
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}