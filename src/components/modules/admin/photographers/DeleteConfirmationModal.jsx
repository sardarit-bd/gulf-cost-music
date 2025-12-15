import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function DeleteConfirmationModal({
    photographer,
    isOpen,
    onClose,
    onConfirm
}) {
    const [confirmationText, setConfirmationText] = useState("");

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

    const handleDelete = () => {
        if (confirmationText === "DELETE") {
            onConfirm();
        } else {
            alert('Please type "DELETE" to confirm deletion');
        }
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

                    {/* Consequences */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Consequences:</h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                            {getDeleteConsequences().map((consequence, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                                    <span>{consequence}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Confirmation Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-mono text-red-600">DELETE</span> to confirm:
                        </label>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                            placeholder="Type DELETE here"
                        />
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
                        onClick={handleDelete}
                        disabled={confirmationText !== "DELETE"}
                        className={`px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2 ${confirmationText === "DELETE"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <Trash2 size={18} />
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
}