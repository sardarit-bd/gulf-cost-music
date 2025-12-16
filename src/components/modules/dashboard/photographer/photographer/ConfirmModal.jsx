import { AlertCircle, Trash2 } from "lucide-react";

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "delete"
}) => {
    if (!isOpen) return null;

    const bgColor = type === "delete" ? "bg-red-500" : "bg-yellow-500";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className={`${bgColor} p-6`}>
                    <div className="flex items-center gap-3">
                        {type === "delete" ? (
                            <Trash2 className="w-8 h-8 text-white" />
                        ) : (
                            <AlertCircle className="w-8 h-8 text-white" />
                        )}
                        <h3 className="text-white text-xl font-bold">{title}</h3>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-gray-300 text-lg mb-6">{message}</p>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-5 py-2.5 ${type === "delete" ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-medium rounded-xl transition`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};