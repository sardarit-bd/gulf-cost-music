import { Ban, CheckCircle, Crown, Eye, Globe, Mail, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
    changePhotographerPlan,
    deletePhotographer,
    togglePhotographerStatus,
} from "./photographer.api";
import PlanChangeModal from "./PlanChangeModal";
import ViewProfileModal from "./ViewProfileModal";

export default function PhotographerRow({ photographer, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);

    const toggleStatus = async () => {
        try {
            setLoading(true);
            await togglePhotographerStatus(
                photographer._id,
                photographer.isActive
            );
            toast.success(`Photographer ${photographer.isActive ? 'deactivated' : 'activated'} successfully`);
            onRefresh();
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handlePlanChange = async (photographerId, newPlan, sendNotification = true) => {
        try {
            setLoading(true);
            await changePhotographerPlan(photographerId, newPlan, { sendNotification });
            toast.success(`Plan changed to ${newPlan.toUpperCase()} successfully`);
            onRefresh();
        } catch (err) {
            toast.error(err.message || "Failed to change plan");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deletePhotographer(photographer._id);
            toast.success("Photographer deleted successfully");
            onRefresh();
            setShowDeleteModal(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete photographer");
        } finally {
            setLoading(false);
        }
    };

    const viewProfile = () => {
        setShowViewModal(true);
    };

    const sendEmail = () => {
        window.location.href = `mailto:${photographer.user?.email}`;
    };

    const openPlanChangeModal = () => {
        setShowPlanModal(true);
    };

    return (
        <>
            <tr className="border-t border-gray-300 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                            {photographer.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                            <p
                                className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                onClick={viewProfile}
                            >
                                {photographer.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Globe size={12} />
                                <span className="capitalize">{photographer.city || 'N/A'}</span>
                                {photographer.isVerified && (
                                    <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </td>

                <td className="p-4">
                    <div className="space-y-1">
                        <p className="text-gray-900">{photographer.user?.email}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={12} />
                            <span>Joined: {new Date(photographer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </td>

                <td className="p-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${photographer.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {photographer.isActive ? (
                            <>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                Active
                            </>
                        ) : (
                            <>
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                Inactive
                            </>
                        )}
                    </span>
                </td>

                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${photographer.user?.subscriptionPlan === "pro" ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {photographer.user?.subscriptionPlan === "pro" ? "PRO" : "FREE"}
                        </span>
                        {photographer.user?.subscriptionPlan === "pro" && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                    </div>
                </td>

                <td className="p-4">
                    <div className="flex gap-1">
                        <button
                            onClick={viewProfile}
                            className="p-2 hover:bg-gray-100 rounded-lg transition group"
                            title="View Profile"
                            disabled={loading}
                        >
                            <Eye size={16} className="text-gray-600 group-hover:text-blue-600" />
                        </button>

                        <button
                            onClick={sendEmail}
                            className="p-2 hover:bg-gray-100 rounded-lg transition group"
                            title="Send Email"
                            disabled={loading}
                        >
                            <Mail size={16} className="text-gray-600 group-hover:text-blue-600" />
                        </button>

                        <button
                            onClick={toggleStatus}
                            className="p-2 hover:bg-gray-100 rounded-lg transition group"
                            title={photographer.isActive ? "Deactivate" : "Activate"}
                            disabled={loading}
                        >
                            {photographer.isActive ? (
                                <Ban size={16} className="text-red-500 group-hover:text-red-600" />
                            ) : (
                                <CheckCircle size={16} className="text-green-500 group-hover:text-green-600" />
                            )}
                        </button>

                        <button
                            onClick={openPlanChangeModal}
                            className="p-2 hover:bg-gray-100 rounded-lg transition group"
                            title="Change Plan"
                            disabled={loading}
                        >
                            <RefreshCw size={16} className="text-blue-500 group-hover:text-blue-600" />
                        </button>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 hover:bg-red-50 rounded-lg transition group"
                            title="Delete Photographer"
                            disabled={loading}
                        >
                            <Trash2 size={16} className="text-red-500 group-hover:text-red-600" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* View Profile Modal */}
            <ViewProfileModal
                photographer={photographer}
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                photographer={photographer}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />

            {/* Plan Change Modal */}
            <PlanChangeModal
                photographer={photographer}
                isOpen={showPlanModal}
                onClose={() => setShowPlanModal(false)}
                onPlanChange={handlePlanChange}
            />
        </>
    );
}