"use client";
import { Eye, Loader2, Mail, MapPin, Minus, Phone, Plus, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function MerchCard({ limit = null }) {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    note: ""
  });

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

        // Filter out inactive products
        items = items.filter(item => item.isActive !== false);

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

  // Check if user is logged in
  const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      return !!token;
    }
    return false;
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleOrderClick = (item) => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      setSelectedItem(item);
      setShowLoginModal(true);
      return;
    }

    // If logged in, proceed with order
    setSelectedItem(item);
    setOrderQuantity(1);
    setSelectedPaymentMethod(null);
    setShowShippingForm(false);
    setShippingInfo({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      note: ""
    });
    setShowOrderModal(true);
  };

  const handleLoginAndProceed = () => {
    setShowLoginModal(false);
    router.push("/signin");
  };

  const handlePaymentMethodSelect = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    // Show shipping form only for COD
    if (paymentMethod === "cod") {
      setShowShippingForm(true);
    } else {
      setShowShippingForm(false);
    }
  };

  // Quantity handlers
  const incrementQuantity = () => {
    if (selectedItem && orderQuantity < selectedItem.stock) {
      setOrderQuantity(orderQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (orderQuantity > 1) {
      setOrderQuantity(orderQuantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      setOrderQuantity('');
      return;
    }

    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= 1) {
      if (selectedItem && numValue <= selectedItem.stock) {
        setOrderQuantity(numValue);
      } else if (selectedItem && numValue > selectedItem.stock) {
        setOrderQuantity(selectedItem.stock);
      } else {
        setOrderQuantity(numValue);
      }
    }
  };

  const handleQuantityBlur = (e) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) < 1) {
      setOrderQuantity(1);
    }
  };

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isShippingFormValid = () => {
    return (
      shippingInfo.name.trim() &&
      shippingInfo.email.trim() &&
      shippingInfo.phone.trim() &&
      shippingInfo.address.trim() &&
      shippingInfo.city.trim() &&
      shippingInfo.postalCode.trim()
    );
  };

  const handleCreateOrder = async () => {
    if (!selectedItem || !selectedPaymentMethod) return;

    // Double check if user is logged in
    if (!isLoggedIn()) {
      toast.error("Your session has expired. Please login again.");
      router.push("/signin");
      return;
    }

    // Validate shipping info for COD
    if (selectedPaymentMethod === "cod" && !isShippingFormValid()) {
      toast.error("Please fill all required shipping information");
      return;
    }

    const finalQuantity = Math.max(1, Math.min(orderQuantity, selectedItem.stock));

    setOrderLoading(true);
    try {
      const token = localStorage.getItem("token");

      const orderData = {
        merchId: selectedItem._id,
        quantity: finalQuantity,
        paymentMethod: selectedPaymentMethod,
      };

      // Add shipping info for COD orders
      if (selectedPaymentMethod === "cod") {
        orderData.shippingInfo = {
          ...shippingInfo,
          country: "Bangladesh"
        };
      }

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (selectedPaymentMethod === "stripe" && data.data.stripeSession) {
          window.location.href = data.data.stripeSession.url;
        } else {
          toast.success("Order placed successfully! For COD, you'll pay when delivered.");
          setShowOrderModal(false);
          fetchMerch();
        }
      } else {
        // If token is invalid, redirect to login
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
        <div className="container mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading merchandise...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-16 bg-white relative">
      <Toaster />
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Merchandise</h2>
        <p className="text-gray-600 mb-8">Exclusive Gulf Coast Music Collection</p>

        {merchItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No merchandise available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}>
                      {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
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
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">
                      {selectedItem.description || "No description available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">${selectedItem.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className={`text-lg font-semibold ${selectedItem.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {selectedItem.stock > 0 ? `${selectedItem.stock} available` : 'Out of stock'}
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
                    {selectedItem.stock > 0 ? 'Purchase Now' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          ></div>

          <div className="relative bg-white max-w-sm w-full rounded-2xl shadow-xl p-6 animate-fadeInScale z-10">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600">
                Please login first to purchase merchandise.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLoginAndProceed}
                className="w-full bg-[var(--primary)] text-gray-700 py-3 rounded-lg font-semibold hover:bg-[var(--primary)]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Login
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-600 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOrderModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 animate-fadeInScale">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase {selectedItem.name}</h2>

              <div className="space-y-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div>
                    <p className="text-gray-500 font-semibold">{selectedItem.name}</p>
                    <p className="text-[var(--primary)] font-bold">${selectedItem.price}</p>
                    <p className="text-sm text-gray-500">
                      Available: {selectedItem.stock} units
                    </p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={decrementQuantity}
                      disabled={orderQuantity <= 1}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        value={orderQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                        min="1"
                        max={selectedItem.stock}
                        className="w-20 text-center border-0 bg-transparent text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Max: {selectedItem.stock} units
                      </div>
                    </div>

                    <button
                      onClick={incrementQuantity}
                      disabled={orderQuantity >= selectedItem.stock}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-blue-900 text-lg">
                        Total: ${((selectedItem.price * (orderQuantity || 1)).toFixed(2))}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        {(orderQuantity || 1)} × ${selectedItem.price} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {(orderQuantity || 1)} item{(orderQuantity || 1) > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePaymentMethodSelect("stripe")}
                      className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${selectedPaymentMethod === "stripe"
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md"
                        }`}
                    >
                      <div className="font-semibold">💳 Stripe</div>
                      <div className="text-xs mt-1">Pay online</div>
                    </button>

                    <button
                      onClick={() => handlePaymentMethodSelect("cod")}
                      className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${selectedPaymentMethod === "cod"
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                        : "border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:shadow-md"
                        }`}
                    >
                      <div className="font-semibold">💰 COD</div>
                      <div className="text-xs mt-1">Pay on delivery</div>
                    </button>
                  </div>
                </div>

                {/* Shipping Information Form (for COD) */}
                {showShippingForm && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Shipping Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={shippingInfo.name}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="text-gray-500 w-4 h-4 inline mr-1" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Note (Optional)
                        </label>
                        <input
                          type="text"
                          name="note"
                          value={shippingInfo.note}
                          onChange={handleShippingInfoChange}
                          className="text-gray-500 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Any special instructions..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Single Confirm Button */}
              <button
                onClick={handleCreateOrder}
                disabled={
                  !selectedPaymentMethod ||
                  orderLoading ||
                  !orderQuantity ||
                  (selectedPaymentMethod === "cod" && !isShippingFormValid())
                }
                className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:from-[var(--primary)]/90 hover:to-[var(--primary)]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
              >
                {orderLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {selectedPaymentMethod === "stripe" && `Pay $${((selectedItem.price * (orderQuantity || 1)).toFixed(2))} with Stripe`}
                    {selectedPaymentMethod === "cod" && `Confirm COD Order - $${((selectedItem.price * (orderQuantity || 1)).toFixed(2))}`}
                    {!selectedPaymentMethod && "Select Payment Method"}
                  </>
                )}
              </button>

              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full mt-3 text-gray-600 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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