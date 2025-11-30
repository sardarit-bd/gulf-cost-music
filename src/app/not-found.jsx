"use client";

import { ArrowLeft, Camera, Home, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Animated Icon */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
                        <div className="absolute inset-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/10">
                            <Camera className="w-12 h-12 text-white" />
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h1 className="text-8xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Page Not Found
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        The creative shot you're looking for has already been developed.
                        Let's capture a new moment together.
                    </p>
                </div>

                {/* Action Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-2xl hover:from-yellow-400 hover:to-amber-400 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25"
                >
                    <Home className="w-5 h-5" />
                    Return to Gallery
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center gap-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-yellow-400/40 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}