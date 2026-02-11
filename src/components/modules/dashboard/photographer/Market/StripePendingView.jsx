"use client";

import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StripePendingView({ stripeStatus, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
    toast.success("Stripe status updated!");
  };

  const handleContinueOnboarding = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/refresh?account_id=${stripeStatus?.stripeAccountId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Failed to continue onboarding");
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Stripe Onboarding in Progress
              </h3>
              <p className="text-gray-700">
                Your Stripe account is being set up. Please complete the
                onboarding process.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={handleContinueOnboarding}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Continue Onboarding
              </button>
            </div>
          </div>

          {/* Requirements */}
          {stripeStatus?.requirements?.currently_due?.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Additional information required:
                  </p>
                  <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                    {stripeStatus.requirements.currently_due
                      .slice(0, 3)
                      .map((req, i) => (
                        <li key={i}>{req.replace(/_/g, " ")}</li>
                      ))}
                    {stripeStatus.requirements.currently_due.length > 3 && (
                      <li>
                        and {stripeStatus.requirements.currently_due.length - 3}{" "}
                        more...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
