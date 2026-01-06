"use client"
import { useEffect } from "react";
import { Crown, ImageIcon, Loader2, Trash2, Upload, X, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const DeleteConfirmationModal = ({
                                     isOpen,
                                     onClose,
                                     onConfirm,
                                     photoIndex,
                                     photoCount,
                                     isLoading
                                 }) => {
    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-red-500/30 shadow-2xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-red-500/20 rounded-xl">
                            <AlertTriangle size={24} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Delete Photo</h3>
                            <p className="text-gray-400 text-sm">This action cannot be undone</p>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-gray-300 text-center">
                            Are you sure you want to delete <span className="text-white font-semibold">Photo #{photoIndex + 1}</span>?
                        </p>
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1 justify-center">
                            <AlertTriangle size={14} />
                            This will permanently remove the photo from your portfolio
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete Photo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;