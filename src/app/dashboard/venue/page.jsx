// "use client";

// import BillingTab from "@/components/modules/dashboard/billing/BillingTab";
// import AddShowTab from "@/components/modules/dashboard/venues/AddShowTab";
// import EditProfileTab from "@/components/modules/dashboard/venues/EditProfileTab";
// import OverviewTab from "@/components/modules/dashboard/venues/OverviewTab";
// import MarketplaceTab from "@/components/modules/venues/MarketplaceTab";
// import { useAuth } from "@/context/AuthContext";
// import {
//   Building2,
//   CreditCard,
//   Crown,
//   Edit3,
//   Music,
//   ShoppingBag,
//   Users,
//   XCircle
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// // Utility to get cookie safely
// const getCookie = (name) => {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//   return match ? match[2] : null;
// };

// export default function VenueDashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const { user } = useAuth();

//   // ===== BILLING STATES =====
//   const [billingData, setBillingData] = useState(null);
//   const [billingLoading, setBillingLoading] = useState(false);

//   // ✅ FIXED: Proper venue structure
//   const [venue, setVenue] = useState({
//     venueName: "",
//     name: "",
//     state: "Alabama",
//     city: "",
//     address: "",
//     seating: "",
//     seatingCapacity: 0,
//     biography: "",
//     openHours: "",
//     openDays: "",
//     phone: "",
//     website: "",
//     photos: [],
//     isActive: false,
//     verifiedOrder: 0,
//     colorCode: null,
//   });

//   const [previewImages, setPreviewImages] = useState([]);
//   const [newShow, setNewShow] = useState({
//     artist: "",
//     date: "",
//     time: "",
//     image: null,
//   });

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showsThisMonth, setShowsThisMonth] = useState(0);
//   const [subscriptionPlan, setSubscriptionPlan] = useState("free");
//   const [removedPhotos, setRemovedPhotos] = useState([]);

//   // ========== NEW MARKETPLACE STATES ==========
//   const [marketplaceListings, setMarketplaceListings] = useState([]);
//   const [marketplaceLoading, setMarketplaceLoading] = useState(false);
//   const [currentListing, setCurrentListing] = useState({
//     title: "",
//     price: "",
//     location: "",
//     description: "",
//     status: "active",
//     photos: [],
//     videos: [],
//     category: "equipment",
//     itemCondition: "excellent",
//     contactPhone: "",
//     contactEmail: "",
//   });

//   const [listingPhotos, setListingPhotos] = useState([]);
//   const [listingVideos, setListingVideos] = useState([]);
//   const [isEditingListing, setIsEditingListing] = useState(false);
//   const [editingListingId, setEditingListingId] = useState(null);
//   const [activeMarketSection, setActiveMarketSection] = useState("create");
//   // ============================================

//   const cityOptions = ["New Orleans", "Biloxi", "Mobile", "Pensacola"];
//   const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

//   // === Check User Subscription ===
//   useEffect(() => {
//     if (user?.subscriptionPlan) {
//       setSubscriptionPlan(user.subscriptionPlan);
//     }
//   }, [user]);

//   // === Fetch Venue Profile ===
//   useEffect(() => {
//     const fetchVenue = async () => {
//       try {
//         setLoading(true);
//         const token = getCookie("token");
//         if (!token) {
//           // toast.error("You must be logged in.");
//           return;
//         }

//         const res = await fetch(`${API_BASE}/api/venues/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.status === 401) {
//           toast.error("Session expired. Please login again.");
//           return;
//         }

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || "Failed to fetch venue.");
//         }

//         if (data.data?.venue) {
//           const v = data.data.venue;
//           // ✅ CORRECT: Proper venue structure for both frontend and backend
//           setVenue({
//             venueName: v.venueName || "",
//             name: v.venueName || "", // For backward compatibility
//             state: v.state || "Alabama",
//             city: v.city || "",
//             address: v.address || "",
//             seating: v.seatingCapacity?.toString() || "",
//             seatingCapacity: v.seatingCapacity || 0,
//             biography: v.biography || "",
//             openHours: v.openHours || "",
//             openDays: v.openDays || "",
//             phone: v.phone || "",
//             website: v.website || "",
//             photos: v.photos || [],
//             isActive: v.isActive || false,
//             verifiedOrder: v.verifiedOrder || 0,
//             colorCode: v.colorCode || null,
//           });
//           setPreviewImages(v.photos?.map((p) => p.url) || []);
//         }

