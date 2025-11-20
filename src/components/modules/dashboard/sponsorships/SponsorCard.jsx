"use client";

import { Edit, ExternalLink, Trash2 } from "lucide-react";

export default function SponsorCard({ sponsor, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            {/* Sponsor Logo */}
            <div className="h-48 bg-gray-50 flex items-center justify-center p-6">
                <img
                    src={sponsor.logo?.url || sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-32 max-w-full object-contain"
                />
            </div>

            {/* Sponsor Info */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {sponsor.name}
                </h3>

                {sponsor.website && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
                        <ExternalLink className="w-4 h-4" />
                        <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                            title={sponsor.website}
                        >
                            {sponsor.website.replace(/^https?:\/\//, '')}
                        </a>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(sponsor)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit sponsor"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(sponsor)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete sponsor"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}