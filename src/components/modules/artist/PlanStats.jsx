"use client";

import { CreditCard, Crown, Image as ImageIcon, Music } from "lucide-react";

export default function PlanStats({
  subscriptionPlan,
  photosCount = 0,
  audiosCount = 0,
  listingsCount = 0,
  hasMarketplaceAccess = false,
  handleProCheckout,
}) {
  const planLimits = {
    free: { photos: 0, audios: 0 },
    pro: { photos: 5, audios: 5 },
  };

  const limits = planLimits[subscriptionPlan] || planLimits.free;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {/* Plan Status with Upgrade Button */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="h-full flex">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown
                  className={`w-5 h-5 ${
                    subscriptionPlan === "pro"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                />
                <span className="text-sm text-gray-400">Current Plan</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  subscriptionPlan === "pro"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {subscriptionPlan === "pro" ? "Pro" : "Free"}
              </span>
            </div>
            {/* <p className="text-2xl font-bold text-white capitalize">
              {subscriptionPlan}
            </p> */}

            {subscriptionPlan === "free" && (
              <div className="mt-auto">
                <button
                  onClick={handleProCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 
                     hover:from-yellow-500 hover:to-yellow-700 
                     text-black px-4 py-3 rounded-lg font-semibold 
                     text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Crown size={16} />
                  <div className="text-left">
                    <div className="font-bold">Upgrade to Pro - $10/month</div>
                  </div>
                </button>
                {/* <p className="text-xs text-gray-400 text-center mt-2">
                Get all Pro features
              </p> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Photos</p>
            <p className="text-xl font-bold text-white">
              {photosCount}{" "}
              <span className="text-gray-400 text-sm">/ {limits.photos}</span>
            </p>
          </div>
          <ImageIcon className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Audio */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Audio Tracks</p>
            <p className="text-xl font-bold text-white">
              {audiosCount}{" "}
              <span className="text-gray-400 text-sm">/ {limits.audios}</span>
            </p>
          </div>
          <Music className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      {/* Marketplace */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Marketplace</p>
            <p className="text-xl font-bold text-white">
              {listingsCount} <span className="text-gray-400 text-sm">/ 1</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard
              className={`w-5 h-5 ${
                hasMarketplaceAccess ? "text-green-500" : "text-gray-500"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
