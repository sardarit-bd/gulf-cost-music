"use client";
import { Package, Search, X } from "lucide-react";
import { useRef } from "react";
import OrderRow from "./OrderRow";

const OrderTable = ({
  orders,
  loading,
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyPress,
  onClearFilters,
  hasActiveFilters,
  activeSearchTerm,
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
  dropdownOpen,
  onToggleDropdown,
  onViewDetails,
  onUpdateDeliveryStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
  statusUpdateLoading,
  actionLoading,
}) => {
  const tableRef = useRef(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Search Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="text-gray-700 w-full h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyPress={onKeyPress}
              />
            </div>

            <button
              onClick={onSearch}
              className="h-9 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Search
            </button>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="h-9 px-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {activeSearchTerm && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              <Search className="w-3 h-3" />
              {activeSearchTerm}
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  dropdownOpen={dropdownOpen}
                  onToggleDropdown={onToggleDropdown}
                  onViewDetails={onViewDetails}
                  onUpdateDeliveryStatus={onUpdateDeliveryStatus}
                  onUpdatePaymentStatus={onUpdatePaymentStatus}
                  onDeleteOrder={onDeleteOrder}
                  statusUpdateLoading={statusUpdateLoading}
                  actionLoading={actionLoading}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-3 py-8 text-center">
                  <div className="text-gray-500">
                    <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-medium text-gray-900">No orders found</p>
                    <p className="text-xs">No matching orders found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Page {currentPage} of {totalPages} ({totalOrders} orders)
            </p>

            <div className="flex gap-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100"
              >
                Prev
              </button>

              <span className="px-2 py-1 text-xs text-gray-700">{currentPage}</span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100"
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

export default OrderTable;