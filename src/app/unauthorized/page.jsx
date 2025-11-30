"use client";
export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="text-center max-w-md mx-auto">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    Access Denied
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    You don't have permission to access this page.
                    This area is restricted to authorized users only.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition duration-200"
                    >
                        Go Back
                    </button>
                    <a
                        href="/"
                        className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-600 transition duration-200 text-center"
                    >
                        Go Home
                    </a>
                </div>

                {/* Additional Help */}
                <p className="text-sm text-gray-500 mt-6">
                    If you believe this is an error, please contact support.
                </p>
            </div>
        </div>
    );
}