"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const dropdownData = {
    artists: {
      title: "Artists",
      items: [
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
    venues: {
      title: "Venues",
      items: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
    news: {
      title: "News",
      items: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
  };

  const handleDropdownEnter = (dropdown) => setActiveDropdown(dropdown);
  const handleDropdownLeave = () => setActiveDropdown(null);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // navbar background
  const isHeroPage = pathname === "/";
  const navbarBg = isHeroPage
    ? isScrolled
      ? "bg-black/80 backdrop-blur-md shadow-md"
      : "bg-transparent"
    : "bg-black";

  return (
    <header
      className={`fixed top-0 w-full border-b border-border z-50 transition-all duration-500 ${navbarBg}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Gulf Coast Music Logo"
              width={80}
              height={50}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-white">
            <Link href="/" className="hover:text-yellow-400 transition">
              Home
            </Link>

            {Object.keys(dropdownData).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1 hover:text-yellow-400 transition py-2">
                  {dropdownData[key].title}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeDropdown === key ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {activeDropdown === key && (
                  <div className="absolute top-full left-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    {dropdownData[key].items.map((item, index) => {
                      // ✅ Single declaration with combined logic
                      const href =
                        key === "artists"
                          ? `/artists/${encodeURIComponent(item)}`
                          : key === "venues"
                            ? `/venues/${encodeURIComponent(item)}`
                            : "#";

                      return (
                        <Link
                          key={index}
                          href={href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-600 transition"
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4 text-white">
            <Link
              href="/profile"
              className="hover:text-yellow-400 transition duration-200 font-medium"
            >
              Profile
            </Link>
            <Link
              href="/signin"
              className="hover:text-yellow-400 transition duration-200 font-medium"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-all duration-200 font-medium hover:scale-105 hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
