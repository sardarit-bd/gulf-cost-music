"use client";

import PhotographerManagement from "@/components/modules/admin/photographers/PhotographersDashboard";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";


export default function PhotographersPage() {
    return (
        <AdminLayout>
            <PhotographerManagement />
        </AdminLayout>
    );
}