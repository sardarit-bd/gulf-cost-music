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

  const pathname = usePathname();
  const router = useRouter();
  const tabletDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

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
        setIsOpen(false);
        setMobileDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Dashboard link for different user roles
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
      case "user": // Fan/regular user
        return "/dashboard/user/orders";
      default:
        return "/dashboard";
    }
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";

    const role = user.role?.charAt(0).toUpperCase() + user.role?.slice(1);
    if (user.role === "user") {
      return "My Orders";
    }
    return `${role} Dashboard`;
  };

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

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdown(mobileDropdown === dropdown ? null : dropdown);
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setMobileDropdown(null);
    setActiveDropdown(null);
  };

  // Close mobile menu completely
  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileDropdown(null);
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

  const shouldHideHeader = pathname?.startsWith("/dashboard/admin");

  if (shouldHideHeader) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${navbarBg}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-60">
            <Image
              src="/images/logo.png"
              alt="Gulf Coast Music Logo"
              width={80}
              height={50}
              className="w-16 sm:w-20"
            />
          </Link>

          {/* Desktop Nav - Show from md breakpoint */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-white">
            <Link
              href="/"
              className="hover:text-yellow-400 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Home
            </Link>

            {Object.keys(dropdownData).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors duration-200 font-medium text-sm xl:text-base py-2">
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
                  <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-50">
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
                          className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200 font-medium"
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

            {/* New Links: Merch, Casts, Waves */}
            <Link
              href="/merch"
              className="hover:text-yellow-400 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Merch
            </Link>
            <Link
              href="/casts"
              className="hover:text-yellow-400 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Casts
            </Link>
            <Link
              href="/waves"
              className="hover:text-yellow-400 transition-colors duration-200 font-medium text-sm xl:text-base"
            >
              Waves
            </Link>
          </nav>

          {/* Tablet Nav - Show from md to lg breakpoint */}
          <nav
            className="hidden md:flex lg:hidden items-center gap-4 text-white"
            ref={tabletDropdownRef}
          >
            <Link
              href="/"
              className="hover:text-yellow-400 transition-colors duration-200 text-sm"
              onClick={closeAllDropdowns}
            >
              Home
            </Link>

            {/* Simplified dropdowns for tablet */}
            {Object.keys(dropdownData).map((key) => (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleMobileDropdown(key)}
                  className="flex items-center gap-1 hover:text-yellow-400 transition-colors duration-200 text-sm"
                >
                  {dropdownData[key].title}
                  <svg
                    className={`w-3 h-3 transition-transform ${mobileDropdown === key ? "rotate-180" : "rotate-0"
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
                  <div className="absolute top-full left-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
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
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-600 transition-colors duration-200"
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

            {/* New Links for Tablet: Merch, Casts, Waves */}
            <Link
              href="/merch"
              className="hover:text-yellow-400 transition-colors duration-200 text-sm"
              onClick={closeAllDropdowns}
            >
              Merch
            </Link>
            <Link
              href="/casts"
              className="hover:text-yellow-400 transition-colors duration-200 text-sm"
              onClick={closeAllDropdowns}
            >
              Casts
            </Link>
            <Link
              href="/waves"
              className="hover:text-yellow-400 transition-colors duration-200 text-sm"
              onClick={closeAllDropdowns}
            >
              Waves
            </Link>
          </nav>

          {/* Auth Buttons & Dashboard */}
          <div className="hidden md:flex items-center gap-3 text-white">
            {isLoggedIn ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200">
                    <span className="hidden lg:inline text-sm max-w-24 truncate">
                      {user?.username || "User"}
                    </span>
                    <svg
                      className="w-4 h-4 hidden lg:block"
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
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button>

                  {/* Profile Dropdown Menu */}
                  <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>

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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {user?.role === "user" ? "My Orders" : "My Profile"}
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        closeAllDropdowns();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-left"
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
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hover:text-yellow-400 transition-colors duration-200 font-medium text-sm"
                  onClick={closeAllDropdowns}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 font-medium text-sm whitespace-nowrap"
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
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
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
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Content */}
            <div
              ref={mobileMenuRef}
              className="lg:hidden fixed h-[100vh] top-0 py-16 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-md z-50 flex flex-col overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeMobileMenu}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
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

              <div className="flex flex-col space-y-1 px-6 py-8">
                {/* Main Links */}
                <Link
                  href="/"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 rounded-lg hover:bg-white/5 font-medium text-lg text-left border-b border-gray-700"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>

                {/* Dropdowns for Mobile */}
                {Object.keys(dropdownData).map((key) => (
                  <div key={key} className="w-full border-b border-gray-700">
                    <button
                      onClick={() => toggleMobileDropdown(key)}
                      className="flex items-center justify-between w-full text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 font-medium text-lg"
                    >
                      <span>{dropdownData[key].title}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${mobileDropdown === key ? "rotate-180" : "rotate-0"
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
                      className={`overflow-hidden transition-all duration-300 ${mobileDropdown === key ? "max-h-96 pb-2" : "max-h-0"
                        }`}
                    >
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
                            className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-3 px-8 rounded-lg hover:bg-white/5 text-base font-medium"
                            onClick={closeMobileMenu}
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* New Links for Mobile: Merch, Casts, Waves */}
                <Link
                  href="/merch"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 rounded-lg hover:bg-white/5 font-medium text-lg text-left border-b border-gray-700"
                  onClick={closeMobileMenu}
                >
                  Merch
                </Link>
                <Link
                  href="/casts"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 rounded-lg hover:bg-white/5 font-medium text-lg text-left border-b border-gray-700"
                  onClick={closeMobileMenu}
                >
                  Casts
                </Link>
                <Link
                  href="/waves"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 py-4 px-4 rounded-lg hover:bg-white/5 font-medium text-lg text-left border-b border-gray-700"
                  onClick={closeMobileMenu}
                >
                  Waves
                </Link>

                {/* Mobile Auth Buttons */}
                <div className="pt-6 mt-4 border-t border-gray-700">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-4 mb-4 bg-white/5 rounded-lg">
                        <p className="text-white font-semibold text-lg">
                          {user?.username}
                        </p>
                        <p className="text-yellow-400 text-sm capitalize">
                          {user?.role}
                        </p>
                      </div>

                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-3 bg-yellow-500 text-black px-4 py-4 rounded-lg hover:bg-yellow-400 transition-colors duration-200 font-semibold justify-center w-full mb-3 text-lg"
                        onClick={closeMobileMenu}
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
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        {getDashboardLabel()}
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 text-white px-4 py-4 rounded-lg hover:bg-white/5 transition-colors duration-200 font-medium justify-center w-full mb-3 text-lg"
                        onClick={closeMobileMenu}
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </Link>

                      <button
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                        className="flex items-center gap-3 w-full bg-red-600 text-white px-4 py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold justify-center text-lg"
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
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="block w-full text-white px-4 py-4 rounded-lg hover:bg-white/5 transition-colors duration-200 font-semibold text-center mb-3 text-lg border border-gray-600"
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="block w-full bg-yellow-500 text-black px-4 py-4 rounded-lg hover:bg-yellow-400 transition-colors duration-200 font-semibold text-center text-lg"
                        onClick={closeMobileMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}