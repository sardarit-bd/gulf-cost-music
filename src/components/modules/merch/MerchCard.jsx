"use client";
import { Eye, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoginRequiredModal from "./LoginRequiredModal";
import OrderModal from "./OrderModal";

export default function MerchCard({ limit = null }) {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchMerch();
  }, [API_BASE, limit]);

  const fetchMerch = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/merch`);
      const data = await res.json();

      if (res.ok && data.success) {
        let items = Array.isArray(data.data) ? data.data : [];
        items = items.filter((item) => item.isActive !== false);
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (limit) {
          items = items.slice(0, limit);
        }

        setMerchItems(items);
      } else {
        console.error("Error loading merch:", data.message);
        setMerchItems([]);
      }
    } catch (error) {
      console.error("Error fetching merch:", error);
      setMerchItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Get token from cookies
  const getTokenFromCookies = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  const isLoggedIn = () => {
    return !!getTokenFromCookies();
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleOrderClick = (item) => {
    if (!isLoggedIn()) {
      setSelectedItem(item);
      setShowLoginModal(true);
      return;
    }

    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const handleLoginAndProceed = () => {
    setShowLoginModal(false);
    router.push("/signin");
  };

  const handleCreateOrder = async (orderData) => {
    if (!selectedItem || !orderData.paymentMethod) return;

    const token = getTokenFromCookies();
    if (!token) {
      toast.error("Your session has expired. Please login again.");
      router.push("/signin");
      return;
    }

    setOrderLoading(true);
    try {
      const finalOrderData = {
        merchId: selectedItem._id,
        quantity: orderData.quantity,
        paymentMethod: orderData.paymentMethod,
        shippingInfo: orderData.shippingInfo,
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalOrderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (orderData.paymentMethod === "stripe" && data.data.stripeSession) {
          window.location.href = data.data.stripeSession.url;
        } else {
          toast.success(
            "Order placed successfully! For COD, you'll pay when delivered."
          );
          setShowOrderModal(false);
          fetchMerch();
        }
      } else {
        if (response.status === 401) {
          toast("Your session has expired. Please login again.");
          router.push("/signin");
        } else {
          toast.error(data.message || "Failed to create order");
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="container mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(limit || 4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="w-full h-80 bg-gray-200"></div>

                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div className="h-6 bg-gray-200 rounded"></div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex justify-between items-center">
                    <div className="h-7 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Loading Indicator */}
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              <p className="text-gray-600 font-medium">
                Loading merchandise...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-16 bg-white relative">
      <Toaster />
      <div className="container mx-auto h-screen">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Merchandise</h2>
        <p className="text-gray-600 mb-8">
          Exclusive Gulf Coast Music Collection
        </p>

        {merchItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No merchandise available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {merchItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="w-full h-80 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain h-full w-full rounded-lg"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description || "No description available"}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[var(--primary)]">
                      ${item.price}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.stock > 0
                        ? `${item.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>

                    <button
                      onClick={() => handleOrderClick(item)}
                      disabled={item.stock <= 0}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] text-gray-700 rounded-lg hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 animate-fadeInScale">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedItem.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="object-contain max-h-80 w-full rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">
                      {selectedItem.description || "No description available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        ${selectedItem.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p
                        className={`text-lg font-semibold ${selectedItem.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                          }`}
                      >
                        {selectedItem.stock > 0
                          ? `${selectedItem.stock} available`
                          : "Out of stock"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleOrderClick(selectedItem);
                    }}
                    disabled={selectedItem.stock <= 0}
                    className="w-full bg-[var(--primary)] text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedItem.stock > 0 ? "Purchase Now" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginAndProceed}
      />

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        selectedItem={selectedItem}
        onOrderConfirm={handleCreateOrder}
        orderLoading={orderLoading}
      />

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.25s ease-out;
        }
      `}</style>
    </section>
  );
}
