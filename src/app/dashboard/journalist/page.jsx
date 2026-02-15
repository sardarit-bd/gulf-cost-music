"use client";

import CreateEditNewsTab from "@/components/modules/journalist/CreateEditNewsTab";
import JournalistHeader from "@/components/modules/journalist/JournalistHeader";
import JournalistTabs from "@/components/modules/journalist/JournalistTabs";
import NewsDetailModal from "@/components/modules/journalist/NewsDetailModal";
import NewsListTab from "@/components/modules/journalist/NewsListTab";
import ProfileTab from "@/components/modules/journalist/ProfileTab";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// State and city options
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

export default function JournalistDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("news");
  const [journalist, setJournalist] = useState({
    fullName: "",
    email: "",
    bio: "",
    state: "",
    city: "",
    areasOfCoverage: [],
    isVerified: false,
    avatar: null,
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [saving, setSaving] = useState(false);
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
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoverageAreas, setSelectedCoverageAreas] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Fetch Journalist Profile & News
  useEffect(() => {
    if (!user) return;
    const token = getCookie("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [profileRes, newsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/journalist/my-news`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        const [profileData, newsData] = await Promise.all([
          profileRes.json(),
          newsRes.json(),
        ]);

        if (profileRes.ok && profileData.data?.journalist) {
          const j = profileData.data.journalist;
          setJournalist({
            fullName: j.fullName || "",
            email: j.user?.email || "",
            bio: j.bio || "",
            state: j.state || "",
            city: j.city || "",
            areasOfCoverage: j.areasOfCoverage || [],
            isVerified: j.isVerified || false,
            avatar: j.profilePhoto?.url || null,
          });
          setPreviewAvatar(j.profilePhoto?.url || null);
          setSelectedCoverageAreas(j.areasOfCoverage || []);
        }

        if (newsRes.ok && newsData.data?.news) {
          setNewsList(newsData.data.news);
        }
      } catch (err) {
        console.error("Error fetching journalist data:", err);
        toast.error("Server error while loading dashboard data");
      }
    };

    fetchData();
  }, [user]);

  // Update city options when state changes in news form
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

  const handleSaveProfile = async () => {
    const token = getCookie("token");
    if (!token) return toast.error("You are not logged in!");

    const toastId = toast.loading("Saving profile...");
    try {
      const formData = new FormData();
      formData.append("bio", journalist.bio);
      formData.append("fullName", journalist.fullName);
      formData.append("city", journalist.city);
      formData.append("state", journalist.state);
      formData.append("areasOfCoverage", JSON.stringify(selectedCoverageAreas));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to save profile", { id: toastId });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Server error while saving profile", { id: toastId });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setPreviewAvatar(URL.createObjectURL(file));

    try {
      const token = getCookie("token");
      if (!token) return toast.error("You are not logged in!");

      const formData = new FormData();
      formData.append("bio", journalist.bio || "");
      formData.append("fullName", journalist.fullName || "");
      formData.append("city", journalist.city || "");
      formData.append("state", journalist.state || "");
      formData.append("areasOfCoverage", JSON.stringify(selectedCoverageAreas));
      formData.append("profilePhoto", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok) toast.success("Profile photo updated!");
      else toast.error(data.message || "Failed to upload profile photo");
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Error uploading avatar");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setForm({
      ...form,
      state: newState,
      city: "",
      location: "",
    });
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setForm({
      ...form,
      city: newCity,
      location: newCity,
    });
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

    const toastId = toast.loading(
      editingNews ? "Updating news..." : "Publishing news...",
    );

    try {
      setSaving(true);
      const token = getCookie("token");
      if (!token) return toast.error("You are not logged in!");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("credit", form.credit);
      formData.append("location", form.city);
      form.photos.forEach((p) => formData.append("photos", p));

      const url = editingNews
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${editingNews._id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`;

      const method = editingNews ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save news");

      toast.success(editingNews ? "News updated!" : "News published!", {
        id: toastId,
      });

      const listRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/journalist/my-news`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const listData = await listRes.json();
      setNewsList(listData.data?.news || []);

      setActiveTab("news");
      setEditingNews(null);
      setForm({
        title: "",
        state: "",
        city: "",
        location: "",
        credit: "",
        description: "",
        photos: [],
      });
      setPreviewImages([]);
    } catch (err) {
      console.error("Save news error:", err);
      toast.error(err.message || "Server error while saving news", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const editNews = (n) => {
    const newsLocation = n.location || "";
    const allLocationOptions = [...Object.values(cityByState).flat()];
    const foundLocation = allLocationOptions.find(
      (loc) => loc.value === newsLocation.toLowerCase(),
    );
    const newsState = foundLocation
      ? Object.keys(cityByState).find((state) =>
          cityByState[state].some(
            (city) => city.value === newsLocation.toLowerCase(),
          ),
        )
      : "";

    const cityOpts =
      newsState && cityByState[newsState] ? cityByState[newsState] : [];

    setForm({
      title: n.title,
      state: newsState,
      city: newsLocation.toLowerCase(),
      location: newsLocation.toLowerCase(),
      credit: n.credit || "",
      description: n.description || "",
      photos: [],
    });
    setCityOptions(cityOpts);
    setPreviewImages(n.photos?.map((p) => p.url) || []);
    setEditingNews(n);
    setActiveTab("edit");
  };

  const viewNewsDetails = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const deleteNews = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this news item? This action cannot be undone.",
      )
    )
      return;
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete news");

      setNewsList((prev) => prev.filter((n) => n._id !== id));
      toast.success("News deleted successfully!");
    } catch (err) {
      console.error("Delete news error:", err);
      toast.error(err.message || "Server error while deleting news");
    }
  };

  const handleProfileStateChange = (state) => {
    setJournalist({ ...journalist, state, city: "" });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        <JournalistHeader />

        <NewsDetailModal
          news={selectedNews}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <JournalistTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            editingNews={editingNews}
          />

          <div className="p-6">
            {activeTab === "profile" && (
              <ProfileTab
                journalist={journalist}
                previewAvatar={previewAvatar}
                selectedCoverageAreas={selectedCoverageAreas}
                onAvatarUpload={handleAvatarUpload}
                onJournalistChange={setJournalist}
                onProfileStateChange={handleProfileStateChange}
                onSaveProfile={handleSaveProfile}
              />
            )}

            {activeTab === "news" && (
              <NewsListTab
                newsList={newsList}
                onViewDetails={viewNewsDetails}
                onEditNews={editNews}
                onDeleteNews={deleteNews}
                onSetActiveTab={setActiveTab}
                onSetForm={setForm}
                onSetEditingNews={setEditingNews}
                onSetPreviewImages={setPreviewImages}
              />
            )}

            {activeTab === "edit" && (
              <CreateEditNewsTab
                form={form}
                editingNews={editingNews}
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
                onCancel={() => {
                  setActiveTab("news");
                  setEditingNews(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
