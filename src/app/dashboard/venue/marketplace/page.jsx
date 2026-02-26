import { Suspense } from "react";
import MarketLayout from "@/components/shared/market/MarketLayout";

export default function VenueMarketDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketLayout userType="venue" />
    </Suspense>
  );
}