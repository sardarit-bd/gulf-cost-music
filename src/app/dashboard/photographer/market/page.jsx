// "use client";

import MarketLayout from "@/components/shared/market/MarketLayout";

// import MarketplacePage from '@/components/modules/dashboard/photographer/Market/MarketplacePage';
// import { useAuth } from "@/context/AuthContext";

// const MarketplacePageRoute = () => {
//     const { user } = useAuth();
//     const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

//     return (
//         <MarketplacePage
//             API_BASE={API_BASE}
//             subscriptionPlan={user?.subscriptionPlan || "free"}
//             user={user}
//         />
//     );
// }

// export default MarketplacePageRoute;

export default function PhotographerMarketDashboard() {
    return (
        <div>
            <MarketLayout userType="photographer" />
        </div>
    );
}