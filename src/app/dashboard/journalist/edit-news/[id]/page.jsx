"use client";

import CreateEditNewsTab from "@/components/modules/journalist/CreateEditNewsTab";
import JournalistHeader from "@/components/modules/journalist/JournalistHeader";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/utils/cookies";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const stateOptions = [
  { value: "", label: "Select State" },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Alabama", label: "Alabama" },
  { value: "Florida", label: "Florida" },
];

const cityByState = {
  Louisiana: [
    { value: "new orleans", label: "New Orleans" },
    { value: "baton rouge", label: "Baton Rouge" },
    { value: "lafayette", label: "Lafayette" },
    { value: "shreveport", label: "Shreveport" },
    { value: "lake charles", label: "Lake Charles" },
    { value: "monroe", label: "Monroe" },
  ],
  Mississippi: [
    { value: "jackson", label: "Jackson" },
    { value: "biloxi", label: "Biloxi" },
    { value: "gulfport", label: "Gulfport" },
    { value: "oxford", label: "Oxford" },
    { value: "hattiesburg", label: "Hattiesburg" },
  ],
  Alabama: [
    { value: "birmingham", label: "Birmingham" },
    { value: "mobile", label: "Mobile" },
    { value: "huntsville", label: "Huntsville" },
    { value: "tuscaloosa", label: "Tuscaloosa" },
  ],
  Florida: [
    { value: "tampa", label: "Tampa" },
    { value: "st. petersburg", label: "St. Petersburg" },
    { value: "clearwater", label: "Clearwater" },
    { value: "pensacola", label: "Pensacola" },
    { value: "panama city", label: "Panama City" },
    { value: "fort myers", label: "Fort Myers" },
  ],
};

export default function EditNewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const newsId = params.id;

  const [form, setForm] = useState({
    title: "",
    state: "",
    city: "",
    location: "",
    credit: "",
    description: "",
    newPhotos: [], // Only new File objects
  });

  const [previewImages, setPreviewImages] = useState([]); // All images for display
  const [removedPhotoUrls, setRemovedPhotoUrls] = useState([]); // Track removed image URLs
  const [cityOptions, setCityOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !newsId) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${newsId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (res.ok && data.data?.news) {
          const n = data.data.news;
          setNews(n);

          // Find state from location
          const newsLocation = n.location || "";
          let newsState = "";

          for (const [state, cities] of Object.entries(cityByState)) {
            if (
              cities.some((city) => city.value === newsLocation.toLowerCase())
            ) {
              newsState = state;
              break;
            }
          }

          setForm({
            title: n.title || "",
            state: newsState,
            city: newsLocation.toLowerCase(),
            location: newsLocation.toLowerCase(),
            credit: n.credit || "",
            description: n.description || "",
            newPhotos: [],
          });

          // Set preview images from existing photos
          setPreviewImages(n.photos?.map((p) => p.url) || []);

          if (newsState) {
            setCityOptions(cityByState[newsState]);
          }
        } else {
          toast.error("News not found");
          router.push("/dashboard/journalist/dashboard");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        toast.error("Failed to load news");
        router.push("/dashboard/journalist/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [user, newsId, router]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal =
      previewImages.length - removedPhotoUrls.length + form.newPhotos.length;
    const maxAllowed = 5 - currentTotal;

    if (maxAllowed <= 0) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const validFiles = files.slice(0, maxAllowed).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const urls = validFiles.map((f) => URL.createObjectURL(f));

    // Update state
    setPreviewImages((prev) => [...prev, ...urls]);
    setForm((prev) => ({
      ...prev,
      newPhotos: [...prev.newPhotos, ...validFiles],
    }));

    toast.success(`Added ${validFiles.length} photo(s)`);
  };

  const handleRemoveImage = (index) => {
    const removedUrl = previewImages[index];

    // Check if it's an existing image (not a blob URL)
    if (!removedUrl.startsWith("blob:")) {
      // Add to removed photos list
      setRemovedPhotoUrls((prev) => [...prev, removedUrl]);
    } else {
      // It's a newly uploaded image - remove from newPhotos
      URL.revokeObjectURL(removedUrl);

      // Find which new photo corresponds to this URL
      const photoIndex = form.newPhotos.findIndex((file) => {
        return URL.createObjectURL(file) === removedUrl;
      });

      if (photoIndex !== -1) {
        setForm((prev) => ({
          ...prev,
          newPhotos: prev.newPhotos.filter((_, idx) => idx !== photoIndex),
        }));
      }
    }

    // Remove from preview
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveNews = async () => {
    // Validation
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!form.state) {
      toast.error("Please select a state");
      return;
    }

    if (!form.city) {
      toast.error("Please select a city");
      return;
    }

    setSaving(true);
    const token = getCookie("token");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("credit", form.credit || "");
      formData.append("location", form.city);

      // Add removed photo URLs
      formData.append("removedPhotoUrls", JSON.stringify(removedPhotoUrls));

      // Add new photos
      form.newPhotos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${newsId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      // Cleanup blob URLs
      previewImages.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });

      toast.success("News updated successfully!");
      router.push("/dashboard/journalist/dashboard");
    } catch (err) {
      console.error("Error saving news:", err);
      toast.error(err.message || "Error updating news");
    } finally {
      setSaving(false);
    }
  };

  const navigateToDashboard = () => {
    // Cleanup blob URLs
    previewImages.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    router.push("/dashboard/journalist/dashboard");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        <JournalistHeader />

        <CreateEditNewsTab
          form={form}
          editingNews={news}
          saving={saving}
          previewImages={previewImages}
          existingPhotos={previewImages.filter(
            (url) => !url.startsWith("blob:"),
          )}
          cityOptions={cityOptions}
          stateOptions={stateOptions}
          onFormChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          onStateChange={(e) => {
            const selectedState = e.target.value;
            setForm({
              ...form,
              state: selectedState,
              city: "",
              location: "",
            });
            setCityOptions(cityByState[selectedState] || []);
          }}
          onCityChange={(e) => {
            setForm({
              ...form,
              city: e.target.value,
              location: e.target.value,
            });
          }}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onSaveNews={handleSaveNews}
          onCancel={navigateToDashboard}
        />
      </div>
    </div>
  );
}
