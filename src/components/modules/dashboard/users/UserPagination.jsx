const UserPagination = ({ page, pages, onPageChange }) => {
    return (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{pages}</span>
                </p>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="text-gray-500 px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${page === pageNumber
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => onPageChange(Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className="text-gray-500 px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};


export default UserPagination;