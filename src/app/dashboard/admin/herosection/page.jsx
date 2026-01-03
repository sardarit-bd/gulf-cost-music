"use client";

import HeroManagerDashboard from "@/components/modules/admin/hero/HeroManagerDashboard";
import AdminLayout from "@/components/modules/dashboard/AdminLayout";

export default function HeroManagerPage() {
  return (
    <AdminLayout>
      <HeroManagerDashboard />
    </AdminLayout>
  );
}