//         // Fetch shows count for this month
//         await fetchShowsCount(token);

//         // Load marketplace listings if venue is active
//         if (data.data?.venue?.isActive) {
//           await loadMarketplaceListings();
//         }
//       } catch (error) {
//         console.error("Error fetching venue:", error);
//         toast.error(error.message || "Server error while loading venue.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVenue();
//   }, [API_BASE, user?.subscriptionPlan]);

//   // === Fetch Shows Count for Free Plan ===
//   const fetchShowsCount = async (token) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/venues/shows/count`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setShowsThisMonth(data.data?.count || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching shows count:", error);
//     }
//   };

//   // === Marketplace API Functions ===
//   const fetchVenueMarketplaceListings = async () => {
//     try {
//       const token = getCookie("token");
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${API_BASE}/api/market/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // CASE 1: backend returns array
//         if (Array.isArray(data.data)) {
//           return data.data;
//         }

//         // CASE 2: backend returns { listing: {...} }
//         if (data.data?.listing) {
//           return [data.data.listing];
//         }

//         // CASE 3: backend returns single object
//         if (data.data?._id) {
//           return [data.data];
//         }

//         return [];
//       }
//       else if (response.status === 404) {
//         return [];
//       } else {
//         throw new Error(data.message || "Failed to fetch listings");
//       }
//     } catch (error) {
//       console.error("Error fetching marketplace listings:", error);
//       throw error;
//     }
//   };

//   const createMarketplaceListing = async (listingData) => {
//     try {
//       const token = getCookie("token");
//       if (!token) throw new Error("No authentication token found");

//       const formData = new FormData();

//       formData.append("title", listingData.title);
//       formData.append("description", listingData.description);
//       formData.append("price", listingData.price);
//       formData.append("category", listingData.category);
//       formData.append("status", listingData.status);
//       formData.append("itemCondition", listingData.itemCondition);

//       if (listingData.location) {
//         formData.append("location", listingData.location);
//       }
//       if (listingData.contactPhone) {
//         formData.append("contactPhone", listingData.contactPhone);
//       }
//       if (listingData.contactEmail) {
//         formData.append("contactEmail", listingData.contactEmail);
//       }

//       if (listingData.photos && listingData.photos.length > 0) {
//         listingData.photos.forEach((file, index) => {
//           if (file instanceof File) {
//             formData.append("photos", file);
//           }
//         });
//       }

//       if (listingData.videos && listingData.videos.length > 0) {
//         const videoFile = listingData.videos[0];
//         if (videoFile instanceof File) {
//           formData.append("video", videoFile);
//         }
//       }

//       const saveToast = toast.loading("Creating listing...");

//       const response = await fetch(`${API_BASE}/api/market/me`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await response.json();
//       toast.dismiss(saveToast);

//       if (response.ok) {
//         toast.success("Listing created successfully!");
//         return data.data;
//       } else {
//         throw new Error(data.message || "Failed to create listing");
//       }
//     } catch (error) {
//       toast.error(error.message || "Network error while creating listing");
//       throw error;
//     }
//   };

//   const updateMarketplaceListing = async (id, listingData) => {
//     try {
//       const token = getCookie("token");
//       if (!token) throw new Error("No authentication token found");

//       const formData = new FormData();

//       formData.append("title", listingData.title);
//       formData.append("description", listingData.description);
//       formData.append("price", listingData.price);
//       formData.append("category", listingData.category);
//       formData.append("status", listingData.status);
//       formData.append("itemCondition", listingData.itemCondition);

//       if (listingData.location) {
//         formData.append("location", listingData.location);
//       }
//       if (listingData.contactPhone) {
//         formData.append("contactPhone", listingData.contactPhone);
//       }
//       if (listingData.contactEmail) {
//         formData.append("contactEmail", listingData.contactEmail);
//       }

//       if (listingData.photos && listingData.photos.length > 0) {
//         const newPhotos = listingData.photos.filter(
//           (file) => file instanceof File
//         );
//         newPhotos.forEach((file) => {
//           formData.append("photos", file);
//         });
//       }

//       if (listingData.videos && listingData.videos.length > 0) {
//         const videoFile = listingData.videos[0];
//         if (videoFile instanceof File) {
//           formData.append("video", videoFile);
//         }
//       }

//       const saveToast = toast.loading("Updating listing...");

