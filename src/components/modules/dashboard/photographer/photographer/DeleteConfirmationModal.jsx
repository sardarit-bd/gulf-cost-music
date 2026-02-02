"use client"
import { useEffect } from "react";
import { Crown, ImageIcon, Loader2, Trash2, Upload, X, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    videoTitle,
    isLoading,
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl border border-red-200 shadow-2xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-red-100 rounded-xl">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Video</h3>
                            <p className="text-gray-600 text-sm">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-gray-700">
                            Are you sure you want to delete{" "}
                            <span className="text-gray-900 font-semibold">
                                "{videoTitle || "this video"}"
                            </span>
                            ?
                        </p>
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <AlertTriangle size={14} />
                            This will permanently remove the video from your portfolio
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete Video
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};