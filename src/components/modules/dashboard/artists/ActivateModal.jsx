"use client";
import {
    Calendar,
    CheckCircle,
    Mail,
    Power,
    Shield,
    User,
    X
} from "lucide-react";
import { useState } from "react";

const ActivateModal = ({
    artist,
    isOpen,
    onClose,
    onConfirm,
    loading = false
}) => {
    const [notifyUser, setNotifyUser] = useState(true);

    if (!isOpen || !artist) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(artist._id, notifyUser);
    };

    const handleClose = () => {
        setNotifyUser(true);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Activate Artist
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Re-enable artist account
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

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

                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-green-800 mb-1">
                                    What happens when you activate?
                                </h4>
                                <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Artist will be able to login again</li>
                                    <li>• Their profile will be visible to public</li>
                                    <li>• All their content will be restored</li>
                                    <li>• Can start receiving bookings</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Notify User Checkbox */}
                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                id="notifyUserActivate"
                                checked={notifyUser}
                                onChange={(e) => setNotifyUser(e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="notifyUserActivate" className="ml-2 text-sm text-gray-700">
                                Send notification email to artist
                            </label>
                        </div>

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
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Power className="w-4 h-4" />
                                )}
                                <span>{loading ? "Activating..." : "Activate"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActivateModal;