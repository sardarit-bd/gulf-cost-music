"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Artist",
    genre: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const userTypeOptions = {
    Artist: {
      label: "Genre",
      options: [
        "Rap",
        "Country",
        "Pop",
        "Rock",
        "Jazz",
        "Reggae",
        "EDM",
        "Classical",
        "Other",
      ],
    },
    Venue: {
      label: "Location",
      options: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
    Journalist: {
      label: "Location",
      options: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
    Fan: {
      label: "Preferred Location",
      options: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "userType" && {
        genre: "",
        location: "",
      }),
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating your account...");

    try {
      const userTypeLower = formData.userType.toLowerCase();

      const submissionData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: userTypeLower,
      };

      if (userTypeLower === "artist") {
        submissionData.genre = formData.genre;
      } else if (userTypeLower === "venue" || userTypeLower === "journalist") {
        submissionData.location = formData.location;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const data = await res.json();

      // SUCCESS
      if (res.ok && data.success) {
        toast.success(data.message || "Registration successful!", {
          id: toastId,
        });

        setTimeout(() => {
          router.push("/signin");
        }, 1200);

        setFormData({
          username: "",
          email: "",
          password: "",
          userType: "Artist",
          genre: "",
          location: "",
        });
      }

      // VALIDATION ERROR (field-wise)
      else if (data.errors && Array.isArray(data.errors)) {
        toast.dismiss(toastId);
        data.errors.forEach((err) => {
          toast.error(`${err.field ? `${err.field}: ` : ""}${err.message}`);
        });
      }

      // GENERIC ERROR
      else {
        toast.error(data.message || "Something went wrong!", { id: toastId });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error! Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const currentUserType = userTypeOptions[formData.userType];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
        <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign Up
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 text-gray-600"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 text-gray-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-400 text-gray-600"
          />

          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          >
            <option>Artist</option>
            <option>Venue</option>
            <option>Journalist</option>
            <option>Fan</option>
          </select>

          {formData.userType !== "Fan" && currentUserType && (
            <select
              name={formData.userType === "Artist" ? "genre" : "location"}
              value={
                formData.userType === "Artist"
                  ? formData.genre
                  : formData.location
              }
              onChange={handleChange}
              required
              className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">Select {currentUserType.label}</option>
              {currentUserType.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
