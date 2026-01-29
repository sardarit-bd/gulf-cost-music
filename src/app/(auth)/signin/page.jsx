// app/signin/page.jsx
"use client";

import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";



// Custom Input Component
const CustomInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  disabled = false,
  icon,
  error = ""
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          disabled={disabled}
          className={`text-gray-700 w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${icon ? "pl-10" : ""
            } ${error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-yellow-500"
            }`}
        />
      </div>

      {error && (
        <div className="mt-1 flex items-center gap-1 text-red-500 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};


export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      // SUCCESS
      if (res.ok && data.success) {
        toast.success(data.message || "Login successful!", {
          id: toastId,
          duration: 2000,
        });

        // Store token and user data in cookies
        const user = data.data.user;
        const token = data.data.token;

        const cookieSettings =
          "path=/; max-age=86400; SameSite=Lax" +
          (process.env.NODE_ENV === "production" ? "; Secure" : "");

        document.cookie = `token=${token}; ${cookieSettings}`;
        document.cookie = `role=${user.userType}; ${cookieSettings}`;
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(user)
        )}; ${cookieSettings}`;

        // Store in localStorage for immediate access
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on user type
        setTimeout(() => {
          const redirectMap = {
            admin: "/dashboard/admin",
            artist: "/dashboard/artist",
            venue: "/dashboard/venue",
            journalist: "/dashboard/journalist",
            photographer: "/dashboard/photographer",
            fan: "/",
          };

          const redirectTo = redirectMap[user.userType] || "/";
          router.push(redirectTo);
        }, 1000);

        return;
      }

      // Handle errors
      let newFieldErrors = { email: "", password: "" };

      // Case 1: details.details array (your backend format)
      if (
        data.errors?.details?.details &&
        Array.isArray(data.errors.details.details)
      ) {
        data.errors.details.details.forEach((err) => {
          const field = err.field?.toLowerCase();
          const message = err.message;
          if (field === "email") newFieldErrors.email = message;
          if (field === "password") newFieldErrors.password = message;
        });
      }
      // Case 2: simple details array
      else if (data.errors?.details && Array.isArray(data.errors.details)) {
        data.errors.details.forEach((err) => {
          const field = err.field?.toLowerCase();
          const message = err.message;
          if (field === "email") newFieldErrors.email = message;
          if (field === "password") newFieldErrors.password = message;
        });
      }
      // Case 3: simple errors array
      else if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((err) => {
          const field = err.field?.toLowerCase();
          const message = err.message;
          if (field === "email") newFieldErrors.email = message;
          if (field === "password") newFieldErrors.password = message;
        });
      }

      toast.dismiss(toastId);
      setFieldErrors(newFieldErrors);

      // Show toast error
      if (newFieldErrors.email && newFieldErrors.password) {
        toast.error("Please check your email and password");
      } else if (newFieldErrors.email) {
        toast.error(newFieldErrors.email);
      } else if (newFieldErrors.password) {
        toast.error(newFieldErrors.password);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error! Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-yellow-50 mt-20 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <Toaster />

        <div className="max-w-6xl mx-auto flex justify-center mt-16">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-gray-600 mt-1">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email *
                  </label>
                  <CustomInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    icon={<Mail className="h-4 w-4" />}
                    error={fieldErrors.email}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Password *
                  </label>
                  <CustomInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    disabled={loading}
                    icon={<Lock className="h-4 w-4" />}
                    error={fieldErrors.password}
                  />
                  <div className="text-right mt-2">
                    <Link
                      href="/forgot"
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-yellow-600 hover:text-yellow-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}