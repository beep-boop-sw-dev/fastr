export const SPECIALTIES = [
  "Anxiety",
  "Depression",
  "Trauma & PTSD",
  "Couples Therapy",
  "Marriage Counseling",
  "Family Therapy",
  "Child & Adolescent",
  "Grief & Loss",
  "Addiction & Recovery",
  "Eating Disorders",
  "OCD",
  "ADHD",
  "Anger Management",
  "Stress Management",
  "Self-Esteem",
  "Life Transitions",
  "Career Counseling",
  "LGBTQ+ Issues",
  "Relationship Issues",
  "Parenting",
  "Perinatal & Postpartum",
  "Chronic Pain",
  "Sleep Issues",
  "Mindfulness & Meditation",
] as const;

export const TONES = [
  { value: "warm", label: "Warm & Empathetic", description: "Compassionate, nurturing, and approachable" },
  { value: "conversational", label: "Conversational", description: "Casual, friendly, like talking to a trusted friend" },
  { value: "clinical", label: "Professional", description: "Evidence-based, authoritative, clinical expertise" },
  { value: "empowering", label: "Empowering", description: "Motivating, strength-based, action-oriented" },
] as const;

export const AUDIENCES = [
  { value: "potential_clients", label: "Potential Clients", description: "People seeking therapy" },
  { value: "referral_sources", label: "Referral Sources", description: "Doctors, schools, other professionals" },
  { value: "general_public", label: "General Public", description: "Anyone interested in mental health" },
] as const;

export const POST_LENGTHS = [
  { value: 500, label: "Short", description: "~500 words" },
  { value: 1000, label: "Medium", description: "~1,000 words" },
  { value: 1500, label: "Long", description: "~1,500 words" },
] as const;

export const PLANS = {
  free: {
    name: "Free",
    generationsPerMonth: 3,
    maxPostLength: 500,
    maxSavedPosts: 5,
    seoScoring: "basic" as const,
    price: 0,
  },
  pro: {
    name: "Pro",
    generationsPerMonth: 30,
    maxPostLength: 1500,
    maxSavedPosts: Infinity,
    seoScoring: "full" as const,
    price: 29,
  },
  agency: {
    name: "Agency",
    generationsPerMonth: Infinity,
    maxPostLength: 1500,
    maxSavedPosts: Infinity,
    seoScoring: "full" as const,
    price: 79,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** Resolve a user's stripePriceId to their plan. */
export function getPlan(stripePriceId: string | null | undefined) {
  if (!stripePriceId) return PLANS.free;

  // Match by env var (real Stripe price IDs)
  if (process.env.STRIPE_AGENCY_PRICE_ID && stripePriceId === process.env.STRIPE_AGENCY_PRICE_ID)
    return PLANS.agency;
  if (process.env.STRIPE_PRO_PRICE_ID && stripePriceId === process.env.STRIPE_PRO_PRICE_ID)
    return PLANS.pro;

  // Match by test/fallback convention
  if (stripePriceId.includes("agency")) return PLANS.agency;
  if (stripePriceId.includes("pro")) return PLANS.pro;

  return PLANS.free;
}
