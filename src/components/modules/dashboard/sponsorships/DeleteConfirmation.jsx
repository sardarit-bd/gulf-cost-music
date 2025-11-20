"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmation({ item, itemType, onConfirm, onCancel }) {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete {itemType}?
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                This action cannot be undone
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-800">
                            You are about to delete <strong>"{item.name}"</strong>. This will permanently remove the {itemType} and all associated data.
                        </p>
                    </div>

                    {/* Preview (for sponsors) */}
                    {itemType === 'sponsor' && item.logo && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
                            <img
                                src={item.logo?.url || item.logo}
                                alt={item.name}
                                className="w-12 h-12 object-contain rounded"
                            />
                            <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {item.website && (
                                    <p className="text-sm text-gray-600">{item.website}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}