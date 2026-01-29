"use client";

import LoadingState from "@/components/modules/artist/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(WrappedComponent, allowedRoles = []) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push("/signin");
          return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
          router.push("/unauthorized");
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return <LoadingState />;
    }

    if (!user) return null;

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