//       const response = await fetch(`${API_BASE}/api/market/me`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await response.json();
//       toast.dismiss(saveToast);

//       if (response.ok) {
//         toast.success("Listing updated successfully!");
//         return data.data;
//       } else {
//         throw new Error(data.message || "Failed to update listing");
//       }
//     } catch (error) {
//       toast.error(error.message || "Network error while updating listing");
//       throw error;
//     }
//   };

//   const deleteMarketplaceListing = async (id) => {
//     try {
//       const token = getCookie("token");
//       if (!token) throw new Error("No authentication token found");

//       if (
//         !window.confirm(
//           "Are you sure you want to delete this listing? This action cannot be undone."
//         )
//       ) {
//         return false;
//       }

//       const deleteToast = toast.loading("Deleting listing...");

//       const response = await fetch(`${API_BASE}/api/market/me`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();
//       toast.dismiss(deleteToast);

//       if (response.ok) {
//         toast.success("Listing deleted successfully!");
//         return true;
//       } else {
//         throw new Error(data.message || "Failed to delete listing");
//       }
//     } catch (error) {
//       toast.error(error.message || "Network error while deleting listing");
//       throw error;
//     }
//   };

//   const deleteMarketplacePhoto = async (photoIndex) => {
//     try {
//       const token = getCookie("token");
//       if (!token) throw new Error("No authentication token found");

//       const deleteToast = toast.loading("Deleting photo...");

//       const response = await fetch(
//         `${API_BASE}/api/market/me/photos/${photoIndex}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const data = await response.json();
//       toast.dismiss(deleteToast);

//       if (response.ok) {
//         toast.success("Photo deleted successfully!");
//         return data.data;
//       } else {
//         throw new Error(data.message || "Failed to delete photo");
//       }
//     } catch (error) {
//       toast.error(error.message || "Network error while deleting photo");
//       throw error;
//     }
//   };

//   // === Marketplace Handlers ===
//   const loadMarketplaceListings = async () => {
//     if (!venue?.isActive) return;

//     try {
//       setMarketplaceLoading(true);
//       const data = await fetchVenueMarketplaceListings();
//       setMarketplaceListings(data);

//       if (data.length > 0) {
//         setActiveMarketSection("listings");
//       } else {
//         setActiveMarketSection("create");
//       }
//     } catch (error) {
//       console.error("Failed to load marketplace listings:", error);
//     } finally {
//       setMarketplaceLoading(false);
//     }
//   };

//   const handleListingChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentListing((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleListingPhotoUpload = (files) => {
//     if (!venue?.isActive) {
//       toast.error("Only verified venues can use the marketplace");
//       return;
//     }

//     const availableSlots =
//       5 -
//       (listingPhotos.length +
//         currentListing.photos?.filter((p) => !(p instanceof File))?.length ||
//         0);
//     const limitedFiles = files.slice(0, Math.max(0, availableSlots));

//     if (limitedFiles.length === 0) {
//       toast.error("Maximum 5 photos allowed");
//       return;
//     }

//     const urls = limitedFiles.map((file) => URL.createObjectURL(file));
//     setListingPhotos((prev) => [...prev, ...urls]);
//     setCurrentListing((prev) => ({
//       ...prev,
//       photos: [...(prev.photos || []), ...limitedFiles],
//     }));
//   };

//   const handleListingVideoUpload = (files) => {
//     if (!venue?.isActive) {
//       toast.error("Only verified venues can use the marketplace");
//       return;
//     }

//     const availableSlots =
//       1 - (listingVideos.length + (currentListing.video ? 1 : 0));
//     const limitedFiles = files.slice(0, Math.max(0, availableSlots));

//     if (limitedFiles.length === 0) {
//       toast.error("Maximum 1 video allowed");
//       return;
//     }

//     const urls = limitedFiles.map((file) => URL.createObjectURL(file));
//     setListingVideos((prev) => [...prev, ...urls]);
//     setCurrentListing((prev) => ({
//       ...prev,
//       videos: [...(prev.videos || []), ...limitedFiles],
//     }));
//   };

//   const removeListingPhoto = async (index) => {
//     try {
//       const photoToRemove = listingPhotos[index];

//       if (photoToRemove?.startsWith("blob:")) {
//         URL.revokeObjectURL(photoToRemove);

