import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

const SubscriptionStatus = ({ plan, status }) => {
    if (plan === 'free') {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                <Clock className="w-4 h-4 mr-1.5" />
                Free Plan
            </span>
        );
    }

    const statusConfig = {
        active: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: CheckCircle,
            label: 'Active'
        },
        trialing: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: CheckCircle,
            label: 'Trial'
        },
        past_due: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            icon: AlertCircle,
            label: 'Past Due'
        },
        incomplete: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            icon: AlertCircle,
            label: 'Incomplete'
        },
        canceled: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: XCircle,
            label: 'Canceled'
        },
        expired: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: XCircle,
            label: 'Expired'
        },
        none: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            icon: Clock,
            label: 'No Subscription'
        }
    };

    const config = statusConfig[status] || statusConfig.none;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-4 h-4 mr-1.5" />
            {config.label}
        </span>
    );
};

export default SubscriptionStatus;