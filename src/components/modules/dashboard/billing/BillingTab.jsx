"use client";

import {
  CheckCircle,
  CreditCard,
  Crown,
  Loader,
  RefreshCcw,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";

export default function BillingTab({
  user,
  billingData,
  invoices = [],
  loading = false,
  onUpgrade,
  onOpenPortal,
  onCancel,
  onResume,
  onDownloadInvoice,
  onRefresh,
}) {
  const {
    plan = "free",
    status = "none",
    currentPeriodEnd,
    cancelAtPeriodEnd = false,
    trialEndsAt,
  } = billingData || {};

  const isPro = plan === "pro";
  const isActive = status === "active";
  const isTrialing = status === "trialing";
  const isCanceled = cancelAtPeriodEnd;
  const userType = user?.userType;

  // Features based on user type
  const getFeatures = () => {
    const baseFreeFeatures = [
      "Basic profile",
      "Standard support",
    ];

    const baseProFeatures = [
      "5 photo uploads",
      "Add Biography",
      "Priority support",
    ];

    // Add user-specific features
    if (userType === "artist") {
      return {
        free: [...baseFreeFeatures, "3 photo uploads", "1 audio track"],
        pro: [...baseProFeatures, "5 audio tracks", "Marketplace listing"],
      };
    }

    if (userType === "venue") {
      return {
        free: [...baseFreeFeatures, "Basic venue listing"],
        pro: [...baseProFeatures, "Unlimited shows and events", "Featured listing"],
      };
    }

    if (userType === "photographer") {
      return {
        free: [...baseFreeFeatures, "3 photo uploads"],
        pro: [...baseProFeatures, "Video uploads", "Portfolio showcase"],
      };
    }

    if (userType === "studio") {
      return {
        free: [...baseFreeFeatures, "Basic studio listing", "3 photo uploads"],
        pro: [...baseProFeatures, "5 photo uploads", "1 audio sample", "Services showcase", "Featured in directory"],
      };
    }

    // Default for other user types
    return {
      free: baseFreeFeatures,
      pro: baseProFeatures,
    };
  };

  const features = getFeatures();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Billing & Subscription
            </h1>
            <p className="text-gray-600">
              Manage your subscription, view invoices, and update payment methods
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${isPro
                ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border border-yellow-200"
                : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
            >
              {isPro ? "Pro Plan" : "Free Plan"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Plan Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Crown
                    className={isPro ? "text-yellow-600" : "text-gray-400"}
                  />
                  {isPro ? "Pro Plan" : "Free Plan"}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${status === "active"
                      ? "bg-green-100 text-green-700"
                      : status === "trialing"
                        ? "bg-blue-100 text-blue-700"
                        : status === "canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {isPro && (
                    <span className="text-2xl font-bold text-gray-900">
                      $10<span className="text-gray-500 text-lg">/month</span>
                    </span>
                  )}
                </div>
              </div>
              {!isPro && (
                <button
                  onClick={onUpgrade}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 
             hover:from-yellow-600 hover:to-orange-600 
             text-white px-5 py-2.5 rounded-xl font-semibold 
             shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Crown size={16} />
                  Upgrade to Pro · $10/month
                </button>
              )}
            </div>

            {/* Plan Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features[plan].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Dates */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Billing Information
              </h3>
              <div className="space-y-2">
                {trialEndsAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trial Ends</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(trialEndsAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentPeriodEnd && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {isCanceled ? "Subscription Ends" : "Next Billing Date"}
                    </span>
                    <span
                      className={`font-medium ${isCanceled ? "text-red-600" : "text-gray-900"
                        }`}
                    >
                      {new Date(currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              {isPro && (
                <button
                  onClick={onOpenPortal}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 
                           text-gray-800 px-5 py-2.5 rounded-xl font-medium transition-colors duration-200"
                >
                  <CreditCard className="w-4 h-4" />
                  Manage Billing
                </button>
              )}

              {isPro && isActive && !isCanceled && (
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 
                           text-red-600 px-5 py-2.5 rounded-xl font-medium transition-colors duration-200"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Subscription
                </button>
              )}

              {isCanceled && (
                <button
                  onClick={onResume}
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 
                           text-green-600 px-5 py-2.5 rounded-xl font-medium transition-colors duration-200"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Resume Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Upgrade Card */}
          {!isPro && (
            <div
              className="bg-gradient-to-br from-yellow-50 to-orange-50 
                          border border-yellow-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Go Pro Today</h4>
                  <p className="text-yellow-600 font-semibold">$10/month</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">5 photo uploads</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">5 audio tracks</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">Marketplace access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">30-day free trial</span>
                </li>
              </ul>
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 
                         hover:from-yellow-600 hover:to-orange-600 
                         text-white font-semibold py-3 rounded-xl 
                         transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Upgrade Now
              </button>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Subscription Status
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {plan}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${status === "active"
                      ? "bg-green-500"
                      : status === "trialing"
                        ? "bg-blue-500"
                        : status === "canceled"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                  ></div>
                  <p className="text-gray-900 capitalize">{status}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">User Type</p>
                <p className="text-gray-900 capitalize">
                  {user?.userType || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          {isPro && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Pro Tip</h4>
              </div>
              <p className="text-sm text-gray-700">
                Maximize your Pro benefits by uploading high-quality photos and
                audio tracks. Complete profiles get more visibility!
              </p>
            </div>
          )}

          {/* Studio Specific Tip */}
          {isPro && userType === "studio" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Studio Pro Tip</h4>
              </div>
              <p className="text-sm text-gray-700">
                Showcase your best work with high-quality photos and audio samples.
                Complete your services list to attract more clients!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}