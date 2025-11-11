"use client";
import {
    Calendar,
    Mail,
    Power,
    User
} from "lucide-react";
import { useState } from "react";

const DeactivateModal = ({
    artist,
    isOpen,
    onClose,
    onConfirm,
    loading = false
}) => {
    const [reason, setReason] = useState("");
    const [notifyUser, setNotifyUser] = useState(true);

    if (!isOpen || !artist) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(artist._id, artist.isActive, reason, notifyUser);
    };

    const handleClose = () => {
        setReason("");
        setNotifyUser(true);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Artist Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {artist.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{artist.name}</h4>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {artist.user?.email}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                                <User className="w-3 h-3 mr-1" />
                                <span>Artist</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>
                                    {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Power className="w-4 h-4" />
                                )}
                                <span>{loading ? "Deactivating..." : "Deactivate"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeactivateModal;