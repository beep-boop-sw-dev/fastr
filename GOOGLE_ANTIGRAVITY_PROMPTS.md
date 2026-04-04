# Fastr — Google Antigravity Development Prompts

Break this into sequential prompts. Each prompt builds on the previous one. Copy-paste each prompt one at a time.

---

## PROMPT 1: Project Setup & Foundation

```
Build a Next.js SaaS application called "Fastr" — an AI-powered blog writing tool for therapists that helps them create SEO-optimized content to attract more clients.

TECH STACK:
- Next.js 14+ with App Router, TypeScript, Tailwind CSS
- shadcn/ui component library
- Prisma ORM with PostgreSQL (Supabase)
- NextAuth.js for authentication (Google OAuth + email/password with bcryptjs)
- Stripe for subscription billing
- Anthropic Claude API for AI blog generation
- Zod for validation
- react-hook-form for forms
- react-markdown for rendering
- react-hot-toast for notifications
- lucide-react for icons

PROJECT SETUP:
1. Create the Next.js project with TypeScript, Tailwind, ESLint, App Router, and src directory
2. Install all dependencies listed above
3. Initialize shadcn/ui and add these components: button, input, textarea, select, card, badge, dialog, tabs, tooltip, skeleton, separator, label, dropdown-menu, sheet, avatar, progress
4. Configure a calming, therapist-friendly Tailwind theme:
   - Primary: teal/sage green (oklch 0.52 0.08 160)
   - Background: warm cream (oklch 0.97 0.005 80)
   - Accent: soft gold (#D4A853)
   - Professional and clean, not clinical

5. Create this directory structure under src/:
   - app/(marketing)/ — public pages (pricing)
   - app/(auth)/ — sign-in, sign-up
   - app/(app)/ — authenticated app (dashboard, generate, posts, settings/billing)
   - app/api/ — all API routes
   - components/ui/ — shadcn components (already done)
   - components/marketing/ — landing page sections
   - components/app/ — sidebar, topbar
   - components/generate/ — generator form components
   - lib/ — auth, prisma, stripe, claude, prompts, seo-scorer, constants, utils
   - hooks/ — custom React hooks
   - types/ — TypeScript definitions

6. Create .env.example with these variables:
   NEXT_PUBLIC_APP_URL, NEXTAUTH_URL, NEXTAUTH_SECRET,
   DATABASE_URL, DIRECT_URL,
   ANTHROPIC_API_KEY,
   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRO_PRICE_ID, STRIPE_AGENCY_PRICE_ID,
   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

7. Set up next.config.ts with serverExternalPackages for @prisma/client and bcryptjs
```

---

## PROMPT 2: Database Schema & Auth System

