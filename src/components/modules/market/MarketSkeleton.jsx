export default function MarketSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-800 animate-pulse" />
                    <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-800 rounded animate-pulse w-full" />
                        <div className="h-3 bg-gray-800 rounded animate-pulse w-5/6" />
                        <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
