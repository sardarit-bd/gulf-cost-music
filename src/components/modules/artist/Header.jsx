import { Music2 } from "lucide-react";
import PlanBadge from "./PlanBadge";

export default function Header({ subscriptionPlan }) {
    return (
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-2 bg-yellow-500 rounded-lg">
                    <Music2 size={32} className="text-black" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white">Artist Dashboard</h1>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <PlanBadge subscriptionPlan={subscriptionPlan} />
                    </div>
                </div>
            </div>
            <p className="text-gray-400 text-lg">
                Manage your artist profile and media files
            </p>
        </div>
    );
}