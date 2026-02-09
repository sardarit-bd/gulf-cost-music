import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function VerificationAlert() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
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

        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto border border-gray-200 shadow-sm">
            <Shield className="w-14 h-14 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verification Required
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Only verified venues can list items on the marketplace. Please
              complete verification to continue.
            </p>
            <Link
              href="/dashboard/venues/edit-profile"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition block text-center shadow-sm"
            >
              Complete Verification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
