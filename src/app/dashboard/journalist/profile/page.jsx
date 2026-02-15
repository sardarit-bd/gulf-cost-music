"use client";

import JournalistHeader from "@/components/modules/journalist/JournalistHeader";
// import JournalistHeader from "@/components/journalist/JournalistHeader";
// import ProfileTab from "@/components/journalist/ProfileTab";
// import JournalistHeader from "@/components/modules/journalist/JournalistHeader";
import ProfileTab from "@/components/modules/journalist/ProfileTab";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "@/utils/cookies";
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

export default function JournalistProfilePage() {
  const { user } = useAuth();
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
  const [selectedCoverageAreas, setSelectedCoverageAreas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/journalists/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (res.ok && data.data?.journalist) {
          const j = data.data.journalist;
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
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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

  const handleSaveProfile = async () => {
    setSaving(true);
    const token = getCookie("token");

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
        toast.success("Profile updated!");
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
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

        <ProfileTab
          journalist={journalist}
          previewAvatar={previewAvatar}
          selectedCoverageAreas={selectedCoverageAreas}
          onAvatarUpload={handleAvatarUpload}
          onJournalistChange={setJournalist}
          onProfileStateChange={(state) => {
            setJournalist({ ...journalist, state, city: "" });
          }}
          onSaveProfile={handleSaveProfile}
          saving={saving}
        />
      </div>
    </div>
  );
}
