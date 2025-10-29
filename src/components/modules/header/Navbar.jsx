"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const tabletDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!token);

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close tablet dropdowns
      if (
        tabletDropdownRef.current &&
        !tabletDropdownRef.current.contains(event.target)
      ) {
        setMobileDropdown(null);
      }

      // Close mobile menu when clicking outside
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !mobileToggleRef.current?.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/signin");
  };

  const getDashboardLink = () => {
    if (!user) return "/signin";

    switch (user.role) {
      case "artist":
        return "/dashboard/artist";
      case "venue":
        return "/dashboard/venue";
      case "journalist":
        return "/dashboard/journalist";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";

    const role = user.role?.charAt(0).toUpperCase() + user.role?.slice(1);
    return `${role} Dashboard`;
  };

  const dropdownData = {
    artists: {
      title: "Artists",
      icon: "",
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
      icon: "",
      items: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
    news: {
      title: "News",
      icon: "",
      items: ["New Orleans", "Biloxi", "Mobile", "Pensacola"],
    },
  };

  const handleDropdownEnter = (dropdown) => setActiveDropdown(dropdown);
  const handleDropdownLeave = () => setActiveDropdown(null);

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdown(mobileDropdown === dropdown ? null : dropdown);
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setMobileDropdown(null);
    setActiveDropdown(null);
  };

  // Close mobile menu completely with animation
  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setMobileDropdown(null);
    }, 300);
  };

  const openMobileMenu = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  // Prevent event propagation for mobile menu content
  const handleMobileMenuContentClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroPage = pathname === "/";
  const navbarBg = isHeroPage
    ? isScrolled
      ? "bg-black/95 backdrop-blur-md shadow-lg"
      : "bg-transparent"
    : "bg-black/95 backdrop-blur-md";

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 w-full border-b border-gray-700 z-50 transition-all duration-500 ${navbarBg}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 z-60 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Image
              src="/images/logo.png"
              alt="Gulf Coast Music Logo"
              width={80}
              height={50}
              className="w-16 sm:w-20 transition-all duration-300"
              priority
            />
          </Link>

          {/* Desktop Nav - Show from lg breakpoint */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-white">
            <Link
              href="/"
              className="relative group px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300 font-medium text-sm xl:text-base"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </Link>

            {Object.keys(dropdownData).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300 font-medium text-sm xl:text-base group">
                  <span>{dropdownData[key].icon}</span>
                  <span>{dropdownData[key].title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === key ? "rotate-180" : "rotate-0"
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
                  <div className="absolute top-full left-0 w-64 bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 py-4 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="text-yellow-400 font-semibold text-sm">
                        {dropdownData[key].title}
                      </h3>
                    </div>
                    <div className="py-2">
                      {dropdownData[key].items.map((item, index) => {
                        const href =
                          key === "artists"
                            ? `/artists/${encodeURIComponent(item)}`
                            : key === "venues"
                            ? `/venues/${encodeURIComponent(item)}`
                            : `/news/${encodeURIComponent(item)}`;

                        return (
                          <Link
                            key={index}
                            href={href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 transition-all duration-300 group/item"
                            onClick={closeAllDropdowns}
                          >
                            <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            <span className="flex-1">{item}</span>
                            <svg
                              className="w-4 h-4 opacity-0 transform -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Tablet Nav - Show from md to lg breakpoint */}
          <nav
            className="hidden md:flex lg:hidden items-center gap-2 text-white"
            ref={tabletDropdownRef}
          >
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 text-sm font-medium"
              onClick={closeAllDropdowns}
            >
              Home
            </Link>

            {/* Simplified dropdowns for tablet */}
            {Object.keys(dropdownData).map((key) => (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleMobileDropdown(key)}
                  className="flex items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 text-sm font-medium"
                >
                  <span>{dropdownData[key].title}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${
                      mobileDropdown === key ? "rotate-180" : "rotate-0"
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

                {mobileDropdown === key && (
                  <div className="absolute top-full left-0 w-48 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 py-3 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-gray-700">
                      <h3 className="text-yellow-400 font-semibold text-xs">
                        {dropdownData[key].title}
                      </h3>
                    </div>
                    {dropdownData[key].items.map((item, index) => {
                      const href =
                        key === "artists"
                          ? `/artists/${encodeURIComponent(item)}`
                          : key === "venues"
                          ? `/venues/${encodeURIComponent(item)}`
                          : `/news/${encodeURIComponent(item)}`;

                      return (
                        <Link
                          key={index}
                          href={href}
                          className="block px-3 py-2 text-sm text-gray-200 hover:text-yellow-400 hover:bg-white/5 transition-all duration-300"
                          onClick={closeAllDropdowns}
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

          {/* Auth Buttons & Dashboard */}
          <div className="hidden md:flex items-center gap-3 text-white">
            {isLoggedIn ? (
              <>
                {/* Dashboard Button */}
                <Link
                  href={getDashboardLink()}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2.5 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium text-sm flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-yellow-500/25 hover:scale-105 active:scale-95"
                  onClick={closeAllDropdowns}
                >
                  <svg
                    className="w-4 h-4 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg transition-transform duration-300 group-hover:scale-110">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:inline text-sm max-w-24 truncate font-medium">
                      {user?.username || "User"}
                    </span>
                    <svg
                      className="w-4 h-4 hidden lg:block transition-transform duration-300 group-hover:rotate-180"
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

                  {/* Profile Dropdown Menu */}
                  <div className="absolute top-full right-0 w-56 bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-yellow-500/10 to-transparent">
                      <p className="text-sm font-bold text-white truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-yellow-400 font-medium capitalize mt-1">
                        {user?.role}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 transition-all duration-300 group/item"
                      onClick={closeAllDropdowns}
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover/item:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        closeAllDropdowns();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-200 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group/item text-left"
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover/item:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 font-medium text-sm border border-gray-600 hover:border-yellow-400 hover:text-yellow-400"
                  onClick={closeAllDropdowns}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-5 py-2.5 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium text-sm whitespace-nowrap shadow-lg hover:shadow-yellow-500/25 hover:scale-105 active:scale-95"
                  onClick={closeAllDropdowns}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileToggleRef}
            className="md:hidden text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95"
            onClick={() => (isOpen ? closeMobileMenu() : openMobileMenu())}
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "rotate-45 top-3" : "top-1"
                }`}
              ></span>
              <span
                className={`absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "opacity-0" : "top-3 opacity-100"
                }`}
              ></span>
              <span
                className={`absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "-rotate-45 top-3" : "top-5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {(isOpen || isClosing) && (
          <>
            {/* Backdrop with animation */}
            <div
              className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
                isClosing
                  ? "bg-black/0 backdrop-blur-0"
                  : "bg-black/60 backdrop-blur-sm"
              }`}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Content */}
            <div
              ref={mobileMenuRef}
              className={`lg:hidden fixed top-24 left-0 right-0 bottom-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex flex-col overflow-y-auto transition-transform duration-300 ${
                isClosing ? "translate-x-full" : "translate-x-0"
              }`}
              onClick={handleMobileMenuContentClick}
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-black to-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                      <>
                        <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-white font-bold text-xl">
                            {user?.username}
                          </p>
                          <p className="text-yellow-400 text-sm capitalize font-medium">
                            {user?.role}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        👤
                      </div>
                    )}
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col p-6 space-y-2">
                {/* Main Links */}
                <Link
                  href="/"
                  className="flex items-center gap-4 text-white hover:text-yellow-400 transition-all duration-300 py-5 px-6 rounded-2xl hover:bg-white/5 font-semibold text-xl active:scale-95 border border-transparent hover:border-yellow-400/30"
                  onClick={closeMobileMenu}
                >
                  <span className="text-2xl">🏠</span>
                  <span>Home</span>
                </Link>

                {/* Dropdowns for Mobile */}
                {Object.keys(dropdownData).map((key) => (
                  <div key={key} className="w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileDropdown(key);
                      }}
                      className="flex items-center justify-between w-full text-white hover:text-yellow-400 transition-all duration-300 py-5 px-6 rounded-2xl hover:bg-white/5 font-semibold text-xl active:scale-95 border border-transparent hover:border-yellow-400/30"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">
                          {dropdownData[key].icon}
                        </span>
                        <span>{dropdownData[key].title}</span>
                      </div>
                      <svg
                        className={`w-6 h-6 transition-transform duration-300 ${
                          mobileDropdown === key ? "rotate-180" : "rotate-0"
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

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        mobileDropdown === key ? "max-h-96" : "max-h-0"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="ml-6 pl-6 border-l-2 border-yellow-400 py-4 space-y-3">
                        {dropdownData[key].items.map((item, index) => {
                          const href =
                            key === "artists"
                              ? `/artists/${encodeURIComponent(item)}`
                              : key === "venues"
                              ? `/venues/${encodeURIComponent(item)}`
                              : `/news/${encodeURIComponent(item)}`;

                          return (
                            <Link
                              key={index}
                              href={href}
                              className="block text-gray-300 hover:text-yellow-400 transition-all duration-300 py-4 px-6 rounded-xl hover:bg-white/5 text-lg font-medium active:scale-95 transform hover:translate-x-2 border border-transparent hover:border-yellow-400/20"
                              onClick={closeMobileMenu}
                            >
                              {item}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="pt-8 mt-6 border-t border-gray-700/50">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-5 rounded-2xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold justify-center w-full mb-4 text-xl shadow-lg active:scale-95"
                        onClick={closeMobileMenu}
                      >
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        {getDashboardLabel()}
                      </Link>

                      <button
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                        className="flex items-center gap-4 w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5 rounded-2xl hover:from-red-500 hover:to-red-600 transition-all duration-300 font-bold justify-center text-xl shadow-lg active:scale-95"
                      >
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="block w-full text-white px-6 py-5 rounded-2xl hover:bg-white/5 transition-all duration-300 font-bold text-center mb-4 text-xl border-2 border-gray-600 hover:border-yellow-400 active:scale-95"
                        onClick={closeMobileMenu}
                      >
                        🔐 Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-5 rounded-2xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold text-center text-xl shadow-lg active:scale-95"
                        onClick={closeMobileMenu}
                      >
                        🚀 Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Smooth scrolling for mobile */
        @media (max-width: 1023px) {
          html {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </header>
  );
}
