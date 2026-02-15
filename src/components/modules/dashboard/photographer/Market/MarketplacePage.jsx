"use client";

import StripeConnectedView from "@/components/shared/StripeConnectedView";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AccessDenied from "./AccessDenied";
import CreateListingTab from "./CreateListingTab";
import LoadingState from "./LoadingState";
import MarketplaceHeader from "./MarketplaceHeader";
import MarketplaceStats from "./MarketplaceStats";
import MarketplaceTabs from "./MarketplaceTabs";
import MyListingsTab from "./MyListingsTab";
import StripeConnectPrompt from "./StripeConnectPrompt";
import StripePendingView from "./StripePendingView";

const getToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (token) return token;
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;)\s*token=([^;]+)/);
    return match ? match[1] : null;
  }
  return null;
};

export default function MarketplacePage({ API_BASE, subscriptionPlan, user }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create");
  const [existingItem, setExistingItem] = useState(null);

  // ===== STRIPE CONNECT STATUS =====
  const [stripeStatus, setStripeStatus] = useState({
    isStripeConnected: false,
    stripeAccountId: null,
    stripeAccountStatus: "not_connected",
    stripeStatusMessage: "Not Connected",
    requirements: null,
    chargesEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
    canSellInMarket: false,
  });

  const [checkingStripe, setCheckingStripe] = useState(true);

  // Check permissions - Photographer specific
  const isVerified = !!user?.isVerified;
  const isAllowedSeller = [
    "artist",
    "venue",
    "photographer",
    "studio",
    "journalist",
    "fan",
  ].includes(String(user?.userType || "").toLowerCase());
  const hasMarketplaceAccess = isVerified && isAllowedSeller;

  // ===== CHECK STRIPE CONNECTION STATUS =====
  const checkStripeStatus = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/stripe/connect/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setStripeStatus(data.data);
        return data.data;
      }
    } catch (error) {
      console.error("Error checking Stripe status:", error);
    } finally {
      setCheckingStripe(false);
    }
  };

  // ===== HANDLE STRIPE CONNECTION =====
  const handleStripeConnect = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please sign in again");
        return;
      }

      const res = await fetch(`${API_BASE}/api/stripe/connect/onboard`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success && data.url) {
        // Redirect to Stripe onboarding
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to connect Stripe");
      }
    } catch (error) {
      console.error("Stripe connect error:", error);
      toast.error("Failed to connect Stripe account");
    }
  };

  // ===== REFRESH STRIPE STATUS =====
  const refreshStripeStatus = async () => {
    setCheckingStripe(true);
    await checkStripeStatus();
  };

  // ===== HANDLE DASHBOARD REDIRECT =====
  const handleDashboardRedirect = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please sign in again");
        return;
      }

      const res = await fetch(`${API_BASE}/api/stripe/connect/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        if (data.requiresOnboarding) {
          // Redirect to complete onboarding
          window.location.href = data.url;
        } else {
          toast.error(data.message || "Failed to access dashboard");
        }
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to access Stripe dashboard");
    }
  };

  // Load marketplace data
  useEffect(() => {
    const loadMarketplaceData = async () => {
      if (!hasMarketplaceAccess) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = getToken();

        if (!token) {
          throw new Error("Not authenticated");
        }

        // First check Stripe status
        await checkStripeStatus();

        // Load user's listing
        const res = await fetch(`${API_BASE}/api/market/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setExistingItem(data.data);
            setActiveTab("listings");
          }
        } else if (res.status !== 404) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load listing");
        }
      } catch (error) {
        console.error("Load error:", error);
        if (!error.message.includes("404")) {
          toast.error(error.message || "Failed to load marketplace data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (API_BASE) {
      loadMarketplaceData();
    }
  }, [API_BASE, hasMarketplaceAccess, user]);

  // Handle listing creation/update
  const handleListingUpdate = (updatedItem, isNew = false) => {
    setExistingItem(updatedItem);
    setActiveTab("listings");
    toast.success(
      isNew ? "Listing created successfully!" : "Listing updated successfully!",
    );
  };

  // Handle listing deletion
  const handleListingDelete = () => {
    setExistingItem(null);
    setActiveTab("create");
    toast.success("Listing deleted successfully!");
  };

  // Handle Stripe connection success
  const handleStripeSuccess = () => {
    refreshStripeStatus();
    toast.success("Stripe account connected successfully!");
  };

  if (!hasMarketplaceAccess) {
    return <AccessDenied userType="photographer" />;
  }

  if (loading || checkingStripe) {
    return <LoadingState message="Loading Marketplace..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="space-y-8">
        {/* Header */}
        <MarketplaceHeader
          existingItem={existingItem}
          user={user}
          stripeStatus={stripeStatus}
        />

        {/* ===== STRIPE CONNECT SECTION - PHOTOGRAPHER ===== */}
        {!stripeStatus.isStripeConnected &&
          stripeStatus.stripeAccountStatus === "pending" && (
            <StripePendingView
              stripeStatus={stripeStatus}
              onRefresh={refreshStripeStatus}
            />
          )}

        {!stripeStatus.isStripeConnected &&
          stripeStatus.stripeAccountStatus === "not_connected" && (
            <StripeConnectPrompt
              onSuccess={handleStripeSuccess}
              user={user}
              userType="photographer"
              onConnect={handleStripeConnect}
            />
          )}

        {stripeStatus.isStripeConnected && (
          <StripeConnectedView
            stripeStatus={stripeStatus}
            onConnect={handleStripeConnect}
            onRefresh={refreshStripeStatus}
            userType="photographer"
            onDashboardClick={handleDashboardRedirect}
          />
        )}

        {/* Stats Cards */}
        <MarketplaceStats
          existingItem={existingItem}
          stripeStatus={stripeStatus}
          user={user}
        />

        {/* Tabs Navigation - Show only if Stripe is connected OR no listing exists */}
        {(stripeStatus.isStripeConnected || !existingItem) && (
          <MarketplaceTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            existingItem={existingItem}
            stripeConnected={stripeStatus.isStripeConnected}
          />
        )}

        {/* Tab Content - Disable if Stripe not connected and no listing exists */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {!stripeStatus.isStripeConnected && !existingItem ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">
                Please connect your Stripe account to start selling your photography services
              </p>
            </div>
          ) : (
            <>
              {activeTab === "create" ? (
                <CreateListingTab
                  API_BASE={API_BASE}
                  existingItem={existingItem}
                  onSuccess={handleListingUpdate}
                  onDelete={handleListingDelete}
                  user={user}
                  stripeStatus={stripeStatus}
                  userType="photographer"
                />
              ) : (
                <MyListingsTab
                  existingItem={existingItem}
                  onEdit={() => setActiveTab("create")}
                  onDelete={handleListingDelete}
                  API_BASE={API_BASE}
                  user={user}
                  stripeStatus={stripeStatus}
                  userType="photographer"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}