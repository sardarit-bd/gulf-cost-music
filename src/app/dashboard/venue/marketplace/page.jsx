// // app/dashboard/venues/marketplace/page.js
// "use client";

// import {
//     AlertCircle,
//     ArrowLeft,
//     Building2,
//     CheckCircle,
//     DollarSign,
//     Edit2,
//     Edit3,
//     FileText,
//     ImageIcon,
//     List,
//     MapPin,
//     Package,
//     PlusCircle,
//     Shield,
//     Trash2,
//     Upload,
//     Video,
//     X
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const getCookie = (name) => {
//     if (typeof document === "undefined") return null;
//     const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//     return match ? match[2] : null;
// };

// export default function MarketplacePage() {
//     const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

//     const [venue, setVenue] = useState(null);
//     const [marketplaceListings, setMarketplaceListings] = useState([]);
//     const [marketplaceLoading, setMarketplaceLoading] = useState(false);
//     const [currentListing, setCurrentListing] = useState({
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
//     });
//     const [listingPhotos, setListingPhotos] = useState([]);
//     const [listingVideos, setListingVideos] = useState([]);
//     const [isEditingListing, setIsEditingListing] = useState(false);
//     const [editingListingId, setEditingListingId] = useState(null);
//     const [activeMarketSection, setActiveMarketSection] = useState("create");
//     const [formErrors, setFormErrors] = useState({});
//     const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//     const [loadingPage, setLoadingPage] = useState(true);

//     useEffect(() => {
//         fetchVenueData();
//     }, []);

//     const fetchVenueData = async () => {
//         try {
//             setLoadingPage(true);
//             const token = getCookie("token");
//             if (!token) {
//                 toast.error("You must be logged in.");
//                 return;
//             }

//             const res = await fetch(`${API_BASE}/api/venues/profile`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (res.status === 401) {
//                 toast.error("Session expired. Please login again.");
//                 return;
//             }

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.message || "Failed to fetch venue.");
//             }

//             if (data.data?.venue) {
//                 const v = data.data.venue;
//                 setVenue({
//                     name: v.venueName || "",
//                     city: v.city || "",
//                     isActive: v.isActive || false,
//                     stripeAccountId: v.stripeAccountId
//                 });

//                 if (v.isActive) {
//                     await loadMarketplaceListings();
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching venue:", error);
//             toast.error(error.message || "Server error while loading venue.");
//         } finally {
//             setLoadingPage(false);
//         }
//     };

//     const fetchVenueMarketplaceListings = async () => {
//         try {
//             const token = getCookie("token");
//             if (!token) throw new Error("No authentication token found");

//             const response = await fetch(`${API_BASE}/api/market/me`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 if (Array.isArray(data.data)) {
//                     return data.data;
//                 }
//                 if (data.data?.listing) {
//                     return [data.data.listing];
//                 }
//                 if (data.data?._id) {
//                     return [data.data];
//                 }
//                 return [];
//             }
//             else if (response.status === 404) {
//                 return [];
//             } else {
//                 throw new Error(data.message || "Failed to fetch listings");
//             }
//         } catch (error) {
//             console.error("Error fetching marketplace listings:", error);
//             throw error;
//         }
//     };

//     const createMarketplaceListing = async (listingData) => {
//         try {
//             const token = getCookie("token");
//             if (!token) throw new Error("No authentication token found");

//             const formData = new FormData();
//             formData.append("title", listingData.title);
//             formData.append("description", listingData.description);
//             formData.append("price", listingData.price);
//             formData.append("category", listingData.category);
//             formData.append("status", listingData.status);
//             formData.append("itemCondition", listingData.itemCondition);

//             if (listingData.location) {
//                 formData.append("location", listingData.location);
//             }
//             if (listingData.contactPhone) {
//                 formData.append("contactPhone", listingData.contactPhone);
//             }
//             if (listingData.contactEmail) {
//                 formData.append("contactEmail", listingData.contactEmail);
//             }

//             if (listingData.photos && listingData.photos.length > 0) {
//                 listingData.photos.forEach((file, index) => {
//                     if (file instanceof File) {
//                         formData.append("photos", file);
//                     }
//                 });
//             }

//             if (listingData.videos && listingData.videos.length > 0) {
//                 const videoFile = listingData.videos[0];
//                 if (videoFile instanceof File) {
//                     formData.append("video", videoFile);
//                 }
//             }

//             const saveToast = toast.loading("Creating listing...");
//             const response = await fetch(`${API_BASE}/api/market/me`, {
//                 method: "POST",
//                 headers: { Authorization: `Bearer ${token}` },
//                 body: formData,
//             });

//             const data = await response.json();
//             toast.dismiss(saveToast);

//             if (response.ok) {
//                 toast.success("Listing created successfully!");
//                 return data.data;
//             } else {
//                 throw new Error(data.message || "Failed to create listing");
//             }
//         } catch (error) {
//             toast.error(error.message || "Network error while creating listing");
//             throw error;
//         }
//     };

//     const updateMarketplaceListing = async (id, listingData) => {
//         try {
//             const token = getCookie("token");
//             if (!token) throw new Error("No authentication token found");

//             const formData = new FormData();
//             formData.append("title", listingData.title);
//             formData.append("description", listingData.description);
//             formData.append("price", listingData.price);
//             formData.append("category", listingData.category);
//             formData.append("status", listingData.status);
//             formData.append("itemCondition", listingData.itemCondition);

//             if (listingData.location) {
//                 formData.append("location", listingData.location);
//             }
//             if (listingData.contactPhone) {
//                 formData.append("contactPhone", listingData.contactPhone);
//             }
//             if (listingData.contactEmail) {
//                 formData.append("contactEmail", listingData.contactEmail);
//             }

