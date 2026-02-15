"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset link sent to your email.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
              } text-black font-semibold py-2 rounded-md transition-all duration-200`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Success or Error Message */}
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

        {/* Back to Sign In */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Remember your password?{" "}
          <Link href="/signin" className="text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