```
Continue building the Fastr app. Now set up the database and authentication.

PRISMA SCHEMA (prisma/schema.prisma):
Create these models for PostgreSQL:

1. Account — standard NextAuth OAuth account (id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state). FK to User with cascade delete. Unique on [provider, providerAccountId].

2. Session — standard NextAuth session (id, sessionToken unique, userId, expires). FK to User.

3. VerificationToken — (identifier, token unique, expires). Unique on [identifier, token].

4. User — id (cuid), name?, email? (unique), emailVerified?, image?, password? (hashed, for credentials auth), stripeCustomerId? (unique), stripeSubscriptionId? (unique), stripePriceId?, stripeCurrentPeriodEnd?, createdAt, updatedAt. Relations: accounts[], sessions[], practiceInfo (1:1), posts[], usageRecords[].

5. PracticeInfo — 1:1 with User. Fields: practiceName?, city?, state?, neighborhood?, specialties (String[] default []), defaultTone (default "warm"), defaultAudience (default "potential_clients"), websiteUrl?, phone?

6. Post — userId (indexed), title, content (Text), metaDescription?, slug?, topic?, primaryKeyword?, secondaryKeywords (String[] default []), tone?, targetAudience?, wordCount?, callToAction?, localCity?, localState?, seoScore? (Int), actualWordCount?, status (enum: DRAFT/FINAL/ARCHIVED, default DRAFT), createdAt, updatedAt. FK to User.

7. UsageRecord — userId, action (default "generation"), tokens (Int default 0), createdAt. Index on [userId, createdAt]. FK to User.

AUTHENTICATION (src/lib/auth.ts):
- Configure NextAuth with JWT session strategy
- Providers: Google OAuth + Credentials (email/password with bcrypt)
- PrismaAdapter from @auth/prisma-adapter
- Custom pages: signIn -> "/sign-in", newUser -> "/dashboard"
- JWT callback: store user.id in token
- Session callback: expose user.id on session.user
- Extend NextAuth types in src/types/next-auth.d.ts

API ROUTES:
- src/app/api/auth/[...nextauth]/route.ts — NextAuth handler
- src/app/api/auth/register/route.ts — POST: validate with zod (name, email, password min 8), check email uniqueness, hash password with bcrypt(12), create user

MIDDLEWARE (src/middleware.ts):
- Protect /dashboard, /generate, /posts, /settings routes — redirect to /sign-in if not authenticated
- Redirect /sign-in, /sign-up to /dashboard if already authenticated

AUTH PAGES:
- src/app/(auth)/layout.tsx — centered card layout
- src/app/(auth)/sign-in/page.tsx — Google OAuth button + email/password form, error handling, redirect to callbackUrl
- src/app/(auth)/sign-up/page.tsx — Google OAuth + name/email/password form, calls /api/auth/register then auto signs in

SESSION PROVIDER:
- src/components/providers.tsx — wraps app with SessionProvider, TooltipProvider, and Toaster
- Update root layout.tsx to use Providers wrapper, Inter font, and Fastr metadata
```

---

## PROMPT 3: Core Blog Generation Engine

```
Continue building Fastr. Now build the core blog generation feature — this is the heart of the product.

CONSTANTS (src/lib/constants.ts):
Define these:
- SPECIALTIES: array of 24 therapy specialties (Anxiety, Depression, Trauma & PTSD, Couples Therapy, Marriage Counseling, Family Therapy, Child & Adolescent, Grief & Loss, Addiction & Recovery, Eating Disorders, OCD, ADHD, Anger Management, Stress Management, Self-Esteem, Life Transitions, Career Counseling, LGBTQ+ Issues, Relationship Issues, Parenting, Perinatal & Postpartum, Chronic Pain, Sleep Issues, Mindfulness & Meditation)
- TONES: 4 options with value/label/description — warm ("Compassionate, nurturing"), conversational ("Casual, friendly"), clinical ("Evidence-based, authoritative"), empowering ("Motivating, strength-based")
- AUDIENCES: potential_clients, referral_sources, general_public
- POST_LENGTHS: 500 (Short), 1000 (Medium), 1500 (Long)
- PLANS: free (3 gen/mo, 500 words max, 5 saved, $0), pro (30 gen/mo, 1500 max, unlimited, $29), agency (unlimited, 1500 max, unlimited, $79)

PROMPT ENGINEERING (src/lib/prompts.ts):
This is the core product differentiator. Build two functions:

buildSystemPrompt(): Returns a system prompt that tells Claude it's an expert SEO content writer for therapy practices. Include guidance on:
- SEO best practices (keyword placement, density 1-2%, semantic variations)
- Therapy marketing ethics (no outcome guarantees, person-first language, no stigma)
- Local SEO (naturally incorporate city/state/neighborhood)
- Blog structure (H1 title, 3-5 H2s with keyword variations, keyword in first paragraph, meta description 150-160 chars, short paragraphs)
- Output format: Markdown with H1 title, "META: " line for meta description, H2 subheadings, CTA section

buildUserPrompt(input): Takes all generator fields and constructs the user message. Include:
- Topic and word count
- Primary + secondary keywords
- Tone guidance (map each tone value to specific writing instructions)
- Audience guidance (map each audience to writing focus)
- Practice details for local SEO (name, city, state, neighborhood, specialties)
- Call to action instruction

CLAUDE INTEGRATION (src/lib/claude.ts):
- Initialize Anthropic client with ANTHROPIC_API_KEY
- streamBlogGeneration() function: takes systemPrompt, userPrompt, maxTokens (default 4096)
- Uses anthropic.messages.stream() with claude-sonnet-4-20250514 model
- Returns the stream object for SSE piping

GENERATION API (src/app/api/generate/route.ts):
POST endpoint that:
1. Authenticates via getServerSession
2. Validates input with zod schema (topic required, primaryKeyword required, wordCount 300-2000)
3. Checks usage limits: query user's stripePriceId to determine plan, count UsageRecords since period start, reject if over limit
4. Checks word count against plan's maxPostLength
5. Merges form input with saved PracticeInfo (form values override)
6. Builds system + user prompts
7. Streams response as SSE: pipe Claude's content_block_delta events as `data: {"text": "..."}\n\n`
8. After stream completes: create UsageRecord, send final `data: {"done": true, "tokens": N}\n\n`
9. Return ReadableStream with Content-Type: text/event-stream

STREAMING HOOK (src/hooks/use-generation.ts):
Custom React hook that:
- Manages state: content (string, accumulated), isGenerating, error, tokens
- generate(input) function: POST to /api/generate, read SSE stream, accumulate text
- Parses `data: ` lines, handles {text}, {done}, {error} events
- reset() function to clear state

PRACTICE INFO API (src/app/api/practice/route.ts):
- GET: return user's PracticeInfo
- PUT: upsert PracticeInfo with zod validation

USAGE API (src/app/api/usage/route.ts):
- GET: return { plan name, generationsUsed, generationsLimit, totalPosts, maxPostLength }
```

