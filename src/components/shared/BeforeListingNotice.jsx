"use client";

import { ArrowRight, CheckCircle, Info } from "lucide-react";

export default function BeforeListingNotice({
    steps = [],
    onButtonClick,
    isConnected = false,
    isReady = false,
}) {
    return (
        <div className="mt-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-gray-900 font-bold text-xl">
                        Before listing an item
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Complete these steps to start selling on our marketplace
                    </p>
                </div>
            </div>

            <div className="space-y-3 ml-14">
                {/* Step 1: Stripe Connection */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isConnected ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 border-2 border-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">1</span>
                            </div>
                        )}
                        <div>
                            <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-gray-800'}`}>
                                Connect Stripe account for payouts
                            </span>
                            {!isConnected && (
                                <p className="text-gray-500 text-sm mt-0.5">
                                    Required to receive payments securely
                                </p>
                            )}
                        </div>
                    </div>

                    {!isConnected && (
                        <button
                            onClick={onButtonClick}
                            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                            Connect Stripe
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="border-l-2 border-dotted border-gray-300 h-6 ml-4"></div>

                {/* Step 2: Artist Verification */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">
                            Get verified as an artist
                        </span>
                        <p className="text-gray-500 text-sm mt-0.5">
                            Verify your artist profile for trust
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-l-2 border-dotted border-gray-300 h-6 ml-4"></div>

                {/* Step 3: Create Listing */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">
                            Create your first listing
                        </span>
                        <p className="text-gray-500 text-sm mt-0.5">
                            Add photos, description, and pricing
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {isConnected && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50/90 to-emerald-50/90 border border-green-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-green-800">Stripe Connected Successfully!</span>
                                <span className="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                    Verified
                                </span>
                            </div>
                            <p className="text-green-700/90 text-sm mt-1.5">
                                Your Stripe account is connected and ready to receive payments.
                                You can now create listings and start selling.
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700">Secure payments</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700">Instant payouts</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700">Buyer protection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Setup Progress</span>
                    <span className="font-medium">
                        {isConnected ? "33%" : "0%"} Complete
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isConnected
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-1/3'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 w-0'}`}
                    ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>Step 1 of 3</span>
                    <span>{isConnected ? "✓ Connected" : "Pending"}</span>
                </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 font-medium">💡 Tip:</span>
                    Complete all steps to unlock full marketplace features and maximize your sales potential.
                </p>
            </div>
        </div>
    );
}