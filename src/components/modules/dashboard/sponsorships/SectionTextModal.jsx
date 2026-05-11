"use client";

import { Loader2, Settings, X } from "lucide-react";
import { useState } from "react";

const SectionTextModal = ({ sectionText, isLoading, onSave, onClose }) => {
  const [title, setTitle] = useState(sectionText.sectionTitle);
  const [subtitle, setSubtitle] = useState(sectionText.sectionSubtitle);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ sectionTitle: title, sectionSubtitle: subtitle });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Page Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-5">
            <h3 className="text-xs font-medium text-gray-500 mb-2">Preview</h3>
            <p className="text-base font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              required
              placeholder="Our Sponsors"
            />
          </div>

          {/* Section Subtitle */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Description *
            </label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              rows="3"
              className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
              required
              placeholder="We're proud to partner with amazing local businesses and community supporters."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionTextModal;
