import MarketLayout from "@/components/shared/market/MarketLayout";
import { Suspense } from "react";

export default function ArtistMarketDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketLayout userType="artist" />
        </Suspense>
    );
}