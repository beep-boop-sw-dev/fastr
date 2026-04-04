import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenTool,
  Search,
  MapPin,
  Zap,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "AI-Powered Writing",
    description: "Generate professional blog posts in minutes with Claude AI, trained to write in your voice and style.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Every post is optimized for search engines with keyword targeting, meta descriptions, and proper heading structure.",
  },
  {
    icon: MapPin,
    title: "Local SEO Targeting",
    description: "Attract clients in your area with content optimized for your city, neighborhood, and local search terms.",
  },
  {
    icon: Zap,
    title: "One-Click Publishing",
    description: "Copy, download, or export your blog posts in seconds. Ready to paste into your website or CMS.",
  },
];

const steps = [
  { number: "1", title: "Enter Your Details", description: "Add your practice info, specialties, and preferred writing tone." },
  { number: "2", title: "Choose Your Topic", description: "Pick a blog topic and target keywords for SEO." },
  { number: "3", title: "Generate & Publish", description: "AI writes your post in seconds. Review, edit, and publish." },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Licensed Psychologist, Austin TX",
    quote: "Fastr cut my blog writing time from 4 hours to 15 minutes. My website traffic has doubled since I started posting consistently.",
  },
  {
    name: "James Rodriguez, LMFT",
    role: "Marriage & Family Therapist, Denver CO",
    quote: "The local SEO feature is a game-changer. I'm now ranking on the first page for 'couples therapy Denver' thanks to consistent blogging.",
  },
  {
    name: "Dr. Amara Johnson",
    role: "Clinical Social Worker, Atlanta GA",
    quote: "As a therapist, I know what I want to say but struggle with SEO. Fastr bridges that gap perfectly.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying it out",
    features: ["3 blog posts per month", "Short posts (500 words)", "Basic SEO scoring", "5 saved posts"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For active content creators",
    features: ["30 blog posts per month", "All post lengths (up to 1,500 words)", "Full SEO scoring & analysis", "Unlimited saved posts"],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$79",
    description: "For practices & agencies",
    features: ["Unlimited blog posts", "All post lengths", "Full SEO scoring & analysis", "Unlimited saved posts"],
    cta: "Go Agency",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-primary">
            Fastr
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/sign-up">
              <Button size="sm">Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
                <Zap className="mr-2 h-3.5 w-3.5 text-gold" />
                AI-powered blog writing for therapists
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                Blog posts that bring{" "}
                <span className="text-primary">clients to your practice</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Stop spending hours writing blog posts. Fastr uses AI to create SEO-optimized content
                that ranks in search results and attracts the right clients to your therapy practice.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Writing for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. 3 free posts per month.
              </p>
            </div>
          </div>
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">Everything you need to blog consistently</h2>
              <p className="text-lg text-muted-foreground">
                Built specifically for therapy practices. No marketing degree required.
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
              <h2 className="mb-4 text-3xl font-bold">How it works</h2>
              <p className="text-lg text-muted-foreground">Three simple steps to a published blog post.</p>
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
              <h2 className="mb-4 text-3xl font-bold">Loved by therapists</h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of therapy practices growing with Fastr.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name} className="border-0 bg-background shadow-sm">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
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
              <h2 className="mb-4 text-3xl font-bold">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground">Start free. Upgrade when you need more.</p>
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
            <h2 className="mb-4 text-3xl font-bold">
              Start attracting more clients today
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join therapists who are growing their practices with consistent, SEO-optimized blog content.
            </p>
            <Link href="/sign-up">
              <Button size="lg">
                Get Started for Free
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
              <p className="text-lg font-bold text-primary">Fastr</p>
              <p className="text-sm text-muted-foreground">
                AI-powered blog writing for therapy practices.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#pricing" className="hover:text-foreground">Pricing</a>
              <Link href="/sign-in" className="hover:text-foreground">Sign In</Link>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Fastr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