//             if (listingData.photos && listingData.photos.length > 0) {
//                 const newPhotos = listingData.photos.filter(
//                     (file) => file instanceof File
//                 );
//                 newPhotos.forEach((file) => {
//                     formData.append("photos", file);
//                 });
//             }

//             if (listingData.videos && listingData.videos.length > 0) {
//                 const videoFile = listingData.videos[0];
//                 if (videoFile instanceof File) {
//                     formData.append("video", videoFile);
//                 }
//             }

//             const saveToast = toast.loading("Updating listing...");
//             const response = await fetch(`${API_BASE}/api/market/me`, {
//                 method: "PUT",
//                 headers: { Authorization: `Bearer ${token}` },
//                 body: formData,
//             });

//             const data = await response.json();
//             toast.dismiss(saveToast);

//             if (response.ok) {
//                 toast.success("Listing updated successfully!");
//                 return data.data;
//             } else {
//                 throw new Error(data.message || "Failed to update listing");
//             }
//         } catch (error) {
//             toast.error(error.message || "Network error while updating listing");
//             throw error;
//         }
//     };

//     const deleteMarketplaceListing = async (id) => {
//         try {
//             const token = getCookie("token");
//             if (!token) throw new Error("No authentication token found");

//             if (
//                 !window.confirm(
//                     "Are you sure you want to delete this listing? This action cannot be undone."
//                 )
//             ) {
//                 return false;
//             }

//             const deleteToast = toast.loading("Deleting listing...");
//             const response = await fetch(`${API_BASE}/api/market/me`, {
//                 method: "DELETE",
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const data = await response.json();
//             toast.dismiss(deleteToast);

//             if (response.ok) {
//                 toast.success("Listing deleted successfully!");
//                 return true;
//             } else {
//                 throw new Error(data.message || "Failed to delete listing");
//             }
//         } catch (error) {
//             toast.error(error.message || "Network error while deleting listing");
//             throw error;
//         }
//     };

//     const loadMarketplaceListings = async () => {
//         if (!venue?.isActive) return;

//         try {
//             setMarketplaceLoading(true);
//             const data = await fetchVenueMarketplaceListings();
//             setMarketplaceListings(data);

//             if (data.length > 0) {
//                 setActiveMarketSection("listings");
//             } else {
//                 setActiveMarketSection("create");
//             }
//         } catch (error) {
//             console.error("Failed to load marketplace listings:", error);
//         } finally {
//             setMarketplaceLoading(false);
//         }
//     };

//     const handleListingChange = (e) => {
//         const { name, value } = e.target;
//         setCurrentListing((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleListingPhotoUpload = (files) => {
//         if (!venue?.isActive) {
//             toast.error("Only verified venues can use the marketplace");
//             return;
//         }

//         const availableSlots =
//             5 -
//             (listingPhotos.length +
//                 currentListing.photos?.filter((p) => !(p instanceof File))?.length ||
//                 0);
//         const limitedFiles = files.slice(0, Math.max(0, availableSlots));

//         if (limitedFiles.length === 0) {
//             toast.error("Maximum 5 photos allowed");
//             return;
//         }

//         const urls = limitedFiles.map((file) => URL.createObjectURL(file));
//         setListingPhotos((prev) => [...prev, ...urls]);
//         setCurrentListing((prev) => ({
//             ...prev,
//             photos: [...(prev.photos || []), ...limitedFiles],
//         }));
//     };

//     const handleListingVideoUpload = (files) => {
//         if (!venue?.isActive) {
//             toast.error("Only verified venues can use the marketplace");
//             return;
//         }

//         const availableSlots =
//             1 - (listingVideos.length + (currentListing.video ? 1 : 0));
//         const limitedFiles = files.slice(0, Math.max(0, availableSlots));

//         if (limitedFiles.length === 0) {
//             toast.error("Maximum 1 video allowed");
//             return;
//         }

//         const urls = limitedFiles.map((file) => URL.createObjectURL(file));
//         setListingVideos((prev) => [...prev, ...urls]);
//         setCurrentListing((prev) => ({
//             ...prev,
//             videos: [...(prev.videos || []), ...limitedFiles],
//         }));
//     };

//     const removeListingPhoto = async (index) => {
//         try {
//             const photoToRemove = listingPhotos[index];

//             if (photoToRemove?.startsWith("blob:")) {
//                 URL.revokeObjectURL(photoToRemove);

//                 setCurrentListing((prev) => {
//                     const newPhotos = [...prev.photos];
//                     const fileIndex = newPhotos.findIndex((p) => p instanceof File);
//                     if (fileIndex !== -1) {
//                         newPhotos.splice(fileIndex, 1);
//                     }
//                     return { ...prev, photos: newPhotos };
//                 });

//                 setListingPhotos((prev) => {
//                     const newList = [...prev];
//                     newList.splice(index, 1);
//                     return newList;
//                 });
//             } else {
//                 // For already uploaded photos
//                 setCurrentListing((prev) => {
//                     const newPhotos = prev.photos.filter((_, i) => i !== index);
//                     return { ...prev, photos: newPhotos };
//                 });

//                 setListingPhotos((prev) => {
//                     const newList = [...prev];
//                     newList.splice(index, 1);
//                     return newList;
//                 });
//             }
//         } catch (error) {
//             console.error("Failed to remove photo:", error);
//         }
//     };

//     const removeListingVideo = (index) => {
//         if (listingVideos[index]?.startsWith("blob:")) {
//             URL.revokeObjectURL(listingVideos[index]);
//         }