//         setCurrentListing((prev) => {
//           const newPhotos = [...prev.photos];
//           const fileIndex = newPhotos.findIndex((p) => p instanceof File);
//           if (fileIndex !== -1) {
//             newPhotos.splice(fileIndex, 1);
//           }
//           return { ...prev, photos: newPhotos };
//         });

//         setListingPhotos((prev) => {
//           const newList = [...prev];
//           newList.splice(index, 1);
//           return newList;
//         });
//       } else {
//         const updatedListing = await deleteMarketplacePhoto(index);

//         if (updatedListing) {
//           setCurrentListing((prev) => ({
//             ...prev,
//             photos: updatedListing.photos || [],
//           }));

//           if (activeTab === "marketplace") {
//             await loadMarketplaceListings();
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Failed to remove photo:", error);
//     }
//   };

//   const removeListingVideo = (index) => {
//     if (listingVideos[index]?.startsWith("blob:")) {
//       URL.revokeObjectURL(listingVideos[index]);
//     }

//     setCurrentListing((prev) => {
//       const newVideos = [...prev.videos];
//       newVideos.splice(index, 1);
//       return { ...prev, videos: newVideos };
//     });

//     setListingVideos((prev) => {
//       const newList = [...prev];
//       newList.splice(index, 1);
//       return newList;
//     });
//   };

//   const handleCreateListing = async () => {
//     if (!venue?.isActive) {
//       toast.error("Only verified venues can use the marketplace");
//       return;
//     }

//     if (!currentListing.title?.trim()) {
//       toast.error("Please enter a title");
//       return;
//     }

//     if (!currentListing.price || parseFloat(currentListing.price) <= 0) {
//       toast.error("Please enter a valid price");
//       return;
//     }

//     if (!currentListing.description?.trim()) {
//       toast.error("Please enter a description");
//       return;
//     }

//     const totalPhotos = listingPhotos.length;
//     if (totalPhotos === 0) {
//       toast.error("Please upload at least one photo");
//       return;
//     }

//     try {
//       if (marketplaceListings.length > 0 && !isEditingListing) {
//         toast.error(
//           "You can only have one active listing. Please edit or delete your existing listing."
//         );
//         return;
//       }

//       const listingData = {
//         ...currentListing,
//         price: parseFloat(currentListing.price),
//         category: currentListing.category || "equipment",
//         status: currentListing.status || "active",
//       };

//       const newListing = await createMarketplaceListing(listingData);

//       setMarketplaceListings([newListing]);

//       setCurrentListing({
//         title: "",
//         price: "",
//         location: "",
//         description: "",
//         status: "active",
//         photos: [],
//         videos: [],
//         category: "equipment",
//         itemCondition: "excellent",
//         contactPhone: "",
//         contactEmail: "",
//       });
//       setListingPhotos([]);
//       setListingVideos([]);

//       toast.success("Listing created successfully!");
//       setActiveMarketSection("listings");
//     } catch (error) {
//       console.error("Failed to create listing:", error);
//     }
//   };

//   const handleEditListing = (listing) => {
//     setIsEditingListing(true);
//     setEditingListingId(listing._id);
//     setCurrentListing({
//       title: listing.title,
//       price: listing.price.toString(),
//       location: listing.location || "",
//       description: listing.description,
//       status: listing.status,
//       category: listing.category || "equipment",
//       itemCondition: listing.itemCondition || "excellent",
//       contactPhone: listing.contactPhone || "",
//       contactEmail: listing.contactEmail || "",
//       photos: listing.photos || [],
//       videos: listing.video ? [listing.video] : [],
//     });

//     setListingPhotos(listing.photos || []);
//     setListingVideos(listing.video ? [listing.video] : []);

//     setActiveMarketSection("create");
//   };

//   const handleUpdateListing = async () => {
//     if (!venue?.isActive) {
//       toast.error("Only verified venues can use the marketplace");
//       return;
//     }

//     if (!currentListing.title?.trim()) {
//       toast.error("Please enter a title");
//       return;
//     }

//     if (!currentListing.price || parseFloat(currentListing.price) <= 0) {
//       toast.error("Please enter a valid price");
//       return;
//     }

//     if (!currentListing.description?.trim()) {
//       toast.error("Please enter a description");
//       return;
//     }

//     const totalPhotos = listingPhotos.length;
//     if (totalPhotos === 0) {
//       toast.error("Please upload at least one photo");
//       return;
//     }

