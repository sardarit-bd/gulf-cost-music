import { Save } from "lucide-react";

export default function SaveButton({ onClick, saving }) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className={`flex items-center gap-2 px-10 py-3 rounded-lg font-medium shadow-lg transition ${saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black hover:scale-105"
                }`}
        >
            {saving ? (
                <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Saving...
                </>
            ) : (
                <>
                    <Save size={18} /> Save Changes
                </>
            )}
        </button>
    );
}