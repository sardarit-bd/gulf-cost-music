// components/journalist/CreateEditNewsTab.js
import Select from "@/ui/Select";
import {
  FileText,
  Globe,
  Image as ImageIcon,
  MapPin,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";

const formatCityName = (city) => {
  if (!city) return "";
  return city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function CreateEditNewsTab({
  form,
  editingNews,
  saving,
  previewImages,
  cityOptions,
  stateOptions,
  onFormChange,
  onStateChange,
  onCityChange,
  onImageUpload,
  onRemoveImage,
  onSaveNews,
  onCancel,
}) {
  const handleImageInput = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    onImageUpload({ target: { files } });
    e.target.value = null;
  };

  return (
    <div>
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileText size={24} className="text-blue-700" />
          {editingNews ? "Edit News Story" : "Create New News Story"}
        </h2>
        <p className="text-gray-600">
          {editingNews
            ? "Update your news story details"
            : "Fill in the details below to publish a new story"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onFormChange}
                  placeholder="Enter compelling headline..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                />
              </div>

              {/* State and City Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <Select
                    name="state"
                    value={form.state}
                    options={stateOptions}
                    onChange={onStateChange}
                    placeholder="Select State"
                    required
                    icon={<Globe size={16} className="text-gray-500" />}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Select
                    name="city"
                    value={form.city}
                    options={[
                      { value: "", label: "Select City" },
                      ...cityOptions,
                    ]}
                    onChange={onCityChange}
                    placeholder={
                      form.state ? "Select City" : "Select State First"
                    }
                    disabled={!form.state}
                    required
                    icon={<MapPin size={16} className="text-gray-500" />}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Credit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit / Byline
                </label>
                <input
                  name="credit"
                  value={form.credit}
                  onChange={onFormChange}
                  placeholder="Your name or source credit..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onFormChange}
                  rows={6}
                  placeholder="Write your news story here. Be descriptive and engaging..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition resize-vertical"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Photos & Actions */}
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-gray-700" />
              Photos ({previewImages.length}/5)
            </h3>

            <label
              className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition ${previewImages.length >= 5
                  ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
            >
              <Upload size={24} />
              <span className="text-sm font-medium">
                {previewImages.length >= 5
                  ? "Maximum Reached"
                  : "Upload Photos"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageInput}
                disabled={previewImages.length >= 5}
              />
            </label>

            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Preview:</p>
                <div className="grid grid-cols-2 gap-3">
                  {previewImages.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 group"
                    >
                      <Image
                        src={src}
                        alt={`Preview ${i + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                          e.target.className = "w-full h-full bg-gray-100";
                        }}
                      />
                      <button
                        onClick={() => onRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Preview */}
          {form.state && form.city && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-gray-700" />
                Location Preview
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">State:</span>
                  <span className="text-gray-900 font-medium">
                    {form.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">City:</span>
                  <span className="text-gray-900 font-medium">
                    {formatCityName(form.city)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  This news will appear under {form.state} &gt;{" "}
                  {formatCityName(form.city)} in the calendar
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <button
                disabled={saving || !form.state || !form.city}
                onClick={onSaveNews}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving
                  ? "Saving..."
                  : editingNews
                    ? "Update News"
                    : "Publish News"}
              </button>

              <button
                onClick={onCancel}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
