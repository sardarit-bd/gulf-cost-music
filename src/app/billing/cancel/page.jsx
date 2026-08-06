"use client";

import Link from "next/link";
import { useState } from "react";
import { XCircle, RotateCcw, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/components/shared/market/api";

export default function BillingCancelPage() {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const response = await api.post("/api/subscription/checkout/pro");
      if (response.url) {
        window.location.href = response.url;
        return;
      }
      toast.error("Could not start checkout. Please try again from Billing.");
    } catch (error) {
      console.error("Retry subscription checkout error:", error);
      toast.error(error.data?.message || "Unable to start checkout");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md text-center border-border">
        <CardContent className="flex flex-col items-center gap-4 pt-2">
          <div className="rounded-full bg-destructive/10 p-4">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground">
            Checkout Cancelled
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            You cancelled the Pro subscription checkout. Nothing was charged and
            your account is unchanged.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Button
              onClick={handleRetry}
              disabled={retrying}
              className="flex-1"
            >
              {retrying ? (
                <>
                  <Loader2 className="mr-1 animate-spin" />
                  Starting checkout…
                </>
              ) : (
                <>
                  <RotateCcw className="mr-1" />
                  Retry Subscription
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard/billing">
                <ArrowLeft className="mr-1" />
                Back to Billing
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
