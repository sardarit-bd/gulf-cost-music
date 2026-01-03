"use client";

import { AlertCircle, CheckCircle, CreditCard, Crown, Loader, RefreshCcw, XCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getToken = () =>
    document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export default function BillingTab() {
    const [loading, setLoading] = useState(true);
    const [billing, setBilling] = useState(null);
    const [user, setUser] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    /* ===============================
       Fetch user and billing status
    =============================== */
    const fetchUserAndBilling = async () => {
        try {
            const token = getToken();
            if (!token) {
                toast.error("Please login first");
                return;
            }

            // Fetch user profile
            const userRes = await fetch(`${API_BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userData = await userRes.json();
            if (userRes.ok) {
                setUser(userData.data);
            }

            // Fetch billing status
            const billingRes = await fetch(`${API_BASE}/api/subscription/status`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const billingData = await billingRes.json();
            if (billingRes.ok) {
                setBilling(billingData.data);
            } else {
                console.error("Billing status error:", billingData.message);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load billing info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAndBilling();
    }, []);

    /* ===============================
       Upgrade to Pro
    =============================== */
    const handleUpgradeToPro = async () => {
        try {
            setCheckoutLoading(true);
            const token = getToken();

            if (!token) {
                toast.error("Please login first");
                return;
            }

            // Check if already on Pro
            if (billing?.plan === "pro" && billing?.status === "active") {
                toast.error("You are already on Pro plan");
                return;
            }

            const res = await fetch(`${API_BASE}/api/subscription/checkout/pro`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Checkout failed");
            }

            if (data.success && data.url) {
                // Open Stripe checkout in new window
                const checkoutWindow = window.open(
                    data.url,
                    "stripe_checkout",
                    "width=500,height=700,scrollbars=yes"
                );

                if (!checkoutWindow || checkoutWindow.closed) {
                    toast.error("Popup blocked! Please allow popups for this site.");
                    return;
                }

                // Check for payment completion
                const checkInterval = setInterval(() => {
                    if (checkoutWindow.closed) {
                        clearInterval(checkInterval);
                        toast.success("Payment completed! Refreshing...");
                        setTimeout(() => {
                            fetchUserAndBilling();
                            window.location.reload();
                        }, 2000);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Upgrade error:", error);
            toast.error(error.message || "Failed to create checkout");
        } finally {
            setCheckoutLoading(false);
        }
    };

    /* ===============================
       Manage Billing Portal
    =============================== */
    const openBillingPortal = async () => {
        try {
            setActionLoading(true);
            const token = getToken();

            const res = await fetch(`${API_BASE}/api/subscription/portal`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Unable to open billing portal");

            // Open Stripe customer portal
            window.open(data.url, "_blank");
        } catch (error) {
            console.error("Portal error:", error);
            toast.error(error.message || "Failed to open billing portal");
        } finally {
            setActionLoading(false);
        }
    };

    /* ===============================
       Cancel Subscription
    =============================== */
    const cancelSubscription = async () => {
        if (!confirm("Your subscription will remain active until the end of the current billing period. Continue?")) {
            return;
        }

        try {
            setActionLoading(true);
            const token = getToken();

            const res = await fetch(`${API_BASE}/api/subscription/cancel`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Cancel failed");

            toast.success("Subscription cancelled. It will end at the current period.");
            fetchUserAndBilling();
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error(error.message || "Failed to cancel subscription");
        } finally {
            setActionLoading(false);
        }
    };

    /* ===============================
       Resume Subscription
    =============================== */
    const resumeSubscription = async () => {
        try {
            setActionLoading(true);
            const token = getToken();

            const res = await fetch(`${API_BASE}/api/subscription/resume`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Resume failed");

            toast.success("Subscription resumed!");
            fetchUserAndBilling();
        } catch (error) {
            console.error("Resume error:", error);
            toast.error(error.message || "Failed to resume subscription");
        } finally {
            setActionLoading(false);
        }
    };

    /* ===============================
       Loading State
    =============================== */
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading billing information...</p>
                </div>
            </div>
        );
    }

    if (!billing && !user) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Unable to Load Billing</h3>
                <p className="text-gray-400 mb-6">Please try refreshing the page or contact support.</p>
                <button
                    onClick={fetchUserAndBilling}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    const {
        plan = "free",
        status = "none",
        currentPeriodEnd,
        cancelAtPeriodEnd = false,
        trialEndsAt,
    } = billing || {};

    const isPro = plan === "pro";
    const isActive = status === "active";
    const isTrialing = status === "trialing";
    const isCanceled = cancelAtPeriodEnd;
    const hasStripeSubscription = billing?.currentPeriodEnd !== null;

    /* ===============================
       Plan Features
    =============================== */
    const planFeatures = {
        free: [
            "Basic profile listing",
            "Limited photo uploads (0)",
            "No audio uploads",
            "No marketplace access",
            "Standard support"
        ],
        pro: [
            "Unlimited photo uploads (5)",
            "Audio uploads (5 tracks)",
            "Marketplace access",
            "Biography section",
            "Priority support",
            "Verified badge",
            "Analytics dashboard"
        ]
    };

    const userType = user?.userType || "artist";
    const subscriptionRules = {
        artist: { photos: 5, mp3: 5, biography: true, marketplace: true },
        venue: { photos: 10, events: 5, marketplace: true },
        photographer: { photos: 20, portfolio: true, marketplace: true }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Subscription & Billing</h1>
                        <p className="text-gray-400">
                            Manage your subscription plan, billing information, and payment methods
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isPro
                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-gray-800 text-gray-300 border border-gray-700"
                            }`}>
                            {isPro ? "Pro Plan" : "Free Plan"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Plan Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Current Plan Card */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                                    <Crown className={isPro ? "text-yellow-500" : "text-gray-500"} />
                                    {isPro ? "Pro Plan" : "Free Plan"}
                                </h2>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === "active" ? "bg-green-500/20 text-green-500" :
                                        status === "trialing" ? "bg-blue-500/20 text-blue-500" :
                                            status === "canceled" ? "bg-red-500/20 text-red-500" :
                                                "bg-gray-500/20 text-gray-400"
                                        }`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                    {isPro && (
                                        <span className="text-2xl font-bold text-white">
                                            $10<span className="text-gray-400 text-lg">/month</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            {!isPro && (
                                <button
                                    onClick={handleUpgradeToPro}
                                    disabled={checkoutLoading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 
                           hover:from-yellow-600 hover:to-orange-600 
                           text-black font-semibold px-5 py-2.5 rounded-xl 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300"
                                >
                                    {checkoutLoading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            Upgrade to Pro
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Plan Features */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Plan Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {planFeatures[plan].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current Usage */}
                        {isPro && subscriptionRules[userType] && (
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">Your Current Limits</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(subscriptionRules[userType]).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <p className="text-2xl font-bold text-white">{value}</p>
                                            <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Billing Information */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                            <CreditCard className="w-5 h-5" />
                            Billing Information
                        </h3>

                        <div className="space-y-6">
                            {/* Status Timeline */}
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                                {trialEndsAt && (
                                    <div className="relative mb-6">
                                        <div className="absolute -left-9 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900"></div>
                                        <div>
                                            <p className="text-sm text-gray-400">Trial Period</p>
                                            <p className="text-white font-medium">
                                                Ends on {new Date(trialEndsAt).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            {new Date(trialEndsAt) > new Date() && (
                                                <p className="text-sm text-blue-400 mt-1">
                                                    {Math.ceil((new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {currentPeriodEnd && (
                                    <div className="relative mb-6">
                                        <div className="absolute -left-9 top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900"></div>
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                {isCanceled ? "Subscription Ends" : "Next Billing Date"}
                                            </p>
                                            <p className="text-white font-medium">
                                                {new Date(currentPeriodEnd).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            {!isCanceled && new Date(currentPeriodEnd) > new Date() && (
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Renews automatically
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-800">
                                <button
                                    onClick={openBillingPortal}
                                    disabled={actionLoading || !hasStripeSubscription}
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-white px-5 py-2.5 rounded-xl font-medium transition"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {actionLoading ? "Loading..." : "Manage Billing"}
                                </button>

                                {isPro && isActive && !isCanceled && (
                                    <button
                                        onClick={cancelSubscription}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-white px-5 py-2.5 rounded-xl font-medium transition"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {actionLoading ? "Processing..." : "Cancel Subscription"}
                                    </button>
                                )}

                                {isCanceled && (
                                    <button
                                        onClick={resumeSubscription}
                                        disabled={actionLoading}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-white px-5 py-2.5 rounded-xl font-medium transition"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        {actionLoading ? "Processing..." : "Resume Subscription"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Actions & Info */}
                <div className="space-y-6">
                    {/* Upgrade Card (for Free users) */}
                    {!isPro && (
                        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 
                          border border-yellow-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Unlock Pro Features</h4>
                                    <p className="text-yellow-400 font-semibold">$10/month</p>
                                </div>
                            </div>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-300">Marketplace access</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-300">Photo & audio uploads</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-300">Verified badge</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-300">Priority support</span>
                                </li>
                            </ul>
                            <button
                                onClick={handleUpgradeToPro}
                                disabled={checkoutLoading}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 
                         hover:from-yellow-600 hover:to-orange-600 
                         text-black font-semibold py-3 rounded-xl 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300"
                            >
                                {checkoutLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    "Upgrade Now"
                                )}
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-3">
                                Cancel anytime • 7-day trial available
                            </p>
                        </div>
                    )}

                    {/* Current Status Card */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <h4 className="text-sm font-semibold text-gray-300 mb-4">Subscription Status</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500">Plan</p>
                                <p className="text-lg font-bold text-white capitalize">{plan}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" :
                                        status === "trialing" ? "bg-blue-500" :
                                            status === "canceled" ? "bg-red-500" :
                                                "bg-gray-500"
                                        }`}></div>
                                    <p className="text-white capitalize">{status}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">User Type</p>
                                <p className="text-white capitalize">{userType}</p>
                            </div>
                        </div>
                    </div>

                    {/* Help & Support */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <h4 className="text-sm font-semibold text-white mb-4">Need Help?</h4>
                        <div className="space-y-3">
                            <a
                                href="mailto:support@gulfmusic.com"
                                className="block text-gray-400 hover:text-white text-sm transition"
                            >
                                ✉️ Contact Support
                            </a>
                            <a
                                href="/faq"
                                className="block text-gray-400 hover:text-white text-sm transition"
                            >
                                📚 FAQ & Documentation
                            </a>
                            <a
                                href="/terms"
                                className="block text-gray-400 hover:text-white text-sm transition"
                            >
                                📄 Terms of Service
                            </a>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    {isPro && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                </div>
                                <h4 className="text-sm font-semibold text-white">Pro Tip</h4>
                            </div>
                            <p className="text-sm text-gray-300">
                                Use all your Pro features! Upload photos, add audio tracks, and list items in the marketplace to get the most value from your subscription.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Warning Messages */}
            {isCanceled && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Subscription Ending</h4>
                            <p className="text-gray-300">
                                Your subscription is set to end on {new Date(currentPeriodEnd).toLocaleDateString()}.
                                You will lose access to Pro features after this date.
                                You can resume your subscription anytime before it ends.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isTrialing && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Trial Active</h4>
                            <p className="text-gray-300">
                                You're currently on a free trial. Your trial ends on {new Date(trialEndsAt).toLocaleDateString()}.
                                After the trial, you'll be charged $10/month unless you cancel.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}