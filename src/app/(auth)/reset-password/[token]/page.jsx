"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/reset-password/${token}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ password }),
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Password reset successful!");
                setTimeout(() => router.push("/signin"), 2000);
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (err) {
            console.error("Reset Password Error:", err);
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Reset Password
                </h2>

                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading
                                ? "bg-yellow-300 cursor-not-allowed"
                                : "bg-yellow-400 hover:bg-yellow-500"
                            } text-black font-semibold py-2 rounded-md transition-all duration-200`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <p className="text-green-600 text-sm mt-4 text-center font-medium">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center font-medium">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
