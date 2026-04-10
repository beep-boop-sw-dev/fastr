# Clarion — Full Build Session Log

**Date:** 2026-04-07 / 2026-04-08
**Status:** MVP deployed and functional

---

## 1. Product Overview

**Clarion** (formerly "Fastr") is an AI-powered blog writing SaaS for therapists and health professionals. It helps clinicians publish credible, SEO-optimized content that builds trust with potential clients and drives organic search traffic to their practice websites.

**Target audience:** Licensed therapists, psychologists, counselors, clinical social workers, and group practices.

**Core value proposition:** Therapists have deep clinical expertise but rarely have time to write content. Clarion transforms that expertise into polished, professional blog posts — without sounding like AI or marketing copy.

**Planned domain:** clarionwriter.com

---

## 2. Brand Guide

The rebrand from "Fastr" to "Clarion" was driven by a comprehensive brand guide document. The name "Clarion" evokes clarity, authority, and a clear voice — fitting for professionals who help others find clarity.

### Brand Voice

- Calm, warm, professional — mirrors the tone therapists use with clients
- Avoids hype, urgency, and AI/tech buzzwords
- Uses words like "thoughtful," "credible," "confidence," "trust," "expertise"
- Second person throughout ("your expertise," "your clients")
- Never says "AI-generated" or "automated" — uses "Guided Content Creation"

### Taglines & Key Copy

- **Hero headline:** "Your expertise, published."
- **Hero subhead:** Positions around the idea that clinicians' expertise can help people before their first session
- **Pill badge:** "Built for health professionals"
- **Final CTA:** "Your clients are searching. Let them find you."
- **Footer:** "Professional content for health professionals."

### Color Palette

Described as "calm and grounded" — designed to feel trustworthy for health professionals.

| Token | Color | Hex/Value | Usage |
|-------|-------|-----------|-------|
| Primary | Deep Teal | oklch(0.40 0.06 185) | Buttons, links, primary actions |
| Sage | Warm Sage | #7A9E7E | Header bar background |
| Clay | Warm Terracotta | #C4856A | Star ratings, warm accents |
| Clay Light | | #D4A08A | Hover states |
| Clay Dark | | #A86D52 | Active states |
| Background | Warm Off-White | oklch(0.97 0.005 70) | Page background |
| Foreground | Near-Black | oklch(0.22 0.00 0) | Body text |
| Accent | Mid-Green | oklch(0.63 0.06 150) | Secondary elements |
| Muted | Warm Gray | oklch(0.48 0.01 50) | Subdued text |

Full dark mode defined with teal-shifted dark backgrounds.

### Typography

| Role | Font | Weights |
|------|------|---------|
| Body (sans) | DM Sans | 400–700 |
| Headings (serif) | Lora | 400, 500, 600, 700 |
| Mono | Geist Mono | — |

h1 and h2 elements use Lora serif for a professional editorial feel.

### Design Details

- Border radius: 0.625rem (10px) — soft, approachable
- Star ratings use the Clay color (warm terracotta, not generic gold)
- Header bar: `bg-[#7A9E7E]` with white text
- CTA buttons: white text on sage green background
- OKLCH color space for CSS custom properties (modern browser support)

---

## 3. Features & Pricing

### Four Core Features

1. **Guided Content Creation** — transforms clinical expertise into polished blog posts
2. **Search Visibility** — keyword targeting, headings, meta descriptions built in
3. **Local Reach** — content tailored to city, neighborhood, community
4. **Ready to Publish** — review, refine, publish with confidence

### Three-Step Process

1. Share your practice details (specialties, location, voice)
2. Choose your topic (subject + keywords)
3. Review and publish

### Pricing Tiers

| | Free | Pro (Most Popular) | Agency |
|---|---|---|---|
| **Price** | $0/mo | $29/mo | $79/mo |
| **Tagline** | "A place to start" | "For consistent publishing" | "For practices and groups" |
| **Posts/month** | 3 | 30 | Unlimited |
| **Post length** | Short (500 words) | All lengths (up to 1,500 words) | All lengths |
| **SEO** | Basic scoring | Full scoring & analysis | Full scoring & analysis |
| **Saved posts** | 5 | Unlimited | Unlimited |
| **Practice profiles** | 1 | 1 | 5 |
| **Priority creation** | No | Yes | Yes |
| **Early access** | No | No | Yes |

All plans include full access to content creation tools. Cancel anytime.
Support email: support@clarionwriter.com

### Testimonials (Fictional Personas)

