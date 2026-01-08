"use client";
import { Loader2, Save, X } from "lucide-react";

const WaveForm = ({
    showForm,
    editingItem,
    formData,
    saveLoading,
    onClose,
    onSubmit,
    onInputChange
}) => {
    if (!showForm) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {editingItem ? "Edit Open Mic Session" : "Add New Session"}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onInputChange('title', e.target.value)}
                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                            placeholder="Enter open mic session title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            YouTube URL *
                        </label>
                        <input
                            type="url"
                            value={formData.youtubeUrl}
                            onChange={(e) => onInputChange('youtubeUrl', e.target.value)}
                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail URL
                        </label>
                        <input
                            type="url"
                            value={formData.thumbnail}
                            onChange={(e) => onInputChange('thumbnail', e.target.value)}
                            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                            placeholder="https://example.com/thumbnail.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to use YouTube thumbnail
                        </p>
                    </div> */}
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base order-2 sm:order-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saveLoading}
                        className="px-4 sm:px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-primary/80 font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base order-1 sm:order-2"
                    >
                        {saveLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>{editingItem ? "Updating..." : "Adding..."}</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{editingItem ? "Update Session" : "Add Session"}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WaveForm;