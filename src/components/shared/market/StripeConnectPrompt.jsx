"use client";

import { AlertCircle, ArrowRight, Crown, DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

export default function StripeConnectPrompt({ userType = "studio" }) {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/stripe/connect/onboard');
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Stripe connect error:', error);
            toast.error(error.data?.message || 'Failed to connect Stripe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            Connect Stripe to Start Selling
                            {userType && (
                                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                                    {userType}
                                </span>
                            )}
                        </h3>
                        <p className="text-gray-600">
                            Your listing is saved as draft. Connect Stripe to activate it and start receiving payments.
                        </p>
                        <div className="flex flex-col gap-2 mt-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span>Listing will be visible to buyers only after Stripe connection</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <Crown className="w-4 h-4" />
                                <span>Pro accounts: 0% marketplace fees after connection</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition-all shadow-md whitespace-nowrap disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                        </>
                    ) : (
                        <>
                            Connect Stripe Now
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}