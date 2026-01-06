import { Crown } from "lucide-react";

export default function UpgradePrompt({ feature }) {
    return (
        <div className="mt-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-start gap-3">
                <Crown className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
                <div>
                    <p className="text-sm text-gray-300">
                        <span className="font-medium">{feature}</span> is available for Pro users
                    </p>
                    <button
                        onClick={() => window.open("/pricing", "_blank")}
                        className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded font-medium transition"
                    >
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    );
}