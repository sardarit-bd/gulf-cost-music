"use client";

import { User, Mail, Phone, FileText, Save, Loader2 } from "lucide-react";

const ProfileInfoForm = ({ form, onChange, onSubmit, saving }) => {
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      icon: User,
      type: "text",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      placeholder: "Enter your phone number",
      required: false,
    },
    {
      name: "bio",
      label: "Bio",
      icon: FileText,
      type: "textarea",
      placeholder: "Tell us about yourself...",
      required: false,
      rows: 4,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <User className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Profile Information
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Update your personal details
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-5 space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const value = form[field.name] || "";

          return (
            <div key={field.name}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={value}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white"
                  />
                )}
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoForm;
