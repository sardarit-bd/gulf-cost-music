"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

const EditModal = ({
  isOpen,
  onClose,
  onSave,
  fieldName,
  currentValue,
  fieldType,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue(currentValue || "");
    }
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const getInputType = () => {
    if (fieldType === "email") return "email";
    if (fieldType === "phone") return "tel";
    if (fieldType === "url") return "url";
    return "text";
  };

  const getPlaceholder = () => {
    const placeholders = {
      phone: "+1 234 567 8900",
      email: "contact@example.com",
      instagram: "https://instagram.com/username",
      youtube: "https://youtube.com/channel",
    };
    return placeholders[fieldType] || "Enter value";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full z-10">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit {fieldName}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {fieldName}
            </label>
            <input
              type={getInputType()}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition text-gray-700"
              placeholder={getPlaceholder()}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">
              Click outside or press Enter to save
            </p>
          </div>

          <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-amber-700 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
