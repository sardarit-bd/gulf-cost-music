import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function MarketplaceHeader({ venue }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/venues"
          className="p-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Venue Marketplace
          </h1>
          <p className="text-gray-600">
            Sell equipment and services to other venues
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Verified Venue
        </span>
      </div>
    </div>
  );
}
