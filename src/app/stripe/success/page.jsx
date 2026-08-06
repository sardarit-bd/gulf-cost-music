"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertTriangle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/components/shared/market/api";
import { getMarketplacePath } from "@/lib/marketplaceRoutes";

const REDIRECT_DELAY_MS = 3000;

function StripeConnectSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const accountId = params.get("account_id");
  const marketplacePath = getMarketplacePath(user?.userType);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!accountId) {
        if (active) {
          setStatus("error");
          setMessage(
            "We couldn't find your Stripe account reference in the redirect link.",
          );
        }
        return;
      }

      try {
        const response = await api.get(
          `/api/stripe/connect/success?account_id=${accountId}`,
        );
        if (!active) return;

        if (response.data?.isStripeConnected) {
          setStatus("active");
        } else {
          setStatus("pending");
          setMessage(
            response.message ||
              "Your Stripe account is still finishing verification.",
          );
        }
      } catch (error) {
        console.error("Stripe connect verification error:", error);
        if (active) {
          setStatus("error");
          setMessage(
            error.data?.message ||
              "We couldn't verify your Stripe account right now.",
          );
        }
      }
    };

    verify();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  useEffect(() => {
    if (status !== "active") return;
    const timer = setTimeout(
      () => router.push(marketplacePath),
      REDIRECT_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [status, marketplacePath, router]);

  const iconWrapClass =
    status === "error"
      ? "bg-destructive/10"
      : status === "pending"
        ? "bg-amber-500/10"
        : "bg-primary/10";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md text-center border-border">
        <CardContent className="flex flex-col items-center gap-4 pt-2">
          <div className={`rounded-full p-4 ${iconWrapClass}`}>
            {status === "verifying" && (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            )}
            {status === "active" && (
              <CheckCircle2 className="h-10 w-10 text-primary" />
            )}
            {status === "pending" && (
              <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            )}
            {status === "error" && (
              <AlertTriangle className="h-10 w-10 text-destructive" />
            )}
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            {status === "verifying" && "Verifying your Stripe account…"}
            {status === "active" && "Stripe Account Connected!"}
            {status === "pending" && "Almost There"}
            {status === "error" && "Verification Issue"}
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {status === "verifying" &&
              "Please wait while we confirm your onboarding with Stripe."}
            {status === "active" &&
              "You're all set to receive payouts. Redirecting you to the marketplace…"}
            {status === "pending" &&
              (message ||
                "Stripe still needs a bit more information before your account is fully active.")}
            {status === "error" &&
              (message || "Something went wrong verifying your account.")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            {(status === "pending" || status === "error") && (
              <Button asChild className="flex-1">
                <Link
                  href={`/stripe/refresh${accountId ? `?account_id=${accountId}` : ""}`}
                >
                  Continue Verification
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1">
              <Link href={marketplacePath}>
                <Store className="mr-1" />
                Back to Marketplace
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StripeConnectSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <StripeConnectSuccessContent />
    </Suspense>
  );
}
