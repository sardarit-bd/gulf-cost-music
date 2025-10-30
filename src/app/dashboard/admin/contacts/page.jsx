"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Mail, 
  Eye, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Search, 
  Filter,
  MoreVertical,
  User,
  MessageSquare,
  Download,
  RefreshCw,
  TrendingUp,
  MailOpen,
  MailWarning,
  Calendar,
  Phone,
  Reply,
  Archive
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);

  const API_URL = "http://localhost:5000/api/admin/contacts";

  // 🔹 Fetch all contact messages
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter })
      });

      const { data } = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContacts(data.data.contacts || []);
      setPages(data.data.pagination?.pages || 1);
    } catch (err) {
      console.error("Fetch contacts error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mark message as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchContacts();
      setActionMenu(null);
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  // 🔹 Delete message
  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
      setActionMenu(null);
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  // 🔹 Mark all as read
  const markAllAsRead = async () => {
    if (!window.confirm("Mark all messages as read?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchContacts();
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, statusFilter]);

  const getUnreadCount = () => contacts.filter(msg => !msg.isRead).length;

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and respond to customer inquiries and feedback
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              {getUnreadCount() > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button 
                onClick={fetchContacts}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={Mail} 
              label="Total Messages" 
              value={contacts.length} 
              change={8}
              color="indigo"
            />
            <StatCard 
              icon={MailOpen} 
              label="Read Messages" 
              value={contacts.filter(msg => msg.isRead).length} 
              change={12}
              color="green"
            />
            <StatCard 
              icon={MailWarning} 
              label="Unread Messages" 
              value={getUnreadCount()} 
              change={-4}
              color="orange"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(contacts.length * 0.2)} 
              change={20}
              color="purple"
            />
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Messages
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by email, subject, or message content..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchContacts()}
                  />
                </div>
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
              </div>

              <button
                onClick={fetchContacts}
                className="w-full lg:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          {/* Messages Table Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Messages ({contacts.length})
                {getUnreadCount() > 0 && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {getUnreadCount()} unread
                  </span>
                )}
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.length > 0 ? (
                      contacts.map((msg) => (
                        <tr 
                          key={msg._id} 
                          className={`hover:bg-gray-50 transition-colors group ${
                            !msg.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {msg.name ? msg.name.charAt(0).toUpperCase() : msg.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {msg.name || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {msg.email}
                                </div>
                                {msg.phone && (
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {msg.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-md">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {msg.subject}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {truncateText(msg.message, 120)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-xs text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(msg.createdAt)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {msg.isRead ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <MailOpen className="w-3 h-3 mr-1" />
                                Read
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                <Eye className="w-3 h-3 mr-1" />
                                Unread
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              {!msg.isRead && (
                                <button
                                  onClick={() => markAsRead(msg._id)}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                  title="Mark as Read"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Reply"
                              >
                                <Reply className="w-4 h-4" />
                              </button>

                              <div className="relative">
                                <button
                                  onClick={() => setActionMenu(actionMenu === msg._id ? null : msg._id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {actionMenu === msg._id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      View Details
                                    </button>
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <Reply className="w-4 h-4 mr-2" />
                                      Reply
                                    </button>
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <Archive className="w-4 h-4 mr-2" />
                                      Archive
                                    </button>
                                    <button
                                      onClick={() => deleteMessage(msg._id)}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Message
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No messages found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all"
                                ? "Try adjusting your search filters" 
                                : "All contact messages will appear here"
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {contacts.length} messages on page {page} of {pages}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNumber
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    purple: "from-purple-500 to-pink-600",
  };

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↗" : "↘";

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}>
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value || 0}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
};

export default ContactManagement;