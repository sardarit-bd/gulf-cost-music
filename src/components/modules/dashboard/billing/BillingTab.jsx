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


  const artistFeatures = {
    free: [
      "Basic profile",
      "No photo uploads",
      ...(userType === "artist" ? ["No audio uploads"] : []),
      "No marketplace access",
      "Standard support",
    ],
    pro: [
      "5 photo uploads",
      ...(userType === "artist" ? ["5 audio tracks"] : []),
      "Marketplace listing",
      ...(userType === "photographer" ? ["1 video tracks"] : []),
      ...(userType === "venue" ? ["Unlimited shows and events"] : []),
      "Add Biography",
    ],
  };


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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Billing & Subscription
            </h1>
            <p className="text-gray-400">
              Manage your subscription, view invoices, and update payment
              methods
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${isPro
                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-gray-800 text-gray-300 border border-gray-700"
                }`}
            >
              {isPro ? "Pro Plan" : "Free   Plan"}
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
                  <Crown
                    className={isPro ? "text-yellow-500" : "text-gray-500"}
                  />
                  {isPro ? "Pro Plan" : "Free Plan"}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${status === "active"
                      ? "bg-green-500/20 text-green-500"
                      : status === "trialing"
                        ? "bg-blue-500/20 text-blue-500"
                        : status === "canceled"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                  >
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
                  onClick={onUpgrade}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 
             hover:from-yellow-500 hover:to-yellow-700 
             text-black px-5 py-2.5 rounded-xl font-semibold 
             shadow-md hover:shadow-lg transition-all"
                >
                  <Crown size={16} />
                  Upgrade to Pro · $10/month
                </button>
              )}
            </div>

            {/* Plan Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Plan Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {artistFeatures[plan].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Dates */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Billing Information
              </h3>
              <div className="space-y-2">
                {trialEndsAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Trial Ends</span>
                    <span className="text-white font-medium">
                      {new Date(trialEndsAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentPeriodEnd && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      {isCanceled ? "Subscription Ends" : "Next Billing Date"}
                    </span>
                    <span
                      className={`font-medium ${isCanceled ? "text-red-400" : "text-white"
                        }`}
                    >
                      {new Date(currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-800">
              {isPro && (
                <button
                  onClick={onOpenPortal}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 
                           text-white px-5 py-2.5 rounded-xl font-medium transition"
                >
                  <CreditCard className="w-4 h-4" />
                  Manage Billing
                </button>
              )}

              {isPro && isActive && !isCanceled && (
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 
                           text-white px-5 py-2.5 rounded-xl font-medium transition"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Subscription
                </button>
              )}

              {isCanceled && (
                <button
                  onClick={onResume}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                           text-white px-5 py-2.5 rounded-xl font-medium transition"
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
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 
                          border border-yellow-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Go Pro Today</h4>
                  <p className="text-yellow-400 font-semibold">$10/month</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">5 photo uploads</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">5 audio tracks</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">Marketplace access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">30-day free trial</span>
                </li>
              </ul>
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 
                         hover:from-yellow-600 hover:to-orange-600 
                         text-black font-semibold py-3 rounded-xl 
                         transition-all duration-300"
              >
                Upgrade Now
              </button>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-4">
              Subscription Status
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <p className="text-lg font-bold text-white capitalize">
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
                          : "bg-gray-500"
                      }`}
                  ></div>
                  <p className="text-white capitalize">{status}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">User Type</p>
                <p className="text-white capitalize">
                  {user?.userType || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          {isPro && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-sm font-semibold text-white">Pro Tip</h4>
              </div>
              <p className="text-sm text-gray-300">
                Maximize your Pro benefits by uploading high-quality photos and
                audio tracks. Complete profiles get more visibility!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
