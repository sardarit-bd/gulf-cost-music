import PhotographerRow from "./PhotographerRow";

export default function PhotographerTable({
    photographers,
    pagination,
    filters,
    onFilterChange,
    onRefresh,
    onPageChange,
    loading
}) {
    const PaginationButton = ({ page, active, onClick }) => (
        <button
            onClick={() => onClick(page)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${active
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-50"
                }`}
            disabled={loading}
        >
            {page}
        </button>
    );

    const handleLimitChange = (e) => {
        onFilterChange("limit", parseInt(e.target.value));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
            {/* Table Info */}
            <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-50">
                <div>
                    <span className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{photographers.length}</span> of{" "}
                        <span className="font-semibold">{pagination.total}</span> photographers
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">Photographer</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">Plan</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && photographers.length === 0 ? (
                            // Skeleton loading rows
                            [...Array(filters.limit)].map((_, i) => (
                                <tr key={i} className="border-t animate-pulse">
                                    <td className="p-4">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : photographers.map((p) => (
                            <PhotographerRow
                                key={p._id}
                                photographer={p}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {photographers.length === 0 && !loading && (
                <div className="p-8 text-center border-t">
                    <div className="text-gray-400 mb-2">📷</div>
                    <p className="text-gray-500 font-medium">No photographers found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Try changing your filters or search term
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="p-4 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Page {pagination.current} of {pagination.pages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(pagination.current - 1)}
                            disabled={pagination.current === 1 || loading}
                            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                let pageNum;
                                if (pagination.pages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.current <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.current >= pagination.pages - 2) {
                                    pageNum = pagination.pages - 4 + i;
                                } else {
                                    pageNum = pagination.current - 2 + i;
                                }

                                return (
                                    <PaginationButton
                                        key={pageNum}
                                        page={pageNum}
                                        active={pagination.current === pageNum}
                                        onClick={onPageChange}
                                    />
                                );
                            })}
                        </div>

                        <button
                            onClick={() => onPageChange(pagination.current + 1)}
                            disabled={pagination.current === pagination.pages || loading}
                            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}