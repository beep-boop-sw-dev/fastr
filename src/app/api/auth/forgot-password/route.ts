import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma().user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    // Delete any existing reset tokens for this user
    await prisma().verificationToken.deleteMany({
      where: { identifier: `reset:${email}` },
    });

    // Generate token and expiry (1 hour)
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma().verificationToken.create({
      data: {
        identifier: `reset:${email}`,
        token,
        expires,
      },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
