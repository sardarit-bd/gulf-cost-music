"use client";

import CustomLoader from "@/components/shared/loader/Loader";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PhotographerStats from "./PhotographerStats";
import PhotographerTable from "./PhotographerTable";
import { fetchPhotographersForAdmin } from "./photographer.api";

export default function PhotographerManagement() {
    const [loading, setLoading] = useState(true);
    const [photographers, setPhotographers] = useState([]);
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });

    const [filters, setFilters] = useState({
        search: "",
        page: 1,
        limit: 10,
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await fetchPhotographersForAdmin(filters);
            setPhotographers(res.content);
            setStats(res.stats);
            setPagination(res.pagination);
        } catch (err) {
            toast.error(err.message || "Failed to load photographers");
            setPhotographers([]);
            setStats({
                total: 0,
                pro: 0,
                free: 0,
                active: 0,
                inactive: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filters]);

    const onFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const onPageChange = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    if (loading && photographers.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen py-20 bg-white">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header - Matching Events Page */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        Photographer Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage photographer profiles, subscription plans, and activation status
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <PhotographerStats stats={stats} loading={loading} />

            {/* Table with integrated search */}
            <PhotographerTable
                photographers={photographers}
                pagination={pagination}
                filters={filters}
                onFilterChange={onFilterChange}
                onRefresh={loadData}
                onPageChange={onPageChange}
                loading={loading}
            />
        </div>
    );
}