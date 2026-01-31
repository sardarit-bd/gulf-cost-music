"use client";

import { CheckCircle, Info } from "lucide-react";

export default function BeforeListingNotice({
    steps = [],
    onButtonClick,
    isConnected = false,
    isReady = false,
}) {
    return (
        <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                    <h3 className="text-white font-semibold text-lg">
                        Before listing an item
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Complete these steps to start selling
                    </p>
                </div>
            </div>

            <div className="space-y-3 ml-11">
                {/* Step 1: Stripe Connection */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                            <div className="w-5 h-5 rounded-full border border-yellow-500 flex items-center justify-center">
                                <span className="text-yellow-500 text-xs">1</span>
                            </div>
                        )}
                        <span className={`${isConnected ? 'text-green-400 line-through' : 'text-gray-300'}`}>
                            Connect Stripe account for payouts
                        </span>
                    </div>

                    {!isConnected && (
                        <button
                            onClick={onButtonClick}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium py-1.5 px-4 rounded-lg transition"
                        >
                            Connect Now
                        </button>
                    )}
                </div>

                {/* Step 2: Artist Verification */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-yellow-500 flex items-center justify-center">
                        <span className="text-yellow-500 text-xs">2</span>
                    </div>
                    <span className="text-gray-300">
                        Get verified as an artist
                    </span>
                </div>

                {/* Step 3: Create Listing */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-yellow-500 flex items-center justify-center">
                        <span className="text-yellow-500 text-xs">3</span>
                    </div>
                    <span className="text-gray-300">
                        Create your first listing
                    </span>
                </div>
            </div>

            {/* Success Message */}
            {isConnected && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Stripe Connected Successfully!</span>
                    </div>
                    <p className="text-green-400/80 text-sm mt-1 ml-7">
                        Your Stripe account is connected and ready to receive payments.
                    </p>
                </div>
            )}
        </div>
    );
}