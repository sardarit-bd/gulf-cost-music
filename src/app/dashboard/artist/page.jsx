"use client";

// import ArtistDashboard from "@/components/modules/dashboard/artists/ArtistDashboard";
import withAuth from "@/utils/withAuth";
import ArtistDashboardPage from "./artistdashboard/page";

function DashboardPage() {
  return <ArtistDashboardPage />;
}

// Protect this page for artists only
export default withAuth(DashboardPage, ["artist"]);
