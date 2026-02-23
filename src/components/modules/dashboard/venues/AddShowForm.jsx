"use client";

import {
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit3,
    ImageIcon,
    Music,
    X,
} from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function AddShowForm({
    initialData = null,
    onSubmit,
    onCancel,
    loading,
    venue,
}) {
    const [formData, setFormData] = useState({
        artist: initialData?.artistBandName || initialData?.artist || "",
        date: initialData?.date ? new Date(initialData.date) : null,
        time: initialData?.eventTime || initialData?.time || "",
        description: initialData?.description || "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(initialData?.image?.url || null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [customTimeMode, setCustomTimeMode] = useState(false);
    const [customTime, setCustomTime] = useState("");
    const [customTimeError, setCustomTimeError] = useState("");

    const datePickerRef = useRef(null);
    const timePickerRef = useRef(null);
    const customTimeInputRef = useRef(null);

    // Close pickers when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
            if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
                setShowTimePicker(false);
                setCustomTimeMode(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus custom time input when switching to custom mode
    useEffect(() => {
        if (customTimeMode && customTimeInputRef.current) {
            customTimeInputRef.current.focus();
        }
    }, [customTimeMode]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // FIXED: Time format conversion
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.artist || !formData.date || !formData.time) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!initialData && !formData.image && !imagePreview) {
            toast.error("Please upload a show image");
            return;
        }

        // Format date for API
        const formattedDate = moment(formData.date).format('MM/DD/YYYY');

        // Convert time from 24-hour to 12-hour format with AM/PM
        let formattedTime = formData.time;

        // Check if time is in HH:MM format (24-hour)
        if (formData.time && formData.time.includes(':')) {
            const [hours, minutes] = formData.time.split(':');
            const hour = parseInt(hours);
            const minute = parseInt(minutes);

            // Create date object for time conversion
            const timeDate = new Date();
            timeDate.setHours(hour, minute);

            // Format to 12-hour with AM/PM
            formattedTime = timeDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            // Example: "02:30 PM" (with space)
        }

        onSubmit({
            ...formData,
            date: formattedDate,
            time: formattedTime
        });
    };

    const getMinDate = () => {
        return new Date(); // Today
    };

    // Calendar Functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (selectedDate >= getMinDate()) {
            setFormData({ ...formData, date: selectedDate });
            setShowDatePicker(false);
        }
    };

    const formatDisplayDate = (date) => {
        if (!date) return "Select date";
        return moment(date).format('MMMM D, YYYY');
    };

    const formatDisplayTime = (time) => {
        if (!time) return "Select time";

        // If it's already in 12-hour format with AM/PM, return as is
        if (time.includes('AM') || time.includes('PM')) {
            return time;
        }

        // If it's in HH:MM format, convert to 12-hour for display
        if (time.includes(':')) {
            return moment(time, 'HH:mm').format('h:mm A');
        }
        return time;
    };

    // Validate custom time (24-hour format for input)
    const validateCustomTime = (time) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    };

    const handleCustomTimeChange = (e) => {
        const value = e.target.value;
        setCustomTime(value);

        if (value && !validateCustomTime(value)) {
            setCustomTimeError("Please use HH:MM format (e.g., 14:30)");
        } else {
            setCustomTimeError("");
        }
    };

    const handleCustomTimeSubmit = () => {
        if (!customTime) {
            setCustomTimeError("Please enter a time");
            return;
        }

        if (!validateCustomTime(customTime)) {
            setCustomTimeError("Please use HH:MM format (e.g., 14:30)");
            return;
        }

        setFormData({ ...formData, time: customTime });
        setCustomTimeMode(false);
        setShowTimePicker(false);
        setCustomTime("");
        setCustomTimeError("");
    };

    // Generate time slots (every 30 minutes) - Store in 24-hour format
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 30]) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Group time slots by period
    const morningSlots = timeSlots.filter(t => {
        const hour = parseInt(t.split(':')[0]);
        return hour >= 5 && hour < 12;
    });

    const afternoonSlots = timeSlots.filter(t => {
        const hour = parseInt(t.split(':')[0]);
        return hour >= 12 && hour < 17;
    });

    const eveningSlots = timeSlots.filter(t => {
        const hour = parseInt(t.split(':')[0]);
        return hour >= 17 || hour < 5;
    });

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        // Week days header
        const weekDaysHeader = weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
            </div>
        ));

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2" />);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isToday = moment(date).isSame(new Date(), 'day');
            const isSelected = formData.date && moment(date).isSame(formData.date, 'day');
            const isPast = date < getMinDate() && !moment(date).isSame(getMinDate(), 'day');
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            days.push(
                <button
                    key={day}
                    onClick={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                    className={`
                        p-2 text-sm rounded-lg transition-all
                        ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'}
                        ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                        ${isToday && !isSelected ? 'border-2 border-blue-200 font-bold' : ''}
                        ${isWeekend && !isSelected && !isPast ? 'text-red-500' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="p-4">
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <h4 className="font-semibold text-gray-800">
                        {moment(currentMonth).format('MMMM YYYY')}
                    </h4>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ChevronRight size={18} className="text-gray-600" />
                    </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDaysHeader}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    };

    const renderTimePicker = () => (
        <div className="p-4">
            {/* Header with Custom/Preset toggle */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h4 className="font-semibold text-gray-800">Select Show Time</h4>
                <button
                    type="button"
                    onClick={() => {
                        setCustomTimeMode(!customTimeMode);
                        setCustomTime("");
                        setCustomTimeError("");
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                >
                    {customTimeMode ? (
                        <>Preset Times</>
                    ) : (
                        <>
                            <Edit3 size={14} />
                            Custom Time
                        </>
                    )}
                </button>
            </div>

            {customTimeMode ? (
                // Custom Time Input
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Enter Time (24-hour format)
                        </label>
                        <div className="flex gap-2">
                            <input
                                ref={customTimeInputRef}
                                type="text"
                                value={customTime}
                                onChange={handleCustomTimeChange}
                                placeholder="HH:MM (e.g., 14:30)"
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleCustomTimeSubmit();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleCustomTimeSubmit}
                                disabled={!customTime || customTimeError}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={18} />
                            </button>
                        </div>
                        {customTimeError && (
                            <p className="text-xs text-red-500 mt-1">{customTimeError}</p>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">
                        Example: 09:30, 14:45, 23:15
                    </p>
                </div>
            ) : (
                // Preset Time Slots
                <div className="max-h-80 overflow-y-auto pr-1">
                    <div className="space-y-4">
                        {/* Morning */}
                        {morningSlots.length > 0 && (
                            <div>
                                <h5 className="text-xs font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">
                                    Morning (5 AM - 12 PM)
                                </h5>
                                <div className="grid grid-cols-3 gap-2">
                                    {morningSlots.map(time => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, time });
                                                setShowTimePicker(false);
                                            }}
                                            className={`
                                                px-2 py-2 text-xs rounded-lg border transition-all
                                                ${formData.time === time
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                }
                                            `}
                                        >
                                            {moment(time, 'HH:mm').format('h:mm A')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Afternoon */}
                        {afternoonSlots.length > 0 && (
                            <div>
                                <h5 className="text-xs font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">
                                    Afternoon (12 PM - 5 PM)
                                </h5>
                                <div className="grid grid-cols-3 gap-2">
                                    {afternoonSlots.map(time => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, time });
                                                setShowTimePicker(false);
                                            }}
                                            className={`
                                                px-2 py-2 text-xs rounded-lg border transition-all
                                                ${formData.time === time
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                }
                                            `}
                                        >
                                            {moment(time, 'HH:mm').format('h:mm A')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Evening */}
                        {eveningSlots.length > 0 && (
                            <div>
                                <h5 className="text-xs font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">
                                    Evening (5 PM - 5 AM)
                                </h5>
                                <div className="grid grid-cols-3 gap-2">
                                    {eveningSlots.map(time => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, time });
                                                setShowTimePicker(false);
                                            }}
                                            className={`
                                                px-2 py-2 text-xs rounded-lg border transition-all
                                                ${formData.time === time
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                }
                                            `}
                                        >
                                            {moment(time, 'HH:mm').format('h:mm A')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Artist */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Music size={18} className="text-gray-500" />
                    Artist / Band Name *
                </label>
                <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-sm"
                    placeholder="Enter artist or band name"
                    required
                    disabled={loading || initialData}
                />
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Modern Date Picker */}
                <div ref={datePickerRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={18} className="text-gray-500" />
                        Show Date *
                    </label>

                    {initialData ? (
                        // Edit mode - date is fixed, just display
                        <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-between">
                            <span>{formatDisplayDate(formData.date)}</span>
                            <Calendar size={18} className="text-gray-400" />
                        </div>
                    ) : (
                        // Add mode - date picker enabled
                        <>
                            <button
                                type="button"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-left flex items-center justify-between hover:border-blue-400 transition shadow-sm"
                            >
                                <span className={`${formData.date ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {formatDisplayDate(formData.date)}
                                </span>
                                <Calendar size={18} className="text-gray-400" />
                            </button>

                            {/* Custom Calendar Dropdown */}
                            {showDatePicker && (
                                <div className="absolute z-50 mt-2 w-80 bg-white text-gray-600 rounded-xl shadow-xl border border-gray-200">
                                    {renderCalendar()}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Modern Time Picker with Custom Option */}
                <div ref={timePickerRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={18} className="text-gray-500" />
                        Show Time *
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowTimePicker(!showTimePicker)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-left flex items-center justify-between hover:border-blue-400 transition shadow-sm"
                    >
                        <span className={`${formData.time ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formatDisplayTime(formData.time)}
                        </span>
                        <Clock size={18} className="text-gray-400" />
                    </button>

                    {/* Custom Time Picker Dropdown */}
                    {showTimePicker && (
                        <div className="absolute z-50 mt-2 w-80 text-gray-700 rounded-xl shadow-xl border border-gray-200 bg-white">
                            {renderTimePicker()}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Show Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-sm"
                    placeholder="Describe the show, music genre, special guests, ticket info, etc."
                    rows="3"
                    disabled={loading}
                    maxLength="1000"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">
                        {formData.description.length}/1000
                    </span>
                </div>
            </div>

            {/* Show Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon size={18} className="text-gray-500" />
                    Show Image {!initialData && '*'}
                </label>

                {imagePreview && (
                    <div className="mb-4 relative w-full max-w-md h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img
                            src={imagePreview}
                            alt="Show preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setImagePreview(null);
                                setFormData({ ...formData, image: null });
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="show-image-upload"
                        required={!initialData && !imagePreview}
                        disabled={loading}
                    />
                    <label
                        htmlFor="show-image-upload"
                        className={`
                            flex items-center justify-center gap-2 w-full px-4 py-3 
                            rounded-xl border-2 border-dashed transition cursor-pointer
                            ${imagePreview
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-blue-400 hover:bg-blue-50'
                            }
                        `}
                    >
                        <ImageIcon size={18} />
                        <span>
                            {imagePreview ? 'Change Image' : 'Click to upload show image'}
                        </span>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
                </p>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        initialData ? 'Update Show' : 'Add Show'
                    )}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}