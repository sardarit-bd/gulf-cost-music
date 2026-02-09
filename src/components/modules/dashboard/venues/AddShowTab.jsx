import Input from "@/ui/Input";
import { Calendar, CheckCircle, Clock, ImageIcon, Loader2, MapPin, Music } from "lucide-react";
import { useEffect, useState } from "react";

const AddShowTab = ({
    newShow,
    setNewShow,
    handleAddShow,
    loading,
    showsThisMonth = 0,
    venue,
}) => {
    // ALL FEATURES ENABLED FOR ALL USERS
    const MAX_SHOWS_PER_MONTH = 50; // Free users get 50 shows/month
    const isLimitReached = showsThisMonth >= MAX_SHOWS_PER_MONTH;

    // Local state for date input
    const [dateInput, setDateInput] = useState("");
    const [dateError, setDateError] = useState("");

    // Initialize date input when newShow.date changes
    useEffect(() => {
        if (newShow.date) {
            // Convert MM/DD/YYYY to YYYY-MM-DD for input field
            const dateParts = newShow.date.split('/');
            if (dateParts.length === 3) {
                const [month, day, year] = dateParts;
                setDateInput(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
            }
        } else {
            setDateInput("");
        }
    }, [newShow.date]);

    // Validate and format date
    const validateAndSetDate = (value) => {
        setDateInput(value);
        setDateError("");

        // If empty, clear the date
        if (!value) {
            setNewShow({ ...newShow, date: "" });
            return;
        }

        // Check if it's a valid date (YYYY-MM-DD format)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
            setDateError("Please use YYYY-MM-DD format");
            return;
        }

        const [year, month, day] = value.split('-').map(Number);

        // Check if date is valid
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
        ) {
            setDateError("Invalid date (e.g., February 30th)");
            return;
        }

        // Check if date is not in past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date < today) {
            setDateError("Date cannot be in the past");
            return;
        }

        // Convert to MM/DD/YYYY format for backend
        const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
        setNewShow({ ...newShow, date: formattedDate });
    };

    // Handle date input change
    const handleDateChange = (e) => {
        const value = e.target.value;
        validateAndSetDate(value);
    };

    // Handle date picker (calendar icon click)
    const handleDatePicker = () => {
        // Focus the date input to open native date picker
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.showPicker();
        }
    };

    // Handle manual date input (keyboard)
    const handleManualDateInput = (e) => {
        let value = e.target.value;

        // Allow only numbers and dashes
        value = value.replace(/[^0-9-]/g, '');

        // Auto-format as user types: YYYY-MM-DD
        if (value.length <= 4) {
            // Just year
            setDateInput(value);
        } else if (value.length <= 7) {
            // Year and month with dash
            const year = value.substring(0, 4);
            const month = value.substring(4);
            if (month.length <= 2) {
                setDateInput(`${year}-${month}`);
            }
        } else if (value.length <= 10) {
            // Year, month, and day
            const year = value.substring(0, 4);
            const month = value.substring(5, 7);
            const day = value.substring(8);
            if (day.length <= 2) {
                setDateInput(`${year}-${month}-${day}`);
            }
        }

        // After a delay, validate the date
        setTimeout(() => {
            validateAndSetDate(value);
        }, 100);
    };

    // Handle time change (convert to AM/PM format)
    const handleTimeChange = (e) => {
        let timeValue = e.target.value;

        // If empty, clear the time
        if (!timeValue) {
            setNewShow({ ...newShow, time: "" });
            return;
        }

        // Convert from 24h to 12h format
        if (timeValue.includes(':')) {
            const [hours, minutes] = timeValue.split(':');
            let hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12; // Convert 0 to 12
            timeValue = `${hour}:${minutes.padStart(2, '0')} ${ampm}`;
        }

        setNewShow({ ...newShow, time: timeValue });
    };

    // Format time for input field (convert from AM/PM to 24h)
    const formatTimeForInput = (timeString) => {
        if (!timeString) return '';

        if (timeString.includes('AM') || timeString.includes('PM')) {
            const [time, period] = timeString.split(' ');
            let [hours, minutes] = time.split(':');

            hours = parseInt(hours);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            return `${String(hours).padStart(2, '0')}:${minutes}`;
        }

        return timeString;
    };

    // Get min date for calendar (today's date in YYYY-MM-DD format)
    const getMinDate = () => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="space-y-8">
            {/* Venue Location Info */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <MapPin className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-semibold">Venue Location</h4>
                        <p className="text-gray-400 text-sm">
                            Shows will be automatically listed in: <span className="font-medium text-white capitalize">{venue?.city || "Not set"}, {venue?.state || "Not set"}</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Your venue's location from the profile will be used for all shows
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Show Form */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Music size={24} />
                            Schedule New Show
                        </h3>
                        <p className="text-gray-400 mt-1">
                            Add a live performance event to your venue calendar
                        </p>
                    </div>
                    {/* <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
                        <span className="font-medium">
                            {showsThisMonth}/{MAX_SHOWS_PER_MONTH} shows this month
                        </span>
                    </div> */}
                </div>

                {isLimitReached && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-yellow-400" size={20} />
                            <div>
                                <h4 className="text-yellow-400 font-semibold">Monthly Show Limit</h4>
                                <p className="text-yellow-300/80 text-sm">
                                    You've scheduled {showsThisMonth} shows this month. You can schedule up to {MAX_SHOWS_PER_MONTH} shows per month.
                                </p>
                                <p className="text-gray-300 text-xs mt-1">
                                    The limit resets at the beginning of each month.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleAddShow} className="space-y-6">
                    {/* Artist */}
                    <Input
                        label="Artist / Band Name"
                        name="artist"
                        value={newShow.artist}
                        onChange={(e) => setNewShow({ ...newShow, artist: e.target.value })}
                        icon={<Music size={18} />}
                        placeholder="Enter artist or band name"
                        disabled={loading || isLimitReached}
                        required
                    />

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Date Input with Calendar Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Calendar size={18} />
                                Show Date *
                            </label>

                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={dateInput}
                                    onChange={handleDateChange}
                                    onInput={handleManualDateInput}
                                    className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    min={getMinDate()}
                                    disabled={loading || isLimitReached}
                                    required
                                />

                                {/* Custom Calendar Button */}
                                <button
                                    type="button"
                                    onClick={handleDatePicker}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition"
                                    disabled={loading || isLimitReached}
                                >
                                    <Calendar size={18} />
                                </button>
                            </div>

                            {dateError && (
                                <p className="text-red-400 text-xs mt-2">
                                    {dateError}
                                </p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                                <p className="text-gray-500 text-xs">
                                    Format: YYYY-MM-DD
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const today = new Date();
                                        const month = String(today.getMonth() + 1).padStart(2, '0');
                                        const day = String(today.getDate()).padStart(2, '0');
                                        const year = today.getFullYear();
                                        const todayStr = `${year}-${month}-${day}`;
                                        validateAndSetDate(todayStr);
                                    }}
                                    className="text-xs text-green-500 hover:text-green-400 transition"
                                    disabled={loading || isLimitReached}
                                >
                                    Use Today
                                </button>
                            </div>
                        </div>

                        {/* Time Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Clock size={18} />
                                Show Time *
                            </label>

                            <div className="relative">
                                <input
                                    type="time"
                                    name="time"
                                    value={formatTimeForInput(newShow.time)}
                                    onChange={handleTimeChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading || isLimitReached}
                                    required
                                    step="1800" // 30 minute intervals
                                />

                                {/* Time Picker Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Open time picker
                                        const timeInput = document.querySelector('input[type="time"]');
                                        if (timeInput) {
                                            timeInput.showPicker();
                                        }
                                    }}
                                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition"
                                    disabled={loading || isLimitReached}
                                    title="Open time picker"
                                >
                                    <Clock className="" size={18} />
                                </button>
                            </div>

                            {/* Quick Time Selector */}
                            <div className="mt-3">
                                <p className="text-xs text-gray-400 mb-2">Popular show times:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "12:00 PM", value: "12:00 PM" },
                                        { label: "1:00 PM", value: "01:00 PM" },
                                        { label: "2:00 PM", value: "02:00 PM" },
                                        { label: "3:00 PM", value: "03:00 PM" },
                                        { label: "4:00 PM", value: "04:00 PM" },
                                        { label: "5:00 PM", value: "05:00 PM" },
                                        { label: "6:00 PM", value: "06:00 PM" },
                                        { label: "7:00 PM", value: "07:00 PM" },
                                        { label: "8:00 PM", value: "08:00 PM" },
                                        { label: "9:00 PM", value: "09:00 PM" },
                                        { label: "10:00 PM", value: "10:00 PM" },
                                    ].map((timeOption) => (
                                        <button
                                            key={timeOption.value}
                                            type="button"
                                            onClick={() => {
                                                // Convert to 24-hour format for input
                                                const [time, period] = timeOption.value.split(' ');
                                                let [hours, minutes] = time.split(':');

                                                hours = parseInt(hours);
                                                if (period === 'PM' && hours < 12) hours += 12;
                                                if (period === 'AM' && hours === 12) hours = 0;

                                                handleTimeChange({
                                                    target: {
                                                        value: `${String(hours).padStart(2, '0')}:${minutes}`
                                                    }
                                                });
                                            }}
                                            className={`px-2 py-1 text-xs rounded transition ${newShow.time === timeOption.value
                                                ? 'bg-green-500 text-black font-medium'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                            disabled={loading || isLimitReached}
                                        >
                                            {timeOption.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Display */}
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-gray-500 text-xs">
                                    {newShow.time ? `Selected: ${newShow.time}` : "Select or type time"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Clear time
                                            handleTimeChange({ target: { value: "" } });
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300 transition"
                                        disabled={loading || isLimitReached || !newShow.time}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Show Description
                        </label>
                        <textarea
                            name="description"
                            value={newShow.description || ''}
                            onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Describe the show, music genre, special guests, ticket info, etc."
                            rows="3"
                            disabled={loading || isLimitReached}
                            maxLength="1000"
                        />
                        <p className="text-gray-500 text-xs mt-2">
                            {newShow.description?.length || 0}/1000 characters
                        </p>
                    </div>

                    {/* Show Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <ImageIcon size={18} />
                            Show Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setNewShow({ ...newShow, image: e.target.files[0] })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-green-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            disabled={loading || isLimitReached}
                        />
                        <p className="text-gray-500 text-xs mt-2">
                            Upload a promotional image for the show (Max: 5MB, JPG/PNG) - Available for all users
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={loading || isLimitReached}
                            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition ${isLimitReached
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-[var(--primary)] hover:bg-primary/80 text-black hover:scale-105"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Scheduling Show...
                                </>
                            ) : (
                                <>
                                    <Music size={18} />
                                    {isLimitReached ? `Limit Reached (${MAX_SHOWS_PER_MONTH}/month)` : "Schedule Show"}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Usage Information */}
                {/* <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Shows This Month</p>
                            <p className="text-lg font-bold text-white">{showsThisMonth}/{MAX_SHOWS_PER_MONTH}</p>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Monthly Limit</p>
                            <p className="text-lg font-bold text-green-400">{MAX_SHOWS_PER_MONTH} shows</p>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Status</p>
                            <p className="text-lg font-bold text-blue-400">
                                {isLimitReached ? "Limit Reached" : "Available"}
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default AddShowTab;