//         setCurrentListing((prev) => {
//             const newVideos = [...prev.videos];
//             newVideos.splice(index, 1);
//             return { ...prev, videos: newVideos };
//         });

//         setListingVideos((prev) => {
//             const newList = [...prev];
//             newList.splice(index, 1);
//             return newList;
//         });
//     };

//     const validateForm = () => {
//         const errors = {};

//         if (!currentListing.title?.trim()) {
//             errors.title = "Title is required";
//         }

//         if (!currentListing.price || parseFloat(currentListing.price) <= 0) {
//             errors.price = "Please enter a valid price";
//         }

//         if (!currentListing.description?.trim()) {
//             errors.description = "Description is required";
//         }

//         const totalPhotos = listingPhotos.length;
//         if (totalPhotos === 0) {
//             errors.photos = "At least one photo is required";
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleCreateListing = async () => {
//         if (!venue?.isActive) {
//             toast.error("Only verified venues can use the marketplace");
//             return;
//         }

//         if (!validateForm()) {
//             return;
//         }

//         if (marketplaceListings.length > 0 && !isEditingListing) {
//             toast.error(
//                 "You can only have one active listing. Please edit or delete your existing listing."
//             );
//             return;
//         }

//         try {
//             const listingData = {
//                 ...currentListing,
//                 price: parseFloat(currentListing.price),
//                 category: currentListing.category || "equipment",
//                 status: currentListing.status || "active",
//             };

//             const newListing = await createMarketplaceListing(listingData);

//             setMarketplaceListings([newListing]);

//             setCurrentListing({
//                 title: "",
//                 price: "",
//                 location: "",
//                 description: "",
//                 status: "active",
//                 photos: [],
//                 videos: [],
//                 category: "equipment",
//                 itemCondition: "excellent",
//                 contactPhone: "",
//                 contactEmail: "",
//             });
//             setListingPhotos([]);
//             setListingVideos([]);

//             toast.success("Listing created successfully!");
//             setActiveMarketSection("listings");
//         } catch (error) {
//             console.error("Failed to create listing:", error);
//         }
//     };

//     const handleUpdateListing = async () => {
//         if (!venue?.isActive) {
//             toast.error("Only verified venues can use the marketplace");
//             return;
//         }

//         if (!validateForm()) {
//             return;
//         }

//         try {
//             const listingData = {
//                 ...currentListing,
//                 price: parseFloat(currentListing.price),
//                 category: currentListing.category || "equipment",
//                 status: currentListing.status || "active",
//             };

//             const updatedListing = await updateMarketplaceListing(
//                 editingListingId,
//                 listingData
//             );

//             setMarketplaceListings([updatedListing]);

//             setIsEditingListing(false);
//             setEditingListingId(null);
//             setCurrentListing({
//                 title: "",
//                 price: "",
//                 location: "",
//                 description: "",
//                 status: "active",
//                 photos: [],
//                 videos: [],
//                 category: "equipment",
//                 itemCondition: "excellent",
//                 contactPhone: "",
//                 contactEmail: "",
//             });
//             setListingPhotos([]);
//             setListingVideos([]);

//             toast.success("Listing updated successfully!");
//             setActiveMarketSection("listings");
//         } catch (error) {
//             console.error("Failed to update listing:", error);
//         }
//     };

//     const handleEditListing = (listing) => {
//         setIsEditingListing(true);
//         setEditingListingId(listing._id);
//         setCurrentListing({
//             title: listing.title,
//             price: listing.price.toString(),
//             location: listing.location || "",
//             description: listing.description,
//             status: listing.status,
//             category: listing.category || "equipment",
//             itemCondition: listing.itemCondition || "excellent",
//             contactPhone: listing.contactPhone || "",
//             contactEmail: listing.contactEmail || "",
//             photos: listing.photos || [],
//             videos: listing.video ? [listing.video] : [],
//         });

//         setListingPhotos(listing.photos || []);
//         setListingVideos(listing.video ? [listing.video] : []);

//         setActiveMarketSection("create");
//     };

//     const handleDeleteListing = async (id) => {
//         if (!venue?.isActive) {
//             toast.error("Only verified venues can use the marketplace");
//             return;
//         }

//         try {
//             await deleteMarketplaceListing(id);
//             setMarketplaceListings([]);
//             toast.success("Listing deleted successfully!");
//             setActiveMarketSection("create");
//         } catch (error) {
//             console.error("Failed to delete listing:", error);
//         }
//     };

//     const handleCancelEdit = () => {
//         setIsEditingListing(false);
//         setEditingListingId(null);
//         setCurrentListing({
//             title: "",
//             price: "",
//             location: "",
//             description: "",
//             status: "active",
//             photos: [],
//             videos: [],
//             category: "equipment",
//             itemCondition: "excellent",
//             contactPhone: "",
//             contactEmail: "",
//         });
//         setListingPhotos([]);
//         setListingVideos([]);
//         setActiveMarketSection("listings");
//     };

//     const handlePhotoUpload = (e) => {
//         const files = Array.from(e.target.files);
//         const validTypes = ["image/jpeg", "image/png", "image/webp"];
//         const maxSize = 5 * 1024 * 1024;

//         const validFiles = files.filter((file) => {
//             if (!validTypes.includes(file.type)) {
//                 return false;
//             }
//             if (file.size > maxSize) {
//                 return false;
//             }
//             return true;
//         });

//         if (validFiles.length > 0) {
//             handleListingPhotoUpload(validFiles);
//         }
//     };

//     const handleVideoUpload = (e) => {
//         const files = Array.from(e.target.files);
//         const validTypes = ["video/mp4", "video/quicktime"];
//         const maxSize = 50 * 1024 * 1024;

//         const validFiles = files.filter((file) => {
//             if (!validTypes.includes(file.type)) {
//                 return false;
//             }
//             if (file.size > maxSize) {
//                 return false;
//             }
//             return true;
//         });

//         if (validFiles.length > 0) {
//             handleListingVideoUpload(validFiles);
//         }
//     };

//     const handleCreateOrUpdate = () => {
//         if (isEditingListing) {
//             handleUpdateListing();
//         } else {
//             handleCreateListing();
//         }
//     };

//     const handleStripeConnect = async () => {
//         try {
//             const token = getCookie("token");
//             const res = await fetch(
//                 `${API_BASE}/api/stripe/connect/onboard`,
//                 {
//                     method: "POST",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const data = await res.json();

//             if (data.success && data.url) {
//                 window.location.href = data.url;
//             } else {
//                 toast.error(data.message || "Stripe connection failed");
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error("Something went wrong");
//         }
//     };

//     if (loadingPage) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
//                     <p className="text-gray-400">Loading marketplace...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!venue?.isActive) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-16">
//                 <Toaster position="top-center" reverseOrder={false} />

//                 <div className="max-w-4xl mx-auto">
//                     <div className="flex items-center gap-4 mb-8">
//                         <Link
//                             href="/dashboard/venues"
//                             className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
//                         >
//                             <ArrowLeft size={20} />
//                         </Link>
//                         <div>
//                             <h1 className="text-3xl font-bold text-white">Venue Marketplace</h1>
//                             <p className="text-gray-400">Sell equipment and services to other venues</p>
//                         </div>
//                     </div>

//                     <div className="text-center py-12">
//                         <div className="bg-gray-900 rounded-2xl p-8 max-w-md mx-auto border border-gray-800">
//                             <Shield className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
//                             <h3 className="text-xl font-bold text-white mb-2">
//                                 Verification Required
//                             </h3>
//                             <p className="text-gray-400 mb-6 text-sm">
//                                 Only verified venues can list items on the marketplace. Please complete verification to continue.
//                             </p>
//                             <Link
//                                 href="/dashboard/venues/edit-profile"
//                                 className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition block text-center"
//                             >
//                                 Complete Verification
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const hasListing = marketplaceListings.length > 0;
//     const listing = hasListing ? marketplaceListings[0] : null;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-16">
//             <Toaster position="top-center" reverseOrder={false} />

//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <Link
//                             href="/dashboard/venues"
//                             className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
//                         >
//                             <ArrowLeft size={20} />
//                         </Link>
//                         <div>
//                             <h1 className="text-3xl font-bold text-white">Venue Marketplace</h1>
//                             <p className="text-gray-400">
//                                 {hasListing
//                                     ? "Sell your venue equipment and services to other venues"
//                                     : "List equipment, furniture, or venue services for sale"}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <span className="flex items-center gap-2 bg-green-500/20 text-green-500 px-4 py-2 rounded-full text-sm font-medium">
//                             <Shield className="w-4 h-4" />
//                             Verified Venue
//                         </span>
//                     </div>
//                 </div>

//                 {!venue.stripeAccountId && (
//                     <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-md">
//                         <h3 className="text-yellow-400 font-semibold text-lg mb-2">
//                             Before listing an item
//                         </h3>
//                         <ul className="space-y-2 text-sm text-gray-300">
//                             <li className="flex items-start gap-2">
//                                 <span className="text-yellow-400">1.</span>
//                                 Connect your <strong>Stripe account</strong> to receive payments
//                             </li>
//                             <li className="flex items-start gap-2">
//                                 <span className="text-yellow-400">2.</span>
//                                 Complete venue verification (business details & payout info)
//                             </li>
//                             <li className="flex items-start gap-2">
//                                 <span className="text-yellow-400">3.</span>
//                                 Add at least one photo and a valid price
//                             </li>
//                         </ul>
//                         <button
//                             onClick={handleStripeConnect}
//                             className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
//                         >
//                             Connect Stripe Account
//                         </button>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Stripe is required to securely send your earnings to you.
//                         </p>
//                     </div>
//                 )}

//                 {/* Navigation Tabs */}
//                 <div className="flex flex-wrap border-b border-gray-800 mb-6">
//                     <button
//                         className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${activeMarketSection === "create"
//                             ? "text-white border-b-2 border-yellow-500"
//                             : "text-gray-400 hover:text-white"
//                             }`}
//                         onClick={() => setActiveMarketSection("create")}
//                     >
//                         {isEditingListing
//                             ? <>
//                                 <Edit3 className="w-4 h-4 text-yellow-400" />
//                                 Edit Listing
//                             </>
//                             : hasListing
//                                 ? <>
//                                     <Edit3 className="w-4 h-4 text-yellow-400" />
//                                     Edit Listing
//                                 </>
//                                 : <>
//                                     <PlusCircle className="w-4 h-4 text-yellow-400" />
//                                     Create New Listing
//                                 </>}
//                     </button>

//                     <button
//                         className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all ${activeMarketSection === "listings"
//                             ? "text-white border-b-2 border-yellow-500"
//                             : "text-gray-400 hover:text-white"
//                             }`}
//                         onClick={() => setActiveMarketSection("listings")}
//                     >
//                         <List className="w-4 h-4 text-yellow-400" />
//                         My Listing {hasListing && `(1)`}
//                     </button>
//                 </div>

//                 {/* Create/Edit Listing Form */}
//                 {activeMarketSection === "create" && (
//                     <div className="space-y-6">
//                         {/* Basic Information Card */}
//                         <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
//                                     <Package className="w-5 h-5 text-yellow-500" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-white">Item Details</h3>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {/* Title */}
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                                         Title *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="title"
//                                         value={currentListing.title}
//                                         onChange={handleListingChange}
//                                         placeholder="e.g., Professional PA System, Stage Lighting Kit, Venue Chairs"
//                                         className={`w-full bg-gray-800 border ${formErrors.title ? "border-red-500" : "border-gray-700"
//                                             } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
//                                     />
//                                     {formErrors.title && (
//                                         <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
//                                             <AlertCircle className="w-4 h-4" />
//                                             {formErrors.title}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Price */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                                         Price (USD) *
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <DollarSign className="h-5 w-5 text-gray-500" />
//                                         </div>
//                                         <input
//                                             type="number"
//                                             name="price"
//                                             value={currentListing.price}
//                                             onChange={handleListingChange}
//                                             placeholder="0.00"
//                                             step="0.01"
//                                             min="0"
//                                             className={`w-full bg-gray-800 border ${formErrors.price ? "border-red-500" : "border-gray-700"
//                                                 } rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
//                                         />
//                                     </div>
//                                     {formErrors.price && (
//                                         <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
//                                             <AlertCircle className="w-4 h-4" />
//                                             {formErrors.price}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Location */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                                         <span className="flex items-center gap-2">
//                                             <MapPin className="w-4 h-4" />
//                                             Pickup Location *
//                                         </span>
//                                     </label>
//                                     <select
//                                         name="location"
//                                         value={currentListing.location || ""}
//                                         onChange={handleListingChange}
//                                         className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
//                                         required
//                                     >
//                                         <option value="">Select a location</option>
//                                         <option value="New Orleans">New Orleans</option>
//                                         <option value="Biloxi">Biloxi</option>
//                                         <option value="Mobile">Mobile</option>
//                                         <option value="Pensacola">Pensacola</option>
//                                     </select>
//                                     <p className="mt-2 text-sm text-gray-400">
//                                         Select where the item can be picked up
//                                     </p>
//                                 </div>

//                                 {/* Status */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                                         Listing Status
//                                     </label>
//                                     <select
//                                         name="status"
//                                         value={currentListing.status}
//                                         onChange={handleListingChange}
//                                         className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
//                                     >
//                                         <option value="active">Active</option>
//                                         <option value="draft">Draft</option>
//                                         <option value="sold">Sold</option>
//                                         <option value="reserved">Reserved</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Media Upload Section */}
//                         <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
//                                     <ImageIcon className="w-5 h-5 text-purple-500" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-white">Media Upload</h3>
//                             </div>

//                             {/* Photos Upload */}
//                             <div className="mb-8">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-300">
//                                             Photos (Max 5) *
//                                         </label>
//                                         <p className="text-sm text-gray-500 mt-1">
//                                             Clear photos from multiple angles increase sales
//                                         </p>
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-300">
//                                         {listingPhotos.length}/5 uploaded
//                                     </span>
//                                 </div>

//                                 {/* Photo Grid */}
//                                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
//                                     {listingPhotos.map((photo, index) => (
//                                         <div key={index} className="relative group">
//                                             <div className="aspect-square overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
//                                                 <img
//                                                     src={photo}
//                                                     alt={`Listing photo ${index + 1}`}
//                                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                                                 />
//                                             </div>
//                                             <button
//                                                 onClick={() => removeListingPhoto(index)}
//                                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
//                                             >
//                                                 <X className="w-4 h-4" />
//                                             </button>
//                                         </div>
//                                     ))}

//                                     {/* Upload Button */}
//                                     {listingPhotos.length < 5 && (
//                                         <label className="cursor-pointer">
//                                             <div className="aspect-square border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-gray-800/50 transition-all duration-300 group">
//                                                 <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500/20 transition">
//                                                     <Upload className="w-6 h-6 text-gray-400 group-hover:text-yellow-500 transition" />
//                                                 </div>
//                                                 <span className="text-sm text-gray-400 group-hover:text-yellow-500 transition">
//                                                     Click to upload
//                                                 </span>
//                                                 <span className="text-xs text-gray-500 mt-1">
//                                                     JPEG, PNG, WebP
//                                                 </span>
//                                             </div>
//                                             <input
//                                                 type="file"
//                                                 accept="image/jpeg,image/png,image/webp"
//                                                 multiple
//                                                 onChange={handlePhotoUpload}
//                                                 className="hidden"
//                                             />
//                                         </label>
//                                     )}
//                                 </div>

//                                 {formErrors.photos && (
//                                     <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
//                                         <AlertCircle className="w-4 h-4" />
//                                         {formErrors.photos}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Videos Upload */}
//                             <div>
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-300">
//                                             Video (Optional)
//                                         </label>
//                                         <p className="text-sm text-gray-500 mt-1">
//                                             Show equipment in action
//                                         </p>
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-300">
//                                         {listingVideos.length}/1 uploaded
//                                     </span>
//                                 </div>

//                                 {/* Video Upload Area */}
//                                 {listingVideos.length === 0 ? (
//                                     <label className="cursor-pointer block">
//                                         <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-500 hover:bg-gray-800/50 transition-all duration-300 group max-w-md">
//                                             <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500/20 transition">
//                                                 <Video className="w-7 h-7 text-gray-400 group-hover:text-yellow-500 transition" />
//                                             </div>
//                                             <p className="text-gray-400 group-hover:text-yellow-500 transition text-sm">
//                                                 Click to upload video
//                                             </p>
//                                             <p className="text-xs text-gray-500 mt-1">
//                                                 MP4, MOV • Max 50MB • &lt; 2 min
//                                             </p>
//                                         </div>
//                                         <input
//                                             type="file"
//                                             accept="video/mp4,video/quicktime"
//                                             onChange={handleVideoUpload}
//                                             className="hidden"
//                                         />
//                                     </label>
//                                 ) : (
//                                     <div className="relative max-w-md">
//                                         <div className="rounded-xl overflow-hidden border border-gray-700 bg-black">
//                                             <video
//                                                 src={
//                                                     listingVideos[0] instanceof File
//                                                         ? URL.createObjectURL(listingVideos[0])
//                                                         : listingVideos[0]
//                                                 }
//                                                 controls
//                                                 preload="metadata"
//                                                 className="w-full h-auto max-h-[280px] object-contain"
//                                             />
//                                         </div>
//                                         <button
//                                             onClick={() => removeListingVideo(0)}
//                                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
//                                         >
//                                             <X className="w-4 h-4" />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex justify-between items-center pt-6 border-t border-gray-800">
//                             <div>
//                                 {isEditingListing && (
//                                     <button
//                                         onClick={handleCancelEdit}
//                                         className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition"
//                                     >
//                                         Cancel Edit
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="flex gap-4">
//                                 {hasListing && !isEditingListing && (
//                                     <button
//                                         onClick={() => handleDeleteListing(listing._id)}
//                                         className="px-6 py-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 transition flex items-center gap-2"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                         Delete Listing
//                                     </button>
//                                 )}

//                                 <button
//                                     onClick={handleCreateOrUpdate}
//                                     className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/20"
//                                 >
//                                     {isEditingListing ? (
//                                         <span className="flex items-center gap-2">
//                                             <CheckCircle className="w-5 h-5" />
//                                             Update Listing
//                                         </span>
//                                     ) : (
//                                         <span className="flex items-center gap-2">
//                                             <Upload className="w-5 h-5" />
//                                             Publish Listing
//                                         </span>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* My Listing View */}
//                 {activeMarketSection === "listings" && listing && (
//                     <div className="space-y-6">
//                         {marketplaceLoading ? (
//                             <div className="text-center py-12">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
//                                 <p className="text-gray-400 mt-4">Loading your listing...</p>
//                             </div>
//                         ) : (
//                             <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
//                                 {/* Status Banner */}
//                                 <div
//                                     className={`px-6 py-3 ${listing.status === "active"
//                                         ? "bg-green-500/20"
//                                         : listing.status === "sold"
//                                             ? "bg-red-500/20"
//                                             : listing.status === "reserved"
//                                                 ? "bg-orange-500/20"
//                                                 : "bg-yellow-500/20"
//                                         }`}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center gap-2">
//                                             <span
//                                                 className={`w-2 h-2 rounded-full ${listing.status === "active"
//                                                     ? "bg-green-500"
//                                                     : listing.status === "sold"
//                                                         ? "bg-red-500"
//                                                         : listing.status === "reserved"
//                                                             ? "bg-orange-500"
//                                                             : "bg-yellow-500"
//                                                     }`}
//                                             ></span>
//                                             <span
//                                                 className={`text-sm font-medium ${listing.status === "active"
//                                                     ? "text-green-500"
//                                                     : listing.status === "sold"
//                                                         ? "text-red-500"
//                                                         : listing.status === "reserved"
//                                                             ? "text-orange-500"
//                                                             : "text-yellow-500"
//                                                     }`}
//                                             >
//                                                 {listing.status.charAt(0).toUpperCase() +
//                                                     listing.status.slice(1)}
//                                             </span>
//                                         </div>
//                                         <span className="text-sm text-gray-400">
//                                             Listed on {new Date(listing.createdAt).toLocaleDateString()}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="p-6">
//                                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                                         {/* Left Column - Photos */}
//                                         <div className="lg:col-span-2 space-y-8">
//                                             {/* Title & Meta */}
//                                             <div>
//                                                 <div className="flex items-start justify-between mb-4">
//                                                     <h2 className="text-3xl font-bold text-white pr-4">
//                                                         {listing.title}
//                                                     </h2>
//                                                     <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
//                                                         ${listing.price}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             {/* Main Image Gallery */}
//                                             <div className="space-y-4">
//                                                 <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 shadow-xl">
//                                                     <Image
//                                                         src={listing.photos[selectedImageIndex]}
//                                                         alt={listing.title}
//                                                         fill
//                                                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                                                     />
//                                                     <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
//                                                         <span className="text-sm text-white font-medium">
//                                                             {selectedImageIndex + 1} / {listing.photos?.length || 1}
//                                                         </span>
//                                                     </div>
//                                                 </div>

//                                                 {/* Thumbnail Strip */}
//                                                 {listing.photos && listing.photos.length > 1 && (
//                                                     <div className="flex gap-3 overflow-x-auto pb-2">
//                                                         {listing.photos.map((photo, index) => (
//                                                             <button
//                                                                 key={index}
//                                                                 onClick={() => setSelectedImageIndex(index)}
//                                                                 className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300
//                                     ${selectedImageIndex === index
//                                                                         ? "border-yellow-500"
//                                                                         : "border-gray-800 hover:border-yellow-500"
//                                                                     }`}
//                                                             >
//                                                                 <Image
//                                                                     width="400"
//                                                                     height="400"
//                                                                     src={photo}
//                                                                     alt={`${listing.title} ${index + 1}`}
//                                                                     className="w-full h-full object-cover"
//                                                                 />
//                                                             </button>
//                                                         ))}
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Description */}
//                                             <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
//                                                 <div className="flex items-center gap-3 mb-6">
//                                                     <FileText className="w-6 h-6 text-yellow-500" />
//                                                     <h3 className="text-xl font-bold text-white">
//                                                         Description
//                                                     </h3>
//                                                 </div>
//                                                 <div className="prose prose-invert max-w-none">
//                                                     <p className="text-gray-300 leading-relaxed whitespace-pre-line">
//                                                         {listing.description}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Right Column - Details & Actions */}
//                                         <div className="lg:col-span-1">
//                                             <div className="sticky top-6">
//                                                 <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//                                                     <div className="mb-6">
//                                                         <div className="flex items-baseline gap-2">
//                                                             <span className="text-3xl font-bold text-white">
//                                                                 ${listing.price}
//                                                             </span>
//                                                             <span className="text-gray-400">USD</span>
//                                                         </div>
//                                                         <p className="text-gray-400 text-sm mt-1">
//                                                             Fixed price
//                                                         </p>
//                                                     </div>

