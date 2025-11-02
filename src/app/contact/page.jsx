"use client";

import React, { useState } from "react";
import axios from "axios";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`, {
        email,
        subject,
        message,
      });

      if (res.data.success) {
        setFeedback({ type: "success", msg: res.data.message });
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setFeedback({ type: "error", msg: res.data.message || "Something went wrong!" });
      }
    } catch (err) {
      console.error("Contact form submit error:", err);
      setFeedback({
        type: "error",
        msg: err.response?.data?.message || "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex items-center justify-center px-4 py-16"
      style={{
        background: "linear-gradient(to bottom, #f9f9f6 0%, #000000 100%)",
      }}
    >
      <div className="max-w-7xl w-full bg-[#fefdeb] rounded-md shadow-md p-8 md:p-10">
        <h2 className="text-center text-lg md:text-xl font-semibold text-black mb-6">
          For any inquiries:
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="text-gray-500 w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <input
              type="text"
              placeholder="Subject"
              className="text-gray-500 w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white placeholder:text-gray-400"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <textarea
              placeholder="Message"
              rows="5"
              className="text-gray-500 w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white resize-none placeholder:text-gray-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`p-3 rounded-md text-sm font-medium ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {feedback.msg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-yellow-300" : "bg-yellow-400 hover:bg-yellow-500"
            } text-black font-semibold py-3 rounded-md transition-all shadow-sm hover:shadow-md`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
