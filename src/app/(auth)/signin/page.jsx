"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Signing you in...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      // SUCCESS
      if (res.ok && data.success) {
        toast.success(data.message || "Login successful!", { id: toastId });

        // Save token and user
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect after short delay
        setTimeout(() => router.push("/"), 1200);

        setEmail("");
        setPassword("");
      }

      // FIELD VALIDATION ERRORS
      else if (data.errors && Array.isArray(data.errors)) {
        toast.dismiss(toastId);
        data.errors.forEach((err) => {
          toast.error(`${err.field ? `${err.field}: ` : ""}${err.message}`);
        });
      }

      // INVALID CREDENTIALS / GENERIC
      else {
        toast.error(data.message || "Invalid email or password", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error! Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster/>
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4">
          <Link
            href="/forget"
            className="text-sm text-gray-600 hover:text-yellow-500"
          >
            Forgot Password?
          </Link>
        </div>

        <p className="text-sm text-gray-700 mt-4">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-yellow-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
