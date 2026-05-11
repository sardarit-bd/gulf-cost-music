"use client";

import { X } from "lucide-react";
import { useState } from "react";

const EditModal = ({
  isOpen,
  onClose,
  onSave,
  fieldName,
  currentValue,
  isTextarea = false,
}) => {
  if (!isOpen) return null;

  return (
    <EditModalContent
      key={`${fieldName}-${String(currentValue ?? "")}`}
      onClose={onClose}
      onSave={onSave}
      fieldName={fieldName}
      currentValue={currentValue}
      isTextarea={isTextarea}
    />
  );
};

const EditModalContent = ({
  onClose,
  onSave,
  fieldName,
  currentValue,
  isTextarea,
}) => {
  const [value, setValue] = useState(currentValue || "");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full z-10">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Edit {fieldName}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          {isTextarea ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              className="text-gray-500 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
              placeholder={`Enter ${fieldName.toLowerCase()}`}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-gray-500 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              placeholder={`Enter ${fieldName.toLowerCase()}`}
              autoFocus
            />
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(value)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
