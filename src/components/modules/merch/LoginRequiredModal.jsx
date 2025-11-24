"use client";
import { User } from "lucide-react";

const LoginRequiredModal = ({
    isOpen,
    onClose,
    onLogin
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white max-w-sm w-full rounded-2xl shadow-xl p-6 animate-fadeInScale z-10">
                <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Login Required
                    </h2>
                    <p className="text-gray-600">
                        Please login first to purchase merchandise.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onLogin}
                        className="w-full bg-[var(--primary)] text-gray-700 py-3 rounded-lg font-semibold hover:bg-[var(--primary)]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Go to Login
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full text-gray-600 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.25s ease-out;
        }
      `}</style>
        </div>
    );
};

export default LoginRequiredModal;