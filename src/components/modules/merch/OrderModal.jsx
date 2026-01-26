"use client";
import {
    Loader2,
    Mail,
    MapPin,
    Minus,
    Phone,
    Plus,
    ShoppingCart,
    User
} from "lucide-react";
import { useState } from "react";

const OrderModal = ({
    isOpen,
    onClose,
    selectedItem,
    onOrderConfirm,
    orderLoading = false
}) => {
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [showShippingForm, setShowShippingForm] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        note: ""
    });

    if (!isOpen || !selectedItem) return null;

    // Quantity handlers
    const incrementQuantity = () => {
        if (orderQuantity < selectedItem.stock) {
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
            if (numValue <= selectedItem.stock) {
                setOrderQuantity(numValue);
            } else {
                setOrderQuantity(selectedItem.stock);
            }
        }
    };

    const handleQuantityBlur = (e) => {
        const value = e.target.value;
        if (value === '' || parseInt(value) < 1) {
            setOrderQuantity(1);
        }
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

    const handleCreateOrder = () => {
        const finalQuantity = Math.max(1, Math.min(orderQuantity, selectedItem.stock));

        onOrderConfirm({
            quantity: finalQuantity,
            paymentMethod: selectedPaymentMethod,
            shippingInfo: selectedPaymentMethod === "cod" ? {
                ...shippingInfo,
                country: "Bangladesh"
            } : undefined
        });
    };

    const totalPrice = (selectedItem.price * (orderQuantity || 1)).toFixed(2);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
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
                                        Total: ${totalPrice}
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
                            <div className="grid grid-cols-1 gap-3">
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

                                {/* <button
                                    onClick={() => handlePaymentMethodSelect("cod")}
                                    className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${selectedPaymentMethod === "cod"
                                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:shadow-md"
                                        }`}
                                >
                                    <div className="font-semibold">💰 COD</div>
                                    <div className="text-xs mt-1">Pay on delivery</div>
                                </button> */}
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
                                {selectedPaymentMethod === "stripe" && `Pay $${totalPrice} with Stripe`}
                                {selectedPaymentMethod === "cod" && `Confirm COD Order - $${totalPrice}`}
                                {!selectedPaymentMethod && "Select Payment Method"}
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full mt-3 text-gray-600 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>

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
        </div>
    );
};

export default OrderModal;