"use client";

import CreateEditNewsTab from "@/components/modules/journalist/CreateEditNewsTab";
// import CreateEditNewsTab from "@/components/modules/journalist/CreateEditNewsTab";
// import CreateEditNewsTab from "@/components/journalist/CreateEditNewsTab";
// import JournalistHeader from "@/components/journalist/JournalistHeader";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
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

export default function CreateNewsPage() {
  const { user } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (form.state && cityByState[form.state]) {
      setCityOptions(cityByState[form.state]);
      if (!form.city && cityByState[form.state].length > 0) {
        setForm((prev) => ({
          ...prev,
          city: cityByState[form.state][0].value,
        }));
      }
    } else {
      setCityOptions([]);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    setForm({
      ...form,
      state: e.target.value,
      city: "",
      location: "",
    });
  };

  const handleCityChange = (e) => {
    setForm({
      ...form,
      city: e.target.value,
      location: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });

    if (validFiles.length + previewImages.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const urls = validFiles.map((f) => URL.createObjectURL(f));
    setPreviewImages((prev) => [...prev, ...urls]);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...validFiles] }));

    if (validFiles.length > 0) {
      toast.success(`Added ${validFiles.length} photo(s)`);
    }
  };

  const removeImage = (i) => {
    setPreviewImages((p) => p.filter((_, idx) => idx !== i));
    setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });
  };

  const handleSaveNews = async () => {
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
      formData.append("credit", form.credit);
      formData.append("location", form.city);
      form.photos.forEach((p) => formData.append("photos", p));

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to publish");

      toast.success("News published successfully!");
      router.push("/journalist/dashboard");
    } catch (err) {
      toast.error(err.message || "Error publishing news");
    } finally {
      setSaving(false);
    }
  };

  const navigateToDashboard = () => {
    router.push("/journalist/dashboard");
  };

  return (
    <div className="py-8 px-4">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* <JournalistHeader /> */}

        <CreateEditNewsTab
          form={form}
          editingNews={null}
          saving={saving}
          previewImages={previewImages}
          cityOptions={cityOptions}
          stateOptions={stateOptions}
          onFormChange={handleChange}
          onStateChange={handleStateChange}
          onCityChange={handleCityChange}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
          onSaveNews={handleSaveNews}
          onCancel={navigateToDashboard}
        />
      </div>
    </div>
  );
}
