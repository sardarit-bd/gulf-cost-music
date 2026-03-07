// components/billing/PlanComparison.jsx
"use client";

import { Star, Zap, FileText, Download, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PlanComparison = ({ currentPlan = 'free' }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const features = [
        {
            name: 'Marketplace Fee',
            free: '10%',
            pro: '0%',
            proIcon: <Zap className="w-4 h-4 text-purple-600" />
        },
        {
            name: 'Marketplace Visibility',
            free: 'Basic',
            pro: 'Premium',
            proIcon: <Star className="w-4 h-4 text-purple-600" />
        }
    ];

    // Fetch invoices on component mount
    useEffect(() => {
        if (currentPlan === 'pro') {
            fetchInvoices();
        }
    }, [currentPlan]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/invoices`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setInvoices(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            paid: 'bg-green-100 text-green-700',
            open: 'bg-yellow-100 text-yellow-700',
            uncollectible: 'bg-red-100 text-red-700',
            void: 'bg-gray-100 text-gray-700'
        };

        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-700'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <h3 className="text-lg font-semibold">Plan Comparison</h3>
                <p className="text-sm text-gray-300 mt-1">Choose the best plan for you</p>
            </div>

            {/* Plan Headers */}
            <div className="grid grid-cols-2 border-b border-gray-200">
                <div className="px-6 py-4 bg-gray-50">
                    <span className="text-sm font-medium text-gray-500">Free</span>
                </div>
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Pro</span>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                            $10/mo
                        </span>
                    </div>
                </div>
            </div>

            {/* Features List */}
            <div className="divide-y divide-gray-200">
                {features.map((feature, index) => (
                    <div key={index} className="grid grid-cols-2">
                        <div className="px-6 py-4 text-sm text-gray-600">
                            {feature.name}
                        </div>
                        <div className="px-6 py-4 flex items-center gap-2">
                            {/* Free Plan Value */}
                            <span className="text-sm text-gray-900 min-w-[60px]">
                                {typeof feature.free === 'string' ? feature.free : feature.free}
                            </span>

                            {/* Pro Plan Value */}
                            <div className="flex items-center gap-1">
                                {feature.proIcon}
                                <span className="text-sm font-medium text-gray-900">
                                    {typeof feature.pro === 'string' ? feature.pro : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Invoices Section - Only for Pro Users */}
            {currentPlan === 'pro' && (
                <div className="border-t border-gray-200">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <h4 className="text-sm font-semibold text-gray-900">Recent Invoices</h4>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            </div>
                        ) : invoices.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-600">{formatDate(invoice.created)}</span>
                                            </div>
                                            {getStatusBadge(invoice.status)}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-3 h-3 text-gray-400" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(invoice.amount)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {invoice.hostedInvoiceUrl && (
                                                    <a
                                                        href={invoice.hostedInvoiceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 hover:bg-gray-100 rounded transition"
                                                        title="View Online"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                                                    </a>
                                                )}
                                                {invoice.invoicePdf && (
                                                    <a
                                                        href={invoice.invoicePdf}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 hover:bg-gray-100 rounded transition"
                                                        title="Download PDF"
                                                        onClick={() => toast.success('Downloading invoice...')}
                                                    >
                                                        <Download className="w-3.5 h-3.5 text-gray-500" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-xs text-gray-500">No invoices found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Current Plan Indicator */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                {currentPlan === 'pro' ? (
                    <div className="flex items-center gap-2 text-sm text-purple-700">
                        <Zap className="w-4 h-4" />
                        <span className="font-medium">You're on the Pro plan</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Current: Free Plan</span>
                    </div>
                )}
            </div>

            {/* Pro Tip */}
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-t border-yellow-200">
                <p className="text-xs text-yellow-800">
                    <strong className="block mb-1">💡 Pro Tip</strong>
                    Pro users save 10% on every marketplace sale. If you sell $100+/month, Pro pays for itself!
                </p>
            </div>
        </div>
    );
};

export default PlanComparison;