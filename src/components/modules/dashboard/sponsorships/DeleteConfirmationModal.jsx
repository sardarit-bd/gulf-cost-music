"use client";

import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmationModal = ({ item, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full z-10">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Sponsor
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-gray-700 text-sm mb-2">
            Are you sure you want to delete this sponsor?
          </p>
          <p className="font-medium text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
            "{item?.name}"
          </p>
          <p className="text-xs text-red-600 mt-3">
            This action cannot be undone. All data associated with this sponsor
            will be permanently removed.
          </p>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            Delete Sponsor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
