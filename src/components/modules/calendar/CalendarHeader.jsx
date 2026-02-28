import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CalendarHeader({
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    availableCities,
    allStates,
    formatCityDisplay
}) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Gulf Coast Music Calendar
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                    Live shows and events across the Gulf Coast
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* State Selector */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">State:</span>
                </div>

                <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-[160px] bg-white border-gray-300 text-black">
                        <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black border border-gray-200 max-h-[300px]">
                        {allStates.map((state) => (
                            <SelectItem key={state} value={state} className="capitalize">
                                {state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* City Selector */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">City:</span>
                </div>

                <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                    disabled={availableCities.length === 0}
                >
                    <SelectTrigger className="w-[160px] bg-white border-gray-300 text-black">
                        <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black border border-gray-200 max-h-[300px]">
                        {availableCities.map((city) => (
                            <SelectItem key={city.key} value={city.key} className="capitalize">
                                {city.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}