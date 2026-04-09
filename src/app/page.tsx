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
  Sliders,
  FileText,
  BarChart3,
  Globe,
  ChevronDown,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────── */

const stats = [
  { value: "2x", label: "Average traffic increase", icon: TrendingUp },
  { value: "15 min", label: "Per blog post", icon: Clock },
  { value: "1,000+", label: "Posts published", icon: FileText },
];

const featureBlocks = [
  {
    badge: "Content Creation",
    title: "Share your expertise without the blank page",
    description:
      "You know what your clients need to hear. Clarion guides you from topic to finished post — structured around your specialties, your voice, and the community you serve. Not a generic content mill. A thoughtful process built for clinicians.",
    points: [
      "Choose from four writing tones: warm, conversational, professional, or empowering",
      "Content grounded in your clinical specialties and practice focus",
      "Posts structured with headings, flow, and a clear call to action",
    ],
    visual: "tone",
  },
  {
    badge: "Search Visibility",
    title: "Reach the people searching for help in your area",
    description:
      "Every post is built to perform. Primary keywords, secondary keywords, meta descriptions, and heading structure — all handled for you. Clarion scores each post so you know exactly how discoverable it is before you publish.",
    points: [
      "Built-in SEO scoring with actionable feedback",
      "Keyword targeting woven naturally into your content",
      "Meta descriptions and heading hierarchy included automatically",
    ],
    visual: "seo",
  },
  {
    badge: "Local Reach",
    title: "Become the trusted voice in your neighborhood",
    description:
      "Generic mental health content doesn't build a local practice. Clarion tailors every post to your city, neighborhood, and community — so when someone in your area searches for help, they find you.",
    points: [
      "Content localized to your city, state, and neighborhood",
      "Natural references to community context and local concerns",
      "Attract clients who are actively searching nearby",
    ],
    visual: "local",
  },
];

const beforeAfter = {
  before: {
    label: "Without Clarion",
    items: [
      "Staring at a blank page for an hour",
      "Generic content that sounds like everyone else",
      "No idea if anyone will find it on Google",
      "Published once, then nothing for months",
    ],
  },
  after: {
    label: "With Clarion",
    items: [
      "Topic to finished post in 15 minutes",
      "Content that sounds like you and your practice",
      "SEO scoring and keyword targeting built in",
      "Consistent publishing that compounds over time",
    ],
  },
};

