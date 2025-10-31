"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Newspaper, 
  Eye, 
  Power, 
  Trash2, 
  Calendar, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  User,
  Download,
  RefreshCw,
  TrendingUp,
  FileText,
  Clock,
  Tag,
  Plus,
  BarChart3
} from "lucide-react";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";

const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content?type=news`;

  // 🔹 Fetch All News
  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter })
      });

      const { data } = await axios.get(`${API_URL}&${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewsList(data.data.content);
      setPages(data.data.pagination.pages);
    } catch (err) {
      console.error("Fetch news error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle News Status (Active/Inactive)
  const toggleNewsStatus = async (id, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? "deactivate" : "activate"} this news?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/content/news/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNews();
      setActionMenu(null);
    } catch (err) {
      console.error("Toggle news error:", err);
    }
  };

  // 🔹 Delete News
  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
      setActionMenu(null);
    } catch (err) {
      console.error("Delete news error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, categoryFilter]);

  // Extract unique categories for filter
  const categories = [...new Set(newsList.map(news => news.category).filter(Boolean))];

  const getCategoryColor = (category) => {
    const colors = {
      'music': 'bg-purple-100 text-purple-800 border-purple-200',
      'events': 'bg-blue-100 text-blue-800 border-blue-200',
      'artists': 'bg-pink-100 text-pink-800 border-pink-200',
      'venues': 'bg-green-100 text-green-800 border-green-200',
      'industry': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                News Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage news articles, publish content, and engage with your audience
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                <Plus className="w-4 h-4" />
                <span>Add News</span>
              </button>
              <button 
                onClick={fetchNews}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={Newspaper} 
              label="Total News" 
              value={newsList.length} 
              change={15}
              color="orange"
            />
            <StatCard 
              icon={FileText} 
              label="Active News" 
              value={newsList.filter(n => n.isActive).length} 
              change={8}
              color="green"
            />
            <StatCard 
              icon={Power} 
              label="Inactive News" 
              value={newsList.filter(n => !n.isActive).length} 
              change={-3}
              color="red"
            />
            <StatCard 
              icon={TrendingUp} 
              label="This Month" 
              value={Math.floor(newsList.length * 0.25)} 
              change={25}
              color="blue"
            />
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search News
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by title, content, or author..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchNews()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={fetchNews}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center space-x-2 self-end"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* News Table Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                News Articles ({newsList.length})
              </h3>
              <div className="text-sm text-gray-500">
                Page {page} of {pages}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author & Category
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
                    {newsList.length > 0 ? (
                      newsList.map((news) => (
                        <tr 
                          key={news._id} 
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                <Newspaper className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 line-clamp-2">
                                  {news.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {truncateText(news.content, 80)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{news.user?.username || "Unknown"}</span>
                              </div>
                              {news.category && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(news.category)}`}>
                                  <Tag className="w-3 h-3 mr-1" />
                                  {news.category}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(news.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-xs text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(news.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {news.isActive ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <button
                                onClick={() => window.open(`/news/${news._id}`, "_blank")}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Article"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => toggleNewsStatus(news._id, news.isActive)}
                                className={`p-2 rounded-lg transition-colors ${
                                  news.isActive
                                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                }`}
                                title={news.isActive ? "Unpublish" : "Publish"}
                              >
                                <Power className="w-4 h-4" />
                              </button>

                              <div className="relative">
                                <button
                                  onClick={() => setActionMenu(actionMenu === news._id ? null : news._id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {actionMenu === news._id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Article
                                    </button>
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <BarChart3 className="w-4 h-4 mr-2" />
                                      View Analytics
                                    </button>
                                    <button
                                      onClick={() => deleteNews(news._id)}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Article
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
                            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No news articles found</p>
                            <p className="text-sm">
                              {search || statusFilter !== "all" || categoryFilter
                                ? "Try adjusting your search filters" 
                                : "Get started by creating your first news article"
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
                    Showing {newsList.length} articles on page {page} of {pages}
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
                              ? "bg-orange-600 text-white shadow-sm"
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
    orange: "from-orange-500 to-red-600",
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-pink-600",
    blue: "from-blue-500 to-cyan-600",
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

export default NewsManagement;