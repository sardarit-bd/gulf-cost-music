"use client";

import { useSession } from "@/lib/auth";
import { ROLE_MENUS } from "@/utils/userMenus";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Camera,
  LayoutDashboard,
  LogOut,
  Menu,
  Music,
  Newspaper,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function RoleSidebarLayout({ role, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Get menu based on role
  const menu = useMemo(() => ROLE_MENUS[role] || [], [role]);

  // Enhanced menu with icons
  const enhancedMenu = useMemo(() => {
    const iconMap = {
      Dashboard: LayoutDashboard,
      Order: ShoppingCart,
      Statistic: BarChart3,
      Product: Package,
      Stock: Zap,
      Offer: Tag,
      Profile: User,
      Settings: Settings,
      Notifications: Bell,
      Users: Users,
      Music: Music,
      Events: Calendar,
      Marketplace: ShoppingBag,
      Analytics: BarChart3,
      Earnings: ShoppingBag,
      Portfolio: Camera,
      Gallery: Camera,
      Bookings: Calendar,
      Equipment: Package,
      Pricing: Tag,
      Favorites: User,
      Tickets: ShoppingCart,
      Merchandise: ShoppingBag,
      Articles: Newspaper,
      Interviews: Users,
      Reviews: BarChart3,
      "Venue Info": Building2,
      "Studio Info": Building2,
    };

    return menu.map((item) => ({
      ...item,
      icon: iconMap[item.label] || LayoutDashboard,
    }));
  }, [menu]);

  const handleLogout = () => {
    logout?.();
    router.push("/signin");
  };

  // User role check
  const userRole = user?.userType?.toLowerCase();
  if (user && userRole && userRole !== role) {
    router.replace("/dashboard");
    return null;
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  // Get user display name
  const getUserName = () => {
    return user?.username || "User";
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || "user@example.com";
  };

  // Close sidebar on mobile when clicking a link
  const handleMenuItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl m-2 p-6 flex-col text-white shadow-2xl z-20`}
      >
        {/* Logo Section */}
        <div className="mb-10 flex items-center justify-center">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="Gulf Coast Logo"
              width={100}
              height={100}
              className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar border-t-1 border-white/20 pt-4">
          {enhancedMenu.map((item) => {
            const Icon = item.icon;
            // const active = pathname === item.href || pathname.startsWith(item.href);
            const dashboardRoot = `/dashboard/${role}`;

            let active = false;

            if (item.href === dashboardRoot) {
              // Dashboard only active on exact match
              active = pathname === dashboardRoot;
            } else {
              // Other menus active on exact or sub-routes
              active =
                pathname === item.href || pathname.startsWith(item.href + "/");
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-medium
                    ${
                      active
                        ? "bg-white text-blue-600 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>

                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        {/* User Profile Section */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{getUserName()}</p>
              <p className="text-xs text-blue-200 truncate">{getUserEmail()}</p>
            </div>
          </div>
        </div>
        {/* Social Links and Logout */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-blue-600 to-blue-700 text-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-wide">Gulf Coast</h1>
              <p className="text-sm text-blue-100 mt-1">{role} Dashboard</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-white hover:bg-white/10 rounded-2xl ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto py-2">
            {enhancedMenu.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${
                    active
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Profile */}
          <div className="mt-4 pt-5 border-t border-white/20">
            <div className="flex items-center gap-3 p-3 rounded-2xl">
              <div className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {getUserName()}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  {getUserEmail()}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Social Links and Logout */}
          <div className="mt-4 pt-5 border-t border-white/20">
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? "ml-0" : "lg:ml-64"}`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 ml-0 lg:ml-8 bg-white shadow-sm border-b border-gray-200">
          <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center flex-1">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg mr-2"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Breadcrumb - Desktop */}
              <div className="hidden lg:flex items-center text-sm text-gray-600">
                <Link href="/dashboard" className="hover:text-gray-900">
                  Dashboard
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium capitalize">
                  {pathname.split("/").pop()?.replace("-", " ") || "Overview"}
                </span>
              </div>

              {/* Mobile Title */}
              <div className="lg:hidden text-base sm:text-lg font-semibold text-gray-900 truncate">
                {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="lg:hidden px-4 py-3 border-t border-gray-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search dashboard..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="">
            <div className="">{children}</div>
          </div>
        </main>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
        }
        @media (max-width: 768px) {
          .custom-scrollbar {
            scrollbar-width: none;
          }
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