- **Dr. Sarah Chen**, Licensed Psychologist, Austin TX — website traffic doubled
- **James Rodriguez LMFT**, Denver CO — first page for local searches within 3 months
- **Dr. Amara Johnson**, Clinical Social Worker, Atlanta GA — content creation made effortless

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui v4 (@base-ui/react) |
| Auth | NextAuth v4 (Credentials + Google OAuth) |
| Database | Supabase PostgreSQL |
| ORM | Prisma v7.6.0 with @prisma/adapter-pg |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Payments | Stripe |
| Hosting | Vercel (auto-deploy from GitHub) |
| Validation | Zod v4 |

### Key Dependencies

```
next@16.2.1, react@19, typescript@5
prisma@7.6.0, @prisma/client@7.6.0, @prisma/adapter-pg@7.7.0, pg@8.20.0
next-auth@4, @auth/prisma-adapter
stripe@21.0.1
@anthropic-ai/sdk@0.80.0
bcryptjs, zod
```

---

## 5. Database Schema

### User
Standard NextAuth user extended with Stripe billing fields:
- `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`, `stripeCurrentPeriodEnd`
- Relations: accounts, sessions, practiceInfo (1:1), posts, usageRecords

### PracticeInfo (1:1 with User)
- `practiceName`, `city`, `state`, `neighborhood`
- `specialties` (string array)
- `defaultTone` (default: "warm"), `defaultAudience` (default: "potential_clients")
- `websiteUrl`, `phone`

### Post
Core content model:
- `title`, `content` (text), `metaDescription`, `slug`
- `topic`, `primaryKeyword`, `secondaryKeywords` (string array)
- `tone`, `targetAudience`, `wordCount`, `callToAction`
- `localCity`, `localState` — for local SEO
- `seoScore`, `actualWordCount`
- `status` enum: DRAFT / FINAL / ARCHIVED

### UsageRecord
Token consumption tracking:
- `action` (default: "generation"), `tokens` (int)
- Indexed on [userId, createdAt]

---

## 6. Application Architecture

### Page Structure

```
/ ...................... Landing page (marketing)
/pricing ............... Pricing page
/sign-in ............... Auth (email/password + Google OAuth)
/sign-up ............... Registration
/dashboard ............. User dashboard (posts this month, create new)
/generate .............. Create new post form
/posts ................. Post list
/posts/[id] ............ Individual post view
/settings .............. User settings
/settings/billing ...... Stripe billing management
```

### API Routes

```
/api/auth/[...nextauth] ... NextAuth handler (lazy-loaded)
/api/auth/register ........ Email/password registration
/api/generate ............. Blog post generation (Claude API)
/api/posts ................ CRUD for posts
/api/posts/[id] ........... Individual post operations
/api/practice ............. Practice info CRUD
/api/usage ................ Usage tracking
/api/stripe/checkout ...... Stripe checkout session
/api/stripe/portal ........ Stripe customer portal
/api/stripe/webhook ....... Stripe webhook handler
```

All API routes use `export const dynamic = "force-dynamic"`.

### Lazy Initialization Pattern

All SDK clients use lazy initialization to prevent build-time crashes:

- **Prisma:** `export function prisma()` with `@prisma/adapter-pg`
- **Stripe:** `getStripe()` with Proxy wrapper
- **Anthropic:** `getAnthropic()` called inside `streamBlogGeneration()`
- **NextAuth:** `getAuthOptions()` lazily constructs config with PrismaAdapter

### Prisma v7 Architecture

```
prisma.config.ts          @prisma/adapter-pg
(CLI: migrations,         (Runtime: PrismaClient
 db push, generate)        queries, connections)
       │                          │
       ▼                          ▼
  DATABASE_URL              DATABASE_URL
  (from .env)               (from process.env)
```

---

## 7. Deployment & Environment

### GitHub Repository
`beep-boop-sw-dev/fastr` — auto-deploys to Vercel on push to `main`

### Vercel URL
https://fastr-pi.vercel.app

### Environment Variables (Vercel)

