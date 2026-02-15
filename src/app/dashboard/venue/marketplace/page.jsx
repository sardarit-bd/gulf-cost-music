"use client";

import CreateListingForm from "@/components/modules/venues/marketplace/CreateListingForm";
import ListingDetailView from "@/components/modules/venues/marketplace/ListingDetailView";
import MarketplaceActionButtons from "@/components/modules/venues/marketplace/MarketplaceActionButtons";
import MarketplaceHeader from "@/components/modules/venues/marketplace/MarketplaceHeader";
import MarketplaceTabs from "@/components/modules/venues/marketplace/MarketplaceTabs";
import StripeConnectAlert from "@/components/modules/venues/marketplace/StripeConnectAlert";
import VerificationAlert from "@/components/modules/venues/marketplace/VerificationAlert";
import { getCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function MarketplacePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  const [venue, setVenue] = useState(null);
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [currentListing, setCurrentListing] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    status: "active",
    photos: [],
    videos: [],
    category: "equipment",
    itemCondition: "excellent",
    contactPhone: "",
    contactEmail: "",
  });
  const [existingPhotos, setExistingPhotos] = useState([]); // Existing photos from server
  const [photosToDelete, setPhotosToDelete] = useState([]); // Photos to delete from Cloudinary
  const [deleteVideo, setDeleteVideo] = useState(false); // Flag to delete video
  const [listingVideos, setListingVideos] = useState([]);
  const [isEditingListing, setIsEditingListing] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [activeMarketSection, setActiveMarketSection] = useState("create");
  const [formErrors, setFormErrors] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVenueData();
  }, []);

  const fetchVenueData = async () => {
    try {
      setLoadingPage(true);
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
          isActive: v.isActive || false,
          stripeAccountId: v.stripeAccountId,
        });

        if (v.isActive) {
          await loadMarketplaceListings();
        }
      }
    } catch (error) {
      console.error("Error fetching venue:", error);
      toast.error(error.message || "Server error while loading venue.");
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchVenueMarketplaceListings = async () => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${API_BASE}/api/market/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data.data)) {
          return data.data;
        }
        if (data.data?.listing) {
          return [data.data.listing];
        }
        if (data.data?._id) {
          return [data.data];
        }
        return [];
      } else if (response.status === 404) {
        return [];
      } else {
        throw new Error(data.message || "Failed to fetch listings");
      }
    } catch (error) {
      console.error("Error fetching marketplace listings:", error);
      throw error;
    }
  };

  const createMarketplaceListing = async (listingData) => {
    setIsSubmitting(true);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("price", listingData.price);
      formData.append("category", listingData.category || "equipment");
      formData.append("status", listingData.status || "active");
      formData.append("itemCondition", listingData.itemCondition || "excellent");

      if (listingData.location) {
        formData.append("location", listingData.location);
      }
      if (listingData.contactPhone) {
        formData.append("contactPhone", listingData.contactPhone);
      }
      if (listingData.contactEmail) {
        formData.append("contactEmail", listingData.contactEmail);
      }

      // Add new photos
      if (listingData.photos && listingData.photos.length > 0) {
        const newPhotos = listingData.photos.filter(file => file instanceof File);
        newPhotos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      // Add new video
      if (listingData.videos && listingData.videos.length > 0) {
        const videoFile = listingData.videos[0];
        if (videoFile instanceof File) {
          formData.append("video", videoFile);
        }
      }

      const saveToast = toast.loading("Creating listing...");
      const response = await fetch(`${API_BASE}/api/market/me`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      toast.dismiss(saveToast);

      if (response.ok) {
        toast.success("Listing created successfully!");
        return data.data;
      } else {
        throw new Error(data.message || "Failed to create listing");
      }
    } catch (error) {
      toast.error(error.message || "Network error while creating listing");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMarketplaceListing = async (id, listingData) => {
    setIsSubmitting(true);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("price", listingData.price);
      formData.append("category", listingData.category || "equipment");
      formData.append("status", listingData.status || "active");
      formData.append("itemCondition", listingData.itemCondition || "excellent");

      if (listingData.location) {
        formData.append("location", listingData.location);
      }
      if (listingData.contactPhone) {
        formData.append("contactPhone", listingData.contactPhone);
      }
      if (listingData.contactEmail) {
        formData.append("contactEmail", listingData.contactEmail);
      }

      // Add photos to delete (for existing photos)
      if (photosToDelete.length > 0) {
        photosToDelete.forEach((photoUrl, index) => {
          formData.append(`photosToDelete[${index}]`, photoUrl);
        });
      }

      // Add delete video flag
      if (deleteVideo) {
        formData.append("deleteVideo", "true");
      }

      // Add new photos
      if (listingData.photos && listingData.photos.length > 0) {
        const newPhotos = listingData.photos.filter(file => file instanceof File);
        newPhotos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      // Add new video
      if (listingData.videos && listingData.videos.length > 0) {
        const videoFile = listingData.videos[0];
        if (videoFile instanceof File) {
          formData.append("video", videoFile);
        }
      }

      const saveToast = toast.loading("Updating listing...");
      const response = await fetch(`${API_BASE}/api/market/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      toast.dismiss(saveToast);

      if (response.ok) {
        toast.success("Listing updated successfully!");
        return data.data;
      } else {
        throw new Error(data.message || "Failed to update listing");
      }
    } catch (error) {
      toast.error(error.message || "Network error while updating listing");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMarketplaceListing = async (id) => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No authentication token found");

      if (
        !window.confirm(
          "Are you sure you want to delete this listing? This action cannot be undone.",
        )
      ) {
        return false;
      }

      const deleteToast = toast.loading("Deleting listing...");
      const response = await fetch(`${API_BASE}/api/market/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      toast.dismiss(deleteToast);

      if (response.ok) {
        toast.success("Listing deleted successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error(error.message || "Network error while deleting listing");
      throw error;
    }
  };

  const loadMarketplaceListings = async () => {
    if (!venue?.isActive) return;

    try {
      setMarketplaceLoading(true);
      const data = await fetchVenueMarketplaceListings();
      setMarketplaceListings(data);

      if (data.length > 0) {
        setActiveMarketSection("listings");
      } else {
        setActiveMarketSection("create");
      }
    } catch (error) {
      console.error("Failed to load marketplace listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setMarketplaceLoading(false);
    }
  };

  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setCurrentListing((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoUpload = (files) => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    // Calculate available slots
    const currentPhotoCount = existingPhotos.length +
      (currentListing.photos?.filter(p => p instanceof File)?.length || 0);
    const availableSlots = 5 - currentPhotoCount;

    if (availableSlots <= 0) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const limitedFiles = files.slice(0, Math.min(files.length, availableSlots));

    if (limitedFiles.length === 0) {
      toast.error("Cannot upload more than 5 photos");
      return;
    }

    // Add new files to current listing
    setCurrentListing((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...limitedFiles],
    }));

    toast.success(`Added ${limitedFiles.length} photo(s)`);
  };

  const handleVideoUpload = (files) => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    if (files.length > 1) {
      toast.error("Maximum 1 video allowed");
      return;
    }

    const videoFile = files[0];

    // Set delete flag to false when uploading new video
    if (deleteVideo) setDeleteVideo(false);

    // Replace existing video with new one
    setCurrentListing((prev) => ({
      ...prev,
      videos: [videoFile],
    }));

    setListingVideos([videoFile]);

    toast.success("Video added");
  };

  const removeListingPhoto = (index) => {
    const allPhotos = [...existingPhotos, ...(currentListing.photos || [])];
    const photoToRemove = allPhotos[index];

    if (typeof photoToRemove === 'string' && photoToRemove.startsWith('http')) {
      // This is an existing photo from server, add to delete list
      setPhotosToDelete(prev => [...prev, photoToRemove]);

      // Remove from existing photos
      const existingIndex = existingPhotos.indexOf(photoToRemove);
      if (existingIndex !== -1) {
        const newExisting = [...existingPhotos];
        newExisting.splice(existingIndex, 1);
        setExistingPhotos(newExisting);
      }

      toast.success("Photo marked for deletion");
    } else if (photoToRemove instanceof File) {
      // This is a newly uploaded file
      setCurrentListing(prev => {
        const newPhotos = [...prev.photos];
        const fileIndex = newPhotos.indexOf(photoToRemove);
        if (fileIndex !== -1) {
          newPhotos.splice(fileIndex, 1);
        }
        return { ...prev, photos: newPhotos };
      });

      toast.success("Photo removed");
    }
  };

  const removeListingVideo = () => {
    if (currentListing.videos?.[0] instanceof File) {
      // New video file, just remove it
      setCurrentListing(prev => ({
        ...prev,
        videos: []
      }));
      setListingVideos([]);
    } else if (currentListing.videos?.[0]) {
      // Existing video from server, mark for deletion
      setDeleteVideo(true);
      setCurrentListing(prev => ({
        ...prev,
        videos: []
      }));
      setListingVideos([]);
    }

    toast.success("Video removed");
  };

  const validateForm = () => {
    const errors = {};

    if (!currentListing.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!currentListing.price || parseFloat(currentListing.price) <= 0) {
      errors.price = "Please enter a valid price";
    }

    if (!currentListing.description?.trim()) {
      errors.description = "Description is required";
    }

    if (!currentListing.location) {
      errors.location = "Pickup location is required";
    }

    // Check total photos (existing + new)
    const totalPhotos = existingPhotos.length +
      (currentListing.photos?.filter(p => p instanceof File)?.length || 0);
    if (totalPhotos === 0) {
      errors.photos = "At least one photo is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateListing = async () => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    if (isSubmitting) {
      toast.error("Please wait, submission in progress");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    if (marketplaceListings.length > 0 && !isEditingListing) {
      toast.error(
        "You can only have one active listing. Please edit or delete your existing listing.",
      );
      return;
    }

    try {
      const listingData = {
        ...currentListing,
        price: parseFloat(currentListing.price),
        category: currentListing.category || "equipment",
        status: currentListing.status || "active",
        itemCondition: currentListing.itemCondition || "excellent",
      };

      const newListing = await createMarketplaceListing(listingData);
      setMarketplaceListings([newListing]);

      resetForm();
      toast.success("Listing created successfully!");
      setActiveMarketSection("listings");

      // Refresh listings
      await loadMarketplaceListings();
    } catch (error) {
      console.error("Failed to create listing:", error);
      toast.error(error.message || "Failed to create listing");
    }
  };

  const handleUpdateListing = async () => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    if (isSubmitting) {
      toast.error("Please wait, submission in progress");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const listingData = {
        ...currentListing,
        price: parseFloat(currentListing.price),
        category: currentListing.category || "equipment",
        status: currentListing.status || "active",
        itemCondition: currentListing.itemCondition || "excellent",
      };

      const updatedListing = await updateMarketplaceListing(
        editingListingId,
        listingData,
      );
      setMarketplaceListings([updatedListing]);

      // Reset delete flags
      setPhotosToDelete([]);
      setDeleteVideo(false);

      setIsEditingListing(false);
      setEditingListingId(null);
      resetForm();
      toast.success("Listing updated successfully!");
      setActiveMarketSection("listings");

      // Refresh listings
      await loadMarketplaceListings();
    } catch (error) {
      console.error("Failed to update listing:", error);
      toast.error(error.message || "Failed to update listing");
    }
  };

  const handleEditListing = (listing) => {
    setIsEditingListing(true);
    setEditingListingId(listing._id);

    // Set existing photos
    setExistingPhotos(listing.photos || []);
    setPhotosToDelete([]);

    // Set existing video
    if (listing.video || listing.videos?.[0]) {
      const videoUrl = listing.video || listing.videos?.[0];
      setListingVideos([videoUrl]);
      setDeleteVideo(false);
    } else {
      setListingVideos([]);
      setDeleteVideo(false);
    }

    setCurrentListing({
      title: listing.title,
      price: listing.price.toString(),
      location: listing.location || "",
      description: listing.description,
      status: listing.status,
      category: listing.category || "equipment",
      itemCondition: listing.itemCondition || "excellent",
      contactPhone: listing.contactPhone || "",
      contactEmail: listing.contactEmail || "",
      photos: [], // New photos will be added here
      videos: listing.video ? [listing.video] : (listing.videos || []),
    });

    setActiveMarketSection("create");
  };

  const handleDeleteListing = async (id) => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    try {
      const success = await deleteMarketplaceListing(id);
      if (success) {
        setMarketplaceListings([]);
        resetForm();
        toast.success("Listing deleted successfully!");
        setActiveMarketSection("create");
      }
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.error(error.message || "Failed to delete listing");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingListing(false);
    setEditingListingId(null);
    setPhotosToDelete([]);
    setDeleteVideo(false);
    resetForm();
    setActiveMarketSection("listings");
    toast.success("Edit cancelled");
  };

  const resetForm = () => {
    setCurrentListing({
      title: "",
      price: "",
      location: "",
      description: "",
      status: "active",
      photos: [],
      videos: [],
      category: "equipment",
      itemCondition: "excellent",
      contactPhone: "",
      contactEmail: "",
    });
    setExistingPhotos([]);
    setPhotosToDelete([]);
    setDeleteVideo(false);
    setListingVideos([]);
    setFormErrors({});
  };

  const handleStripeConnect = async () => {
    try {
      const token = getCookie("token");
      const res = await fetch(`${API_BASE}/api/stripe/connect/onboard`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Stripe connection failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (!venue?.isActive) {
    return <VerificationAlert />;
  }

  const hasListing = marketplaceListings.length > 0;
  const listing = hasListing ? marketplaceListings[0] : null;

  // Combine existing and new photos for display
  const displayPhotos = [
    ...existingPhotos,
    ...(currentListing.photos || []).filter(p => p instanceof File)
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
          },
          duration: 4000,
        }}
      />

      <div className="max-w-7xl mx-auto">
        <MarketplaceHeader venue={venue} />

        {!venue.stripeAccountId && (
          <StripeConnectAlert onConnect={handleStripeConnect} />
        )}

        <MarketplaceTabs
          activeMarketSection={activeMarketSection}
          setActiveMarketSection={setActiveMarketSection}
          isEditingListing={isEditingListing}
          hasListing={hasListing}
        />

        {activeMarketSection === "create" && (
          <CreateListingForm
            currentListing={currentListing}
            displayPhotos={displayPhotos}
            listingVideos={listingVideos}
            formErrors={formErrors}
            isEditingListing={isEditingListing}
            hasListing={hasListing}
            listing={listing}
            isSubmitting={isSubmitting}
            photosToDelete={photosToDelete}
            deleteVideo={deleteVideo}
            onListingChange={handleListingChange}
            onPhotoUpload={handlePhotoUpload}
            onVideoUpload={handleVideoUpload}
            onRemovePhoto={removeListingPhoto}
            onRemoveVideo={removeListingVideo}
            onCancelEdit={handleCancelEdit}
            onDeleteListing={() => listing && handleDeleteListing(listing._id)}
            onCreateOrUpdate={
              isEditingListing ? handleUpdateListing : handleCreateListing
            }
          />
        )}

        {activeMarketSection === "listings" && listing && (
          <ListingDetailView
            listing={listing}
            venue={venue}
            marketplaceLoading={marketplaceLoading}
            onEditListing={() => handleEditListing(listing)}
            onDeleteListing={() => handleDeleteListing(listing._id)}
          />
        )}

        <MarketplaceActionButtons />
      </div>
    </div>
  );
}