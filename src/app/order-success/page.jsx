import OrderSuccessClient from "@/components/modules/merch/order-success/OrderSuccessClient";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <OrderSuccessClient />
        </Suspense>
    );
}
