"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Artist",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          userType: formData.userType.toLowerCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Registration successful!");
        // Optional: redirect to login after few seconds
        setTimeout(() => {
          router.push("/signin");
        }, 1000);

        setFormData({
          username: "",
          email: "",
          password: "",
          userType: "Artist",
        });
      } else {
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error! Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign Up
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            name="username"
            placeholder="Name"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 text-gray-400"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 text-gray-400"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 text-gray-400"
          />

          {/* Dropdown */}
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white placeholder:text-gray-400"
          >
            <option>Artist</option>
            <option>Venue</option>
            <option>Journalist</option>
            <option>Fan</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-green-500">{message}</p>
        )}

        {/* Bottom Link */}
        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an Account?{" "}
          <Link href="/signin" className="text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
