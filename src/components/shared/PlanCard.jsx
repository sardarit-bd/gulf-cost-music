import { Check } from "lucide-react";

export const PlanCard = ({
    plan,
    selected,
    onSelect,
    price,
    features,
    icon: Icon,
    recommended = false,
    disabled = false
}) => {
    return (
        <div
            onClick={() => !disabled && onSelect(plan)}
            className={`relative flex-1 cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${selected
                ? "border-yellow-500 bg-yellow-50 shadow-lg"
                : disabled
                    ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50"
                }`}
        >
            {recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    🔥 RECOMMENDED
                </div>
            )}

            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${selected ? 'bg-yellow-500' : 'bg-gray-100'}`}>
                    <Icon className={`h-5 w-5 ${selected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{plan === 'free' ? 'Free Plan' : 'Pro Plan'}</h3>
                    <p className="text-sm text-gray-500">{price}</p>
                </div>
            </div>

            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${selected ? 'text-yellow-600' : 'text-gray-400'}`} />
                        <span className="text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};