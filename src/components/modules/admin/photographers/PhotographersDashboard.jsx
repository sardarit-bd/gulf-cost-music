"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PhotographerFilters from "./PhotographerFilters";
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
        status: "all",
        plan: "all",
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
            // Set empty data on error
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
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border animate-pulse">
                            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Photographer Management</h1>
                <p className="text-gray-600 mt-1">
                    Manage photographer profiles, plans & activation
                </p>
            </div>

            {/* Stats */}
            <PhotographerStats stats={stats} loading={loading} />

            {/* Filters */}
            <PhotographerFilters filters={filters} onChange={onFilterChange} />

            {/* Table */}
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