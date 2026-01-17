import { Crown } from "lucide-react";

export default function UpgradePrompt({ feature, onUpgrade }) {
    return (
        <div className="mt-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-start gap-3">
                <Crown className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
                <div>
                    <p className="text-sm text-gray-300">
                        <span className="font-medium">{feature}</span> is available for Pro users
                    </p>
                    <button
                        onClick={onUpgrade}
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 
             hover:from-yellow-500 hover:to-yellow-700 
             text-black px-5 py-2.5 rounded-xl font-semibold 
             shadow-md hover:shadow-lg transition-all"
                    >
                        <Crown size={16} />
                        Upgrade to Pro · $10/month
                    </button>
                </div>
            </div>
        </div>
    );
}