"use client";

import { AlertCircle, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StripePendingView({ stripeStatus, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefresh();
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh status");
    } finally {
      setRefreshing(false);
    }
  };

  const handleContinueOnboarding = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") ||
        document.cookie.match(/(?:^|;)\s*token=([^;]+)/)?.[1];

      if (!token) {
        toast.error("Please sign in again");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/onboard`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to continue onboarding");
      }
    } catch (error) {
      console.error("Continue onboarding error:", error);
      toast.error("Failed to continue onboarding");
    } finally {
      setLoading(false);
    }
  };

  const pendingRequirements = stripeStatus?.requirements?.currently_due || [];
  const hasPendingRequirements = pendingRequirements.length > 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Stripe Onboarding in Progress
            </h3>
            <p className="text-gray-600">
              Your Stripe account is connected but requires additional information to start receiving payments.
            </p>

            {hasPendingRequirements && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {pendingRequirements.length} requirement(s) pending
                    </p>
                    <ul className="mt-2 space-y-1">
                      {pendingRequirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="text-xs text-yellow-700 flex items-center gap-1">
                          <span className="w-1 h-1 bg-yellow-600 rounded-full"></span>
                          {req.replace(/_/g, " ")}
                        </li>
                      ))}
                      {pendingRequirements.length > 3 && (
                        <li className="text-xs text-yellow-700">
                          and {pendingRequirements.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-white border border-blue-300 text-blue-700 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Status
          </button>

          <button
            onClick={handleContinueOnboarding}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Complete Onboarding
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}