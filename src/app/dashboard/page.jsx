"use client";

import { useSession } from "@/lib/auth";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    switch (user.userType?.toLowerCase()) {
      case "artist":
        router.replace("/dashboard/artist");
        break;
      case "venue":
        router.replace("/dashboard/venue");
        break;
      case "journalist":
        router.replace("/dashboard/journalist");
        break;
      case "admin":
        router.replace("/dashboard/admin");
        break;
      default:
        router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400">Checking your session.. </p>
        </div>
      </div>
    );
  }

  return null;
}
