"use client";

import { CheckCircle, DollarSign, ExternalLink } from "lucide-react";

export default function StripeConnectedView({
  stripeStatus,
  onDashboardClick,
}) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Stripe Account Connected ✓
              </h3>
              <p className="text-gray-700">
                Your Stripe account is active and ready to receive payments.
              </p>
            </div>
            <button
              onClick={onDashboardClick}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Stripe Dashboard
            </button>
          </div>

          {/* Status Details */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Charges:</span>
              <span className="font-medium text-gray-900">
                {stripeStatus?.chargesEnabled ? "Enabled" : "Pending"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Payouts:</span>
              <span className="font-medium text-gray-900">
                {stripeStatus?.payoutsEnabled ? "Enabled" : "Pending"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Account ID:</span>
              <span className="font-mono text-xs text-gray-500">
                {stripeStatus?.stripeAccountId?.slice(-8) || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
