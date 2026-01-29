"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { api } from "../../artist/apiService";
import EditProfileTab from "../../artist/EditProfileTab";
import Header from "../../artist/Header";
import ArtistMarketplaceTab from "../../artist/MarketplaceTab";
import OverviewTab from "../../artist/OverviewTab";
import PlanStats from "../../artist/PlanStats";
import Tabs from "../../artist/Tabs";
import BillingTab from "../billing/BillingTab";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
  const [deletedPhotoIndexes, setDeletedPhotoIndexes] = useState([]);

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

  const [uploadLimits] = useState({
    photos: 5,
    audios: 5,
    marketplace: true,
  });

  const subscriptionPlan = user?.subscriptionPlan || "free";

  // Load all data
  useEffect(() => {
    loadArtistProfile();
    loadMarketplaceData();
    loadBillingData();
  }, []);

  const loadArtistProfile = async () => {
    try {
      const response = await api.getMyArtistProfile();
      if (response.success && response.data.artist) {
        const artistData = response.data.artist;
        setArtist(artistData);

        // Ensure we only set valid photos with URLs
        const validPhotos = (artistData.photos || [])
          .filter(
            (photo) =>
              photo &&
              photo.url &&
              typeof photo.url === "string" &&
              photo.url.trim() !== "" &&
              !photo.url.includes("undefined") &&
              !photo.url.includes("null"),
          )
          .map((p) => ({
            url: p.url,
            filename: p.filename || p.url.split("/").pop(),
            isNew: false,
          }));

        setPreviewImages(validPhotos);

        // Ensure valid audio files
        const validAudios = (artistData.mp3Files || []).filter(
          (audio) =>
            audio &&
            audio.url &&
            typeof audio.url === "string" &&
            audio.url.trim() !== "" &&
            !audio.url.includes("undefined") &&
            !audio.url.includes("null"),
        );

        setAudioPreview(validAudios);
      } else {
        // Set empty arrays if no valid data
        setPreviewImages([]);
        setAudioPreview([]);
      }
    } catch (error) {
      console.error("Error loading artist profile:", error);
      toast.error("Failed to load profile");
      setPreviewImages([]);
      setAudioPreview([]);
    }
  };

  const loadMarketplaceData = async () => {
    try {
      setLoadingListings(true);
      const response = await api.getMyMarketItem();
      if (response.success) {
        if (response.data) {
          setListings([response.data]);
          setIsEditingListing(true);
          setCurrentListing({
            title: response.data.title || "",
            description: response.data.description || "",
            price: response.data.price || "",
            location: response.data.location || "",
            status: response.data.status || "active",
          });
          setListingPhotos(response.data.photos || []);
          setListingVideos(
            Array.isArray(response.data.videos) ? response.data.videos : [],
          );
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
      const billingRes = await api.getBillingStatus();
      setBillingData(billingRes.data);
    } catch (error) {
      console.error("Error loading billing data:", error);
    } finally {
      setBillingLoading(false);
    }
  };

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
        "Your subscription will remain active until the end of the current billing period. Continue?",
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

  const handleSave = async (saveDataOrFormData) => {
    try {
      setSaving(true);

      let formData;

      // Check if saveDataOrFormData is FormData or plain object
      if (saveDataOrFormData instanceof FormData) {
        formData = saveDataOrFormData;

        // Add basic fields if not already present
        if (!formData.has("name")) {
          formData.append("name", artist.name || "");
        }
        if (!formData.has("city")) {
          formData.append("city", artist.city || "");
        }
        if (!formData.has("genre")) {
          formData.append("genre", artist.genre || "");
        }
        // সবাই বায়োগ্রাফি লিখতে পারবে
        if (!formData.has("biography")) {
          formData.append("biography", artist.biography || "");
        }
      } else {
        formData = new FormData();
        const saveData = saveDataOrFormData;

        formData.append("name", saveData.name || artist.name || "");
        formData.append("city", saveData.city || artist.city || "");
        formData.append("genre", saveData.genre || artist.genre || "");
        // সবাই বায়োগ্রাফি লিখতে পারবে
        formData.append(
          "biography",
          saveData.biography || artist.biography || "",
        );

        // Add removed photos and audios
        if (saveData.removedPhotos && saveData.removedPhotos.length > 0) {
          saveData.removedPhotos.forEach((filename) => {
            formData.append("removedPhotos", filename);
          });
        }

        if (saveData.removedAudios && saveData.removedAudios.length > 0) {
          saveData.removedAudios.forEach((filename) => {
            formData.append("removedAudios", filename);
          });
        }

        // Add new photo files
        if (saveData.newPhotos && saveData.newPhotos.length > 0) {
          saveData.newPhotos.forEach((photo) => {
            if (photo instanceof File) {
              formData.append("photos", photo);
            }
          });
        }

        // Add new audio files
        if (saveData.newAudios && saveData.newAudios.length > 0) {
          saveData.newAudios.forEach((audio) => {
            if (audio instanceof File) {
              formData.append("mp3Files", audio);
            }
          });
        }
      }

      // Debug: Check FormData contents
      console.log("=== FormData Debug ===");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

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

  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setCurrentListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateListing = async () => {
    if (listings.length > 0) {
      toast.error("You already have a listing. Please edit it.");
      return;
    }

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

      // NEW photos only
      listingPhotos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append("photos", photo);
        }
      });

      // deleted photo indexes
      deletedPhotoIndexes.forEach((i) => {
        formData.append("deletedPhotos[]", i);
      });

      if (listingVideos[0] instanceof File) {
        formData.append("video", listingVideos[0]);
      }

      const response = await api.updateMarketItem(formData);

      if (response.success) {
        toast.success("Listing updated successfully!");
        setDeletedPhotoIndexes([]); // reset
        await loadMarketplaceData();
        setIsEditingListing(false);
      }
    } catch (err) {
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

  const removeListingPhoto = (index) => {
    const photo = listingPhotos[index];

    // if existing photo (string URL), track deletion
    if (typeof photo === "string") {
      setDeletedPhotoIndexes((prev) => [...prev, index]);
    }

    const newPhotos = [...listingPhotos];
    newPhotos.splice(index, 1);
    setListingPhotos(newPhotos);
  };

  const removeListingVideo = (index) => {
    setListingVideos([]);
  };

  // Image and Audio Upload Handlers - সবাই একই লিমিট
  const handleImageUpload = async (files) => {
    // ❌ NO Pro plan check - সবাই আপলোড করতে পারবে
    const totalPhotos = previewImages.length + files.length;
    if (totalPhotos > 5) {
      // সর্বোচ্চ ৫টি ছবি
      toast.error(`You can upload maximum 5 photos.`);
      return;
    }

    const newImages = [...previewImages];
    files.forEach((file) => {
      newImages.push({
        url: URL.createObjectURL(file),
        filename: file.name,
        file,
        isNew: true,
      });
    });

    setPreviewImages(newImages);
  };

  const handleAudioUpload = async (files) => {
    // ❌ NO Pro plan check - সবাই আপলোড করতে পারবে
    const totalAudios = audioPreview.length + files.length;
    if (totalAudios > 5) {
      // সর্বোচ্চ ৫টি অডিও
      toast.error(`You can upload maximum 5 audio files.`);
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

      const res = await fetch(`${API_URL}/api/subscription/checkout/pro`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error("Unable to start checkout. Please try again.");
    }
  };

  const handleStripeConnect = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/connect/onboard`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Stripe connection failed");
      }
    } catch (err) {
      toast.error("Stripe connect failed");
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
              onAudioUpload={handleAudioUpload}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "marketplace" && user?.isVerified && (
            <ArtistMarketplaceTab
              subscriptionPlan={subscriptionPlan}
              hasMarketplaceAccess={uploadLimits.marketplace}
              listings={listings}
              loadingListings={loadingListings}
              currentListing={currentListing}
              billingData={billingData}
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
              loadMarketplaceData={loadMarketplaceData}
              setListingPhotos={setListingPhotos}
              setIsEditingListing={setIsEditingListing}
              setListingVideos={setListingVideos}
              handleStripeConnect={handleStripeConnect}
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
