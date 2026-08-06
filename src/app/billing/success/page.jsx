"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, LayoutDashboard, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getMarketplacePath } from "@/lib/marketplaceRoutes";

export default function BillingSuccessPage() {
  const { user, refreshUser } = useAuth();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await refreshUser();
      } finally {
        if (active) setVerifying(false);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPro = user?.subscriptionPlan === "pro";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md text-center border-border">
        <CardContent className="flex flex-col items-center gap-4 pt-2">
          <div className="rounded-full bg-primary/10 p-4">
            {verifying ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-primary" />
            )}
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            {verifying ? "Confirming your subscription…" : "You're on Pro!"}
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {verifying
              ? "Hang tight while we verify your subscription status."
              : "Your Pro subscription is now active. Enjoy 0% marketplace fees and full seller benefits."}
          </p>

          {!verifying && !isPro && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Your payment went through, but it can take a minute to reflect
              here. Check the Billing page shortly if Pro access isn&apos;t
              showing yet.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Button asChild className="flex-1">
              <Link href="/dashboard/billing">
                <LayoutDashboard className="mr-1" />
                Go to Billing
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={getMarketplacePath(user?.userType)}>
                <Store className="mr-1" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
