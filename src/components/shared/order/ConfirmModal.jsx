// ConfirmModal.jsx (new file)
import { X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-red-600",
            hover: "hover:bg-red-700",
            light: "bg-red-50",
            text: "text-red-600"
        },
        warning: {
            bg: "bg-yellow-600",
            hover: "hover:bg-yellow-700",
            light: "bg-yellow-50",
            text: "text-yellow-600"
        },
        info: {
            bg: "bg-blue-600",
            hover: "hover:bg-blue-700",
            light: "bg-blue-50",
            text: "text-blue-600"
        }
    };

    const color = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl max-w-md w-full animate-fadeInScale">
                <div className={`p-4 ${color.light} rounded-t-2xl flex items-center justify-between`}>
                    <h3 className={`font-semibold ${color.text}`}>{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-lg transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 mb-6">{message}</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2 ${color.bg} text-white rounded-lg ${color.hover} transition`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.2s ease-out;
        }
      `}</style>
        </div>
    );
}
