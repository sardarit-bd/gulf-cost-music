import { Suspense } from "react";
import MarketLayout from "@/components/shared/market/MarketLayout";

export default function StudioDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketLayout userType="studio" />
        </Suspense>
    );
}