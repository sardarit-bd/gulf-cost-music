"use client";

import ArtistDashboard from "@/components/modules/dashboard/artists/ArtistDashboard";
import withAuth from "@/utils/withAuth";

function DashboardPage() {
  return <ArtistDashboard />;
}

// Protect this page for artists only
export default withAuth(DashboardPage, ["artist"]);
