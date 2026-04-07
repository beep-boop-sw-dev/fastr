import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "A place to start",
    features: [
      "3 blog posts per month",
      "Short posts (500 words)",
      "Basic SEO scoring",
      "5 saved posts",
      "1 practice profile",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For consistent publishing",
    features: [
      "30 blog posts per month",
      "All post lengths (up to 1,500 words)",
      "Full SEO scoring & analysis",
      "Unlimited saved posts",
      "1 practice profile",
      "Priority content creation",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$79",
    description: "For practices and groups",
    features: [
      "Unlimited blog posts",
      "All post lengths",
      "Full SEO scoring & analysis",
      "Unlimited saved posts",
      "5 practice profiles",
      "Priority content creation",
      "Early access to new features",
    ],
    cta: "Choose Agency",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold font-heading">Choose your plan</h1>
          <p className="text-lg text-muted-foreground">
            Start free. Grow at your own pace. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-primary shadow-lg relative" : ""}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include full access to our content creation tools.
            <br />
            Questions? Email us at{" "}
            <span className="text-foreground font-medium">support@clarionwriter.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
