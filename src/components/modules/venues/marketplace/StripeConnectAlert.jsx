export default function StripeConnectAlert({ onConnect }) {
  return (
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-md">
      <h3 className="text-yellow-800 font-semibold text-lg mb-2">
        Before listing an item
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-yellow-600 font-bold">1.</span>
          Connect your{" "}
          <strong className="text-yellow-700">Stripe account</strong> to receive
          payments
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-600 font-bold">2.</span>
          Complete venue verification (business details & payout info)
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-600 font-bold">3.</span>
          Add at least one photo and a valid price
        </li>
      </ul>
      <button
        onClick={onConnect}
        className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold transition shadow-sm"
      >
        Connect Stripe Account
      </button>
      <p className="text-xs text-gray-600 mt-2">
        Stripe is required to securely send your earnings to you.
      </p>
    </div>
  );
}
