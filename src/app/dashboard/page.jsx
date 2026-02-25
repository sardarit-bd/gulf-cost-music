"use client";

import CustomLoader from "@/components/shared/loader/Loader";
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

    const role = user.userType?.toLowerCase();

    switch (role) {
      case "artist":
        router.replace("/dashboard/artist");
        break;
      case "photographer":
        router.replace("/dashboard/photographer");
        break;
      case "venue":
        router.replace("/dashboard/venue");
        break;
      case "studio":
        router.replace("/dashboard/studio");
        break;
      case "journalist":
        router.replace("/dashboard/journalist");
        break;
      case "fan":
        router.replace("/dashboard/fan");
        break;
      case "admin":
        router.replace("/dashboard/admin");
        break;
      default:
        // fallback – invalid / corrupted role
        router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20 bg-white">
        <div className="text-center">
          <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return null;
}
