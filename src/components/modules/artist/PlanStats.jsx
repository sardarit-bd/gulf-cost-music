import { Crown, ImageIcon, Music2 } from "lucide-react";

export default function PlanStats({ subscriptionPlan, photosCount, audiosCount }) {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <ImageIcon size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white font-medium">Photo Uploads</p>
                        <p className="text-gray-400 text-sm">
                            {subscriptionPlan === "pro"
                                ? `${photosCount}/5 photos allowed`
                                : "Not available in Free plan"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Music2 size={20} className="text-purple-400" />
                    </div>
                    <div>
                        <p className="text-white font-medium">Audio Uploads</p>
                        <p className="text-gray-400 text-sm">
                            {subscriptionPlan === "pro"
                                ? `${audiosCount}/5 audio files allowed`
                                : "Not available in Free plan"}
                        </p>
                    </div>
                </div>

                {subscriptionPlan === "free" && (
                    <button
                        onClick={() => window.open("/pricing", "_blank")}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition"
                    >
                        <Crown size={16} />
                        Upgrade to Pro
                    </button>
                )}
            </div>
        </div>
    );
}