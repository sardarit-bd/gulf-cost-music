"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    loading = false,
    type = "default", // 'default', 'danger', 'warning'
    itemName = "", // Optional: show the name of item being deleted
}) {
    if (!isOpen) return null;

    const typeConfig = {
        default: {
            icon: Trash2,
            iconColor: "text-gray-600",
            bgColor: "bg-gray-100",
            buttonColor: "bg-red-600 hover:bg-red-700",
        },
        danger: {
            icon: AlertTriangle,
            iconColor: "text-red-600",
            bgColor: "bg-red-100",
            buttonColor: "bg-red-600 hover:bg-red-700",
        },
        warning: {
            icon: AlertTriangle,
            iconColor: "text-yellow-600",
            bgColor: "bg-yellow-100",
            buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        },
    };

    const config = typeConfig[type] || typeConfig.default;
    const Icon = config.icon;

    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${config.iconColor}`} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                                <p className="text-gray-600 text-sm mt-1">Please confirm your action</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <div className={`w-full h-full ${config.bgColor} rounded-full flex items-center justify-center`}>
                                    <Icon className={`w-8 h-8 ${config.iconColor}`} />
                                </div>
                            </div>

                            <p className="text-gray-700 mb-3">{description}</p>

                            {itemName && (
                                <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                                    <p className="font-medium text-gray-900">{itemName}</p>
                                </div>
                            )}
                        </div> */}

                        {/* Warning Note */}
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">Warning</p>
                                    <p className="text-sm text-gray-600">This action cannot be undone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`flex-1 px-4 py-3 ${config.buttonColor} text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    {confirmText}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple version for quick use
export function SimpleDeleteModal({ isOpen, onClose, onConfirm, loading, title, description }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {title || "Delete Item?"}
                    </h3>
                    <p className="text-gray-600">
                        {description || "This action cannot be undone."}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// Mini delete confirmation for small items
export function MiniDeleteConfirm({ onConfirm, onCancel, loading, itemName }) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-4 shadow-lg max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Delete {itemName}?</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-1"
                    >
                        {loading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Trash2 className="w-3 h-3" />
                        )}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}