//                                                     <div className="flex gap-4">
//                                                         <button
//                                                             onClick={() => {
//                                                                 handleEditListing(listing);
//                                                                 setActiveMarketSection("create");
//                                                             }}
//                                                             className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
//                                                         >
//                                                             <Edit2 className="w-5 h-5" />
//                                                             Edit Listing
//                                                         </button>

//                                                         <button
//                                                             onClick={() => handleDeleteListing(listing._id)}
//                                                             className="w-full bg-red-500/20 text-red-500 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition flex items-center justify-center gap-2"
//                                                         >
//                                                             <Trash2 className="w-5 h-5" />
//                                                             Delete Listing
//                                                         </button>
//                                                     </div>

//                                                     {/* Venue Info */}
//                                                     <div className="mt-8 pt-6 border-t border-gray-700">
//                                                         <h4 className="text-sm font-semibold text-gray-300 mb-4">
//                                                             Seller Info
//                                                         </h4>
//                                                         <div className="flex items-center gap-3 mb-4">
//                                                             <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
//                                                                 <Building2 className="w-5 h-5 text-yellow-500" />
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-white font-medium">
//                                                                     {venue.name}
//                                                                 </p>
//                                                                 <p className="text-gray-400 text-sm">
//                                                                     {venue.city} • Verified Venue
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {/* Stats */}
//                                                     <div className="mt-6 pt-6 border-t border-gray-700">
//                                                         <h4 className="text-sm font-semibold text-gray-300 mb-4">
//                                                             Listing Stats
//                                                         </h4>
//                                                         <div className="grid grid-cols-2 gap-4">
//                                                             <div>
//                                                                 <p className="text-gray-400 text-sm">Photos</p>
//                                                                 <p className="text-lg font-bold text-white">
//                                                                     {listing.photos?.length || 0}/5
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-gray-400 text-sm">Status</p>
//                                                                 <p className="text-lg font-bold text-white capitalize">
//                                                                     {listing.status}
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-gray-400 text-sm">Condition</p>
//                                                                 <p className="text-lg font-bold text-white capitalize">
//                                                                     {listing.itemCondition?.replace("-", " ")}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {listing.video && (
//                                                         <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
//                                                             <h4 className="text-sm font-semibold text-gray-300 mb-3">
//                                                                 Listing Video
//                                                             </h4>
//                                                             <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700">
//                                                                 <video
//                                                                     src={listing.video}
//                                                                     controls
//                                                                     preload="metadata"
//                                                                     className="w-full h-full object-cover"
//                                                                 >
//                                                                     Your browser does not support the video tag.
//                                                                 </video>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="mt-8 flex flex-wrap gap-4">
//                     <Link
//                         href="/dashboard/venues"
//                         className="flex-1 min-w-[200px] bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl border border-gray-700 text-center transition"
//                     >
//                         Back to Dashboard
//                     </Link>
//                     <Link
//                         href="/dashboard/venues/edit-profile"
//                         className="flex-1 min-w-[200px] bg-gray-900 hover:bg-gray-800 text-gray-300 px-6 py-3 rounded-xl border border-gray-700 text-center transition"
//                     >
//                         Edit Profile
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }

