"use client";
import { Mail, Trash2 } from "lucide-react";
import { useState } from "react";

const DeleteConfirmationModal = ({ user, onClose, onConfirm }) => {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        setDeleting(true);
        await onConfirm(user._id);
        setDeleting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-full">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete this user? This action cannot be
                            undone.
                        </p>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {user?.username}
                                    </h4>
                                    <p className="text-gray-600 text-xs flex items-center">
                                        <Mail className="w-3 h-3 mr-1" />
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-800 text-sm">
                                <strong>Warning:</strong> This will permanently delete the
                                user account and all associated data.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            disabled={deleting}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={deleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center"
                        >
                            {deleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete User
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;