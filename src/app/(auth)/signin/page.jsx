"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign IN</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <Link href="/forget" className="text-sm text-gray-600 hover:text-yellow-500">
            Forget Password
          </Link>
        </div>

        <p className="text-sm text-gray-700 mt-4">
          Did not have an account?{" "}
          <Link href="/signup" className="text-yellow-500 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
