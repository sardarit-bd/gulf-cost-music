import { Suspense } from "react";
import MarketLayout from "@/components/shared/market/MarketLayout";

export default function JournalistMarketDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketLayout userType="journalist" />
        </Suspense>
    );
}