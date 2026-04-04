"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PLANS } from "@/lib/constants";
import { Check, Loader2, ExternalLink } from "lucide-react";

interface UsageData {
  plan: string;
  generationsUsed: number;
  generationsLimit: number;
  totalPosts: number;
  maxPostLength: number;
}

const planFeatures = {
  Free: ["3 blog posts per month", "Short posts (500 words)", "Basic SEO scoring", "5 saved posts"],
  Pro: ["30 blog posts per month", "All post lengths", "Full SEO scoring", "Unlimited saved posts"],
  Agency: ["Unlimited blog posts", "All post lengths", "Full SEO scoring", "Unlimited saved posts"],
};

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("success")) toast.success("Subscription activated!");
    if (searchParams.get("canceled")) toast("Checkout canceled", { icon: "ℹ️" });
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckout(priceId: string) {
    setCheckoutLoading(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
      </div>
    );
  }

  const currentPlan = usage?.plan || "Free";
  const usagePercent = usage
    ? usage.generationsLimit === Infinity
      ? 0
      : (usage.generationsUsed / usage.generationsLimit) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and usage.</p>
      </div>

      {/* Current Usage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan: {currentPlan}</CardTitle>
              <CardDescription>
                {usage?.generationsUsed || 0} of{" "}
                {usage?.generationsLimit === Infinity ? "unlimited" : usage?.generationsLimit || 3}{" "}
                generations used this month
              </CardDescription>
            </div>
            {currentPlan !== "Free" && (
              <Button variant="outline" onClick={handlePortal} disabled={portalLoading}>
                {portalLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Manage Billing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={usagePercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
          const isCurrent = plan.name === currentPlan;
          const features = planFeatures[plan.name as keyof typeof planFeatures] || [];

          return (
            <Card key={key} className={isCurrent ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrent && <Badge>Current</Badge>}
                </div>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {!isCurrent && plan.price > 0 && (
                  <Button
                    className="w-full"
                    variant={key === "pro" ? "default" : "outline"}
                    onClick={() => {
                      const priceId = key === "pro"
                        ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
                        : process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID;
                      if (priceId) handleCheckout(priceId);
                    }}
                    disabled={!!checkoutLoading}
                  >
                    {checkoutLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {currentPlan === "Free" ? "Get Started" : "Switch Plan"}
                  </Button>
                )}
                {isCurrent && (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
