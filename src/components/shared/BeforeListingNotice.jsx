"use client";


export default function BeforeListingNotice({
    title = "Before listing an item",
    steps = [],
    buttonText = "Connect Stripe Account",
    onButtonClick,
}) {
    return (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-md">
            <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                {title}
            </h3>

            <ul className="space-y-2 text-sm text-gray-300">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-400">{index + 1}.</span>
                        <span dangerouslySetInnerHTML={{ __html: step }} />
                    </li>
                ))}
            </ul>

            {onButtonClick && (
                <button
                    onClick={onButtonClick}
                    className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                    {buttonText}
                </button>
            )}

            <p className="text-xs text-gray-400 mt-2">
                Stripe is required to securely send your earnings to you.
            </p>
        </div>
    );
}
