"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderSuccess() {
    const router = useRouter();
    const params = useSearchParams();
    const sessionId = params.get("session_id");

    useEffect(() => {
        if (sessionId) {
            setTimeout(() => {
                router.push("/merch");
            }, 3000);
        }
    }, [sessionId]);

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
            <p className="text-gray-600 mt-2">
                Thank you for your purchase! Redirecting you to merchandise page...
            </p>

            <div className="mt-6 animate-bounce text-5xl">✔</div>
        </div>
    );
}
