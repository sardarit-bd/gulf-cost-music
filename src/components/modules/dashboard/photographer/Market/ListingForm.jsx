import Select from "@/ui/Select";
import { AlertCircle, DollarSign, FileText, MapPin } from "lucide-react";

const STATE_OPTIONS = [
    { value: "", label: "Select a state", disabled: true },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Alabama", label: "Alabama" },
    { value: "Florida", label: "Florida" }
];

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "hidden", label: "Hidden" },
    { value: "sold", label: "Sold" }
];

export default function ListingForm({
    formData,
    errors,
    onChange,
    onSelectChange,
    existingItem
}) {
    return (
        <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        placeholder="e.g., Fender Stratocaster, Studio Session Service"
                        className={`w-full bg-white border ${errors.title ? "border-red-500" : "border-gray-300"
                            } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.title && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (USD) *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={onChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className={`w-full bg-white border ${errors.price ? "border-red-500" : "border-gray-300"
                                } rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                    </div>
                    {errors.price && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.price}
                        </p>
                    )}
                </div>

                {/* State */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                    </label>
                    <Select
                        name="location"
                        value={formData.location}
                        options={STATE_OPTIONS}
                        onChange={(e) => onSelectChange("location", e.target.value)}
                        placeholder="Select a state"
                        icon={<MapPin className="w-4 h-4 text-gray-400" />}
                    />
                    {errors.location && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.location}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Status
                    </label>
                    <Select
                        name="status"
                        value={formData.status}
                        options={STATUS_OPTIONS}
                        onChange={(e) => onSelectChange("status", e.target.value)}
                        placeholder="Select status"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            rows="6"
                            className={`w-full bg-white border ${errors.description ? "border-red-500" : "border-gray-300"
                                } rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                    </div>
                    {errors.description && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description}
                        </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                        Detailed descriptions increase trust and sales
                    </p>
                </div>
            </div>
        </div>
    );
}