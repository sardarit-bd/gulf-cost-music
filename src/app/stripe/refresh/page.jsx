"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCcw, Loader2, Store } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/components/shared/market/api";
import { getMarketplacePath } from "@/lib/marketplaceRoutes";

function StripeRefreshContent() {
  const params = useSearchParams();
  const accountId = params.get("account_id");
  const { user } = useAuth();
  const marketplacePath = getMarketplacePath(user?.userType);

  const [status, setStatus] = useState("checking");
  const [manualLoading, setManualLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const requestNewLink = async () => {
      if (!accountId) {
        if (active) setStatus("manual");
        return;
      }

      try {
        const response = await api.get(
          `/api/stripe/connect/refresh?account_id=${accountId}`,
        );
        if (!active) return;

        if (response.url) {
          setStatus("redirecting");
          window.location.href = response.url;
        } else {
          setStatus("manual");
        }
      } catch (error) {
        console.error("Stripe refresh link error:", error);
        if (active) setStatus("manual");
      }
    };

    requestNewLink();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const handleManualContinue = async () => {
    setManualLoading(true);
    try {
      const response = await api.post("/api/stripe/connect/onboard");
      if (response.url) {
        window.location.href = response.url;
        return;
      }
      toast.error("Could not start Stripe onboarding. Please try again.");
    } catch (error) {
      console.error("Stripe onboarding retry error:", error);
      toast.error(error.data?.message || "Unable to reach Stripe right now.");
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md text-center border-border">
        <CardContent className="flex flex-col items-center gap-4 pt-2">
          <div
            className={`rounded-full p-4 ${status === "manual" ? "bg-amber-500/10" : "bg-primary/10"}`}
          >
            {(status === "checking" || status === "redirecting") && (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            )}
            {status === "manual" && (
              <RefreshCcw className="h-10 w-10 text-amber-500" />
            )}
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            {status === "checking" && "Resuming Onboarding…"}
            {status === "redirecting" && "Redirecting to Stripe…"}
            {status === "manual" && "Onboarding Interrupted"}
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {status === "checking" &&
              "We're requesting a fresh Stripe verification link for you."}
            {status === "redirecting" &&
              "Taking you back to Stripe to finish verification."}
            {status === "manual" &&
              "Your Stripe verification link expired or was left incomplete. You can pick up right where you left off."}
          </p>

          {status === "manual" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <Button
                onClick={handleManualContinue}
                disabled={manualLoading}
                className="flex-1"
              >
                {manualLoading ? (
                  <>
                    <Loader2 className="mr-1 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  "Continue Stripe Verification"
                )}
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={marketplacePath}>
                  <Store className="mr-1" />
                  Back to Marketplace
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StripeRefreshPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <StripeRefreshContent />
    </Suspense>
  );
}
