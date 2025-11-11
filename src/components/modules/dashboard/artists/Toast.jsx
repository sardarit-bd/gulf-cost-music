"use client";
import { XCircle } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-right-8 duration-300`}>
            <span>{message}</span>
            <button onClick={onClose} className="text-white hover:text-gray-200">
                <XCircle className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;