export function EmptyListingState({ onStart }) {
    return (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-transparent rounded-3xl border-2 border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
                <div className="relative mx-auto w-40 h-40 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl"></div>
                    <div className="relative bg-white rounded-full w-40 h-40 flex items-center justify-center border-2 border-gray-200">
                        <div className="text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto" />
                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Ready to Sell?
                </h3>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                    List your music gear, offer services, or sell merchandise. Reach thousands of musicians and fans on Gulf Coast's premier marketplace.
                </p>
                <button
                    onClick={onStart}
                    className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-semibold px-12 py-5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 transform hover:-translate-y-1 w-full max-w-sm"
                >
                    <span className="flex items-center justify-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        Create Your First Listing
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                </button>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
                    {[
                        { value: "0%", label: "Commission Fee", desc: "No hidden fees" },
                        { value: "24h", label: "Avg. Response", desc: "Fast replies" },
                        { value: "100%", label: "Secure", desc: "Stripe protected" },
                    ].map((item, index) => (
                        <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                            <div className="text-2xl font-bold text-gray-900 mb-2">{item.value}</div>
                            <div className="text-gray-700 font-medium">{item.label}</div>
                            <div className="text-gray-500 text-sm mt-1">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}