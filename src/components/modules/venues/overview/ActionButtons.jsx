// components/venue/ActionButtons.js
import Link from "next/link";

export default function ActionButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Link
        href="/dashboard/venues/edit-profile"
        className="flex-1 min-w-[200px] bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl border border-gray-300 text-center transition shadow-sm hover:shadow"
      >
        Edit Profile
      </Link>
      <Link
        href="/dashboard/venues/add-show"
        className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-center transition shadow-sm hover:shadow"
      >
        Add New Show
      </Link>
      <Link
        href="/dashboard/venues"
        className="flex-1 min-w-[200px] bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl border border-gray-300 text-center transition shadow-sm hover:shadow"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
