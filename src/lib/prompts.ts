interface PromptInput {
  practiceName?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  specialties?: string[];
  topic: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  tone: string;
  targetAudience: string;
  wordCount: number;
  callToAction?: string;
}

const TONE_GUIDANCE: Record<string, string> = {
  warm: "Write in a warm, empathetic, and nurturing tone. Use compassionate language that makes readers feel understood and safe. Avoid clinical jargon — use accessible, human language.",
  conversational: "Write in a casual, friendly tone — like a trusted friend who happens to be a therapist. Use contractions, rhetorical questions, and relatable examples. Keep sentences short and punchy.",
  clinical: "Write in a professional, evidence-based tone. Reference research and therapeutic approaches where appropriate. Maintain authority while remaining accessible. Use proper clinical terminology with brief explanations.",
  empowering: "Write in a motivating, strength-based tone. Focus on the reader's capacity for growth and change. Use action-oriented language and encourage self-efficacy. Be uplifting without being dismissive of struggles.",
};

const AUDIENCE_GUIDANCE: Record<string, string> = {
  potential_clients: "Write for people who may be considering therapy for the first time or looking for a new therapist. Address their concerns, normalize their experience, and gently guide them toward seeking help.",
  referral_sources: "Write for healthcare professionals, educators, and other referral sources. Demonstrate clinical expertise and specialization. Focus on outcomes and evidence-based approaches.",
  general_public: "Write for a general audience interested in mental health and wellness. Make the content educational, destigmatizing, and broadly applicable.",
};

export function buildSystemPrompt(): string {
  return `You are an expert SEO content writer who specializes in creating blog posts for therapy and mental health practices. You deeply understand:

1. **SEO best practices**: keyword placement in titles, headers, meta descriptions, first paragraph, and throughout the content at natural density (1-2%). Use semantic variations of keywords naturally.

2. **Therapy practice marketing**: You understand the ethical considerations of marketing therapy services. Never make guarantees about outcomes. Use person-first language. Avoid stigmatizing terms.

3. **Local SEO**: When location information is provided, naturally incorporate the city, state, and neighborhood into the content to help the practice rank for local searches (e.g., "therapy in [City]", "[Specialty] therapist near [Neighborhood]").

4. **Blog structure for SEO**:
   - Start with a compelling title that includes the primary keyword
   - Write a meta description (150-160 characters) that includes the primary keyword
   - Use one H1 (the title), and 3-5 H2 subheadings that include keyword variations
   - Include the primary keyword in the first paragraph
   - End with a clear call to action
   - Use short paragraphs (2-3 sentences) for readability

5. **Output format**: Return the blog post in Markdown format with:
   - The title as an H1
   - A meta description on the second line prefixed with "META: "
   - Well-structured content with H2 subheadings
   - A concluding call-to-action section`;
}

export function buildUserPrompt(input: PromptInput): string {
  const parts: string[] = [];

  parts.push(`Write a blog post about: **${input.topic}**`);
  parts.push(`Target word count: approximately ${input.wordCount} words.`);
  parts.push(`Primary SEO keyword: "${input.primaryKeyword}"`);

  if (input.secondaryKeywords?.length) {
    parts.push(`Secondary keywords to include naturally: ${input.secondaryKeywords.map(k => `"${k}"`).join(", ")}`);
  }

  parts.push(`\n**Tone**: ${TONE_GUIDANCE[input.tone] || TONE_GUIDANCE.warm}`);
  parts.push(`**Audience**: ${AUDIENCE_GUIDANCE[input.targetAudience] || AUDIENCE_GUIDANCE.potential_clients}`);

  if (input.practiceName || input.city || input.state) {
    parts.push("\n**Practice & Local SEO Details**:");
    if (input.practiceName) parts.push(`- Practice name: ${input.practiceName}`);
    if (input.city && input.state) parts.push(`- Location: ${input.city}, ${input.state}`);
    if (input.neighborhood) parts.push(`- Neighborhood: ${input.neighborhood}`);
    if (input.specialties?.length) parts.push(`- Specialties: ${input.specialties.join(", ")}`);
    parts.push("Naturally weave the location and practice name into the content for local SEO. Include phrases like \"therapy in [City]\" or \"[City] therapist\" where they fit naturally.");
  }

  if (input.callToAction) {
    parts.push(`\n**Call to Action**: End the blog post by encouraging readers to: ${input.callToAction}`);
  }

  return parts.join("\n");
}
