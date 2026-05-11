"use client";

import { Layout } from "lucide-react";

const FooterHeader = ({ isEditMode }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          Footer Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isEditMode
            ? "Edit mode active - Make your changes and save"
            : "Manage your website footer content and links"}
        </p>
      </div>
      {isEditMode && (
        <div className="mt-3 lg:mt-0">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Edit Mode
          </span>
        </div>
      )}
    </div>
  );
};

export default FooterHeader;
