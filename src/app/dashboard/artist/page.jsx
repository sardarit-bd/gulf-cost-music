"use client";

import LoadingState from "@/components/modules/artist/LoadingState";
import ArtistDashboard from "@/components/modules/dashboard/artists/ArtistDashboard";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingState />;
  if (!user) return <div>Please login</div>;

  return <ArtistDashboard key={user._id} />;
}
