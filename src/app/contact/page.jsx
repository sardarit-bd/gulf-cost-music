"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FiAlertCircle, FiMail, FiMessageSquare, FiSend, FiUser } from "react-icons/fi";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`, {
        email,
        subject,
        message,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Message sent successfully!");
        setEmail("");
        setSubject("");
        setMessage("");
        setFormSubmitted(true);

        // Reset form submitted state after 3 seconds
        setTimeout(() => setFormSubmitted(false), 3000);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Contact form submit error:", err);
      toast.error(
        err.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-amber-50"></div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative px-4 py-20 md:py-28">
        <Toaster />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="container mx-auto max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl mb-6 shadow-lg">
              <FiMail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          {/* Success Message */}
          {formSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl text-center shadow-md"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiSend className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Message Sent Successfully!</h3>
              </div>
              <p className="text-green-700">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </motion.div>
          )}

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiMail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl p-4 pl-12 outline-none transition-all duration-300 focus:ring-1.5 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-white placeholder:text-gray-400 text-gray-700 text-lg shadow-sm hover:shadow-md`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiMail className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <FiAlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiUser className="w-4 h-4" />
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="What is this regarding?"
                      className={`w-full border ${errors.subject ? 'border-red-300' : 'border-gray-200'} rounded-xl p-4 pl-12 outline-none transition-all duration-300 focus:ring-1.5 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-white placeholder:text-gray-400 text-gray-700 text-lg shadow-sm hover:shadow-md`}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={loading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiUser className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.subject && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <FiAlertCircle className="w-4 h-4" />
                      <span>{errors.subject}</span>
                    </div>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiMessageSquare className="w-4 h-4" />
                    Your Message
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Write your message here..."
                      rows="6"
                      className={`w-full border ${errors.message ? 'border-red-300' : 'border-gray-200'} rounded-xl p-4 pl-12 outline-none transition-all duration-300 focus:ring-1.5 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-white placeholder:text-gray-400 text-gray-700 text-lg resize-none shadow-sm hover:shadow-md`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={loading}
                    ></textarea>
                    <div className="absolute left-4 top-4 text-gray-400">
                      <FiMessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.message && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <FiAlertCircle className="w-4 h-4" />
                      <span>{errors.message}</span>
                    </div>
                  )}
                  <div className="text-right text-sm text-gray-500">
                    {message.length} characters
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full relative overflow-hidden ${loading
                    ? 'bg-gradient-to-r from-amber-300 to-yellow-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
                    } text-white font-bold py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </div>
                  )}

                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>

                {/* Note */}
                {/* <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    We typically respond within 24 hours. For urgent matters, please call us directly.
                  </p>
                </div> */}
              </form>
            </div>

            {/* Footer Decoration */}
            {/* <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-8 py-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiMail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email Support</p>
                    <p className="text-sm text-gray-600">support@example.com</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Your Company. All rights reserved.
                  </p>
                </div>
              </div>
            </div> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}