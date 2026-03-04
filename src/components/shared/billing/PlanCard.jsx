// components/billing/PlanCard.jsx
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard } from 'lucide-react';
import SubscriptionStatus from './SubscriptionStatus';

const BillingPlanCard = ({ subscription, userType }) => {
    const { plan = 'free', status = 'none', currentPeriodEnd, cancelAtPeriodEnd } = subscription || {};

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getUserTypeLabel = (type) => {
        const labels = {
            artist: 'Artist',
            venue: 'Venue',
            photographer: 'Photographer',
            studio: 'Studio',
            journalist: 'Journalist'
        };
        return labels[type] || type;
    };

    const isPro = plan === 'pro';
    const isActive = status === 'active' || status === 'trialing';

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {getUserTypeLabel(userType)} Account
                        </p>
                    </div>
                    <SubscriptionStatus plan={plan} status={status} />
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                {/* Plan Info */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {isPro ? 'Pro Plan' : 'Free Plan'}
                            </h3>
                            {isPro && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {status === 'trialing' ? 'Trial' : 'Premium'}
                                </span>
                            )}
                        </div>
                        {isPro && (
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                $10 <span className="text-lg font-normal text-gray-500">/ month</span>
                            </p>
                        )}
                    </div>

                    {isPro && isActive && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4" />
                            <span>
                                {cancelAtPeriodEnd ? 'Ends on' : 'Renews on'} {formatDate(currentPeriodEnd)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Subscription Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Current Period End</p>
                            <p className="text-base font-semibold text-gray-900">
                                {isPro ? formatDate(currentPeriodEnd) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Subscription Status</p>
                            <p className="text-base font-semibold text-gray-900 capitalize">
                                {status === 'none' ? 'No Subscription' : status}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <CreditCard className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                            <p className="text-base font-semibold text-gray-900">
                                {isPro && !cancelAtPeriodEnd ? formatDate(currentPeriodEnd) : 'No upcoming billing'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${cancelAtPeriodEnd ? 'bg-yellow-50' : 'bg-gray-50'
                            }`}>
                            {cancelAtPeriodEnd ? (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                            ) : (
                                <CheckCircle className="w-4 h-4 text-gray-600" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Cancel at Period End</p>
                            <p className="text-base font-semibold text-gray-900">
                                {cancelAtPeriodEnd ? 'Yes' : 'No'}
                            </p>
                            {cancelAtPeriodEnd && (
                                <p className="text-xs text-yellow-600 mt-1">
                                    Your subscription will end on {formatDate(currentPeriodEnd)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pro Features Summary */}
                {!isPro && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Upgrade to Pro</span> to unlock 0% marketplace fees
                            and premium visibility for your {getUserTypeLabel(userType).toLowerCase()} profile.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingPlanCard;