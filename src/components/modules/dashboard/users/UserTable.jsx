"use client";
import {
    Building2,
    Calendar,
    CheckCircle,
    Crown,
    Edit,
    Eye,
    FileText,
    Mail,
    MoreVertical,
    Music,
    Save,
    Shield,
    Trash2,
    User as UserIcon,
    UserPlus,
    X
} from "lucide-react";

const UserTable = ({
    users,
    loading,
    page,
    pages,
    editingUser,
    formData,
    saveLoading,
    actionMenu,
    onPageChange,
    onView,
    onVerify,
    onEdit,
    onSave,
    onCancel,
    onInputChange,
    onPromote,
    onDelete,
    onActionMenuToggle,
    hasActiveFilters,
    totalUsers
}) => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Users ({totalUsers})
                    {hasActiveFilters && (
                        <span className="text-sm text-gray-500 ml-2">
                            (Filtered from {totalUsers} total users)
                        </span>
                    )}
                </h3>
                <div className="text-sm text-gray-500">
                    Page {page} of {pages}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    editingUser={editingUser}
                                    formData={formData}
                                    saveLoading={saveLoading}
                                    actionMenu={actionMenu}
                                    getUserTypeIcon={getUserTypeIcon}
                                    getUserTypeColor={getUserTypeColor}
                                    onView={onView}
                                    onVerify={onVerify}
                                    onEdit={onEdit}
                                    onSave={onSave}
                                    onCancel={onCancel}
                                    onInputChange={onInputChange}
                                    onPromote={onPromote}
                                    onDelete={onDelete}
                                    onActionMenuToggle={onActionMenuToggle}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-lg font-medium">No users found</p>
                                        <p className="text-sm mt-1">
                                            {hasActiveFilters
                                                ? "Try adjusting your search filters"
                                                : "No users in the system"}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <Pagination
                    page={page}
                    pages={pages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

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
                                    className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                                    title="Promote to Admin"
                                >
                                    <Crown className="w-3 h-3 mr-1" />
                                    Promote
                                </button>
                            )}
                            {!user.isVerified && (
                                <button
                                    onClick={() => onVerify(user._id)}
                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verify
                                </button>
                            )}
                            <button
                                onClick={() => onView(user)}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                            >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => onActionMenuToggle(user._id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {actionMenu === user._id && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit User
                                        </button>
                                        {user.userType !== "admin" && (
                                            <button
                                                onClick={() => onPromote(user)}
                                                className="flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 w-full text-left"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Promote to Admin
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
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

const Pagination = ({ page, pages, onPageChange }) => {
    return (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{pages}</span>
                </p>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="text-gray-500 px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${page === pageNumber
                                        ? "bg-blue-600 text-white"
                                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => onPageChange(Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className="text-gray-500 px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;