"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <img src="/images/logo.png" alt="Gulf Coast Music" className="w-32 mb-4" />
        </div>

        {/* Get In Touch */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-gray-300">
            <li>→ Campus Contact</li>
            <li>→ Meet With Us</li>
            <li>→ Report Copyright</li>
            <li>→ Report on Security Issues</li>
            <li>→ Privacy Statement</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>→ Campus Contact</li>
            <li>→ Meet With Us</li>
            <li>→ Report Copyright</li>
            <li>→ Report on Security Issues</li>
            <li>→ Privacy Statement</li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <MdPhone className="text-yellow-400" /> +880 1713 738679
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-yellow-400" /> thegulfcoastmusic@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <MdLocationOn className="text-yellow-400" /> Chandash, Mohadevpur, Naogaon
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4 text-xl">
            <FaFacebookF className="hover:text-yellow-400 cursor-pointer transition" />
            <FaTwitter className="hover:text-yellow-400 cursor-pointer transition" />
            <FaInstagram className="hover:text-yellow-400 cursor-pointer transition" />
            <FaYoutube className="hover:text-yellow-400 cursor-pointer transition" />
            <FaWhatsapp className="hover:text-yellow-400 cursor-pointer transition" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        Copyright © 2025 <span className="text-yellow-400 font-semibold">Gulf Coast Music</span>. 
        All Rights Reserved || Developed By{" "}
        <span className="text-yellow-400 font-semibold">Sardar IT Team</span>
      </div>
    </footer>
  );
}
