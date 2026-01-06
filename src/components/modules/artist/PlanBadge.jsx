import { Crown, Users } from "lucide-react";

export default function PlanBadge({ subscriptionPlan }) {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${subscriptionPlan === "pro"
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-gray-700 text-gray-300 border border-gray-600"
            }`}>
            {subscriptionPlan === "pro" ? (
                <>
                    <Crown size={14} />
                    Pro Plan
                </>
            ) : (
                <>
                    <Users size={14} />
                    Free Plan
                </>
            )}
        </div>
    );
}