"use client";

import { User, Key, Shield } from "lucide-react";

const ProfileHeader = ({ onOpenPasswordModal }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            Admin Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account settings and profile information
          </p>
        </div>
        <button
          onClick={onOpenPasswordModal}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium cursor-pointer border border-gray-300"
        >
          <Key className="w-4 h-4" />
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
