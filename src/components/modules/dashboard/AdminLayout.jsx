"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Music,
  Building2,
  Newspaper,
  Mail,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Calendar,
  FileText,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  ShoppingBag,
  Mic2,
  Waves
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/admin',
      icon: BarChart3,
      type: 'single'
    },
    {
      name: 'User Management',
      href: '/dashboard/admin/users',
      icon: Users,
      type: 'single'
    },
    {
      name: 'Content Management',
      icon: FileText,
      type: 'group',
      children: [
        { name: 'Artists', href: '/dashboard/admin/artists', icon: Music },
        { name: 'Venues', href: '/dashboard/admin/venues', icon: Building2 },
        { name: 'News', href: '/dashboard/admin/news', icon: Newspaper },
        { name: 'Events', href: '/dashboard/admin/events', icon: Calendar },
        { name: 'Merch', href: '/dashboard/admin/merch', icon: ShoppingBag },
        { name: 'Casts', href: '/dashboard/admin/Casts', icon: Mic2 },
        { name: 'Waves', href: '/dashboard/admin/waves', icon: Waves },
      ]
    },
    {
      name: 'Contact Messages',
      href: '/dashboard/admin/contacts',
      icon: Mail,
      type: 'single'
    },
    {
      name: 'System Settings',
      href: '/dashboard/admin/settings',
      icon: Settings,
      type: 'single'
    },
  ];

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href) => {
    if (href === '/dashboard/admin') return pathname === '/dashboard/admin';
    return pathname.startsWith(href);
  };

  const isChildActive = (children) => {
    return children.some(child => isActive(child.href));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isItemActive = item.type === 'single' ? isActive(item.href) : isChildActive(item.children);
    const isExpanded = expandedItems.includes(item.name);

    if (item.type === 'group') {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isItemActive
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center">
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </div>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>

          {isExpanded && (
            <div className="ml-4 space-y-1 border-l border-gray-200 pl-2">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const isChildActive = isActive(child.href);

                return (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isChildActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ChildIcon className="mr-3 h-4 w-4" />
                    {child.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className="mr-3 h-5 w-5" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">Gulf Coast</span>
                  <span className="block text-xs text-gray-500 -mt-1">Music Admin</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Super Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Breadcrumb */}
              <nav className="flex ml-4 lg:ml-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/dashboard/admin" className="text-gray-400 hover:text-gray-500">
                      <Home className="h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </li>
                  <li>
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {pathname.split('/').pop() || 'Dashboard'}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    A
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </button>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}