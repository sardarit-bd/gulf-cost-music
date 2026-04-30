import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarControls({
    currentDate,
    setCurrentDate,
    view,
    setView,
    monthNames,
    onToday,
    onPrevMonth,
    onNextMonth
}) {
    return (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToday}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition cursor-pointer"
                    >
                        Today
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onPrevMonth}
                            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 min-w-[180px] text-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>

                        <button
                            onClick={onNextMonth}
                            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* View Toggles - Updated with Explore tab */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    {["month", "week", "agenda", "explore"].map((viewType) => (
                        <button
                            key={viewType}
                            onClick={() => setView(viewType)}
                            className={`px-4 py-2 rounded-md transition capitalize cursor-pointer ${view === viewType
                                    ? 'bg-white shadow-sm text-yellow-500 font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {viewType}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}