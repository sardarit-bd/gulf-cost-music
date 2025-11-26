"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  // Fetch footer data from backend
  const fetchFooter = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/footer`);
      const data = await res.json();

      if (data.success) {
        setFooter(data.data);
      }
    } catch (error) {
      console.error("Failed to load footer data:", error);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  if (!footer) {
    return (
      <footer className="bg-gray-900 text-white py-12 text-center">
        <div className="animate-pulse">Loading footer...</div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Logo Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <img
              src={footer.logoUrl}
              alt="Gulf Coast Music"
              className="w-40 h-auto mb-4"
            />
          </div>

          {/* Connect With Us */}
          <div className="text-center lg:text-right">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Connect With Us</h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center lg:justify-end gap-3 text-gray-300">
                <MdPhone className="text-yellow-400 text-lg flex-shrink-0" />
                <span className="text-white font-medium">{footer.contact.phone}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-3 text-gray-300">
                <MdEmail className="text-yellow-400 text-lg flex-shrink-0" />
                <span className="text-white font-medium">{footer.contact.email}</span>
              </div>
              {footer.contact.address && (
                <div className="flex items-center justify-center lg:justify-end gap-3 text-gray-300">
                  <MdLocationOn className="text-yellow-400 text-lg flex-shrink-0" />
                  <span className="text-white font-medium text-sm">{footer.contact.address}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-end gap-6 text-2xl">
              {footer.socialLinks.instagram && (
                <Link
                  href={footer.socialLinks.instagram}
                  className="hover:text-yellow-400 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </Link>
              )}

              {footer.socialLinks.youtube && (
                <Link
                  href={footer.socialLinks.youtube}
                  className="hover:text-yellow-400 transition-all duration-300 transform hover:scale-110"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 py-6 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">
              Copyright © {new Date().getFullYear()}{" "}
              <span className="text-yellow-400 font-semibold">Gulf Coast Music</span>.
              All Rights Reserved
            </div>
            <div className="text-center md:text-right">
              Developed By{" "}
              <span className="text-yellow-400 font-semibold">Sardar IT Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}