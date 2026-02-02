import { AlertTriangle, ArrowRight } from "lucide-react";

export default function StripeConnectPrompt() {
    const handleStripeConnect = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/onboard`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Stripe connection failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Connect Stripe Account Required
                    </h3>
                    <p className="text-gray-700 mb-4">
                        To receive payments for your listings, you need to connect your Stripe account.
                        This is required for secure payment processing.
                    </p>
                    <button
                        onClick={handleStripeConnect}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition shadow-sm"
                    >
                        Connect Stripe Account
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                        Stripe is required to securely send your earnings to you.
                    </p>
                </div>
            </div>
        </div>
    );
}