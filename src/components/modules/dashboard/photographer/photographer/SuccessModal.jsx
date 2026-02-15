import { CheckCircle2 } from "lucide-react";

export const SuccessModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl border border-green-200 shadow-2xl w-full max-w-md transform transition-all">
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};