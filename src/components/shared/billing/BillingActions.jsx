"use client";

import SuccessModal from "@/ui/SuccessModal";
import { CreditCard, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const BillingActions = ({ subscription }) => {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const {
        plan = "free",
        status = "none",
        currentPeriodStart,
        currentPeriodEnd,
    } = subscription || {};

    const isPro = plan === "pro";
    const isActive = status === "active";

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleManageBilling = async () => {
        try {
            setLoading(true);
            setActionType("manage");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/portal`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();



            if (!response.ok) throw new Error(data.message);

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error(error.message || "Failed to open billing portal");
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleUpgrade = async () => {
        try {
            setLoading(true);
            setActionType("upgrade");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/checkout/pro`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            toast.success("Redirecting to Stripe checkout...");

            if (data.url) {
                window.location.href = data.url;
            }

        } catch (error) {
            toast.error(error.message || "Upgrade failed");
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };
    // Free Plan
    if (!isPro) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Actions
                </h3>

                <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                    {loading && actionType === "upgrade" ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Upgrade to Pro
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                    Upgrade to unlock 0% marketplace fees and premium features
                </p>
            </div>
        );
    }

    // Pro Plan
    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Manage Subscription
                </h3>

                {/* Subscription Info */}
                {/* <div className="mb-4 text-sm text-gray-600 space-y-1">
                    <p>
                        <strong>Subscription Started:</strong>{" "}
                        {formatDate(currentPeriodStart)}
                    </p>

                    <p>
                        <strong>Next Billing Date:</strong>{" "}
                        {formatDate(currentPeriodEnd)}
                    </p>
                </div> */}

                <button
                    onClick={handleManageBilling}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {loading && actionType === "manage" ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <ExternalLink className="w-5 h-5" />
                            Open Billing Portal
                        </>
                    )}
                </button>

                {isActive && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-700">
                            Your Pro subscription is active. Manage your billing in the Stripe portal.
                        </p>
                    </div>
                )}
            </div>

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message="Your subscription was successfully updated."
            />
        </>
    );
};

export default BillingActions;