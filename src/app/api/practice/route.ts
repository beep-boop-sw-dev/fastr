import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const practiceSchema = z.object({
  practiceName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  defaultTone: z.string().default("warm"),
  defaultAudience: z.string().default("potential_clients"),
  websiteUrl: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const practiceInfo = await prisma.practiceInfo.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(practiceInfo);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const data = practiceSchema.parse(body);

    const practiceInfo = await prisma.practiceInfo.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { ...data, userId: session.user.id },
    });

    return NextResponse.json(practiceInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
