import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { streamBlogGeneration } from "@/lib/claude";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { PLANS } from "@/lib/constants";

const generateSchema = z.object({
  practiceName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  topic: z.string().min(1, "Topic is required"),
  primaryKeyword: z.string().min(1, "Primary keyword is required"),
  secondaryKeywords: z.array(z.string()).optional(),
  tone: z.string().default("warm"),
  targetAudience: z.string().default("potential_clients"),
  wordCount: z.number().min(300).max(2000).default(1000),
  callToAction: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const input = generateSchema.parse(body);

    // Check usage limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripePriceId: true, stripeCurrentPeriodEnd: true },
    });

    const plan = user?.stripePriceId === process.env.STRIPE_AGENCY_PRICE_ID
      ? PLANS.agency
      : user?.stripePriceId === process.env.STRIPE_PRO_PRICE_ID
        ? PLANS.pro
        : PLANS.free;

    const periodStart = user?.stripeCurrentPeriodEnd
      ? new Date(new Date(user.stripeCurrentPeriodEnd).getTime() - 30 * 24 * 60 * 60 * 1000)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const usageCount = await prisma.usageRecord.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: periodStart },
      },
    });

    if (usageCount >= plan.generationsPerMonth) {
      return new Response(
        JSON.stringify({ error: `You've reached your ${plan.name} plan limit of ${plan.generationsPerMonth} generations this month. Upgrade for more.` }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check word count limits
    if (input.wordCount > plan.maxPostLength) {
      return new Response(
        JSON.stringify({ error: `Your ${plan.name} plan supports posts up to ${plan.maxPostLength} words. Upgrade for longer posts.` }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Merge with practice info
    const practiceInfo = await prisma.practiceInfo.findUnique({
      where: { userId: session.user.id },
    });

    const mergedInput = {
      ...input,
      practiceName: input.practiceName || practiceInfo?.practiceName || undefined,
      city: input.city || practiceInfo?.city || undefined,
      state: input.state || practiceInfo?.state || undefined,
      neighborhood: input.neighborhood || practiceInfo?.neighborhood || undefined,
      specialties: input.specialties?.length ? input.specialties : practiceInfo?.specialties || [],
    };

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(mergedInput);

    const stream = await streamBlogGeneration({
      systemPrompt,
      userPrompt,
      maxTokens: Math.max(input.wordCount * 3, 4096),
    });

    let totalTokens = 0;

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
            }
            if (event.type === "message_delta" && event.usage) {
              totalTokens = event.usage.output_tokens;
            }
          }

          // Record usage
          await prisma.usageRecord.create({
            data: {
              userId: session.user.id,
              action: "generation",
              tokens: totalTokens,
            },
          });

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, tokens: totalTokens })}\n\n`));
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Generation failed. Please try again." })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues[0].message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