//     try {
//       const listingData = {
//         ...currentListing,
//         price: parseFloat(currentListing.price),
//         category: currentListing.category || "equipment",
//         status: currentListing.status || "active",
//       };

//       const updatedListing = await updateMarketplaceListing(
//         editingListingId,
//         listingData
//       );

//       setMarketplaceListings([updatedListing]);

//       setIsEditingListing(false);
//       setEditingListingId(null);
//       setCurrentListing({
//         title: "",
//         price: "",
//         location: "",
//         description: "",
//         status: "active",
//         photos: [],
//         videos: [],
//         category: "equipment",
//         itemCondition: "excellent",
//         contactPhone: "",
//         contactEmail: "",
//       });
//       setListingPhotos([]);
//       setListingVideos([]);

//       toast.success("Listing updated successfully!");
//       setActiveMarketSection("listings");
//     } catch (error) {
//       console.error("Failed to update listing:", error);
//     }
//   };

//   const handleDeleteListing = async (id) => {
//     if (!venue?.isActive) {
//       toast.error("Only verified venues can use the marketplace");
//       return;
//     }

//     try {
//       await deleteMarketplaceListing(id);
//       setMarketplaceListings([]);
//       toast.success("Listing deleted successfully!");
//       setActiveMarketSection("create");
//     } catch (error) {
//       console.error("Failed to delete listing:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditingListing(false);
//     setEditingListingId(null);
//     setCurrentListing({
//       title: "",
//       price: "",
//       location: "",
//       description: "",
//       status: "active",
//       photos: [],
//       videos: [],
//       category: "equipment",
//       itemCondition: "excellent",
//       contactPhone: "",
//       contactEmail: "",
//     });
//     setListingPhotos([]);
//     setListingVideos([]);
//     setActiveMarketSection("listings");
//   };

//   // === Handle Input ===
//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;

//   //   if (subscriptionPlan === "free") {
//   //     if (name === "biography" || name === "openHours") {
//   //       toast.error(`Free plan users cannot update ${name}. Upgrade to Pro.`);
//   //       return;
//   //     }
//   //   }

//   //   setVenue({ ...venue, [name]: value });
//   // };

//   // === Image Upload with Plan Validation ===
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);

//     if (previewImages.length + files.length > 10) {
//       toast.error("Maximum 10 photos allowed.");
//       return;
//     }

//     const urls = files.map((file) => URL.createObjectURL(file));
//     setPreviewImages([...previewImages, ...urls]);
//     setVenue((prev) => ({
//       ...prev,
//       photos: [...prev.photos, ...files],
//     }));
//   };


//   const removeImage = (index) => {
//     const urlToRemove = previewImages[index];

//     const photoObj = venue.photos.find((p) => p.url === urlToRemove);

//     if (photoObj?.filename) {
//       setRemovedPhotos((prev) => [...prev, photoObj.filename]);
//     }

//     setPreviewImages((prev) => prev.filter((_, i) => i !== index));

//     setVenue((prev) => ({
//       ...prev,
//       photos: prev.photos.filter((p) => p.url !== urlToRemove),
//     }));
//   };

//   // === Save Venue with Plan Validation ===
//   const handleSave = async (saveData) => {
//     try {
//       const token = getCookie("token");
//       if (!token) {
//         toast.error("You are not logged in.");
//         return;
//       }

//       if (saveData) {
//         setVenue((prev) => ({
//           ...prev,
//           ...saveData,
//         }));
//       }

//       // Use saveData if provided, otherwise use venue state
//       const dataToSave = saveData || {
//         venueName: venue.venueName || venue.name || "",
//         state: venue.state || "Alabama",
//         city: venue.city.toLowerCase(),
//         address: venue.address || "",
//         seatingCapacity: venue.seatingCapacity || parseInt(venue.seating) || 0,
//         biography: venue.biography || "",
//         openHours: venue.openHours || "",
//         openDays: venue.openDays || "Mon-Sat",
//         phone: venue.phone || "",
//         website: venue.website || ""
//       };

//       // console.log("Sending venue data:", dataToSave); // ✅ Debug log

//       const formData = new FormData();

//       // ✅ Required fields - MUST include state
//       formData.append("venueName", dataToSave.venueName);
//       formData.append("state", dataToSave.state || "Alabama");
//       formData.append("city", dataToSave.city);

//       // Optional fields based on plan
//       if (dataToSave.address) formData.append("address", dataToSave.address);
//       if (dataToSave.seatingCapacity) formData.append("seatingCapacity", dataToSave.seatingCapacity);