const steps = [
  {
    number: "1",
    title: "Tell us about your practice",
    description:
      "Your specialties, your location, your preferred tone. Set it once and every post starts from a place that reflects who you are.",
  },
  {
    number: "2",
    title: "Choose a topic and keywords",
    description:
      "Pick a subject your clients care about and the search terms that help them find you. Not sure? We'll suggest ideas based on your specialties.",
  },
  {
    number: "3",
    title: "Review, refine, and publish",
    description:
      "Read through your post in a clean document viewer. Edit anything, check your SEO score, then download or copy — ready for your website.",
  },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Licensed Psychologist",
    location: "Austin, TX",
    quote:
      "I finally have a consistent blog. My website traffic has doubled, and new clients tell me they found me through my articles.",
    metric: "2x website traffic",
  },
  {
    name: "James Rodriguez, LMFT",
    role: "Marriage & Family Therapist",
    location: "Denver, CO",
    quote:
      "I wanted to reach more couples in my area. Within three months of consistent blogging, I was appearing on the first page for local searches.",
    metric: "Page 1 in 3 months",
  },
  {
    name: "Dr. Amara Johnson",
    role: "Clinical Social Worker",
    location: "Atlanta, GA",
    quote:
      "I know what I want to say to prospective clients, but turning that into blog content felt impossible. Clarion made it effortless.",
    metric: "4 posts per month",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "A place to start",
    features: [
      "3 posts per month",
      "Short posts (500 words)",
      "Basic SEO scoring",
      "5 saved posts",
      "1 practice profile",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For consistent publishing",
    features: [
      "30 posts per month",
      "All lengths (up to 1,500 words)",
      "Full SEO scoring & analysis",
      "Unlimited saved posts",
      "Priority content creation",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    description: "For practices and groups",
    features: [
      "Unlimited posts",
      "All post lengths",
      "Full SEO scoring & analysis",
      "Unlimited saved posts",
      "5 practice profiles",
      "Early access to new features",
    ],
    cta: "Start Agency",
    popular: false,
  },
];

const faqs = [
  {
    q: "Will the content sound like me?",
    a: "Yes. You choose your writing tone (warm, conversational, professional, or empowering), your specialties, and your practice details. Every post is grounded in your expertise and written in the voice you select — not generic filler.",
  },
  {
    q: "Do I need to be a good writer?",
    a: "Not at all. You bring the clinical expertise — Clarion handles the writing, structure, and SEO. You review the finished post and make any changes you want before publishing.",
  },
  {
    q: "How does the SEO scoring work?",
    a: "Each post is scored on keyword usage, heading structure, meta descriptions, content length, and readability. You see the score and specific feedback before you publish, so you can improve discoverability with confidence.",
  },
  {
    q: "Can I edit the content after it's generated?",
    a: "Absolutely. Every post opens in a full document editor where you can edit the text, adjust the title, update the meta description, and toggle between edit and preview modes. It's your content — Clarion just gives you a strong starting point.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime. There are no contracts or commitments. Your saved posts remain accessible even if you downgrade to the free plan (up to the free plan's saved post limit).",
  },
  {
    q: "Is this an AI content generator?",
    a: "Clarion is a guided content creation tool for health professionals. It's built specifically for therapists and clinicians, uses your practice details and clinical focus to create relevant content, and gives you full control to review and edit everything before publishing. It's a writing partner, not a replacement.",
  },
];

/* ─── COMPONENTS ────────────────────────────────────────────── */

function DemoCard() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-xl border bg-background shadow-xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center text-xs text-muted-foreground">clarionwriter.com</div>
        </div>

        {/* Mock interface */}
        <div className="grid md:grid-cols-[280px_1fr] divide-x">
          {/* Left: Input summary */}
          <div className="p-5 space-y-4 bg-muted/20">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Topic</p>
              <p className="text-sm font-medium">Managing Holiday Anxiety</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Keyword</p>
              <div className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                anxiety therapist Austin
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Tone</p>
              <p className="text-sm">Warm & Empathetic</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">SEO Score</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[87%] rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-bold text-green-600">87</span>
              </div>
            </div>
          </div>

          {/* Right: Content preview */}
          <div className="p-6 space-y-3">
            <h3 className="text-lg font-bold font-heading">How to Manage Anxiety During the Holiday Season</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The holidays can be a time of joy — but for many people, they bring a wave of anxiety that feels impossible to manage.
              If you&apos;re finding yourself overwhelmed by social obligations, family dynamics, or the pressure to feel festive, you&apos;re not alone.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As a therapist in Austin, I work with clients every day who struggle with
              <span className="bg-primary/10 px-0.5 rounded font-medium text-primary"> holiday anxiety</span>.
              Here are three evidence-based strategies that can help you find calm during the busiest time of year...
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> 1,024 words</span>
              <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> SEO: 87/100</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Austin, TX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b last:border-0">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-left font-medium hover:text-primary transition-colors">
        {q}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */

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
            <a href="#features" className="text-sm text-white/80 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-white/80 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-white/80 hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-white text-[#7A9E7E] hover:bg-white/90">
                Get Started Free
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/sign-up">
              <Button size="sm" className="bg-white text-[#7A9E7E] hover:bg-white/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
            <div className="mx-auto max-w-3xl text-center mb-14">
              <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
                Built for therapists & health professionals
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl font-heading">
                Your expertise,{" "}
                <span className="text-primary">published.</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-2xl mx-auto">
                Turn your clinical knowledge into credible blog content that builds trust,
                attracts local clients, and grows your practice — in minutes, not hours.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8">
                    Start Publishing — Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">3 free posts per month. No credit card required.</p>
              </div>
            </div>

            {/* Interactive Demo */}
            <DemoCard />
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </section>

        {/* ── Stats Bar ── */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-10">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold md:text-3xl">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground md:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Before / After ── */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">
                Content marketing shouldn&apos;t feel like a second job
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                You became a therapist to help people, not to wrestle with WordPress.
                Here&apos;s what changes with Clarion.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Before */}
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                <p className="mb-4 text-sm font-semibold text-destructive uppercase tracking-wider">
                  {beforeAfter.before.label}
                </p>
                <ul className="space-y-3">
                  {beforeAfter.before.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs">
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <p className="mb-4 text-sm font-semibold text-primary uppercase tracking-wider">
                  {beforeAfter.after.label}
                </p>
                <ul className="space-y-3">
                  {beforeAfter.after.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Deep Dives ── */}
        <section id="features" className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">
                Everything you need to publish consistently
              </h2>
              <p className="text-lg text-muted-foreground">
                Designed for the way health professionals think, write, and practice.
              </p>
            </div>

            <div className="space-y-20">
              {featureBlocks.map((block, i) => (
                <div
                  key={block.title}
                  className={`grid gap-10 items-center md:grid-cols-2 ${i % 2 === 1 ? "md:direction-rtl" : ""}`}
                >
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {block.badge}
                    </div>
                    <h3 className="mb-3 text-2xl font-bold font-heading">{block.title}</h3>
                    <p className="mb-6 text-muted-foreground leading-relaxed">{block.description}</p>
                    <ul className="space-y-3">
                      {block.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual mockup */}
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    {block.visual === "tone" && (
                      <div className="rounded-xl border bg-background p-6 shadow-sm">
                        <p className="mb-4 text-sm font-medium">Choose your writing tone</p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Warm & Empathetic", desc: "Compassionate, approachable", active: true },
                            { label: "Conversational", desc: "Friendly, like a trusted friend", active: false },
                            { label: "Professional", desc: "Evidence-based, authoritative", active: false },
                            { label: "Empowering", desc: "Motivating, action-oriented", active: false },
                          ].map((t) => (
                            <div
                              key={t.label}
                              className={`rounded-lg border p-3 ${t.active ? "border-primary bg-primary/5" : "border-border"}`}
                            >
                              <p className="text-sm font-medium">{t.label}</p>
                              <p className="text-xs text-muted-foreground">{t.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {block.visual === "seo" && (
                      <div className="rounded-xl border bg-background p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">SEO Score</p>
                          <span className="text-2xl font-bold text-green-600">87/100</span>
                        </div>
                        {[
                          { name: "Keyword in title", score: 10, max: 10 },
                          { name: "Keyword density", score: 8, max: 10 },
                          { name: "Heading structure", score: 15, max: 15 },
                          { name: "Meta description", score: 12, max: 15 },
                          { name: "Content length", score: 20, max: 20 },
                          { name: "Readability", score: 22, max: 30 },
                        ].map((check) => (
                          <div key={check.name} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{check.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-green-500"
                                  style={{ width: `${(check.score / check.max) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium w-10 text-right">
                                {check.score}/{check.max}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {block.visual === "local" && (
                      <div className="rounded-xl border bg-background p-6 shadow-sm space-y-4">
                        <p className="text-sm font-medium">Local targeting</p>
                        <div className="space-y-3">
                          {[
                            { icon: MapPin, label: "City", value: "Austin, Texas" },
                            { icon: Globe, label: "Neighborhood", value: "East Side" },
                            { icon: Users, label: "Audience", value: "Potential clients" },
                            { icon: Sliders, label: "Specialties", value: "Anxiety, Depression, PTSD" },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center gap-3 text-sm">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <row.icon className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{row.label}</p>
                                <p className="font-medium">{row.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">From topic to published post in three steps</h2>
              <p className="text-lg text-muted-foreground">
                No writing experience required. Just your expertise.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.number} className="relative">
                  {i < steps.length - 1 && (
                    <div className="absolute top-6 left-[calc(50%+28px)] hidden h-0.5 w-[calc(100%-56px)] bg-border md:block" />
                  )}
                  <div className="text-center">
                    <div className="relative mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {step.number}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/sign-up">
                <Button size="lg">
                  Try It Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">
                Trusted by health professionals
              </h2>
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
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role} &middot; {t.location}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {t.metric}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground">
                Start free. Upgrade when you&apos;re ready to publish consistently.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 pt-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={
                    plan.popular
                      ? "border-primary shadow-lg relative overflow-visible"
                      : ""
                  }
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
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="block">
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
            <p className="mt-8 text-center text-sm text-muted-foreground">
              All plans include full access to content creation tools. Cancel anytime. No contracts.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold font-heading">Frequently asked questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Clarion.
              </p>
            </div>
            <div className="rounded-xl border bg-background">
              <div className="divide-y px-6">
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold font-heading">
              Your clients are searching.{" "}
              <span className="text-primary">Let them find you.</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Consistent, credible content builds the kind of trust that turns website visitors
              into clients. Start publishing today — your first 3 posts are free.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link href="/sign-up">
                <Button size="lg" className="text-base px-8">
                  Get Started — It&apos;s Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                No credit card required &middot; Set up in under 2 minutes
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <p className="text-lg font-bold text-primary font-heading">Clarion</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Professional content for health professionals.
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Account</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href="/sign-up" className="hover:text-foreground transition-colors">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Support</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:support@clarionwriter.com" className="hover:text-foreground transition-colors">support@clarionwriter.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t pt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Clarion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
