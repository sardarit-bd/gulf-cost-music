"use client";
import { Crown, X } from "lucide-react";
import { useState } from "react";

const PromoteModal = ({ user, onClose, onPromote }) => {
    const [role, setRole] = useState("content_admin");
    const [promoting, setPromoting] = useState(false);

    const handlePromote = async () => {
        setPromoting(true);
        await onPromote(user._id, role);
        setPromoting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            Promote to Admin
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <Crown className="w-5 h-5 text-yellow-600" />
                            <p className="text-sm text-yellow-700">
                                Promoting <strong>{user?.username}</strong> to admin role
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="content_admin">Content Admin</option>
                                <option value="user_admin">User Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Content Admin: Manage content only | User Admin: Manage users
                                only | Super Admin: Full access
                            </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Permissions:
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>✓ Manage users and content</li>
                                <li>✓ Access admin dashboard</li>
                                <li>✓ Moderate platform content</li>
                                {role === "super_admin" && (
                                    <li>✓ Promote other users to admin</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePromote}
                            disabled={promoting}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center"
                        >
                            {promoting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Promoting...
                                </>
                            ) : (
                                <>
                                    <Crown className="w-4 h-4 mr-2" />
                                    Promote to Admin
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoteModal;