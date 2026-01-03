import {
    CheckCircle,
    CreditCard,
    Crown,
    DollarSign,
    Image,
    Mail,
    Shield,
    Users,
    Video,
    X,
    Zap
} from "lucide-react";
import { useState } from "react";
import ConfirmPlanChangeModal from "./ConfirmPlanChangeModal";

export default function PlanChangeModal({
    photographer,
    isOpen,
    onClose,
    onPlanChange
}) {
    const [selectedPlan, setSelectedPlan] = useState(photographer?.user?.subscriptionPlan || "free");
    const [sendNotification, setSendNotification] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // ✅ Add this check to prevent rendering when not open
    if (!isOpen || !photographer) return null;

    const currentPlan = photographer?.user?.subscriptionPlan || "free";
    const isCurrentPlan = selectedPlan === currentPlan;

    const plans = {
        pro: {
            name: "Pro Plan",
            icon: Crown,
            color: "bg-gradient-to-r from-yellow-50 to-amber-50",
            borderColor: "border-yellow-200",
            textColor: "text-yellow-800",
            iconColor: "text-yellow-600",
            price: "$29.99/month",
            features: [
                { icon: <Image size={14} />, text: "Unlimited photo uploads" },
                { icon: <Video size={14} />, text: "Unlimited video uploads" },
                { icon: <DollarSign size={14} />, text: "Add unlimited services" },
                { icon: <Zap size={14} />, text: "Priority listing in search" },
                { icon: <Shield size={14} />, text: "Advanced analytics" },
                { icon: <Mail size={14} />, text: "Email support" }
            ]
        },
        free: {
            name: "Free Plan",
            icon: Users,
            color: "bg-gradient-to-r from-gray-50 to-slate-50",
            borderColor: "border-gray-200",
            textColor: "text-gray-800",
            iconColor: "text-gray-600",
            price: "Free",
            features: [
                { icon: <Image size={14} />, text: "Up to 10 photos" },
                { icon: <Video size={14} />, text: "Up to 3 videos" },
                { icon: <DollarSign size={14} />, text: "Up to 5 services" },
                { icon: <Zap size={14} />, text: "Basic listing" },
                { icon: <Shield size={14} />, text: "Standard support" }
            ]
        }
    };

    const handleNext = () => {
        if (isCurrentPlan) {
            alert(`Photographer is already on ${selectedPlan} plan`);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        try {
            await onPlanChange(photographer._id, selectedPlan, sendNotification);
            onClose();
        } catch (error) {
            // Error is handled in parent component
        }
    };

    return (
        <>
            {/* ✅ This modal will now be rendered OUTSIDE the table */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <CreditCard size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Change Subscription Plan</h2>
                                        <p className="text-gray-600">Update photographer's subscription plan</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Current Photographer Info */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {photographer.name?.charAt(0).toUpperCase() || 'P'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{photographer.name}</h3>
                                    <p className="text-gray-600 text-sm">{photographer.user?.email}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentPlan === 'pro' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                    Current: {currentPlan.toUpperCase()}
                                </div>
                            </div>

                            {/* Plan Selection */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Select New Plan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Pro Plan Card */}
                                    <div
                                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${selectedPlan === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} ${plans.pro.color}`}
                                        onClick={() => setSelectedPlan('pro')}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-yellow-100 rounded-lg">
                                                    <Crown size={20} className="text-yellow-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">Pro Plan</h4>
                                                    <p className="text-sm text-gray-600">Premium features</p>
                                                </div>
                                            </div>
                                            {selectedPlan === 'pro' && (
                                                <CheckCircle size={20} className="text-green-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Free Plan Card */}
                                    <div
                                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${selectedPlan === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} ${plans.free.color}`}
                                        onClick={() => setSelectedPlan('free')}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <Users size={20} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">Free Plan</h4>
                                                    <p className="text-sm text-gray-600">Basic features</p>
                                                </div>
                                            </div>
                                            {selectedPlan === 'free' && (
                                                <CheckCircle size={20} className="text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-6 flex justify-between items-center border-t">
                            <div className="text-sm text-gray-600">
                                {isCurrentPlan ? (
                                    <span className="text-yellow-600 font-medium">Photographer is already on this plan</span>
                                ) : (
                                    <span className="text-blue-600 font-medium">
                                        Changing from <span className="font-bold">{currentPlan.toUpperCase()}</span> to <span className="font-bold">{selectedPlan.toUpperCase()}</span>
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={isCurrentPlan}
                                    className={`px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2 ${isCurrentPlan
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : selectedPlan === 'pro'
                                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                            : 'bg-gray-800 hover:bg-gray-900 text-white'
                                        }`}
                                >
                                    <Shield size={18} />
                                    {isCurrentPlan ? 'Already Selected' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Plan Change Modal */}
            <ConfirmPlanChangeModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirm}
                photographer={photographer}
                newPlan={selectedPlan}
            />
        </>
    );
}