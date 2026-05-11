"use client";

import { useState, useEffect, useRef } from "react";
import { Crown, DollarSign, Eye, MoreVertical, Power, Trash2, Edit, Mail, MapPin, Camera } from "lucide-react";
import { togglePhotographerStatus, deletePhotographer } from "./photographer.api";
import toast from "react-hot-toast";

const PhotographerRow = ({ photographer, onRefresh, onView, onDelete, onPlan }) => {
    const [actionMenu, setActionMenu] = useState(null);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [updating, setUpdating] = useState(false);

    const currentPlan = photographer.user?.subscriptionPlan || "free";
    const isActive = photographer.isActive;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleActive = async () => {
        try {
            setUpdating(true);
            await togglePhotographerStatus(photographer._id, !isActive);
            toast.success(`Photographer ${!isActive ? 'activated' : 'deactivated'} successfully`);
            onRefresh();
        } catch (error) {
            toast.error(error.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${photographer.name}?`)) {
            try {
                await deletePhotographer(photographer._id);
                toast.success("Photographer deleted successfully");
                onRefresh();
            } catch (error) {
                toast.error(error.message || "Failed to delete photographer");
            }
        }
    };

    const handleToggleMenu = (e) => {
        e.stopPropagation();
        setActionMenu(actionMenu === photographer._id ? null : photographer._id);
    };

    const PlanBadge = ({ plan }) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${plan === "pro"
            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}>
            {plan === "pro" ? (
                <><Crown className="w-3 h-3" /> Pro</>
            ) : (
                <><DollarSign className="w-3 h-3" /> Free</>
            )}
        </span>
    );

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {photographer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                            {photographer.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Camera className="w-3 h-3" />
                            {photographer.specialization || "General"}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {photographer.user?.email}
                    </div>
                    {photographer.city && (
                        <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {photographer.city}
                        </div>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                {isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Inactive
                    </span>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <PlanBadge plan={currentPlan} />
                    <button
                        onClick={() => onPlan(photographer)}
                        className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        Change
                    </button>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-1">
                    <button
                        onClick={() => onView(photographer)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                        title="View Profile"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={handleToggleActive}
                        disabled={updating}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isActive
                            ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                            }`}
                        title={isActive ? "Deactivate" : "Activate"}
                    >
                        <Power className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={handleToggleMenu}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {actionMenu === photographer._id && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
                            >
                                <button
                                    onClick={() => {
                                        onView(photographer);
                                        setActionMenu(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                </button>

                                <button
                                    onClick={() => {
                                        onPlan(photographer);
                                        setActionMenu(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                >
                                    {currentPlan === "pro" ? (
                                        <><DollarSign className="w-4 h-4 mr-2" /> Downgrade to Free</>
                                    ) : (
                                        <><Crown className="w-4 h-4 mr-2" /> Upgrade to Pro</>
                                    )}
                                </button>

                                <div className="border-t border-gray-100 my-1"></div>

                                <button
                                    onClick={() => {
                                        handleDelete();
                                        setActionMenu(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Photographer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default PhotographerRow;