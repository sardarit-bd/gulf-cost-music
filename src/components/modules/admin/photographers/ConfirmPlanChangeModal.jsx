"use client";

import { ArrowRight, X } from "lucide-react";
import Portal from "./common/Portal";

export default function ConfirmPlanChangeModal({
    isOpen,
    onClose,
    onConfirm,
    photographer,
    newPlan
}) {
    if (!isOpen || !photographer) return null;

    const currentPlan = photographer.user?.subscriptionPlan || "free";
    const nextPlan = newPlan || currentPlan;

    const getPlanDisplayName = (plan) => {
        return plan.toUpperCase();
    };

    const currentDisplay = getPlanDisplayName(currentPlan);
    const nextDisplay = getPlanDisplayName(nextPlan);

    const handleConfirmClick = () => {
        onConfirm();
        onClose();
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-sm rounded-xl bg-white p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-700 text-lg font-bold">
                            Confirm Plan Change
                        </h2>
                        <button onClick={onClose}>
                            <X />
                        </button>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 mb-4">
                        Are you sure you want to change subscription plan for
                        <span className="font-semibold"> {photographer.name}</span>?
                    </p>

                    {/* Plan Change Info */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentPlan === 'pro' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {currentDisplay}
                        </span>

                        {currentPlan !== nextPlan && (
                            <>
                                <ArrowRight className="text-gray-400" size={18} />
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${nextPlan === 'pro' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {nextDisplay}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="text-gray-600 px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirmClick}
                            className={`px-4 py-2 rounded-lg text-white ${nextPlan === 'pro' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800 hover:bg-gray-900'}`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}