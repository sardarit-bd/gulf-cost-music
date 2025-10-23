"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [role, setRole] = useState("Artist");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign Up</h2>

        <form className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400"
          />

          {/* Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white placeholder:text-gray-400"
          >
            <option className="text-gray-400">Artist</option>
            <option className="text-gray-400">Venue</option>
            <option className="text-gray-400">Journalist</option>
            <option className="text-gray-400">Fan</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

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
