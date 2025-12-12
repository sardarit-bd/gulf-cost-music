"use client";

import AddShowTab from "@/components/modules/dashboard/venues/AddShowTab";
import EditProfileTab from "@/components/modules/dashboard/venues/EditProfileTab";
import OverviewTab from "@/components/modules/dashboard/venues/OverviewTab";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  Crown,
  Edit3,
  ImageIcon,
  Music,
  Users,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Utility to get cookie safely
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function VenueDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const [venue, setVenue] = useState({
    name: "",
    city: "",
    address: "",
    seating: "",
    biography: "",
    openHours: "",
    photos: [],
    isActive: false,
    verifiedOrder: 0,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [newShow, setNewShow] = useState({
    artist: "",
    date: "",
    time: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showsThisMonth, setShowsThisMonth] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [removedPhotos, setRemovedPhotos] = useState([]);


  const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // === Check User Subscription ===
  useEffect(() => {
    if (user?.subscriptionPlan) {
      setSubscriptionPlan(user.subscriptionPlan);
    }
  }, [user]);


  // === Fetch Venue Profile ===
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          toast.error("You must be logged in.");
          return;
        }

        const res = await fetch(`${API_BASE}/api/venues/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch venue.");
        }

        if (data.data?.venue) {
          const v = data.data.venue;
          setVenue({
            name: v.venueName || "",
            city: v.city || "",
            address: v.address || "",
            seating: v.seatingCapacity?.toString() || "",
            biography: v.biography || "",
            openHours: v.openHours || "",
            photos: v.photos || [],
            isActive: v.isActive || false,
            verifiedOrder: v.verifiedOrder || 0,
          });
          setPreviewImages(v.photos?.map((p) => p.url) || []);
        }

        // Fetch shows count for this month
        await fetchShowsCount(token);
      } catch (error) {
        console.error("Error fetching venue:", error);
        toast.error(error.message || "Server error while loading venue.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [API_BASE]);

  // === Fetch Shows Count for Free Plan ===
  const fetchShowsCount = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/venues/shows/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setShowsThisMonth(data.data?.count || 0);
      }
    } catch (error) {
      console.error("Error fetching shows count:", error);
    }
  };

  // === Handle Input ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Free plan restrictions
    if (subscriptionPlan === "free") {
      if (name === "biography" || name === "openHours") {
        toast.error(`Free plan users cannot update ${name}. Upgrade to Pro.`);
        return;
      }
    }

    setVenue({ ...venue, [name]: value });
  };

  // === Image Upload with Plan Validation ===
  const handleImageUpload = (e) => {
    if (subscriptionPlan === "free") {
      toast.error("Free plan users cannot upload photos. Upgrade to Pro.");
      return;
    }

    const files = Array.from(e.target.files);

    // Pro plan limit: 5 photos
    if (previewImages.length + files.length > 5) {
      toast.error("Pro plan allows maximum 5 photos.");
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...urls]);
    setVenue(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removeImage = (index) => {
    const urlToRemove = previewImages[index];

    const photoObj = venue.photos.find(p => p.url === urlToRemove);

    if (photoObj?.filename) {
      setRemovedPhotos(prev => [...prev, photoObj.filename]);
    }

    setPreviewImages(prev => prev.filter((_, i) => i !== index));

    setVenue(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.url !== urlToRemove)
    }));
  };



  // === Save Venue with Plan Validation ===
  const handleSave = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("venueName", venue.name);
      formData.append("city", venue.city.toLowerCase());
      formData.append("address", venue.address);
      formData.append("seatingCapacity", venue.seating);

      // Pro user fields
      if (subscriptionPlan === "pro") {
        formData.append("biography", venue.biography || "");
        formData.append("openHours", venue.openHours);
        formData.append("openDays", "Mon-Sat");
      }

      // NEW PHOTOS
      if (venue.photos && venue.photos.length > 0 && subscriptionPlan === "pro") {
        venue.photos.forEach((file) => {
          if (file instanceof File) {
            formData.append("photos", file);
          }
        });
      }

      removedPhotos.forEach(filename => {
        formData.append("removedPhotos", filename);
      });

      setSaving(true);
      const saveToast = toast.loading("Saving venue...");

      const res = await fetch(`${API_BASE}/api/venues/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(saveToast);

      if (!res.ok) {
        toast.error(data.message || "Failed to save venue");
        return;
      }

      toast.success("Venue profile saved successfully!");
      setRemovedPhotos([]);

      if (data.data?.venue?.photos) {
        setPreviewImages(data.data.venue.photos.map(p => p.url));
      }

    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };


  // === Add Show with Free Plan Limit ===
  const handleAddShow = async (e) => {
    e.preventDefault();

    // Free plan validation
    if (subscriptionPlan === "free" && showsThisMonth >= 1) {
      toast.error(
        "Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows."
      );
      return;
    }

    // Validation
    if (!newShow.artist || !newShow.date || !newShow.time || !newShow.image) {
      toast.error("Please fill all fields including the show image.");
      return;
    }

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("artist", newShow.artist);
      formData.append("date", newShow.date);
      formData.append("time", newShow.time);
      formData.append("image", newShow.image);

      setLoading(true);
      const addToast = toast.loading("Adding show...");

      const res = await fetch(`${API_BASE}/api/venues/add-show`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(addToast);

      if (!res.ok) {
        if (data.message?.includes("Free plan")) {
          toast.error(data.message);
        } else {
          throw new Error(data.message || "Failed to add show.");
        }
        return;
      }

      toast.success("🎤 Show added successfully!");
      setNewShow({ artist: "", date: "", time: "", image: null });

      // Update shows count for free plan
      if (subscriptionPlan === "free") {
        setShowsThisMonth(prev => prev + 1);
      }
    } catch (error) {
      console.error("Add show error:", error);
      toast.error(error.message || "Error adding show.");
    } finally {
      setLoading(false);
    }
  };

  // === Plan Badge Component ===
  const PlanBadge = () => (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${subscriptionPlan === "pro" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-gray-700 text-gray-300 border border-gray-600"}`}>
      {subscriptionPlan === "pro" ? (
        <>
          <Crown size={14} />
          Pro Plan
        </>
      ) : (
        <>
          <Users size={14} />
          Free Plan
        </>
      )}
    </div>
  );

  // === Upgrade Prompt Component ===
  const UpgradePrompt = ({ feature }) => (
    <div className="mt-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
      <div className="flex items-start gap-3">
        <Crown className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
        <div>
          <p className="text-sm text-gray-300">
            <span className="font-medium">{feature}</span> is available for Pro users
          </p>
          <button
            onClick={() => window.open("/pricing", "_blank")}
            className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-medium transition"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading venue dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-16">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="">
        {/* Header with Plan Info */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Building2 size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Venue Dashboard</h1>
              <div className="flex items-center justify-center gap-3 mt-2">
                <PlanBadge />
                {!venue.isActive && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                    <XCircle size={14} />
                    Pending Verification
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Manage your venue profile and upcoming shows
          </p>
        </div>

        {/* Plan Stats Bar */}
        {subscriptionPlan === "free" && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Music size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Monthly Show Limit</p>
                  <p className="text-gray-400 text-sm">
                    {showsThisMonth}/1 show this month
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <ImageIcon size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Photo Uploads</p>
                  <p className="text-gray-400 text-sm">Not available in Free plan</p>
                </div>
              </div>
              <button
                onClick={() => window.open("/pricing", "_blank")}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition"
              >
                <Crown size={16} />
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}

        {/* Main Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Tabs */}
          <div className="border-b border-gray-700 bg-gray-900">
            <div className="flex overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: Building2 },
                { id: "edit", label: "Edit Profile", icon: Edit3 },
                { id: "addshow", label: "Add Show", icon: Music },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === id
                    ? "text-yellow-400 border-b-2 border-yellow-400 bg-gray-800"
                    : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800/50"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                  {id === "addshow" && subscriptionPlan === "free" && (
                    <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                      {showsThisMonth}/1
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "overview" && (
              <OverviewTab
                venue={venue}
                previewImages={previewImages}
                subscriptionPlan={subscriptionPlan}
              />
            )}
            {activeTab === "edit" && (
              <EditProfileTab
                venue={venue}
                cityOptions={cityOptions}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                previewImages={previewImages}
                handleSave={handleSave}
                saving={saving}
                subscriptionPlan={subscriptionPlan}
                UpgradePrompt={UpgradePrompt}
              />
            )}
            {activeTab === "addshow" && (
              <AddShowTab
                newShow={newShow}
                setNewShow={setNewShow}
                handleAddShow={handleAddShow}
                loading={loading}
                subscriptionPlan={subscriptionPlan}
                showsThisMonth={showsThisMonth}
                UpgradePrompt={UpgradePrompt}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


