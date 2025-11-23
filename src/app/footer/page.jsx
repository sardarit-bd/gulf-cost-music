"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

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
      <footer className="bg-black text-white pt-16 pb-8 text-center">
        Loading footer...
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <img src={footer.logoUrl} alt="Gulf Coast Music" className="w-32 mb-4" />
        </div>

        {/* Get In Touch */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-gray-300">
            {footer.getInTouch?.map((item, index) => (
              <li key={index}>→ {item}</li>
            ))}
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-gray-300">
            {footer.usefulLinks?.map((item, index) => (
              <li key={index}>→ {item}</li>
            ))}
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <MdPhone className="text-yellow-400 text-xl" /> {footer.contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-yellow-400 text-xl" /> {footer.contact.email}
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4 text-xl">
            {footer.socialLinks.instagram && (
              <Link href={footer.socialLinks.instagram}>
                <FaInstagram className="text-2xl hover:text-yellow-400 cursor-pointer transition" />
              </Link>
            )}

            {footer.socialLinks.youtube && (
              <Link href={footer.socialLinks.youtube}>
                <FaYoutube className="text-2xl hover:text-yellow-400 cursor-pointer transition" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Divider*/}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        Copyright © {new Date().getFullYear()}{" "}
        <span className="text-yellow-400 font-semibold">Gulf Coast Music</span>.
        All Rights Reserved || Developed By{" "}
        <span className="text-yellow-400 font-semibold">Sardar IT Team</span>
      </div>

    </footer>
  );
}
