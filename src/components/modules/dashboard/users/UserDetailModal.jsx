"use client";
import {
    Building2,
    FileText,
    Mail,
    Music,
    Shield,
    User as UserIcon,
    X
} from "lucide-react";

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    const getUserTypeColor = (type) => {
        switch (type) {
            case "artist":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "venue":
                return "bg-green-100 text-green-800 border-green-200";
            case "admin":
                return "bg-red-100 text-red-800 border-red-200";
            case "journalist":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getUserTypeIcon = (type) => {
        switch (type) {
            case "artist":
                return <Music className="w-4 h-4" />;
            case "venue":
                return <Building2 className="w-4 h-4" />;
            case "admin":
                return <Shield className="w-4 h-4" />;
            case "journalist":
                return <FileText className="w-4 h-4" />;
            default:
                return <UserIcon className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {user.username}
                                </h4>
                                <p className="text-gray-600 flex items-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="font-medium text-gray-700">User Type:</label>
                                <span
                                    className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(
                                        user.userType
                                    )}`}
                                >
                                    {getUserTypeIcon(user.userType)}
                                    <span className="ml-1 capitalize">{user.userType}</span>
                                </span>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700">Status:</label>
                                <span
                                    className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isVerified
                                            ? "bg-green-100 text-green-800"
                                            : "bg-orange-100 text-orange-800"
                                        }`}
                                >
                                    {user.isVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700">Joined:</label>
                                <p className="text-gray-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700">
                                    Last Updated:
                                </label>
                                <p className="text-gray-600">
                                    {user.updatedAt
                                        ? new Date(user.updatedAt).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })
                                        : "Not updated yet"}
                                </p>
                            </div>
                        </div>

                        {user.bio && (
                            <div>
                                <label className="font-medium text-gray-700">Bio:</label>
                                <p className="text-gray-600 mt-1 text-sm">{user.bio}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;