"use client";

// import CreateEditNewsTab from "@/components/journalist/CreateEditNewsTab";
import JournalistHeader from "@/components/journalist/JournalistHeader";
import CreateEditNewsTab from "@/components/modules/journalist/CreateEditNewsTab";
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
    photos: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
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

          // Set form data
          const newsLocation = n.location || "";
          const foundLocation = Object.values(cityByState)
            .flat()
            .find((loc) => loc.value === newsLocation.toLowerCase());

          const newsState = foundLocation
            ? Object.keys(cityByState).find((state) =>
              cityByState[state].some(
                (city) => city.value === newsLocation.toLowerCase(),
              ),
            )
            : "";

          setForm({
            title: n.title,
            state: newsState,
            city: newsLocation.toLowerCase(),
            location: newsLocation.toLowerCase(),
            credit: n.credit || "",
            description: n.description || "",
            photos: [],
          });

          setPreviewImages(n.photos?.map((p) => p.url) || []);

          if (newsState && cityByState[newsState]) {
            setCityOptions(cityByState[newsState]);
          }
        } else {
          toast.error("News not found");
          router.push("/journalist/dashboard");
        }
      } catch (err) {
        toast.error("Failed to load news");
        router.push("/journalist/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [user, newsId, router]);

  const handleSaveNews = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    const token = getCookie("token");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("credit", form.credit);
      formData.append("location", form.city);
      form.photos.forEach((p) => formData.append("photos", p));

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

      toast.success("News updated successfully!");
      router.push("/journalist/dashboard");
    } catch (err) {
      toast.error(err.message || "Error updating news");
    } finally {
      setSaving(false);
    }
  };

  const navigateToDashboard = () => {
    router.push("/journalist/dashboard");
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
          cityOptions={cityOptions}
          stateOptions={stateOptions}
          onFormChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          onStateChange={(e) => {
            setForm({
              ...form,
              state: e.target.value,
              city: "",
              location: "",
            });
          }}
          onCityChange={(e) => {
            setForm({
              ...form,
              city: e.target.value,
              location: e.target.value,
            });
          }}
          onImageUpload={(e) => {
            const files = Array.from(e.target.files).slice(0, 5);
            const validFiles = files.filter((file) => {
              if (!file.type.startsWith("image/")) return false;
              if (file.size > 5 * 1024 * 1024) return false;
              return true;
            });

            const urls = validFiles.map((f) => URL.createObjectURL(f));
            setPreviewImages((prev) => [...prev, ...urls]);
            setForm((prev) => ({
              ...prev,
              photos: [...prev.photos, ...validFiles],
            }));
          }}
          onRemoveImage={(i) => {
            setPreviewImages((p) => p.filter((_, idx) => idx !== i));
            setForm({
              ...form,
              photos: form.photos.filter((_, idx) => idx !== i),
            });
          }}
          onSaveNews={handleSaveNews}
          onCancel={navigateToDashboard}
        />
      </div>
    </div>
  );
}
