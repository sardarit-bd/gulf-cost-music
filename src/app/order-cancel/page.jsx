"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { XCircle, RotateCcw, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderCancelPage() {
  const router = useRouter();

  const handleRetry = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/markets");
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
            Payment Cancelled
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Your checkout was cancelled before completion. Nothing was charged
            to your card.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Button onClick={handleRetry} className="flex-1">
              <RotateCcw className="mr-1" />
              Retry Checkout
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/merch">
                <ShoppingBag className="mr-1" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/markets">
              <Store className="mr-1" />
              Back to Marketplace
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
