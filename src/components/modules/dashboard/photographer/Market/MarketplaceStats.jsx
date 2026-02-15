"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

export default function MarketplaceStats({ existingItem, stripeStatus, user }) {
  // Stripe status icon and color mapping
  const getStripeStatusDetails = () => {
    if (stripeStatus?.isStripeConnected) {
      return {
        value: "Connected",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        message: "Ready to receive payments",
      };
    }

    if (stripeStatus?.stripeAccountStatus === "pending") {
      return {
        value: "Pending",
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        message: "Onboarding in progress",
      };
    }

    if (stripeStatus?.stripeAccountStatus === "restricted") {
      return {
        value: "Restricted",
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        message: "Action required",
      };
    }

    return {
      value: "Not Connected",
      icon: CreditCard,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      message: "Connect to start selling",
    };
  };

  const stripeDetails = getStripeStatusDetails();
  const StripeIcon = stripeDetails.icon;

  // Calculate market fee based on subscription and user type
  const getMarketFeeDetails = () => {
    const isPro = user?.subscriptionPlan === "pro";
    const feePercentage = isPro ? 5 : 10;
    const sellerTypes = [
      "artist",
      "venue",
      "photographer",
      "studio",
      "journalist",
      "fan",
    ];
    const isSeller = sellerTypes.includes(
      String(user?.userType || "").toLowerCase(),
    );

    return {
      percentage: isSeller ? feePercentage : 0,
      label: isSeller ? (isPro ? "5% (Pro)" : "10% (Free)") : "N/A",
      color: isPro ? "text-purple-600" : "text-blue-600",
      bgColor: isPro ? "bg-purple-100" : "bg-blue-100",
    };
  };

  const feeDetails = getMarketFeeDetails();
  const FeeIcon = DollarSign;

  // Listing status details
  const getListingStatusDetails = () => {
    if (existingItem) {
      return {
        value: "Active",
        subValue:
          existingItem.status === "active" ? "Published" : existingItem.status,
        icon: Package,
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    }
    return {
      value: "No Listing",
      subValue: "Create your first listing",
      icon: Package,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
  };

  const listingDetails = getListingStatusDetails();
  const ListingIcon = listingDetails.icon;

  // Subscription details
  const getSubscriptionDetails = () => {
    const isPro = user?.subscriptionPlan === "pro";
    const isActive =
      user?.subscriptionStatus === "active" ||
      user?.subscriptionStatus === "trialing";

    return {
      plan: isPro ? "Pro" : "Free",
      status: isActive ? "Active" : user?.subscriptionStatus || "Inactive",
      icon: TrendingUp,
      color: isPro ? "text-purple-600" : "text-gray-600",
      bgColor: isPro ? "bg-purple-100" : "bg-gray-100",
    };
  };

  const subscriptionDetails = getSubscriptionDetails();
  const SubscriptionIcon = subscriptionDetails.icon;

  const stats = [
    {
      label: "Current Listing",
      value: listingDetails.value,
      subValue: listingDetails.subValue,
      icon: ListingIcon,
      color: listingDetails.color,
      bgColor: listingDetails.bgColor,
    },
    {
      label: "Stripe Connect",
      value: stripeDetails.value,
      subValue: stripeDetails.message,
      icon: StripeIcon,
      color: stripeDetails.color,
      bgColor: stripeDetails.bgColor,
      requiresAction:
        stripeStatus?.stripeAccountStatus === "restricted" ||
        (stripeStatus?.stripeAccountStatus === "pending" &&
          stripeStatus?.requirements?.currently_due?.length > 0),
    },
    // {
    //   label: "Subscription",
    //   value: subscriptionDetails.plan,
    //   subValue: subscriptionDetails.status,
    //   icon: SubscriptionIcon,
    //   color: subscriptionDetails.color,
    //   bgColor: subscriptionDetails.bgColor,
    // },
    {
      label: "Market Fee",
      value: feeDetails.label,
      subValue:
        feeDetails.percentage > 0
          ? `${feeDetails.percentage}% per sale`
          : "Not applicable",
      icon: FeeIcon,
      color: feeDetails.color,
      bgColor: feeDetails.bgColor,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              {stat.subValue && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  {stat.requiresAction && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                  {stat.subValue}
                </p>
              )}
            </div>
            <div
              className={`p-3 ${stat.bgColor} rounded-lg ml-2 flex-shrink-0`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>

          {/* Additional info for Stripe when pending/restricted */}
          {stat.label === "Stripe Connect" &&
            stripeStatus?.requirements?.currently_due?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {stripeStatus.requirements.currently_due.length}{" "}
                  requirement(s) pending
                </p>
              </div>
            )}

          {/* Show trial info if applicable */}
          {stat.label === "Subscription" &&
            user?.trialEndsAt &&
            user?.subscriptionStatus === "trialing" && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-blue-600">
                  Trial ends: {new Date(user.trialEndsAt).toLocaleDateString()}
                </p>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
