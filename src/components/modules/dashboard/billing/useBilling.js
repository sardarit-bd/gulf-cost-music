"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const getToken = () => {
    if (typeof document === "undefined") return null;
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
};

export const useBilling = (API_BASE) => {
    const [billingData, setBillingData] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = getToken();

    /* =========================
       FETCH BILLING STATUS
    ========================= */
    const fetchBilling = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/api/subscription/status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch billing status");
            }

            setBillingData(data.data);
        } catch (err) {
            console.error("Billing fetch error:", err);
            toast.error(err.message || "Failed to load billing info");
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       UPGRADE (STRIPE CHECKOUT)
    ========================= */
    const upgrade = async () => {
        try {
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
        } catch (err) {
            console.error("Upgrade error:", err);
            toast.error(err.message || "Unable to start checkout");
        }
    };

    /* =========================
       STRIPE CUSTOMER PORTAL
    ========================= */
    const openPortal = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/api/subscription/portal`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.message || "Failed to open billing portal");
            }

            window.location.href = data.url;
        } catch (err) {
            console.error("Portal error:", err);
            toast.error(err.message || "Unable to open billing portal");
        }
    };

    /* =========================
       CANCEL SUBSCRIPTION
    ========================= */
    const cancel = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/api/subscription/cancel`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Cancel failed");
            }

            toast.success("Subscription will cancel at period end");
            fetchBilling();
        } catch (err) {
            console.error("Cancel error:", err);
            toast.error(err.message || "Failed to cancel subscription");
        }
    };

    /* =========================
       RESUME SUBSCRIPTION
    ========================= */
    const resume = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/api/subscription/resume`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Resume failed");
            }

            toast.success("Subscription resumed");
            fetchBilling();
        } catch (err) {
            console.error("Resume error:", err);
            toast.error(err.message || "Failed to resume subscription");
        }
    };

    return {
        billingData,
        loading,
        fetchBilling,
        upgrade,
        openPortal,
        cancel,
        resume,
    };
};
