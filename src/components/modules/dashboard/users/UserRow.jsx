import { Calendar, CheckCircle, Crown, Edit, Eye, Mail, MoreVertical, Save, Trash2, UserPlus, X } from "lucide-react";
import { useEffect, useRef } from "react";

const UserRow = ({
    user,
    editingUser,
    formData,
    saveLoading,
    actionMenu,
    getUserTypeIcon,
    getUserTypeColor,
    onView,
    onVerify,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onPromote,
    onDelete,
    onActionMenuToggle
}) => {
    const isEditing = editingUser === user._id;
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // Prevent click outside from closing when clicking inside menu
    useEffect(() => {
        const handleClickInside = (event) => {
            // If click is inside menu or on the button, don't close
            if (menuRef.current && menuRef.current.contains(event.target)) {
                return;
            }
            if (buttonRef.current && buttonRef.current.contains(event.target)) {
                return;
            }
            // If menu is open and click is outside, close it
            if (actionMenu === user._id) {
                // Check if click is not on the button
                if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                    onActionMenuToggle(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickInside);
        return () => {
            document.removeEventListener('mousedown', handleClickInside);
        };
    }, [actionMenu, user._id, onActionMenuToggle]);

    const handleToggleMenu = (e) => {
        e.stopPropagation();
        onActionMenuToggle(user._id);
    };

    const handleMenuAction = (callback) => {
        return () => {
            callback();
            onActionMenuToggle(null);
        };
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={formData.username || ""}
                                    onChange={(e) => onInputChange("username", e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                                    placeholder="Username"
                                />
                                <input
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) => onInputChange("email", e.target.value)}
                                    className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
                                    placeholder="Email"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="text-sm font-medium text-gray-900">
                                    {user.username}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Mail className="text-gray-500 w-3 h-3 mr-1" />
                                    {user.email}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.userType || ""}
                        onChange={(e) => onInputChange("userType", e.target.value)}
                        className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="artist">Artist</option>
                        <option value="venue">Venue</option>
                        <option value="admin">Admin</option>
                        <option value="journalist">Journalist</option>
                    </select>
                ) : (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUserTypeColor(
                            user.userType
                        )}`}
                    >
                        {getUserTypeIcon(user.userType)}
                        <span className="ml-1 capitalize">{user.userType}</span>
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <select
                        value={formData.isVerified?.toString() || "false"}
                        onChange={(e) => onInputChange("isVerified", e.target.value === "true")}
                        className="text-gray-500 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="true">Verified</option>
                        <option value="false">Pending</option>
                    </select>
                ) : user.isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                    {new Date(user.createdAt).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onSave(user._id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {saveLoading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ) : (
                                    <Save className="w-3 h-3 mr-1" />
                                )}
                                {saveLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            {user.userType !== "admin" && (
                                <button
                                    onClick={() => onPromote(user)}
                                    className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium cursor-pointer"
                                    title="Promote to Admin"
                                >
                                    <Crown className="w-3 h-3 mr-1" />
                                    Promote
                                </button>
                            )}
                            {!user.isVerified && (
                                <button
                                    onClick={() => onVerify(user._id)}
                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verify
                                </button>
                            )}
                            <button
                                onClick={() => onView(user)}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium cursor-pointer"
                            >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                            </button>
                            <div className="relative">
                                <button
                                    ref={buttonRef}
                                    onClick={handleToggleMenu}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === user._id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                    >
                                        <button
                                            onClick={handleMenuAction(() => onEdit(user))}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit User
                                        </button>
                                        {user.userType !== "admin" && (
                                            <button
                                                onClick={handleMenuAction(() => onPromote(user))}
                                                className="flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 w-full text-left cursor-pointer"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Promote to Admin
                                            </button>
                                        )}
                                        <button
                                            onClick={handleMenuAction(() => onDelete(user))}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete User
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};


export default UserRow;