//       formData.append("biography", dataToSave.biography || "");
//       if (dataToSave.openHours) formData.append("openHours", dataToSave.openHours);
//       if (dataToSave.openDays) formData.append("openDays", dataToSave.openDays);
//       if (dataToSave.phone) formData.append("phone", dataToSave.phone);
//       if (dataToSave.website) formData.append("website", dataToSave.website);


//       // if (subscriptionPlan === "pro") {

//       // }

//       // Handle photos
//       // if (venue.photos && venue.photos.length > 0 && subscriptionPlan === "pro") {
//       if (venue.photos && venue.photos.length > 0) {
//         venue.photos.forEach((file) => {
//           if (file instanceof File) {
//             formData.append("photos", file);
//           }
//         });
//       }

//       // Handle removed photos
//       removedPhotos.forEach((filename) => {
//         formData.append("removedPhotos", filename);
//       });

//       // ✅ Debug: Log formData contents
//       console.log("FormData contents:");
//       for (let pair of formData.entries()) {
//         console.log(pair[0] + ': ' + pair[1]);
//       }

//       setSaving(true);
//       const saveToast = toast.loading("Saving venue...");

//       const res = await fetch(`${API_BASE}/api/venues/profile`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       toast.dismiss(saveToast);

//       console.log("Save response:", data); // ✅ Debug log

//       if (!res.ok) {
//         console.error("Save error response:", data);
//         toast.error(data.message || "Failed to save venue");
//         return;
//       }

//       toast.success("Venue profile saved successfully!");
//       setRemovedPhotos([]);

//       if (data.data?.venue) {
//         const v = data.data.venue;

//         setVenue({
//           venueName: v.venueName || "",
//           name: v.venueName || "",
//           state: v.state || "Alabama",
//           city: v.city || "",
//           address: v.address || "",
//           seating: v.seatingCapacity?.toString() || "",
//           seatingCapacity: v.seatingCapacity || 0,
//           biography: v.biography || "",
//           openHours: v.openHours || "",
//           openDays: v.openDays || "",
//           phone: v.phone || "",
//           website: v.website || "",
//           photos: v.photos || [],
//           isActive: v.isActive || false,
//           verifiedOrder: v.verifiedOrder || 0,
//           colorCode: v.colorCode || null,
//         });

//         setPreviewImages(v.photos?.map((p) => p.url) || []);
//       }

//     } catch (error) {
//       console.error("Save error:", error);
//       toast.error(error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // === Add Show with Free Plan Limit ===
//   const handleAddShow = async (e) => {
//     e.preventDefault();

//     if (subscriptionPlan === "free" && showsThisMonth >= 1) {
//       toast.error(
//         "Free plan allows only 1 show per month. Upgrade to Pro for unlimited shows."
//       );
//       return;
//     }

//     if (!newShow.artist || !newShow.date || !newShow.time || !newShow.image) {
//       toast.error("Please fill all fields including the show image.");
//       return;
//     }

//     try {
//       const token = getCookie("token");
//       if (!token) {
//         toast.error("You are not logged in.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("artist", newShow.artist);
//       formData.append("date", newShow.date);
//       formData.append("time", newShow.time);
//       formData.append("image", newShow.image);

//       setLoading(true);
//       const addToast = toast.loading("Adding show...");

//       const res = await fetch(`${API_BASE}/api/venues/add-show`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       toast.dismiss(addToast);

//       if (!res.ok) {
//         if (data.message?.includes("Free plan")) {
//           toast.error(data.message);
//         } else {
//           throw new Error(data.message || "Failed to add show.");
//         }
//         return;
//       }

//       toast.success("🎤 Show added successfully!");
//       setNewShow({ artist: "", date: "", time: "", image: null });

//       if (subscriptionPlan === "free") {
//         setShowsThisMonth((prev) => prev + 1);
//       }
//     } catch (error) {
//       console.error("Add show error:", error);
//       toast.error(error.message || "Error adding show.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProCheckout = async () => {
//     try {
//       const token = getCookie("token");
//       if (!token) {
//         alert("You must be logged in to upgrade.");
//         return;
//       }

//       const res = await fetch(
//         `${API_BASE}/api/subscription/checkout/pro`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       if (!res.ok || !data.url) {
//         throw new Error(data.message || "Checkout failed");
//       }

