"use client";

import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Mail,
  Menu,
  Mic2,
  Music,
  Newspaper,
  Settings,
  ShoppingBag,
  User,
  Users,
  Waves,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "../../../../public/images/logo.png";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  // Refs for dropdowns
  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

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

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/contacts?limit=5&read=false`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.data.contacts) {
          // Transform contact messages to notifications
          const contactNotifications = data.data.contacts.map(contact => ({
            id: contact._id,
            title: 'New Contact Message',
            message: `From: ${contact.name || 'Unknown'} - ${contact.subject}`,
            email: contact.email,
            time: formatTimeAgo(contact.createdAt),
            read: contact.isRead,
            type: 'contact',
            contactId: contact._id,
            createdAt: contact.createdAt
          }));

          setNotifications(contactNotifications);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data if API fails
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mock notifications for fallback
  const getMockNotifications = () => {
    return [
      {
        id: 1,
        title: 'New Contact Message',
        message: 'From: John Doe - Website Inquiry',
        email: 'john@example.com',
        time: '5 minutes ago',
        read: false,
        type: 'contact',
        contactId: '1'
      },
      {
        id: 2,
        title: 'New Contact Message',
        message: 'From: Sarah Smith - Support Request',
        email: 'sarah@example.com',
        time: '1 hour ago',
        read: false,
        type: 'contact',
        contactId: '2'
      },
      {
        id: 3,
        title: 'New User Registration',
        message: 'A new artist has registered on the platform',
        time: '2 hours ago',
        read: true,
        type: 'user'
      }
    ];
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Mark notification as read
  const markAsRead = async (notificationId, contactId) => {
    try {
      if (contactId) {
        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/contacts/${contactId}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const unreadContacts = notifications.filter(n => !n.read && n.contactId);

      // Mark all contact notifications as read
      await Promise.all(
        unreadContacts.map(contact =>
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/contacts/${contact.contactId}/read`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (notification.contactId) {
      // Redirect to contact messages page
      router.push('/dashboard/admin/contacts');
      markAsRead(notification.id, notification.contactId);
    }
    setNotificationDropdownOpen(false);
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setUserDropdownOpen(false);
    setNotificationDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    closeAllDropdowns();
  }, [pathname]);

  // Fetch notifications on component mount and when notification dropdown opens
  useEffect(() => {
    if (notificationDropdownOpen) {
      fetchNotifications();
    }
  }, [notificationDropdownOpen]);

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
    logout();
    router.push("/signin");
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

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
                <div className="w-20 h-12 bg-gradient-to-r from-gray-700 to-gray-700 rounded-lg flex items-center justify-center">
                  <Link href="/">
                    <Image src={logo} alt="Logo" width={50} height={40} />
                  </Link>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">Gulf Coast</span>
                  <span className="block text-xs text-gray-500 -mt-1">Gulf Coast Admin</span>
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
              {/* Notifications */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => {
                    setNotificationDropdownOpen(!notificationDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {notificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {unreadCount} new
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                              }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${notification.type === 'contact' ? 'bg-blue-100 text-blue-600' :
                                notification.type === 'user' ? 'bg-green-100 text-green-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                <Mail className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                {notification.email && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.email}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200">
                      <Link
                        href="/dashboard/admin/contacts"
                        className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
                        onClick={() => setNotificationDropdownOpen(false)}
                      >
                        View All Contact Messages
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu - Updated with new style */}
              <div className="relative group" ref={userDropdownRef}>
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.username || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || 'Super Admin'}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Updated Dropdown with new style */}
                <div className={`absolute top-full right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200 ${userDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <Link
                    href="/dashboard/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                    onClick={closeAllDropdowns}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>

                  <Link
                    href="/dashboard/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200"
                    onClick={closeAllDropdowns}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      handleLogout();
                      closeAllDropdowns();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
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