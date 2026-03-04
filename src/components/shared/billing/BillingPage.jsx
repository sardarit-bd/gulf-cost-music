"use client";

import { AlertCircle, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomLoader from '../loader/Loader';
import BillingActions from './BillingActions';
import BillingPlanCard from './PlanCard';
import PlanComparison from './PlanComparison';

const BillingPage = ({ userType }) => {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [error, setError] = useState(null);

    // Supported user types
    const supportedUserTypes = ['artist', 'venue', 'photographer', 'studio', 'journalist'];

    useEffect(() => {
        if (!supportedUserTypes.includes(userType)) {
            setError('Billing page is not available for this user type');
            setLoading(false);
            return;
        }

        fetchBillingStatus();
    }, [userType]);

    const fetchBillingStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/status`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch billing status');

            const data = await response.json();
            setSubscription(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscriptionUpdate = (updatedData) => {
        setSubscription(prev => ({
            ...prev,
            ...updatedData
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen py-20 bg-white">
                <div className="text-center">
                    <CustomLoader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className=" px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Billing & Subscription
                    </h1>
                    <p className="text-gray-600">
                        Manage your subscription and billing preferences
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Plan & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        <BillingPlanCard
                            subscription={subscription}
                            userType={userType}
                        />

                        <BillingActions
                            subscription={subscription}
                            onUpdate={handleSubscriptionUpdate}
                            userType={userType}
                        />
                    </div>

                    {/* Right Column - Plan Comparison */}
                    <div className="lg:col-span-1">
                        <PlanComparison currentPlan={subscription?.plan} />
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        All subscriptions are managed securely through Stripe. Your payment information is never stored on our servers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;