---

## PROMPT 4: Generator Page & Post Management

```
Continue building Fastr. Now build the Generator page (main product), post management, and dashboard.

GENERATOR PAGE (src/app/(app)/generate/page.tsx):
This is the main product page. Build a two-column layout:

LEFT COLUMN — Input Form with these sections in Cards:
1. Practice Info (collapsible, pre-filled from /api/practice on mount):
   - Practice Name (text input)
   - City + State (side by side)
   - Neighborhood (optional)
   - Specialties (clickable Badge toggles from SPECIALTIES constant)

2. Blog Details:
   - Blog Topic/Title (required text input with placeholder examples)
   - Primary SEO Keyword (required)
   - Secondary Keywords (input + Enter to add as tag Badges with X to remove)

3. Tone & Audience:
   - Writing Tone (2x2 grid of selectable cards from TONES)
   - Target Audience (3-column grid from AUDIENCES)
   - Post Length (3-column grid from POST_LENGTHS)
   - Call to Action (textarea)

4. Generate Button (full width, disabled during generation, shows Loader2 spinner)

RIGHT COLUMN — Output Panel:
- SEO Score card (appears after generation): overall score /100 + breakdown of checks
- Generated Content card (sticky):
  - Empty state: "Fill in the form and click Generate"
  - During generation: ReactMarkdown rendering + blinking cursor
  - After generation: content + word count + SEO score
  - Action buttons: Copy, Save (redirects to /posts/[id]), Reset
- Use the useGeneration hook for streaming
- Use scoreSEO() from seo-scorer for real-time scoring

SEO SCORER (src/lib/seo-scorer.ts):
Pure client-side function scoreSEO(content, primaryKeyword, metaDescription?) that returns { overall: 0-100, checks: [] }. Checks:
- Keyword in title (H1): 15 pts
- Keyword density 0.5-3%: 15 pts
- Keyword in first paragraph: 10 pts
- 3+ H2 subheadings: 10 pts
- Keyword in H2s: 10 pts
- Meta description 120-160 chars with keyword: 15 pts
- Content 500+ words: 15 pts
- Readability (no paragraphs over 80 words): 10 pts

POSTS API:
- GET /api/posts — list user's posts (paginated, filterable by status)
- POST /api/posts — save post (generate slug from title)
- GET /api/posts/[id] — get single post (verify ownership)
- PUT /api/posts/[id] — update post fields
- DELETE /api/posts/[id] — delete post (verify ownership)

DASHBOARD (src/app/(app)/dashboard/page.tsx):
- Welcome header with user name + "Generate New Post" CTA button
- 3 stat cards: Monthly Usage (progress bar), Total Posts, Avg SEO Score
- Recent Posts grid (up to 6 cards, each showing title, status badge, SEO score, word count, date)
- Empty state with "Generate Your First Post" CTA

POSTS LIST (src/app/(app)/posts/page.tsx):
- Filter buttons: All, DRAFT, FINAL, ARCHIVED
- Grid of post cards with title, status, keyword badge, SEO score, word count, date
- Delete button (appears on hover, confirms before deleting)

POST EDITOR (src/app/(app)/posts/[id]/page.tsx):
- Top bar: back button, editable title input, clickable status badge (cycles DRAFT->FINAL->ARCHIVED), Copy/Download/Save buttons
- Two-column layout:
  - Left (65%): Tabs for Edit (markdown textarea) and Preview (ReactMarkdown)
  - Right (35%): SEO Score panel (real-time), Meta Description editor with char count, Generation Details card (keyword, tone, location, date)

SETTINGS (src/app/(app)/settings/page.tsx):
- Practice Information card: name, city, state, neighborhood, website, phone, specialties (badge toggles)
- Default Preferences card: default tone (selectable grid), default audience (selectable grid)
- Save button

APP LAYOUT (src/app/(app)/layout.tsx):
- Sidebar (256px) + main content area
- Sidebar: Fastr logo, nav items (Dashboard, Generate Post, My Posts, Settings, Billing), user avatar + name + sign out button at bottom
```

