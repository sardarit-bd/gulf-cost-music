"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTabletDropdownOpen, setIsTabletDropdownOpen] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const tabletDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const desktopDropdownRefs = useRef({});

  // Get global auth state
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  // Logout handler
  const handleSignOut = () => {
    logout();
    router.push("/signin");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close tablet dropdown
      if (
        tabletDropdownRef.current &&
        !tabletDropdownRef.current.contains(event.target)
      ) {
        setIsTabletDropdownOpen(null);
      }

      // Close mobile menu
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !mobileToggleRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setMobileDropdown(null);
      }

      // Close desktop dropdowns
      if (activeDropdown) {
        const dropdownRef = desktopDropdownRefs.current[activeDropdown];
        if (dropdownRef && !dropdownRef.contains(event.target)) {
          setActiveDropdown(null);
        }
      }

      // Close profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, activeDropdown]);

  const getUserRole = () => {
    if (!user) return "user";
    return user.role || user.userType || "user";
  };

  // Main Dashboard link for different user roles
  const getDashboardLink = () => {
    if (!user) return "/signin";

    const userRole = getUserRole();

    switch (userRole) {
      case "artist":
        return "/dashboard/artist/";
      case "venue":
        return "/dashboard/venue";
      case "journalist":
        return "/dashboard/journalist";
      case "photographer":
        return "/dashboard/photographer";
      case "studio":
        return "/dashboard/studio";
      case "admin":
        return "/dashboard/admin";
      case "user":
        return "/dashboard/user";
      default:
        return "/dashboard";
    }
  };

  // Orders link for different user roles
  const getOrdersLink = () => {
    if (!user) return "/signin";

    const userRole = getUserRole();
    return `/dashboard/${userRole}/orders`;
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";

    const userRole = getUserRole();
    const role = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    return `${role} Dashboard`;
  };

  // Updated dropdown data with all sections from your table
  const dropdownData = {
    artists: {
      title: "Artists",
      items: [
        { name: "Rap", path: "rap" },
        { name: "Country", path: "country" },
        { name: "Pop", path: "pop" },
        { name: "Rock", path: "rock" },
        { name: "Jazz", path: "jazz" },
        { name: "Reggae", path: "reggae" },
        { name: "EDM", path: "edm" },
        { name: "Classical", path: "classical" },
        { name: "Other", path: "other" }
      ],
    },
    venues: {
      title: "Venues",
      items: [
        { name: "Louisiana", path: "louisiana" },
        { name: "Mississippi", path: "mississippi" },
        { name: "Alabama", path: "alabama" },
        { name: "Florida", path: "florida" }
      ],
    },
    cameras: {
      title: "Cameras",
      items: [
        { name: "Louisiana", path: "louisiana" },
        { name: "Mississippi", path: "mississippi" },
        { name: "Alabama", path: "alabama" },
        { name: "Florida", path: "florida" }
      ],
    },
    studios: {
      title: "Studios",
      items: [
        { name: "Louisiana", path: "louisiana" },
        { name: "Mississippi", path: "mississippi" },
        { name: "Alabama", path: "alabama" },
        { name: "Florida", path: "florida" }
      ],
    },
    news: {
      title: "News",
      items: [
        { name: "Louisiana", path: "louisiana" },
        { name: "Mississippi", path: "mississippi" },
        { name: "Alabama", path: "alabama" },
        { name: "Florida", path: "florida" }
      ],
    },
    markets: {
      title: "Market",
      items: [
        { name: "Louisiana", path: "louisiana" },
        { name: "Mississippi", path: "mississippi" },
        { name: "Alabama", path: "alabama" },
        { name: "Florida", path: "florida" }
      ],
    },
  };

  const handleDropdownEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleTabletDropdown = (dropdown) => {
    setIsTabletDropdownOpen(isTabletDropdownOpen === dropdown ? null : dropdown);
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdown(mobileDropdown === dropdown ? null : dropdown);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setIsTabletDropdownOpen(null);
    setActiveDropdown(null);
    setMobileDropdown(null);
    setIsProfileDropdownOpen(false);
  };

  // Close mobile menu completely
  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileDropdown(null);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroPage = pathname === "/";
  const navbarBg = isHeroPage
    ? isScrolled
      ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10"
      : "bg-transparent"
    : "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10";

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
    closeAllDropdowns();
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    };
  }, [isOpen]);

  const shouldHideHeader = pathname?.startsWith("/dashboard/admin");

  if (shouldHideHeader) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${navbarBg}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-60 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Gulf Coast Music Logo"
              width={80}
              height={50}
              className="w-14 h-auto sm:w-16 md:w-20"
              priority
            />
          </Link>

          {/* Desktop Navigation (LG and above) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-white flex-1 justify-center">
            {/* Home Link */}
            <Link
              href="/"
              className="px-3 py-2 hover:text-yellow-400 transition-all duration-200 font-medium text-sm xl:text-base hover:bg-white/5 rounded-lg"
              onClick={closeAllDropdowns}
            >
              Home
            </Link>

            {/* All Dropdown Menus */}
            {Object.keys(dropdownData).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(key)}
                onMouseLeave={handleDropdownLeave}
                ref={(el) => (desktopDropdownRefs.current[key] = el)}
              >
                <button className="flex items-center gap-1 px-3 py-2 hover:text-yellow-400 transition-all duration-200 font-medium text-sm xl:text-base hover:bg-white/5 rounded-lg whitespace-nowrap">
                  {dropdownData[key].title}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === key ? "rotate-180" : "rotate-0"
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
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 ${key === 'artists' ? 'w-48' : 'w-56'} bg-white rounded-lg shadow-2xl border border-gray-200 py-3 z-50 animate-fadeIn`}>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">
                        {dropdownData[key].title}
                      </span>
                    </div>
                    {dropdownData[key].items.map((item, index) => (
                      <Link
                        key={index}
                        href={`/${key}/${item.path}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200 group"
                        onClick={closeAllDropdowns}
                      >
                        <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="flex-1">{item.name}</span>
                        <svg
                          className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"
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
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Tablet Navigation (MD to LG) */}
          <nav
            className="hidden md:flex lg:hidden items-center gap-2 text-white flex-1 justify-center"
            ref={tabletDropdownRef}
          >
            <Link
              href="/"
              className="px-2 py-2 hover:text-yellow-400 transition-all duration-200 text-sm font-medium hover:bg-white/5 rounded-lg"
              onClick={closeAllDropdowns}
            >
              Home
            </Link>

            {Object.keys(dropdownData).map((key) => (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleTabletDropdown(key)}
                  className="flex items-center gap-1 px-2 py-2 hover:text-yellow-400 transition-all duration-200 text-sm font-medium hover:bg-white/5 rounded-lg whitespace-nowrap"
                >
                  {dropdownData[key].title}
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isTabletDropdownOpen === key ? "rotate-180" : "rotate-0"
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

                {isTabletDropdownOpen === key && (
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 ${key === 'artists' ? 'w-44' : 'w-48'} bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn`}>
                    <div className="px-3 py-1.5 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-900">
                        {dropdownData[key].title}
                      </span>
                    </div>
                    {dropdownData[key].items.map((item, index) => (
                      <Link
                        key={index}
                        href={`/${key}/${item.path}`}
                        className="block px-3 py-2 text-xs text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                        onClick={closeAllDropdowns}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons & Dashboard */}
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            {isLoggedIn ? (
              <>
                {/* Desktop Profile Dropdown */}
                <div className="hidden md:block relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md hover:bg-yellow-400 transition-colors">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:inline text-sm max-w-24 truncate">
                      {user?.username || "User"}
                    </span>
                    <svg
                      className={`w-4 h-4 hidden lg:block transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : "rotate-0"}`}
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
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {getUserRole()}
                        </p>
                      </div>

                      {/* Main Dashboard Link */}
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                        onClick={closeAllDropdowns}
                      >
                        <svg
                          className="w-4 h-4"
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

                      {/* My Orders Link */}
                      <Link
                        href={getOrdersLink()}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                        onClick={closeAllDropdowns}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        My Orders
                      </Link>

                      {/* Sign Out Button */}
                      <button
                        onClick={() => {
                          handleSignOut();
                          closeAllDropdowns();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-left border-t border-gray-100 mt-1"
                      >
                        <svg
                          className="w-4 h-4"
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
                  )}
                </div>

                {/* Mobile Profile Icon Only */}
                <div className="md:hidden">
                  <Link href={getDashboardLink()}>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hidden sm:inline-block hover:text-yellow-400 transition-colors duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/5"
                  onClick={closeAllDropdowns}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 font-medium text-sm whitespace-nowrap shadow-md hover:shadow-lg"
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
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 ml-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle mobile menu"
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
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />

            <div
              ref={mobileMenuRef}
              className="md:hidden fixed h-[100dvh] top-0 py-20 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-md z-50 flex flex-col overflow-y-auto"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={closeMobileMenu}
                  className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-8 h-8"
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

              <div className="flex flex-col px-6 py-4">
                {/* User Info Section */}
                {isLoggedIn && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">
                          {user?.username || "User"}
                        </p>
                        <p className="text-yellow-400 text-sm capitalize">
                          {getUserRole()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={getDashboardLink()}
                        className="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-200 font-semibold text-center text-sm"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={getOrdersLink()}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-center text-sm"
                        onClick={closeMobileMenu}
                      >
                        My Orders
                      </Link>
                    </div>
                  </div>
                )}

                {/* Home Link */}
                <Link
                  href="/"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 rounded-xl hover:bg-white/5 font-medium text-lg border-b border-white/10 mb-2"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>

                {/* Dropdown Sections */}
                {Object.keys(dropdownData).map((key) => (
                  <div key={key} className="border-b border-white/10">
                    <button
                      onClick={() => toggleMobileDropdown(key)}
                      className="flex items-center justify-between w-full text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 font-medium text-lg"
                    >
                      <span>{dropdownData[key].title}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${mobileDropdown === key ? "rotate-180" : "rotate-0"
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
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdown === key ? "max-h-96" : "max-h-0"
                        }`}
                    >
                      <div className="pb-3">
                        {dropdownData[key].items.map((item, index) => (
                          <Link
                            key={index}
                            href={`/${key}/${item.path}`}
                            className="flex items-center gap-4 text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-3 px-8 rounded-lg hover:bg-white/5 text-base font-medium"
                            onClick={closeMobileMenu}
                          >
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Auth Buttons for Mobile (if not logged in) */}
                {!isLoggedIn && (
                  <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                    <Link
                      href="/signin"
                      className="block w-full text-white px-6 py-4 rounded-xl hover:bg-white/5 transition-colors duration-200 font-semibold text-center text-lg border border-white/20"
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full bg-yellow-500 text-black px-6 py-4 rounded-xl hover:bg-yellow-400 transition-colors duration-200 font-semibold text-center text-lg shadow-lg"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Logout Button for Mobile (if logged in) */}
                {isLoggedIn && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="flex items-center justify-center gap-3 w-full bg-red-600 text-white px-6 py-4 rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold text-lg"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}