"use client";

import { useSearchParams } from "next/navigation";

export default function SubscriptionSuccess() {
    const params = useSearchParams();
    const sessionId = params.get("session_id");

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>✅ Subscription Successful</h1>
            <p>Your Pro subscription has been activated.</p>

            <p style={{ marginTop: "10px", color: "gray" }}>
                Session ID: {sessionId}
            </p>

            <a href="/dashboard" style={{ marginTop: "20px", display: "inline-block" }}>
                Go to Dashboard
            </a>
        </div>
    );
}