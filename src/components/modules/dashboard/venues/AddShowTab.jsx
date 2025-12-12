import Input from "@/ui/Input";
import { Calendar, Clock, ImageIcon, Loader2, Music, XCircle } from "lucide-react";

const AddShowTab = ({
    newShow,
    setNewShow,
    handleAddShow,
    loading,
    subscriptionPlan,
    showsThisMonth,
    UpgradePrompt,
}) => {
    const isFreeLimitReached = subscriptionPlan === "free" && showsThisMonth >= 1;
    const currentDate = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-8">
            {/* Plan Status */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Music size={24} />
                            Add New Show
                        </h3>
                        <p className="text-gray-400 mt-1">
                            Schedule a live performance at your venue
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${subscriptionPlan === "pro" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-700 text-gray-300"}`}>
                        <span className="font-medium">
                            {subscriptionPlan === "pro" ? "Unlimited shows" : `${showsThisMonth}/1 show this month`}
                        </span>
                    </div>
                </div>

                {isFreeLimitReached && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <XCircle className="text-red-400" size={20} />
                            <div>
                                <h4 className="text-red-400 font-semibold">Monthly Limit Reached</h4>
                                <p className="text-red-300/80 text-sm">
                                    Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleAddShow} className="space-y-6">
                    {/* Artist */}
                    <Input
                        label="Artist / Band Name *"
                        name="artist"
                        value={newShow.artist}
                        onChange={(e) => setNewShow({ ...newShow, artist: e.target.value })}
                        icon={<Music size={18} />}
                        placeholder="Enter artist or band name"
                        disabled={loading || isFreeLimitReached}
                    />

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Show Date *"
                            name="date"
                            type="date"
                            value={newShow.date}
                            onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                            icon={<Calendar size={18} />}
                            disabled={loading || isFreeLimitReached}
                            min={currentDate}
                        />
                        <Input
                            label="Show Time *"
                            name="time"
                            type="time"
                            value={newShow.time}
                            onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                            icon={<Clock size={18} />}
                            disabled={loading || isFreeLimitReached}
                        />
                    </div>

                    {/* Show Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <ImageIcon size={18} />
                            Show Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setNewShow({ ...newShow, image: e.target.files[0] })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            disabled={loading || isFreeLimitReached}
                        />
                        <p className="text-gray-500 text-xs mt-2">
                            Upload a promotional image for the show
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={loading || isFreeLimitReached}
                            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition ${isFreeLimitReached
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-105"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Adding Show...
                                </>
                            ) : (
                                <>
                                    <Music size={18} />
                                    {isFreeLimitReached ? "Limit Reached" : "Add Show"}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {subscriptionPlan === "free" && !isFreeLimitReached && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <UpgradePrompt feature="Unlimited shows" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddShowTab;