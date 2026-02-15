import { Edit, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

export const EditVideoModal = ({
  isOpen,
  onClose,
  video,
  onSave,
  isLoading,
  isMobile = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || "",
        description: video.description || "",
      });
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(video._id, formData);
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg md:rounded-2xl border border-blue-200 shadow-2xl w-full max-w-md mx-2 md:mx-4 transform transition-all">
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-2.5 bg-blue-100 rounded-lg md:rounded-xl">
              <Edit size={isMobile ? 20 : 24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Edit Video Details
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Update video title and description
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-2.5 md:py-3 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows="3"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-2.5 md:py-3 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none text-sm md:text-base"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2.5 md:py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg md:rounded-xl font-medium transition disabled:opacity-50 border border-gray-300 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 md:py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg md:rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm text-sm md:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={isMobile ? 16 : 18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={isMobile ? 16 : 18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
