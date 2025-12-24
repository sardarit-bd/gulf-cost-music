import { Loader } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-screen py-20">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-400">Loading artist dashboard...</p>
      </div>
    </div>
  );
}