| Variable | Status |
|----------|--------|
| `DATABASE_URL` | Set (Supabase pooler, port 6543) |
| `NEXTAUTH_SECRET` | Set |
| `NEXTAUTH_URL` | Set (https://fastr-pi.vercel.app) |
| `GOOGLE_CLIENT_ID` | Not set — Google OAuth won't work yet |
| `GOOGLE_CLIENT_SECRET` | Not set |
| `STRIPE_SECRET_KEY` | Not set — billing won't work yet |
| `STRIPE_WEBHOOK_SECRET` | Not set |
| `ANTHROPIC_API_KEY` | Not set — blog generation won't work yet |

### Local Environment Files

- `.env.local` — DATABASE_URL (pooler) + DIRECT_URL + auth secrets
- `.env` — DATABASE_URL + DIRECT_URL (for Prisma CLI)
- `.env.example` — template for required variables

### Database

Supabase PostgreSQL (AWS us-east-2):
- Pooler connection (port 6543) for app runtime
- Direct connection (port 5432) for Prisma migrations
- Schema pushed via `npx prisma db push --url "..."` 

---

## 8. Debugging Journey — Prisma v7 on Vercel

This was the primary technical challenge of the session. Full details below.

### Problem

After setting up Supabase and deploying to Vercel, `/api/auth/register` returned 500. The build succeeded but the runtime crashed.

### Root Causes (Layered)

1. **Build-time instantiation** — Next.js evaluates modules during "Collecting page data." Module-level `new PrismaClient()`, `new Stripe()`, and `new Anthropic()` crash without env vars.

2. **Prisma v7 removed `url` from schema** — `datasource db { url = env("DATABASE_URL") }` throws error P1012. URL must come from `prisma.config.ts` (CLI only) or a driver adapter (runtime).

3. **Prisma v7 requires driver adapter** — `new PrismaClient()` with no arguments is invalid. Must pass `{ adapter: new PrismaPg(...) }` or `{ accelerateUrl: "..." }`.

4. **NextAuth handler delegation** — Exporting the wrapper function itself (instead of calling it with args) caused `Cannot destructure property 'nextauth' of 'e.query'`.

### Approaches That Failed

1. **Proxy pattern** (`new Proxy({} as PrismaClient, ...)`) — Prisma v7 rejects proxied objects
2. **`datasourceUrl` constructor option** — removed in Prisma v7
3. **`url = env("DATABASE_URL")` in schema** — Prisma v7 forbids with error P1012
4. **Simple singleton** — crashes at build time AND runtime
5. **Direct handler export** — breaks NextAuth request parsing

### Working Solution

1. Install `@prisma/adapter-pg` + `pg`
2. `prisma()` function creates `PrismaPg` adapter with `DATABASE_URL`
3. `getAuthOptions()` lazily constructs NextAuth config
4. NextAuth route uses `getHandler()(...args)` pattern
5. All call sites: `prisma.x.y()` → `prisma().x.y()`, `authOptions` → `getAuthOptions()`

### Files Changed

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Kept without `url` (correct for v7) |
| `src/lib/prisma.ts` | Lazy function + `@prisma/adapter-pg` |
| `src/lib/auth.ts` | `authOptions` → `getAuthOptions()` |
| `src/app/api/auth/[...nextauth]/route.ts` | Lazy handler with arg delegation |
| `src/app/api/auth/register/route.ts` | `prisma()` calls |
| `src/app/api/generate/route.ts` | `prisma()` + `getAuthOptions()` |
| `src/app/api/posts/route.ts` | Same |
| `src/app/api/posts/[id]/route.ts` | Same |
| `src/app/api/practice/route.ts` | Same |
| `src/app/api/usage/route.ts` | Same |
| `src/app/api/stripe/checkout/route.ts` | Same |
| `src/app/api/stripe/portal/route.ts` | Same |
| `src/app/api/stripe/webhook/route.ts` | Same |
| `package.json` | Added `@prisma/adapter-pg`, `pg` |

---

## 9. Rebranding Changes Summary

All instances of "Fastr" were replaced with "Clarion" across:

| Area | Changes |
|------|---------|
| Landing page (`page.tsx`) | Full rewrite — hero, features, testimonials, pricing, CTA |
| Layout (`layout.tsx`) | Title, meta description, fonts (Inter → DM Sans + Lora) |
| Globals CSS (`globals.css`) | Complete palette swap, clay/sage colors, font variables |
| Marketing layout | Footer text, nav links |
| Pricing page | Brand-aligned copy, support email |
| Sign-in page | "Clarion" logo, subtitle |
| Sign-up page | "Clarion" logo, "Start publishing content that grows your practice" |
| Sidebar | "Clarion" logo, "Create Post" nav label |
| Dashboard | "Posts This Month", "Create New Post" |
| Generate page | "Create New Post" title |

---

## 10. Remaining Setup

- [ ] Change Supabase database password (was shared in chat)
- [ ] Set up Google OAuth credentials on Google Cloud Console → add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel
- [ ] Set up Stripe account → add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to Vercel
- [ ] Add `ANTHROPIC_API_KEY` to Vercel for blog generation
- [ ] Purchase and connect clarionwriter.com domain to Vercel
- [ ] Update `NEXTAUTH_URL` to clarionwriter.com after domain setup

---

## 11. Verification

```bash
# Landing page
curl -sI https://fastr-pi.vercel.app/
# → HTTP/2 200

# Registration
curl -X POST https://fastr-pi.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
# → {"message":"Account created"}

# Auth providers
curl https://fastr-pi.vercel.app/api/auth/providers
# → {"google":{...},"credentials":{...}}

# Sign-in
curl -X POST .../api/auth/callback/credentials \
  -d "email=...&password=...&csrfToken=..."
# → {"url":"https://fastr-pi.vercel.app"} + session cookie
```
