const InfoCard = ({ icon, label, value, isProFeature = false }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400 mb-1">{label}</h4>
                {isProFeature && (
                    <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                        Pro
                    </span>
                )}
            </div>
            <p className="text-white font-semibold">{value || "Not specified"}</p>
        </div>
    </div>
);

export default InfoCard;