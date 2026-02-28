import { ChevronLeft, ChevronRight } from "lucide-react";

export function MiniCalendar({ currentDate, onChange, monthNames }) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const today = new Date();

    const handlePrev = () => {
        onChange(new Date(year, month - 1, 1));
    };

    const handleNext = () => {
        onChange(new Date(year, month + 1, 1));
    };

    return (
        <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <div className="text-sm font-semibold text-gray-800">
                    {monthNames[month]} {year}
                </div>

                <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="text-center py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday =
                        today.getDate() === day &&
                        today.getMonth() === month &&
                        today.getFullYear() === year;

                    return (
                        <button
                            key={day}
                            onClick={() => onChange(new Date(year, month, day))}
                            className={`h-8 rounded-full flex items-center justify-center transition
                ${isToday
                                    ? "bg-yellow-500 text-white font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                }
                ${currentDate.getDate() === day ? "ring-2 ring-yellow-300" : ""}
              `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}