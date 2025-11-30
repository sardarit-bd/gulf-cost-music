"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({ email: "", password: "" });

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

        const user = data.data.user;
        const token = data.data.token;

        // ------- SET COOKIES -------
        document.cookie = `token=${token}; path=/; max-age=86400`;
        document.cookie = `role=${user.userType}; path=/; max-age=86400`;
        document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`;
        // ----------------------------

        login({ ...user, token });

        const redirectMap = {
          admin: "/dashboard/admin",
          artist: "/dashboard/artist",
          venue: "/dashboard/venue",
          journalist: "/dashboard/journalist",
          fan: "/"
        };

        router.push(redirectMap[user.userType] || "/");
      }


      let newFieldErrors = { email: "", password: "" };

      // Case 1: Handle the double details structure
      if (data.errors?.details?.details && Array.isArray(data.errors.details.details)) {

        data.errors.details.details.forEach((err) => {
          const field = err.field?.toLowerCase();
          const message = err.message;

          if (field === 'email') {
            newFieldErrors.email = message;
          } else if (field === 'password') {
            newFieldErrors.password = message;
          }
        });
      }
      // Case 2: Handle single details structure
      else if (data.errors?.details && Array.isArray(data.errors.details)) {

        data.errors.details.forEach((err) => {
          const field = err.field?.toLowerCase();
          const message = err.message;

          if (field === 'email') {
            newFieldErrors.email = message;
          } else if (field === 'password') {
            newFieldErrors.password = message;
          }
        });
      }
      // Case 3: Handle simple errors array
      else if (data.errors && Array.isArray(data.errors)) {

        data.errors.forEach((err) => {
          const field = err.field?.toLowerCase();
          const message = err.message;

          if (field === 'email') {
            newFieldErrors.email = message;
          } else if (field === 'password') {
            newFieldErrors.password = message;
          }
        });
      }

      // Set field errors and show appropriate messages
      toast.dismiss(toastId);
      setFieldErrors(newFieldErrors);

      // Show specific toast messages
      if (newFieldErrors.email && newFieldErrors.password) {
        toast.error("Please check your email and password");
      } else if (newFieldErrors.email) {
        toast.error(newFieldErrors.email);
      } else if (newFieldErrors.password) {
        toast.error(newFieldErrors.password);
      } else {
        // Fallback to general message
        toast.error(data.message || "Something went wrong");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error! Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Clear field error when user starts typing
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'email') {
      setEmail(value);
      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
    } else {
      setPassword(value);
      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleInputChange('email')}
              required
              className={`w-full border ${fieldErrors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-yellow-400"
                } rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange('password')}
              required
              className={`w-full border ${fieldErrors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-yellow-400"
                } rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4">
          <Link
            href="/forget"
            className="text-sm text-gray-600 hover:text-yellow-500"
          >
            Forgot Password?
          </Link>
        </div>

        <p className="text-sm text-gray-700 mt-4">
          Don't have an account?{" "}
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