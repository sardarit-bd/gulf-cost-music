import MarketLayout from "@/components/shared/market/MarketLayout";
import { Suspense } from "react";

export default function FanMarketDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketLayout userType="fan" />
        </Suspense>
    );
}