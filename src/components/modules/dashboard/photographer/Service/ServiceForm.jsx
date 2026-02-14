// components/modules/dashboard/photographer/ServiceForm.jsx
"use client";

import Input from "@/ui/Input";
import Select from "@/ui/Select"; // আপনার দেওয়া Select কম্পোনেন্ট
import {
  Clock,
  DollarSign,
  Loader2,
  Mail,
  Phone,
  Plus,
  Tag,
  User,
} from "lucide-react";

export default function ServiceForm({
  formData,
  onChange,
  onContactChange,
  onSubmit,
  onCancel,
  isEditing = false,
  saving = false,
  errors = {},
  categoryOptions,
  durationOptions,
  userEmail,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 sticky top-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isEditing
                ? "Update your service details"
                : "Fill in the details below"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <Input
          label="Service Name *"
          name="service"
          value={formData.service}
          onChange={onChange}
          placeholder="Portrait Photography"
          required
          error={errors.service}
        />

        <Input
          label="Price *"
          name="price"
          value={formData.price}
          onChange={onChange}
          placeholder="$199"
          required
          error={errors.price}
          icon={<DollarSign className="w-4 h-4" />}
        />

        {/* Category Select */}
        <Select
          label="Category"
          name="category"
          value={formData.category}
          options={categoryOptions}
          onChange={onChange}
          icon={<Tag className="w-4 h-4" />}
        />

        {/* Duration Select */}
        <Select
          label="Duration"
          name="duration"
          value={formData.duration}
          options={durationOptions}
          onChange={onChange}
          icon={<Clock className="w-4 h-4" />}
        />

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Contact Information
          </h4>
          <div className="space-y-4">
            <Input
              label="Email"
              name="email"
              value={formData.contact?.email || ""}
              onChange={onContactChange}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone (Optional)"
              name="phone"
              value={formData.contact?.phone || ""}
              onChange={onContactChange}
              icon={<Phone className="w-4 h-4" />}
            />

            {/* Preferred Contact Select */}
            <Select
              label="Preferred Contact"
              name="preferredContact"
              value={formData.contact?.preferredContact || "email"}
              options={[
                { value: "email", label: "Email" },
                { value: "phone", label: "Phone" },
              ]}
              onChange={onContactChange}
              icon={<User className="w-4 h-4" />}
            />

            <label className="flex items-center gap-2 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                name="showPhonePublicly"
                checked={formData.contact?.showPhonePublicly || false}
                onChange={onContactChange}
                className="rounded cursor-pointer w-4 h-4"
              />
              Show phone publicly
            </label>
          </div>
        </div>

        {/* <Textarea
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={3}
          placeholder="Describe this service..."
        /> */}

        <div className="flex gap-3 pt-2">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving || !formData.service || !formData.price}
            className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg ${
              isEditing ? "" : "w-full"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{isEditing ? "Update Service" : "Add Service"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
