export default function SubscriptionCancel() {
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>❌ Payment Cancelled</h1>
            <p>You cancelled the subscription process.</p>

            <a href="/dashboard" style={{ marginTop: "20px", display: "inline-block" }}>
                Go back
            </a>
        </div>
    );
}