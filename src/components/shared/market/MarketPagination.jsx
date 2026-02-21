// components/market/MarketPagination.jsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MarketPagination({ pagination, onPageChange }) {
    const { page, pages, total } = pagination;

    if (pages <= 1) return null;

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= pages; i++) {
            if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    return (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 order-2 sm:order-1">
                Showing page {page} of {pages} ({total} total items)
            </p>

            <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((pageNum, index) => (
                    <button
                        key={index}
                        onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                        disabled={pageNum === '...'}
                        className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors
                            ${pageNum === page
                                ? 'bg-blue-600 text-white'
                                : pageNum === '...'
                                    ? 'cursor-default bg-transparent'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === pages}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}