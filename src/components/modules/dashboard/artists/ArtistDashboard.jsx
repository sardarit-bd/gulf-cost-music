"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import EditProfileTab from "../../artist/EditProfileTab";
import Header from "../../artist/Header";
import ArtistMarketplaceTab from "../../artist/MarketplaceTab";
import OverviewTab from "../../artist/OverviewTab";
import PlanStats from "../../artist/PlanStats";
import Tabs from "../../artist/Tabs";
import BillingTab from "../billing/BillingTab";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const getToken = () => {
  if (typeof document !== "undefined") {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  }
  return null;
};

const getHeaders = (isFormData = false) => {
  const token = getToken();
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const api = {
  // Artist Profile
  getMyArtistProfile: () =>
    fetch(`${API_URL}/api/artists/profile/me`, { headers: getHeaders() }).then(
      async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
        return data;
      }
    ),

  updateArtistProfile: (formData) => {
    return fetch(`${API_URL}/api/artists/profile`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      return data;
    });
  },

  // Marketplace
  getMyMarketItem: () =>
    fetch(`${API_URL}/api/market/me`, { headers: getHeaders() }).then(
      async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch market item");
        return data;
      }
    ),

  createMarketItem: (formData) => {
    return fetch(`${API_URL}/api/market/me`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create listing");
      return data;
    });
  },

  updateMarketItem: (formData) => {
    return fetch(`${API_URL}/api/market/me`, {
      method: "PUT",
      headers: getHeaders(true),
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update listing");
      return data;
    });
  },

  deleteMarketItem: () =>
    fetch(`${API_URL}/api/market/me`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete listing");
      return data;
    }),

  deleteMarketPhoto: (index) =>
    fetch(`${API_URL}/api/market/me/photos/${index}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete photo");
      return data;
    }),

  // Billing
  getBillingStatus: () =>
    fetch(`${API_URL}/api/subscription/status`, { headers: getHeaders() }).then(
      async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch billing status");
        return data;
      }
    ),

  createCheckoutSession: () =>
    fetch(`${API_URL}/api/subscription/checkout/pro`, {
      method: "POST",
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create checkout");
      return data;
    }),

  createBillingPortal: () =>
    fetch(`${API_URL}/api/subscription/portal`, {
      method: "POST",
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create billing portal");
      return data;
    }),

  cancelSubscription: () =>
    fetch(`${API_URL}/api/subscription/cancel`, {
      method: "POST",
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to cancel subscription");
      return data;
    }),

  resumeSubscription: () =>
    fetch(`${API_URL}/api/subscription/resume`, {
      method: "POST",
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to resume subscription");
      return data;
    }),

  getInvoices: () =>
    fetch(`${API_URL}/api/subscription/invoices`, {
      headers: getHeaders(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");
      return data;
    }),
};

// Subscription Rules
const SUBSCRIPTION_RULES = {
  artist: {
    free: {
      biography: false,
      photos: 0,
      mp3: 0,
      marketplace: false,
      trialDays: 0,
    },
    pro: {
      biography: true,
      photos: 5,
      mp3: 5,
      marketplace: true,
      trialDays: 7,
    },
  },
};

// Main Component
export default function ArtistDashboard() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [artist, setArtist] = useState({
    name: "",
    city: "",
    genre: "",
    biography: "",
    photos: [],
    mp3Files: [],
    isVerified: false,
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [audioPreview, setAudioPreview] = useState([]);
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [billingData, setBillingData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);

  const [currentListing, setCurrentListing] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    status: "active",
  });

  const [listingPhotos, setListingPhotos] = useState([]);
  const [listingVideos, setListingVideos] = useState([]);
  const [isEditingListing, setIsEditingListing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadLimits, setUploadLimits] = useState({
    photos: 0,
    audios: 0,
    marketplace: false,
  });

  const subscriptionPlan = user?.subscriptionPlan || "free";

  // Load all data
  useEffect(() => {
    loadArtistProfile();
    loadMarketplaceData();
    loadBillingData();
  }, []);

  // Update upload limits when plan changes
  useEffect(() => {
    if (subscriptionPlan) {
      const rules =
        SUBSCRIPTION_RULES.artist[subscriptionPlan] ||
        SUBSCRIPTION_RULES.artist.free;
      setUploadLimits({
        photos: rules.photos,
        audios: rules.mp3,
        marketplace: subscriptionPlan === "pro",
      });
    }
  }, [subscriptionPlan]);

  const loadArtistProfile = async () => {
    try {
      const response = await api.getMyArtistProfile();
      if (response.success && response.data.artist) {
        const artistData = response.data.artist;
        setArtist(artistData);
        setPreviewImages(artistData.photos?.map((p) => p.url) || []);
        setAudioPreview(artistData.mp3Files || []);
      }
    } catch (error) {
      console.error("Error loading artist profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const loadMarketplaceData = async () => {
    try {
      setLoadingListings(true);
      const response = await api.getMyMarketItem();
      if (response.success) {
        if (response.data) {
          setListings([response.data]);
          setCurrentListing({
            title: response.data.title || "",
            description: response.data.description || "",
            price: response.data.price || "",
            location: response.data.location || "",
            status: response.data.status || "active",
          });
          setListingPhotos(response.data.photos || []);
          setListingVideos(response.data.video ? [response.data.video] : []);
        } else {
          setListings([]);
        }
      }
    } catch (error) {
      console.error("Error loading marketplace data:", error);
      toast.error("Failed to load marketplace data");
    } finally {
      setLoadingListings(false);
    }
  };

  const loadBillingData = async () => {
    try {
      setBillingLoading(true);
      const [billingRes, invoicesRes] = await Promise.allSettled([
        api.getBillingStatus(),
        api.getInvoices(),
      ]);

      if (billingRes.status === "fulfilled") {
        setBillingData(billingRes.value.data);
      }

      if (invoicesRes.status === "fulfilled") {
        setInvoices(invoicesRes.value.data || []);
      }
    } catch (error) {
      console.error("Error loading billing data:", error);
    } finally {
      setBillingLoading(false);
    }
  };

  // Billing Handlers
  // const handleProCheckout = async () => {
  //   try {
  //     const token = document.cookie
  //       .split("; ")
  //       .find((row) => row.startsWith("token="))
  //       ?.split("=")[1];

  //     if (!token) {
  //       alert("You must be logged in to upgrade.");
  //       return;
  //     }

  //     const res = await fetch(
  //       `${API_BASE}/api/subscription/checkout/pro`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok || !data.url) {
  //       throw new Error(data.message || "Checkout failed");
  //     }

  //     window.location.href = data.url;
  //   } catch (error) {
  //     console.error("Checkout error:", error);
  //     alert("Unable to start checkout. Please try again.");
  //   }
  // };

  const handleOpenBillingPortal = async () => {
    try {
      const response = await api.createBillingPortal();
      if (response.success && response.url) {
        window.open(response.url, "_blank");
      }
    } catch (error) {
      toast.error(error.message || "Failed to open billing portal");
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Your subscription will remain active until the end of the current billing period. Continue?"
      )
    ) {
      return;
    }

    try {
      const response = await api.cancelSubscription();
      if (response.success) {
        toast.success("Subscription cancelled successfully");
        loadBillingData();
        refreshUser();
      }
    } catch (error) {
      toast.error(error.message || "Failed to cancel subscription");
    }
  };

  const handleResumeSubscription = async () => {
    try {
      const response = await api.resumeSubscription();
      if (response.success) {
        toast.success("Subscription resumed successfully");
        loadBillingData();
        refreshUser();
      }
    } catch (error) {
      toast.error(error.message || "Failed to resume subscription");
    }
  };

  const handleDownloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      toast.success(`Downloading invoice ${invoiceNumber}...`);

      // Create printable invoice view
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 40px; }
              .company { font-size: 24px; font-weight: bold; color: #333; }
              .invoice-title { font-size: 32px; margin: 20px 0; color: #666; }
              .details { margin: 30px 0; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
              .table th { background: #f5f5f5; padding: 12px; text-align: left; }
              .table td { padding: 12px; border-bottom: 1px solid #eee; }
              .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 30px; }
              .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company">Gulf Music Platform</div>
              <div class="invoice-title">INVOICE</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span>Invoice Number:</span>
                <span><strong>${invoiceNumber}</strong></span>
              </div>
              <div class="detail-row">
                <span>Date:</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span>Customer:</span>
                <span>${user?.username || "User"}</span>
              </div>
              <div class="detail-row">
                <span>User Type:</span>
                <span>Artist</span>
              </div>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pro Subscription - Monthly Plan</td>
                  <td>$10.00</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td>$0.00</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total">
              Total: <span style="color: #10b981;">$10.00</span>
            </div>
            
            <div class="footer">
              <p>Thank you for supporting Gulf Music Platform!</p>
              <p>Gulf Music Platform • support@gulfmusic.com</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download invoice");
    }
  };

  // Profile Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", artist.name);
      formData.append("city", artist.city);
      formData.append("genre", artist.genre);

      if (subscriptionPlan === "pro") {
        formData.append("biography", artist.biography || "");
      }

      // Handle file uploads for photos
      const photoFiles =
        artist.photos?.filter((photo) => photo instanceof File) || [];
      photoFiles.forEach((photo, index) => {
        formData.append("photos", photo);
      });

      // Handle file uploads for audio
      const audioFiles = audioPreview
        .filter((audio) => audio.file && audio.file instanceof File)
        .map((audio) => audio.file);

      audioFiles.forEach((audio, index) => {
        formData.append("mp3Files", audio);
      });

      const response = await api.updateArtistProfile(formData);

      if (response.success) {
        toast.success("Profile updated successfully!");
        await loadArtistProfile();
        await refreshUser();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Marketplace Handlers (existing code remains same...)
  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setCurrentListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateListing = async () => {
    if (
      !currentListing.title ||
      !currentListing.description ||
      !currentListing.price
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (listingPhotos.length === 0) {
      toast.error("At least one photo is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", currentListing.title);
      formData.append("description", currentListing.description);
      formData.append("price", currentListing.price);
      formData.append("location", currentListing.location);
      formData.append("status", currentListing.status);

      // Append photos
      listingPhotos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append("photos", photo);
        }
      });

      // Append video if exists
      if (listingVideos.length > 0 && listingVideos[0] instanceof File) {
        formData.append("video", listingVideos[0]);
      }

      const response = await api.createMarketItem(formData);

      if (response.success) {
        toast.success("Listing created successfully!");
        await loadMarketplaceData();
        setActiveTab("marketplace");
      } else {
        toast.error(response.message || "Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    }
  };

  const handleUpdateListing = async () => {
    try {
      const formData = new FormData();
      formData.append("title", currentListing.title);
      formData.append("description", currentListing.description);
      formData.append("price", currentListing.price);
      formData.append("location", currentListing.location);
      formData.append("status", currentListing.status);

      // Append new photos only (existing photos are already in backend)
      listingPhotos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append("photos", photo);
        }
      });

      // Append video if new
      if (listingVideos.length > 0 && listingVideos[0] instanceof File) {
        formData.append("video", listingVideos[0]);
      }

      const response = await api.updateMarketItem(formData);

      if (response.success) {
        toast.success("Listing updated successfully!");
        await loadMarketplaceData();
        setIsEditingListing(false);
      } else {
        toast.error(response.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await api.deleteMarketItem();
      if (response.success) {
        toast.success("Listing deleted successfully!");
        setListings([]);
        setCurrentListing({
          title: "",
          description: "",
          price: "",
          location: "",
          status: "active",
        });
        setListingPhotos([]);
        setListingVideos([]);
      } else {
        toast.error(response.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  const handleEditListing = (listing) => {
    setCurrentListing({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      status: listing.status,
    });
    setListingPhotos(listing.photos || []);
    setListingVideos(listing.video ? [listing.video] : []);
    setIsEditingListing(true);
    setActiveTab("marketplace");
  };

  const handleCancelEdit = () => {
    setIsEditingListing(false);
    if (listings.length > 0) {
      const listing = listings[0];
      setCurrentListing({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        status: listing.status,
      });
      setListingPhotos(listing.photos || []);
      setListingVideos(listing.video ? [listing.video] : []);
    } else {
      setCurrentListing({
        title: "",
        description: "",
        price: "",
        location: "",
        status: "active",
      });
      setListingPhotos([]);
      setListingVideos([]);
    }
  };

  const handleListingPhotoUpload = (files) => {
    const totalPhotos = listingPhotos.length + files.length;
    if (totalPhotos > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const newPhotos = [...listingPhotos];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 5MB)`);
        return;
      }
      newPhotos.push(file);
    });
    setListingPhotos(newPhotos);
  };

  const handleListingVideoUpload = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file is too large (max 50MB)");
      return;
    }

    setListingVideos([file]);
  };

  const removeListingPhoto = async (index) => {
    const photo = listingPhotos[index];

    if (typeof photo === "string" && photo.startsWith("http")) {
      try {
        await api.deleteMarketPhoto(index);
        toast.success("Photo deleted from server");
      } catch (error) {
        toast.error("Failed to delete photo from server");
        return;
      }
    }

    const newPhotos = [...listingPhotos];
    newPhotos.splice(index, 1);
    setListingPhotos(newPhotos);
  };

  const removeListingVideo = (index) => {
    setListingVideos([]);
  };

  // Image and Audio Upload Handlers
  const handleImageUpload = async (files) => {
    if (subscriptionPlan !== "pro") {
      toast.error("Upgrade to Pro to upload photos");
      return;
    }

    const totalPhotos = previewImages.length + files.length;
    if (totalPhotos > uploadLimits.photos) {
      toast.error(
        `Maximum ${uploadLimits.photos} photos allowed for ${subscriptionPlan} plan`
      );
      return;
    }

    const newImages = [...previewImages];
    const newPhotoFiles = [];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
      newPhotoFiles.push(file);
    });

    setPreviewImages(newImages);
    setArtist((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...newPhotoFiles],
    }));
  };

  const handleAudioUpload = async (files) => {
    if (subscriptionPlan !== "pro") {
      toast.error("Upgrade to Pro to upload audio");
      return;
    }

    const totalAudios = audioPreview.length + files.length;
    if (totalAudios > uploadLimits.audios) {
      toast.error(
        `Maximum ${uploadLimits.audios} audio files allowed for ${subscriptionPlan} plan`
      );
      return;
    }

    const newAudios = [...audioPreview];
    files.forEach((file) => {
      newAudios.push({
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      });
    });
    setAudioPreview(newAudios);
  };

  const removeImage = (index) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);

    setArtist((prev) => {
      const newPhotos = [...(prev.photos || [])];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };

  const removeAudio = (index) => {
    const newAudios = [...audioPreview];
    newAudios.splice(index, 1);
    setAudioPreview(newAudios);
  };

  const handleProCheckout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("You must be logged in to upgrade.");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/subscription/checkout/pro`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error("Unable to start checkout. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 md:px-16">
      <Toaster />

      <Header subscriptionPlan={subscriptionPlan} />

      <PlanStats
        subscriptionPlan={subscriptionPlan}
        photosCount={previewImages.length}
        audiosCount={audioPreview.length}
        listingsCount={listings.length}
        hasMarketplaceAccess={uploadLimits.marketplace}
        handleProCheckout={handleProCheckout}
      />

      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 mt-8">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isVerified={user?.isVerified}
          isProUser={user?.subscriptionPlan === "pro"}
        />

        <div className="p-6 md:p-8">
          {activeTab === "overview" && (
            <OverviewTab
              artist={artist}
              previewImages={previewImages}
              audioPreview={audioPreview}
              subscriptionPlan={subscriptionPlan}
              uploadLimits={uploadLimits}
              listings={listings}
              loadingListings={loadingListings}
            />
          )}

          {activeTab === "edit" && (
            <EditProfileTab
              artist={artist}
              previewImages={previewImages}
              audioPreview={audioPreview}
              subscriptionPlan={subscriptionPlan}
              uploadLimits={uploadLimits}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              onAudioUpload={handleAudioUpload}
              onRemoveAudio={removeAudio}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "marketplace" && user?.isVerified && (
            <ArtistMarketplaceTab
              subscriptionPlan={subscriptionPlan}
              hasMarketplaceAccess={true}
              listings={listings}
              loadingListings={loadingListings}
              currentListing={currentListing}
              listingPhotos={listingPhotos}
              listingVideos={listingVideos}
              isEditingListing={isEditingListing}
              onListingChange={handleListingChange}
              onPhotoUpload={handleListingPhotoUpload}
              onVideoUpload={handleListingVideoUpload}
              onRemovePhoto={removeListingPhoto}
              onRemoveVideo={removeListingVideo}
              onCreateListing={handleCreateListing}
              onUpdateListing={handleUpdateListing}
              onEditListing={handleEditListing}
              onDeleteListing={handleDeleteListing}
              onCancelEdit={handleCancelEdit}
            />
          )}

          {activeTab === "billing" && (
            <BillingTab
              user={user}
              billingData={billingData}
              invoices={invoices}
              loading={billingLoading}
              onUpgrade={handleProCheckout}
              onOpenPortal={handleOpenBillingPortal}
              onCancel={handleCancelSubscription}
              onResume={handleResumeSubscription}
              onDownloadInvoice={handleDownloadInvoice}
            />
          )}

        </div>
      </div>
    </div>
  );
}
