"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoginRequiredModal from "./LoginRequiredModal";
import OrderModal from "./OrderModal";

export default function RecentMerchSection() {
    const [merchItems, setMerchItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);

    const router = useRouter();
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/merch`);
                const data = await res.json();
                if (res.ok && data.success) {
                    const allItems = Array.isArray(data.data) ? data.data : [];
                    // Get only the most recent 4 items
                    const recentItems = allItems.slice(0, 4);
                    setMerchItems(recentItems);
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

        fetchMerch();
    }, [API_BASE]);

    // Check if user is logged in
    const isLoggedIn = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            return !!token;
        }
        return false;
    };

    const handleBuyNowClick = (item, e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop event bubbling

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

        if (!isLoggedIn()) {
            toast.error("Your session has expired. Please login again.");
            router.push("/signin");
            return;
        }

        setOrderLoading(true);
        try {
            const token = localStorage.getItem("token");

            const finalOrderData = {
                merchId: selectedItem._id,
                quantity: orderData.quantity,
                paymentMethod: orderData.paymentMethod,
                shippingInfo: orderData.shippingInfo
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
                    toast.success("Order placed successfully! For COD, you'll pay when delivered.");
                    setShowOrderModal(false);
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
                <div className="container mx-auto text-center text-gray-600">
                    Loading merchandise...
                </div>
            </section>
        );
    }

    if (merchItems.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-6 md:px-16 bg-white relative">
            <Toaster />
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Latest Merch</h2>
                    <Link
                        href="/merch"
                        className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium transition-colors"
                    >
                        View All →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {merchItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                            <div className="w-full h-64 flex items-center justify-center bg-white">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-contain h-full"
                                />
                            </div>

                            <div className="bg-[#F9FAFB] p-4">
                                <h3 className="text-base font-medium text-gray-900">
                                    {item.name}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">${item.price}</p>
                                <button
                                    onClick={(e) => handleBuyNowClick(item, e)}
                                    className="block bg-[var(--primary)] w-full text-gray-700 mt-5 px-4 py-2 rounded font-bold hover:bg-[var(--primary)]/90 transition text-lg text-center"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Under Construction Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center z-10 animate-fadeInScale">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            🚧 Under Construction
                        </h2>
                        <p className="text-gray-600 mb-6">
                            This feature is currently being developed. Please check back soon
                            to explore our exclusive Gulf Coast Music merchandise collection.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-6 py-2 bg-[var(--primary)] text-gray-700 rounded-md font-semibold hover:bg-[var(--primary)]/90 transition"
                        >
                            Close
                        </button>
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

            {/* Animation */}
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