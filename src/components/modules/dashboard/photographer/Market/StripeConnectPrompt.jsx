"use client";

import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StripeConnectPrompt({ onSuccess, user }) {
  const [loading, setLoading] = useState(false);

  const handleStripeConnect = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/onboard`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        if (data.url) {
          // Redirect to Stripe onboarding
          window.location.href = data.url;
        } else if (
          data.message === "Already connected" ||
          data.data?.isStripeConnected
        ) {
          // Already connected
          toast.success("Your Stripe account is already connected!");
          if (onSuccess) onSuccess();
        }
      } else {
        toast.error(data.message || "Stripe connection failed");
      }
    } catch (err) {
      console.error("Stripe connect error:", err);
      toast.error("Failed to connect Stripe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is eligible
  const isEligible = [
    "artist",
    "venue",
    "photographer",
    "studio",
    "journalist",
    "fan",
  ].includes(String(user?.userType || "").toLowerCase());

  if (!isEligible) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Stripe Connect Not Available
            </h3>
            <p className="text-gray-700">
              Your account type is not eligible for Stripe Connect at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Stripe Account Required
          </h3>
          <p className="text-gray-700 mb-4">
            To receive payments for your listings, you need to connect your
            Stripe account. This is required for secure payment processing.
          </p>
          <button
            onClick={handleStripeConnect}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect Stripe Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Stripe is required to securely send your earnings to you.
          </p>
        </div>
      </div>
    </div>
  );
}
