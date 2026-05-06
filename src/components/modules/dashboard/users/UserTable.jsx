"use client";
import CustomLoader from "@/components/shared/loader/Loader";
import {
    Building2,
    FileText,
    Music,
    Search,
    Shield,
    User as UserIcon,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserPagination from "./UserPagination";
import UserRow from "./UserRow";

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
    totalUsers,
    onSearch,
    searchValue
}) => {
    const [localSearch, setLocalSearch] = useState(searchValue || "");
    const tableRef = useRef(null);

    // Global click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside the table completely
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                if (actionMenu !== null) {
                    onActionMenuToggle(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionMenu, onActionMenuToggle]);

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

    const handleSearch = () => {
        if (onSearch) {
            onSearch(localSearch);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setLocalSearch("");
        if (onSearch) {
            onSearch("");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen py-20 bg-white">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <div ref={tableRef} className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
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

                {/* Search UI */}
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <Search className="w-3.5 h-3.5" />
                        Search
                    </button>

                    {localSearch && (
                        <button
                            onClick={handleClearSearch}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear
                        </button>
                    )}
                </div>

                {/* Active search term display */}
                {searchValue && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Searching for:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            <Search className="w-3 h-3" />
                            {searchValue}
                        </span>
                    </div>
                )}
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
                <UserPagination
                    page={page}
                    pages={pages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};



export default UserTable;