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
    genre: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage("");

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
        console.log("Adding genre:", formData.genre);
      } else if (userTypeLower === "venue" || userTypeLower === "journalist") {
        submissionData.location = formData.location;
        console.log("Adding location:", formData.location);
      }


      console.log("Final Submission Data:", submissionData);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Registration successful!");


        if (userTypeLower !== "fan") {
          await sendVerificationEmail(formData.email, formData.userType);
        }


        setTimeout(() => {
          router.push("/signin");
        }, 1000);

        setFormData({
          username: "",
          email: "",
          password: "",
          userType: "Artist",
          genre: "",
          location: "",
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

  // Send verification email
  const sendVerificationEmail = async (email, userType) => {
    const verificationMessages = {
      Artist:
        "Hello, please email thegulfcoastmusic@gmail.com to request verification as a Gulf Coast Artist.",
      Venue:
        "Hello, please email thegulfcoastmusic@gmail.com to request verification as a Gulf Coast Venue.",
      Journalist:
        "Hello, please email thegulfcoastmusic@gmail.com to request verification as a Gulf Coast Journalist.",
    };

    try {
      await fetch("http://localhost:5000/api/auth/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: verificationMessages[userType],
          userType: userType,
        }),
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  const currentUserType = userTypeOptions[formData.userType];

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

          {/* User Type Dropdown */}
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

          {/* Dynamic Field based on User Type */}
          {formData.userType !== "Fan" &&
            formData.userType &&
            currentUserType && (
              <select
                name={formData.userType === "Artist" ? "genre" : "location"}
                value={
                  formData.userType === "Artist"
                    ? formData.genre
                    : formData.location
                }
                onChange={handleChange}
                required
                className="w-full border text-gray-400 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white placeholder:text-gray-400"
              >
                <option value="">Select {currentUserType.label}</option>
                {currentUserType.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

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

        {/* Verification Info */}
        {formData.userType !== "Fan" && (
          <p className="text-center text-xs text-yellow-600 mt-2">
            Verification email will be sent to your email address
          </p>
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
