// components/shared/StripeConnectedView.jsx
"use client";

import { AlertCircle, CheckCircle, DollarSign, ExternalLink, Loader2, RefreshCw, Shield } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StripeConnectedView({
    stripeStatus,
    onConnect,
    onRefresh,
    userType = "artist",
    className = "",
}) {
    const [loading, setLoading] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);

    const {
        isConnected = false,
        isReady = false,
        stripeAccountId = null,
        chargesEnabled = false,
        payoutsEnabled = false,
        detailsSubmitted = false,
    } = stripeStatus || {};

    const getStatusColor = () => {
        if (isReady && chargesEnabled && payoutsEnabled) return "green";
        if (isConnected) return "yellow";
        return "gray";
    };

    const getStatusMessage = () => {
        if (!isConnected) return "Not Connected";
        if (isReady && chargesEnabled && payoutsEnabled) return "Active";
        if (detailsSubmitted) return "Pending Approval";
        return "Setup Incomplete";
    };

    const getStatusIcon = () => {
        const color = getStatusColor();
        if (color === "green") return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (color === "yellow") return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        return <Shield className="w-5 h-5 text-gray-400" />;
    };

    const handleConnect = async () => {
        try {
            setLoading(true);
            await onConnect();
        } catch (error) {
            console.error("Stripe connect error:", error);
            toast.error("Failed to connect Stripe account");
        } finally {
            setLoading(false);
        }
    };

    const handleDashboard = async () => {
        if (!stripeAccountId) {
            toast.error("No Stripe account connected");
            return;
        }

        try {
            setDashboardLoading(true);

            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/dashboard`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.success && data.url) {
                window.open(data.url, "_blank");
            } else {
                if (data.requiresOnboarding) {
                    // Onboarding incomplete - redirect to complete
                    window.location.href = data.url;
                } else {
                    toast.error(data.message || "Failed to access dashboard");
                }
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error("Failed to access Stripe dashboard");
        } finally {
            setDashboardLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshLoading(true);
            await onRefresh();
            toast.success("Stripe status updated");
        } catch (error) {
            console.error("Refresh error:", error);
            toast.error("Failed to refresh status");
        } finally {
            setRefreshLoading(false);
        }
    };

    // User type specific messages
    const getUserTypeMessage = () => {
        switch (userType) {
            case "artist":
                return "Connect Stripe to sell music, merchandise, and receive payments for your art";
            case "venue":
                return "Connect Stripe to sell tickets, accept bookings, and manage event payments";
            case "photographer":
                return "Connect Stripe to sell photos, services, and receive client payments";
            default:
                return "Connect Stripe to start selling and receiving payments securely";
        }
    };

    // ========== NOT CONNECTED STATE ==========
    if (!isConnected) {
        return (
            <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 ${className}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Connect Stripe Account
                            </h3>
                            <p className="text-gray-600 max-w-2xl">
                                {getUserTypeMessage()}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Secure payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <ExternalLink className="w-5 h-5" />
                                Connect with Stripe
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // ========== CONNECTED STATE ==========
    return (
        <div className={`bg-green-50 border border-green-200 rounded-2xl p-6 ${className}`}>
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-green-100 rounded-xl">
                        {getStatusIcon()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Stripe Account Connected
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor() === "green"
                                ? "bg-green-200 text-green-800"
                                : getStatusColor() === "yellow"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-gray-200 text-gray-800"
                                }`}>
                                {getStatusMessage()}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-4">
                            {isReady && chargesEnabled && payoutsEnabled
                                ? "Your Stripe account is fully active. You can now receive payments and manage transactions."
                                : "Your Stripe account is connected but requires additional setup to start receiving payments."}
                        </p>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${chargesEnabled ? "bg-green-500" : "bg-yellow-500"
                                    }`} />
                                <span className="text-sm text-gray-600">Charges:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {chargesEnabled ? "Enabled" : "Pending"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${payoutsEnabled ? "bg-green-500" : "bg-yellow-500"
                                    }`} />
                                <span className="text-sm text-gray-600">Payouts:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {payoutsEnabled ? "Enabled" : "Pending"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${detailsSubmitted ? "bg-green-500" : "bg-yellow-500"
                                    }`} />
                                <span className="text-sm text-gray-600">Details:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {detailsSubmitted ? "Submitted" : "Incomplete"}
                                </span>
                            </div>

                            {stripeAccountId && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-mono text-gray-500">
                                        ID: {stripeAccountId.slice(-8)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshLoading}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
                        title="Refresh status"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>

                    <button
                        onClick={handleDashboard}
                        disabled={dashboardLoading || !stripeAccountId}
                        className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition shadow-sm disabled:opacity-50"
                    >
                        {dashboardLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ExternalLink className="w-4 h-4" />
                        )}
                        Dashboard
                    </button>
                </div>
            </div>

            {/* Help Text for Incomplete Setup */}
            {!isReady && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-yellow-800 font-medium">
                                Additional information required
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Please complete your Stripe onboarding to start receiving payments.
                                Click the Dashboard button to continue where you left off.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}