---

## PROMPT 5: Stripe Payments & Billing

```
Continue building Fastr. Now add Stripe subscription payments.

STRIPE SETUP (src/lib/stripe.ts):
- Initialize Stripe with STRIPE_SECRET_KEY
- Let the SDK use its default API version (don't override)

STRIPE API ROUTES:

POST /api/stripe/checkout — Create Checkout Session:
1. Authenticate user
2. Accept { priceId } in body
3. Find or create Stripe customer (store stripeCustomerId on user)
4. Create checkout.sessions with mode: "subscription", client_reference_id: userId
5. Return { url } for redirect

POST /api/stripe/portal — Customer Portal:
1. Authenticate user
2. Get stripeCustomerId
3. Create billingPortal.sessions with return_url
4. Return { url }

POST /api/stripe/webhook — Handle Events:
- Verify signature with STRIPE_WEBHOOK_SECRET
- Handle these events:
  - checkout.session.completed: link stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd to user via client_reference_id
  - invoice.payment_succeeded: update stripeCurrentPeriodEnd
  - customer.subscription.updated: update stripePriceId
  - customer.subscription.deleted: null out all stripe fields

BILLING PAGE (src/app/(app)/settings/billing/page.tsx):
- Current plan card with usage progress bar + "Manage Billing" button (opens Stripe portal)
- 3 plan comparison cards (Free, Pro $29/mo, Agency $79/mo)
  - Feature lists with check icons
  - "Get Started" / "Switch Plan" / "Current Plan" buttons
  - Pro card highlighted as "Most Popular"
- Show success/canceled toast from URL search params after Stripe redirect

PLAN FEATURES displayed on billing page:
- Free: 3 posts/mo, short only, basic SEO, 5 saved
- Pro: 30 posts/mo, all lengths, full SEO, unlimited saved
- Agency: unlimited posts, all lengths, full SEO, unlimited saved
```

---

## PROMPT 6: Marketing Landing Page