//       window.location.href = data.url;
//     } catch (error) {
//       console.error("Checkout error:", error);
//       alert("Unable to start checkout. Please try again.");
//     }
//   };

//   // ================= BILLING HELPERS =================
//   const loadBillingData = async () => {
//     try {
//       setBillingLoading(true);
//       const token = getCookie("token");

//       // ✅ CORRECT: Use venue-specific subscription endpoint
//       const res = await fetch(`${API_BASE}/api/venues/subscription/status`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setBillingData(data.data);
//       } else {
//         console.warn("Billing data not available:", data.message);
//         // Set default free plan data
//         setBillingData({
//           plan: "free",
//           status: "none",
//           currentPeriodEnd: null,
//           cancelAtPeriodEnd: false,
//           trialEndsAt: null,
//         });
//       }
//     } catch (err) {
//       console.error("Billing load error:", err);
//       // Set default free plan data on error
//       setBillingData({
//         plan: "free",
//         status: "none",
//         currentPeriodEnd: null,
//         cancelAtPeriodEnd: false,
//         trialEndsAt: null,
//       });
//     } finally {
//       setBillingLoading(false);
//     }
//   };

//   const handleOpenPortal = async () => {
//     const token = getCookie("token");

//     const res = await fetch(`${API_BASE}/api/subscription/portal`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     if (data?.url) {
//       window.open(data.url, "_blank");
//     }
//   };

//   const handleCancelSubscription = async () => {
//     const token = getCookie("token");

//     await fetch(`${API_BASE}/api/subscription/cancel`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     loadBillingData();
//   };

//   const handleResumeSubscription = async () => {
//     const token = getCookie("token");

//     await fetch(`${API_BASE}/api/subscription/resume`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     loadBillingData();
//   };

//   // === Plan Badge Component ===
//   const PlanBadge = () => (
//     <div
//       className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${subscriptionPlan === "pro"
//         ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
//         : "bg-gray-700 text-gray-300 border border-gray-600"
//         }`}
//     >
//       {subscriptionPlan === "pro" ? (
//         <>
//           <Crown size={14} />
//           Pro Plan
//         </>
//       ) : (
//         <>
//           <Users size={14} />
//           Free Plan
//         </>
//       )}
//     </div>
//   );

//   // === Upgrade Prompt Component ===
//   const UpgradePrompt = ({ feature }) => (
//     <div className="mt-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
//       <div className="flex items-start gap-3">
//         <Crown className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
//         <div>
//           <p className="text-sm text-gray-300">
//             <span className="font-medium">{feature}</span> is available for Pro
//             users
//           </p>
//           <button
//             onClick={() => window.open("/pricing", "_blank")}
//             className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-medium transition"
//           >
//             Upgrade to Pro
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
//           <p className="text-gray-400">Loading venue dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-16">
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="">
//         {/* Header with Plan Info */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <div className="p-2 bg-yellow-500 rounded-lg">
//               <Building2 size={32} className="text-black" />
//             </div>
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-white">Venue Dashboard</h1>
//               <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
//                 <PlanBadge />
//                 {!venue.isActive && (
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
//                     <XCircle size={14} />
//                     Pending Verification
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <p className="text-gray-400 text-lg">
//             Manage your venue profile and upcoming shows
//           </p>
//         </div>

//         {/* Plan Stats Bar */}
//         {/* {subscriptionPlan === "free" && (
//           <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-blue-500/20 rounded-lg">
//                   <Music size={20} className="text-blue-400" />
//                 </div>
//                 <div>
//                   <p className="text-white font-medium">Monthly Show Limit</p>
//                   <p className="text-gray-400 text-sm">
//                     {showsThisMonth}/1 show this month
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-purple-500/20 rounded-lg">
//                   <ImageIcon size={20} className="text-purple-400" />
//                 </div>
//                 <div>
//                   <p className="text-white font-medium">Photo Uploads</p>
//                   <p className="text-gray-400 text-sm">
//                     Not available in Free plan
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-yellow-500/20 rounded-lg">
//                   <ShoppingBag size={20} className="text-yellow-400" />
//                 </div>
//                 <div>
//                   <p className="text-white font-medium">Marketplace</p>
//                   <p className="text-gray-400 text-sm">Pro feature only</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleProCheckout}
//                 className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600
//              hover:from-yellow-500 hover:to-yellow-700
//              text-black px-5 py-2.5 rounded-xl font-semibold
//              shadow-md hover:shadow-lg transition-all whitespace-nowrap"
//               >
//                 <Crown size={16} />
//                 Upgrade to Pro · $10/month
//               </button>
//             </div>
//           </div>
//         )} */}

