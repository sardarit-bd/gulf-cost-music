import { Ban, CheckCircle, Crown, Eye, Globe, Mail, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    togglePhotographerStatus
} from "./photographer.api";

export default function PhotographerRow({
    photographer,
    onRefresh,
    onView,
    onDelete,
    onPlan,
}) {
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        try {
            setLoading(true);
            await togglePhotographerStatus(
                photographer._id,
                photographer.isActive
            );
            toast.success(
                `Photographer ${photographer.isActive ? "deactivated" : "activated"}`
            );
            onRefresh();
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <tr className="border-t border-gray-300 hover:bg-gray-50 transition-colors">
            <td className="p-4 max-w-[90px]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold">
                        {photographer.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div>
                        <p
                            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => onView(photographer)}
                        >
                            {photographer.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Globe size={12} />
                            <span>{photographer.city || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td className="p-4 text-gray-600 max-w-[120px]">
                <p
                    className="font-medium text-gray-900 line-clamp-1 break-all"
                    title={photographer.user?.email}
                >
                    {photographer.user?.email}
                </p>

                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Mail size={12} />
                    {new Date(photographer.createdAt).toLocaleDateString()}
                </div>
            </td>


            <td className="p-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs ${photographer.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {photographer.isActive ? "Active" : "Inactive"}
                </span>
            </td>

            <td className="p-4">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                        {photographer.user?.subscriptionPlan?.toUpperCase() || "FREE"}
                    </span>
                    {photographer.user?.subscriptionPlan === "pro" && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                </div>
            </td>

            <td className="p-4 ">
                <div className="flex gap-4">
                    <button onClick={() => onView(photographer)} title="View">
                        <Eye size={16} className="text-gray-600" />
                    </button>

                    <button onClick={toggleStatus} disabled={loading}>
                        {photographer.isActive ? (
                            <Ban size={16} className="text-red-500" />
                        ) : (
                            <CheckCircle size={16} className="text-green-500" />
                        )}
                    </button>

                    <button onClick={() => onPlan(photographer)}>
                        <RefreshCw size={16} className="text-blue-500" />
                    </button>

                    <button onClick={() => onDelete(photographer)}>
                        <Trash2 size={16} className="text-red-500" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
