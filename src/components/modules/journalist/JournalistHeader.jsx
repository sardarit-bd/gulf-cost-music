import { Newspaper } from "lucide-react";

export default function JournalistHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Newspaper size={28} className="text-white" />
        </div>
        Journalist Dashboard
      </h1>
      <p className="text-gray-600">
        Manage your profile and publish news stories
      </p>
    </div>
  );
}
