"use client";
import {
  Package,
  Search,
  X,
  Eye,
  Edit,
  Trash2,
  ToggleRight,
  ToggleLeft,
  DollarSign,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ProductTable = ({
  products,
  loading,
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyPress,
  onClearSearch,
  hasActiveFilters,
  activeSearchTerm,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableRef = useRef(null);

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const safePaginatedProducts = products.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Search Header - Inside Table Container */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Products ({products.length})
            </h3>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search products..."
                className="text-gray-700 w-64 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none transition-colors"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyPress={onKeyPress}
              />
            </div>
            <button
              onClick={onSearch}
              className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            {searchInput && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Search Badge */}
        {activeSearchTerm && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Searching for:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
              <Search className="w-3 h-3" />
              {activeSearchTerm}
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item) => (
                <ProductRow
                  key={item._id}
                  item={item}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  actionLoading={actionLoading}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      No products found
                    </p>
                    <p className="text-sm">
                      {hasActiveFilters
                        ? `No results found for "${activeSearchTerm}"`
                        : "No products have been created yet"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={onClearSearch}
                        className="mt-3 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${
                      currentPage === pageNumber
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductRow = ({
  item,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoading,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-500 line-clamp-1">
              {item.description || "No description"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-gray-900">{item.price}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.stock > 10
              ? "bg-green-100 text-green-800"
              : item.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {item.stock} units
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(item)}
          disabled={actionLoading === item._id}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition cursor-pointer ${
            item.isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {actionLoading === item._id ? (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current mr-1"></div>
          ) : item.isActive ? (
            <ToggleRight className="w-3 h-3" />
          ) : (
            <ToggleLeft className="w-3 h-3" />
          )}
          {item.isActive ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end items-center gap-1">
          {/* View Button */}
          <button
            onClick={() => onViewDetails(item)}
            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(item)}
            disabled={actionLoading === item._id}
            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
            title="Delete Product"
          >
            {actionLoading === item._id ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-red-600 border-t-transparent"></div>
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTable;
