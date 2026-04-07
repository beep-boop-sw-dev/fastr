import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenTool,
  Search,
  MapPin,
  BookOpen,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "Guided Content Creation",
    description: "A thoughtful process that transforms your clinical expertise into polished, publish-ready blog posts that sound like you.",
  },
  {
    icon: Search,
    title: "Search Visibility",
    description: "Content structured so potential clients can find you. Keyword targeting, clear headings, and meta descriptions built in.",
  },
  {
    icon: MapPin,
    title: "Local Reach",
    description: "Attract clients in your community with content tailored to your city, neighborhood, and the people you serve.",
  },
  {
    icon: BookOpen,
    title: "Ready to Publish",
    description: "Review, refine, and publish with confidence. Every post is crafted to meet the standards your practice demands.",
  },
];

const steps = [
  { number: "1", title: "Share your practice details", description: "Your specialties, your location, your voice. We start with what makes your practice unique." },
  { number: "2", title: "Choose your topic", description: "Select a subject that matters to your clients and the keywords that help them find you." },
  { number: "3", title: "Review and publish", description: "Read through your post, make it yours, and share it with confidence." },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Licensed Psychologist, Austin TX",
    quote: "I finally have a consistent blog. My website traffic has doubled, and new clients tell me they found me through my articles.",
  },
  {
    name: "James Rodriguez, LMFT",
    role: "Marriage & Family Therapist, Denver CO",
    quote: "I wanted to reach more couples in my area. Within three months of consistent blogging, I was appearing on the first page for local searches.",
  },
  {
    name: "Dr. Amara Johnson",
    role: "Clinical Social Worker, Atlanta GA",
    quote: "I know what I want to say to prospective clients, but turning that into blog content felt impossible. Clarion made it effortless.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "A place to start",
    features: ["3 posts per month", "Short posts (500 words)", "Basic SEO scoring", "5 saved posts"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For consistent publishing",
    features: ["30 posts per month", "All post lengths (up to 1,500 words)", "Full SEO scoring & analysis", "Unlimited saved posts"],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$79",
    description: "For practices and groups",
    features: ["Unlimited posts", "All post lengths", "Full SEO scoring & analysis", "Unlimited saved posts"],
    cta: "Choose Agency",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-[#7A9E7E] text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold font-heading">
            Clarion
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-white/80 hover:text-white transition-colors">Pricing</a>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-white text-[#7A9E7E] hover:bg-white/90">Get Started</Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/sign-up">
              <Button size="sm" className="bg-white text-[#7A9E7E] hover:bg-white/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
                Built for health professionals
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl font-heading">
                Your expertise,{" "}
                <span className="text-primary">published.</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed">
                You&apos;ve spent years building clinical expertise that could help people long before
                their first session. Clarion helps you share it — with credible, professional content
                that builds trust and grows your practice.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Publishing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>
            </div>
          </div>
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">Everything you need to publish consistently</h2>
              <p className="text-lg text-muted-foreground">
                Designed for the way health professionals think, write, and practice.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-background shadow-sm">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">How it works</h2>
              <p className="text-lg text-muted-foreground">A thoughtful process from expertise to published post.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">Trusted by health professionals</h2>
              <p className="text-lg text-muted-foreground">
                Clinicians who are growing their practices through consistent, credible content.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name} className="border-0 bg-background shadow-sm">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-clay text-clay" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">Choose your plan</h2>
              <p className="text-lg text-muted-foreground">Start free. Grow at your own pace.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 pt-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.popular ? "border-primary shadow-lg relative overflow-visible" : ""}
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
                      {plan.price !== "$0" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up">
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t bg-primary/5 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold font-heading">
              Your clients are searching. Let them find you.
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Consistent, credible content builds the kind of trust that turns website visitors into clients.
              Your practice grows because your voice is out there, working for you.
            </p>
            <Link href="/sign-up">
              <Button size="lg">
                Start Publishing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="text-lg font-bold text-primary font-heading">Clarion</p>
              <p className="text-sm text-muted-foreground">
                Professional content for health professionals.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#pricing" className="hover:text-foreground">Pricing</a>
              <Link href="/sign-in" className="hover:text-foreground">Sign In</Link>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Clarion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
