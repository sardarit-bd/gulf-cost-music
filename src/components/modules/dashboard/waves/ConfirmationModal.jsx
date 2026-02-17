"use client";
import { Edit, Trash2 } from "lucide-react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText = "Cancel",
    type = "warning"
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "warning":
                return <Edit className="w-6 h-6 text-orange-500" />;
            case "danger":
                return <Trash2 className="w-6 h-6 text-red-500" />;
            default:
                return <Edit className="w-6 h-6 text-orange-500" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case "warning":
                return "bg-orange-600 hover:bg-orange-700";
            case "danger":
                return "bg-red-600 hover:bg-red-700";
            default:
                return "bg-blue-600 hover:bg-blue-700";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
                <div className="flex items-center space-x-3 mb-4">
                    {getIcon()}
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>

                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${getButtonColor()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;