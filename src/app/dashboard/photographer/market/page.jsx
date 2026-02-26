import { Suspense } from "react";
import MarketLayout from "@/components/shared/market/MarketLayout";

export default function PhotographerMarketDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketLayout userType="photographer" />
        </Suspense>
    );
}