// app/dashboard/venues/marketplace/page.js
"use client";

import CreateListingForm from "@/components/modules/venues/marketplace/CreateListingForm";
import ListingDetailView from "@/components/modules/venues/marketplace/ListingDetailView";
import MarketplaceActionButtons from "@/components/modules/venues/marketplace/MarketplaceActionButtons";
import MarketplaceHeader from "@/components/modules/venues/marketplace/MarketplaceHeader";
import MarketplaceTabs from "@/components/modules/venues/marketplace/MarketplaceTabs";
import StripeConnectAlert from "@/components/modules/venues/marketplace/StripeConnectAlert";
import VerificationAlert from "@/components/modules/venues/marketplace/VerificationAlert";
// import CreateListingForm from "@/components/marketplace/CreateListingForm";
// import ListingDetailView from "@/components/marketplace/ListingDetailView";
// import MarketplaceActionButtons from "@/components/marketplace/MarketplaceActionButtons";
// import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
// import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
// import StripeConnectAlert from "@/components/marketplace/StripeConnectAlert";
// import VerificationAlert from "@/components/marketplace/VerificationAlert";
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
  const [listingPhotos, setListingPhotos] = useState([]);
  const [listingVideos, setListingVideos] = useState([]);
  const [isEditingListing, setIsEditingListing] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [activeMarketSection, setActiveMarketSection] = useState("create");
  const [formErrors, setFormErrors] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);

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
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("price", listingData.price);
      formData.append("category", listingData.category);
      formData.append("status", listingData.status);
      formData.append("itemCondition", listingData.itemCondition);

      if (listingData.location) {
        formData.append("location", listingData.location);
      }
      if (listingData.contactPhone) {
        formData.append("contactPhone", listingData.contactPhone);
      }
      if (listingData.contactEmail) {
        formData.append("contactEmail", listingData.contactEmail);
      }

      if (listingData.photos && listingData.photos.length > 0) {
        listingData.photos.forEach((file) => {
          if (file instanceof File) {
            formData.append("photos", file);
          }
        });
      }

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
    }
  };

  const updateMarketplaceListing = async (id, listingData) => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("price", listingData.price);
      formData.append("category", listingData.category);
      formData.append("status", listingData.status);
      formData.append("itemCondition", listingData.itemCondition);

      if (listingData.location) {
        formData.append("location", listingData.location);
      }
      if (listingData.contactPhone) {
        formData.append("contactPhone", listingData.contactPhone);
      }
      if (listingData.contactEmail) {
        formData.append("contactEmail", listingData.contactEmail);
      }

      if (listingData.photos && listingData.photos.length > 0) {
        const newPhotos = listingData.photos.filter(
          (file) => file instanceof File,
        );
        newPhotos.forEach((file) => {
          formData.append("photos", file);
        });
      }

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

    const availableSlots =
      5 -
      (listingPhotos.length +
        (currentListing.photos?.filter((p) => !(p instanceof File))?.length ||
          0));
    const limitedFiles = files.slice(0, Math.max(0, availableSlots));

    if (limitedFiles.length === 0) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setListingPhotos((prev) => [...prev, ...urls]);
    setCurrentListing((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...limitedFiles],
    }));
  };

  const handleVideoUpload = (files) => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    const availableSlots =
      1 - (listingVideos.length + (currentListing.video ? 1 : 0));
    const limitedFiles = files.slice(0, Math.max(0, availableSlots));

    if (limitedFiles.length === 0) {
      toast.error("Maximum 1 video allowed");
      return;
    }

    const urls = limitedFiles.map((file) => URL.createObjectURL(file));
    setListingVideos((prev) => [...prev, ...urls]);
    setCurrentListing((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), ...limitedFiles],
    }));
  };

  const removeListingPhoto = (index) => {
    const photoToRemove = listingPhotos[index];

    if (photoToRemove?.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove);
    }

    setCurrentListing((prev) => {
      const newPhotos = prev.photos.filter((_, i) => i !== index);
      return { ...prev, photos: newPhotos };
    });

    setListingPhotos((prev) => {
      const newList = [...prev];
      newList.splice(index, 1);
      return newList;
    });
  };

  const removeListingVideo = (index) => {
    if (listingVideos[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(listingVideos[index]);
    }

    setCurrentListing((prev) => {
      const newVideos = [...prev.videos];
      newVideos.splice(index, 1);
      return { ...prev, videos: newVideos };
    });

    setListingVideos((prev) => {
      const newList = [...prev];
      newList.splice(index, 1);
      return newList;
    });
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

    const totalPhotos = listingPhotos.length;
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

    if (!validateForm()) {
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
      };

      const newListing = await createMarketplaceListing(listingData);
      setMarketplaceListings([newListing]);

      resetForm();
      toast.success("Listing created successfully!");
      setActiveMarketSection("listings");
    } catch (error) {
      console.error("Failed to create listing:", error);
    }
  };

  const handleUpdateListing = async () => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const listingData = {
        ...currentListing,
        price: parseFloat(currentListing.price),
        category: currentListing.category || "equipment",
        status: currentListing.status || "active",
      };

      const updatedListing = await updateMarketplaceListing(
        editingListingId,
        listingData,
      );
      setMarketplaceListings([updatedListing]);

      setIsEditingListing(false);
      setEditingListingId(null);
      resetForm();
      toast.success("Listing updated successfully!");
      setActiveMarketSection("listings");
    } catch (error) {
      console.error("Failed to update listing:", error);
    }
  };

  const handleEditListing = (listing) => {
    setIsEditingListing(true);
    setEditingListingId(listing._id);
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
      photos: listing.photos || [],
      videos: listing.video ? [listing.video] : [],
    });

    setListingPhotos(listing.photos || []);
    setListingVideos(listing.video ? [listing.video] : []);
    setActiveMarketSection("create");
  };

  const handleDeleteListing = async (id) => {
    if (!venue?.isActive) {
      toast.error("Only verified venues can use the marketplace");
      return;
    }

    try {
      await deleteMarketplaceListing(id);
      setMarketplaceListings([]);
      toast.success("Listing deleted successfully!");
      setActiveMarketSection("create");
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingListing(false);
    setEditingListingId(null);
    resetForm();
    setActiveMarketSection("listings");
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
    setListingPhotos([]);
    setListingVideos([]);
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
            listingPhotos={listingPhotos}
            listingVideos={listingVideos}
            formErrors={formErrors}
            isEditingListing={isEditingListing}
            hasListing={hasListing}
            listing={listing}
            onListingChange={handleListingChange}
            onPhotoUpload={handlePhotoUpload}
            onVideoUpload={handleVideoUpload}
            onRemovePhoto={removeListingPhoto}
            onRemoveVideo={removeListingVideo}
            onCancelEdit={handleCancelEdit}
            onDeleteListing={handleDeleteListing}
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
