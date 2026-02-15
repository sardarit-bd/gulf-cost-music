import { CheckCircle, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";

export default function ActionButtons({
    existingItem,
    loading,
    onSave,
    onDelete,
    onCancel
}) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
                {existingItem && (
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                    >
                        <X className="w-5 h-5" />
                        Cancel Edit
                    </button>
                )}
            </div>

            <div className="flex gap-4">
                {existingItem && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition border border-red-200"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete Listing
                    </button>
                )}

                <button
                    onClick={onSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {existingItem ? "Updating..." : "Creating..."}
                        </>
                    ) : existingItem ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Update Listing
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Publish Listing
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}