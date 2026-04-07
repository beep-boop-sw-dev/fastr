import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["DRAFT", "FINAL", "ARCHIVED"]).optional(),
  seoScore: z.number().optional(),
  actualWordCount: z.number().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const post = await prisma().post.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updatePostSchema.parse(body);

    const post = await prisma().post.updateMany({
      where: { id, userId: session.user.id },
      data,
    });

    if (post.count === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updated = await prisma().post.findUnique({ where: { id } });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const result = await prisma().post.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
