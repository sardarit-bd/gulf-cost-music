// app/dashboard/venues/billing/page.js
"use client";

import { CreditCard, Crown, Loader2, RefreshCw, Shield, Users, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

export default function BillingPage() {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    const [billingData, setBillingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [resuming, setResuming] = useState(false);

    useEffect(() => {
        loadBillingData();
    }, []);

    const loadBillingData = async () => {
        try {
            setLoading(true);
            const token = getCookie("token");

            const res = await fetch(`${API_BASE}/api/venues/subscription/status`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setBillingData(data.data);
            } else {
                console.warn("Billing data not available:", data.message);
                setBillingData({
                    plan: "free",
                    status: "none",
                    currentPeriodEnd: null,
                    cancelAtPeriodEnd: false,
                    trialEndsAt: null,
                });
            }
        } catch (err) {
            console.error("Billing load error:", err);
            setBillingData({
                plan: "free",
                status: "none",
                currentPeriodEnd: null,
                cancelAtPeriodEnd: false,
                trialEndsAt: null,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProCheckout = async () => {
        try {
            setUpgrading(true);
            const token = getCookie("token");
            if (!token) {
                alert("You must be logged in to upgrade.");
                return;
            }

            const res = await fetch(
                `${API_BASE}/api/subscription/checkout/pro`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.message || "Checkout failed");
            }

            window.location.href = data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Unable to start checkout. Please try again.");
        } finally {
            setUpgrading(false);
        }
    };

    const handleOpenPortal = async () => {
        try {
            const token = getCookie("token");
            const res = await fetch(`${API_BASE}/api/subscription/portal`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (data?.url) {
                window.open(data.url, "_blank");
            } else {
                toast.error("Unable to open billing portal");
            }
        } catch (error) {
            console.error("Portal error:", error);
            toast.error("Error opening billing portal");
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm("Are you sure you want to cancel your subscription? You'll lose access to Pro features at the end of your billing period.")) {
            return;
        }

        try {
            setCancelling(true);
            const token = getCookie("token");
            await fetch(`${API_BASE}/api/subscription/cancel`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Subscription cancelled successfully");
            loadBillingData();
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error("Error cancelling subscription");
        } finally {
            setCancelling(false);
        }
    };

    const handleResumeSubscription = async () => {
        try {
            setResuming(true);
            const token = getCookie("token");
            await fetch(`${API_BASE}/api/subscription/resume`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Subscription resumed successfully");
            loadBillingData();
        } catch (error) {
            console.error("Resume error:", error);
            toast.error("Error resuming subscription");
        } finally {
            setResuming(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading billing information...</p>
                </div>
            </div>
        );
    }

    const isPro = billingData?.plan === "pro";
    const isActive = billingData?.status === "active";
    const isCancelled = billingData?.cancelAtPeriodEnd;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-16">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/venues"
                            className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
                            <p className="text-gray-400">Manage your subscription and payment methods</p>
                        </div>
                    </div>
                    <button
                        onClick={loadBillingData}
                        className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Current Plan Card */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Current Plan</h2>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isPro
                                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                        : "bg-gray-700 text-gray-300 border border-gray-600"
                                        }`}
                                >
                                    {isPro ? (
                                        <>
                                            <Crown size={16} />
                                            Pro Plan
                                        </>
                                    ) : (
                                        <>
                                            <Users size={16} />
                                            Free Plan
                                        </>
                                    )}
                                </div>
                                {isPro && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isActive
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                        }`}>
                                        {isActive ? "Active" : "Inactive"}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-white">
                                {isPro ? "$10" : "$0"}
                                <span className="text-gray-400 text-lg">/month</span>
                            </p>
                            <p className="text-gray-400 text-sm">
                                {isPro ? "Billed monthly" : "Free forever"}
                            </p>
                        </div>
                    </div>

                    {/* Plan Status */}
                    {isPro && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                    <p className="text-sm text-gray-400 mb-1">Billing Period</p>
                                    <p className="text-white font-medium">
                                        {billingData.currentPeriodEnd
                                            ? `Renews on ${formatDate(billingData.currentPeriodEnd)}`
                                            : "—"}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                    <p className="text-sm text-gray-400 mb-1">Subscription Status</p>
                                    <p className="text-white font-medium">
                                        {isCancelled ? "Cancelling at period end" : "Active"}
                                    </p>
                                </div>
                            </div>

                            {isCancelled && (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="text-yellow-400" size={20} />
                                        <div>
                                            <h4 className="text-yellow-400 font-semibold">Subscription Cancelled</h4>
                                            <p className="text-yellow-300/80 text-sm">
                                                Your subscription will end on {formatDate(billingData.currentPeriodEnd)}.
                                                You can resume it anytime before then.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Plan Comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Free Plan */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gray-700 rounded-lg">
                                <Users className="text-gray-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Free Plan</h3>
                                <p className="text-gray-400">$0/month</p>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={18} />
                                <span className="text-gray-300">1 show per month</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={18} />
                                <span className="text-gray-300">Basic venue profile</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <XCircle className="text-gray-500" size={18} />
                                <span className="text-gray-400">No marketplace access</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <XCircle className="text-gray-500" size={18} />
                                <span className="text-gray-400">Limited photo uploads</span>
                            </li>
                        </ul>
                        {!isPro && (
                            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                <p className="text-sm text-gray-300 mb-2">Current Plan</p>
                                <button
                                    onClick={handleProCheckout}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold transition"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                <Crown className="text-yellow-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Pro Plan</h3>
                                <p className="text-yellow-400">$10/month</p>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-yellow-400" size={18} />
                                <span className="text-gray-300">Unlimited shows</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-yellow-400" size={18} />
                                <span className="text-gray-300">Full venue profile</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-yellow-400" size={18} />
                                <span className="text-gray-300">Marketplace access</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-yellow-400" size={18} />
                                <span className="text-gray-300">10+ photo uploads</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="text-yellow-400" size={18} />
                                <span className="text-gray-300">Priority support</span>
                            </li>
                        </ul>
                        {isPro ? (
                            <div className="space-y-3">
                                {!isCancelled ? (
                                    <button
                                        onClick={handleCancelSubscription}
                                        disabled={cancelling}
                                        className="w-full bg-red-500/20 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition disabled:opacity-50"
                                    >
                                        {cancelling ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={16} className="animate-spin" />
                                                Cancelling...
                                            </span>
                                        ) : (
                                            "Cancel Subscription"
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleResumeSubscription}
                                        disabled={resuming}
                                        className="w-full bg-green-500/20 text-green-500 py-2 rounded-lg font-semibold hover:bg-green-500/30 transition disabled:opacity-50"
                                    >
                                        {resuming ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={16} className="animate-spin" />
                                                Resuming...
                                            </span>
                                        ) : (
                                            "Resume Subscription"
                                        )}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleProCheckout}
                                disabled={upgrading}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                            >
                                {upgrading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    "Upgrade to Pro"
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Billing Management */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CreditCard size={24} />
                        Billing Management
                    </h3>

                    <div className="space-y-4">
                        {isPro ? (
                            <>
                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">Billing Portal</h4>
                                            <p className="text-gray-400 text-sm">
                                                Update payment method, view invoices, and manage subscription
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleOpenPortal}
                                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                                        >
                                            Open Portal
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                    <h4 className="text-white font-semibold mb-2">Payment Method</h4>
                                    <p className="text-gray-400 text-sm">
                                        Manage your payment methods and billing information through the Stripe portal.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <Shield className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                <h4 className="text-white font-semibold mb-2">Billing Management</h4>
                                <p className="text-gray-400 mb-4">
                                    Upgrade to Pro to access billing management features
                                </p>
                                <button
                                    onClick={handleProCheckout}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/dashboard/venues"
                        className="flex-1 min-w-[200px] bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl border border-gray-700 text-center transition"
                    >
                        Back to Dashboard
                    </Link>
                    <Link
                        href="/dashboard/venues/overview"
                        className="flex-1 min-w-[200px] bg-gray-900 hover:bg-gray-800 text-gray-300 px-6 py-3 rounded-xl border border-gray-700 text-center transition"
                    >
                        View Overview
                    </Link>
                </div>
            </div>
        </div>
    );
}