```
Continue building Fastr. Now build the public marketing landing page and pricing page.

MARKETING LAYOUT (src/app/(marketing)/layout.tsx):
- Sticky header with: Fastr logo, nav links (Pricing), Sign In button (ghost), Get Started Free button (primary)
- Main content area
- Footer with Fastr branding, nav links, copyright

LANDING PAGE (src/app/page.tsx):
NOTE: This page uses its OWN nav/footer (not the marketing layout) since it's the root page.

Sections:
1. HERO — Badge "AI-powered blog writing for therapists", H1 "Blog posts that bring clients to your practice" (with "clients to your practice" in primary color), subtitle about stop spending hours writing, two CTAs (Start Writing for Free + See How It Works), "No credit card required" note, radial gradient background

2. FEATURES (id="features") — 4 cards in a grid:
   - AI-Powered Writing (PenTool icon)
   - SEO Optimization (Search icon)
   - Local SEO Targeting (MapPin icon)
   - One-Click Publishing (Zap icon)

3. HOW IT WORKS — 3 numbered steps:
   1. Enter Your Details
   2. Choose Your Topic
   3. Generate & Publish

4. TESTIMONIALS — 3 cards with 5 gold stars, quotes from therapists:
   - Dr. Sarah Chen, Licensed Psychologist, Austin TX
   - James Rodriguez LMFT, Denver CO
   - Dr. Amara Johnson, Clinical Social Worker, Atlanta GA

5. PRICING (id="pricing") — 3 plan cards (Free/$0, Pro/$29 "Most Popular", Agency/$79) with feature lists and CTA buttons linking to /sign-up

6. FINAL CTA — "Start attracting more clients today" with Get Started for Free button

PRICING PAGE (src/app/(marketing)/pricing/page.tsx):
- Same 3 plan cards as landing page but with more detail
- All lengths listed as features
- "Questions? Email support@fastr.app" note at bottom

DESIGN NOTES:
- Use lucide-react icons throughout
- Cards should have subtle shadows, no borders (or very light borders)
- "Most Popular" badge on Pro plan (-top-3 positioned, primary color pill)
- Calming, professional feel — this is for therapists, not tech people
```

---

## PROMPT 7: Polish & Production Readiness

```
Continue building Fastr. Final polish and production readiness.

MOBILE RESPONSIVE SIDEBAR:
The current sidebar is fixed 256px. Add mobile support:
- On mobile (<768px): hide the sidebar, add a hamburger menu button in a top bar
- Use shadcn Sheet component to slide the sidebar in from the left on mobile
- Keep desktop sidebar as-is

LOADING STATES:
- src/app/(app)/loading.tsx — show skeleton with sidebar + content area skeleton
- src/app/(app)/generate/loading.tsx — skeleton for the generator form

ERROR BOUNDARY:
- src/app/error.tsx — "Something went wrong" with retry button

NEXT.JS CONFIG (next.config.ts):
- Add serverExternalPackages: ["@prisma/client", "bcryptjs"]

FINAL VERIFICATION:
1. Run npx prisma generate and confirm it succeeds
2. Run npm run build and fix any TypeScript errors
3. Run npm run dev and verify:
   - Landing page renders with all sections
   - Sign up/in pages render
   - Dashboard shows empty state
   - Generator page has all input fields
   - Settings page loads
   - Billing page shows plan cards
4. Test mobile responsive on all pages

The app should compile and render all pages without errors. Database-dependent features will only work once Supabase is connected.
```

---

## Summary of Prompts

| # | Focus | Key Deliverables |
|---|-------|-----------------|
| 1 | Setup | Next.js scaffold, deps, shadcn/ui, theme, directory structure |
| 2 | Auth & DB | Prisma schema, NextAuth, sign-in/up pages, middleware |
| 3 | Generation | Claude integration, prompts, streaming API, hooks |
| 4 | Product Pages | Generator page, dashboard, posts CRUD, editor, settings |
| 5 | Payments | Stripe checkout/webhook/portal, billing page |
| 6 | Marketing | Landing page, pricing page, public layout |
| 7 | Polish | Mobile sidebar, loading states, error boundaries, build verification |
