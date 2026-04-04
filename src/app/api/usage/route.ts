import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/constants";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

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

  const totalPosts = await prisma.post.count({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    plan: plan.name,
    generationsUsed: usageCount,
    generationsLimit: plan.generationsPerMonth,
    totalPosts,
    maxPostLength: plan.maxPostLength,
  });
}
