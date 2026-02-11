"use client";

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
import StripeConnectedView from "./StripeConnectedView";
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

  // Check permissions
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

  // ===== REFRESH STRIPE STATUS =====
  const refreshStripeStatus = async () => {
    setCheckingStripe(true);
    await checkStripeStatus();
  };

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
    return <AccessDenied />;
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

        {/* ===== STRIPE CONNECT SECTION ===== */}
        {!stripeStatus.isStripeConnected &&
          stripeStatus.stripeAccountStatus === "pending" && (
            <StripePendingView
              stripeStatus={stripeStatus}
              onRefresh={refreshStripeStatus}
            />
          )}

        {!stripeStatus.isStripeConnected &&
          stripeStatus.stripeAccountStatus === "not_connected" && (
            <StripeConnectPrompt onSuccess={handleStripeSuccess} user={user} />
          )}

        {stripeStatus.isStripeConnected && (
          <StripeConnectedView
            stripeStatus={stripeStatus}
            onDashboardClick={() =>
              window.open("/api/stripe/connect/dashboard", "_blank")
            }
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
                Please connect your Stripe account to start selling
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
                />
              ) : (
                <MyListingsTab
                  existingItem={existingItem}
                  onEdit={() => setActiveTab("create")}
                  onDelete={handleListingDelete}
                  API_BASE={API_BASE}
                  user={user}
                  stripeStatus={stripeStatus}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
