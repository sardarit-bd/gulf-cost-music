"use client";

import { Camera, DollarSign, ExternalLink, Shield, Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StripeConnectPrompt({
  onSuccess,
  user,
  userType = "photographer",
  onConnect
}) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await onConnect();
    } catch (error) {
      console.error("Connect error:", error);
      toast.error("Failed to connect Stripe");
    } finally {
      setLoading(false);
    }
  };

  // User type specific messages
  const getMessages = () => {
    switch (userType) {
      case "photographer":
        return {
          title: "Connect Stripe to Sell Your Photography",
          description: "Start selling your photos, packages, and services to clients",
          features: [
            "Accept payments for photo shoots",
            "Sell digital photo packages",
            "Receive tips and deposits",
            "Secure client payments"
          ]
        };
      case "artist":
        return {
          title: "Connect Stripe to Sell Your Music",
          description: "Start selling your music, merchandise, and tickets",
          features: [
            "Sell digital downloads",
            "Accept payments for merch",
            "Sell event tickets",
            "Receive royalties"
          ]
        };
      case "venue":
        return {
          title: "Connect Stripe for Event Payments",
          description: "Start selling tickets and accepting bookings",
          features: [
            "Sell event tickets",
            "Accept venue bookings",
            "Process deposits",
            "Manage payouts"
          ]
        };
      default:
        return {
          title: "Connect Stripe to Start Selling",
          description: "Start selling your products and services",
          features: [
            "Accept secure payments",
            "Fast payouts",
            "Simple setup",
            "Global reach"
          ]
        };
    }
  };

  const messages = getMessages();

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {messages.title}
            </h3>
            <p className="text-gray-600 max-w-2xl">
              {messages.description}
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {messages.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                Secure payments
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Zap className="w-3 h-3" />
                2.9% + $0.30 per transaction
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign className="w-3 h-3" />
                Fast payouts
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5" />
              Connect with Stripe
            </>
          )}
        </button>
      </div>
    </div>
  );
}