//         {/* Main Container */}
//         <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
//           {/* Tabs */}
//           <div className="border-b border-gray-700 bg-gray-900">
//             <div className="flex overflow-x-auto">
//               {[
//                 { id: "overview", label: "Overview", icon: Building2 },
//                 { id: "edit", label: "Edit Profile", icon: Edit3 },
//                 { id: "addshow", label: "Add Show", icon: Music },
//                 { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
//                 { id: "billing", label: "Billing", icon: CreditCard },
//               ].map(({ id, label, icon: Icon }) => (
//                 <button
//                   key={id}
//                   onClick={() => {
//                     setActiveTab(id);

//                     if (id === "marketplace" && venue?.isActive) {
//                       loadMarketplaceListings();
//                     }

//                     if (id === "billing") {
//                       loadBillingData();
//                     }
//                   }}
//                   className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === id
//                     ? "text-yellow-400 border-b-2 border-yellow-400 bg-gray-800"
//                     : "text-gray-400 hover:text-yellow-300 hover:bg-gray-800/50"
//                     }`}
//                 >
//                   <Icon size={18} />
//                   <span className="hidden sm:inline">{label}</span>
//                   <span className="sm:hidden">{label.charAt(0)}</span>

//                   {id === "addshow" && subscriptionPlan === "free" && (
//                     <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
//                       {showsThisMonth}/1
//                     </span>
//                   )}

//                   {id === "marketplace" && !venue.isActive && (
//                     <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
//                       Verify
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="p-4 sm:p-6 md:p-8">
//             {activeTab === "overview" && (
//               <OverviewTab
//                 venue={venue}
//                 previewImages={previewImages}
//                 subscriptionPlan={subscriptionPlan}
//               />
//             )}
//             {activeTab === "edit" && (
//               <EditProfileTab
//                 venue={venue}
//                 // handleChange={handleChange}
//                 handleImageUpload={handleImageUpload}
//                 removeImage={removeImage}
//                 previewImages={previewImages}
//                 handleSave={handleSave}
//                 saving={saving}
//                 subscriptionPlan={subscriptionPlan}
//                 UpgradePrompt={UpgradePrompt}
//               />
//             )}
//             {activeTab === "addshow" && (
//               <AddShowTab
//                 newShow={newShow}
//                 setNewShow={setNewShow}
//                 handleAddShow={handleAddShow}
//                 loading={loading}
//                 subscriptionPlan={subscriptionPlan}
//                 showsThisMonth={showsThisMonth}
//                 UpgradePrompt={UpgradePrompt}
//                 venue={venue}
//               />
//             )}
//             {activeTab === "marketplace" && (
//               <MarketplaceTab
//                 subscriptionPlan={subscriptionPlan}
//                 venue={venue}
//                 marketplaceListings={marketplaceListings}
//                 marketplaceLoading={marketplaceLoading}
//                 currentListing={currentListing}
//                 listingPhotos={listingPhotos}
//                 listingVideos={listingVideos}
//                 isEditingListing={isEditingListing}
//                 activeMarketSection={activeMarketSection}
//                 setActiveMarketSection={setActiveMarketSection}
//                 handleListingChange={handleListingChange}
//                 handleListingPhotoUpload={handleListingPhotoUpload}
//                 handleListingVideoUpload={handleListingVideoUpload}
//                 removeListingPhoto={removeListingPhoto}
//                 removeListingVideo={removeListingVideo}
//                 handleCreateListing={handleCreateListing}
//                 handleUpdateListing={handleUpdateListing}
//                 handleEditListing={handleEditListing}
//                 handleDeleteListing={handleDeleteListing}
//                 handleCancelEdit={handleCancelEdit}
//               />
//             )}

//             {activeTab === "billing" && (
//               <BillingTab
//                 user={user}
//                 billingData={billingData}
//                 loading={billingLoading}
//                 onUpgrade={handleProCheckout}
//                 onOpenPortal={handleOpenPortal}
//                 onCancel={handleCancelSubscription}
//                 onResume={handleResumeSubscription}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import OverviewPage from './overview/page'

const VenueDashboard = () => {
  return (
    <OverviewPage />
  )
}

export default OverviewPage


